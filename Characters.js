import * as THREE from 'three';

const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const damp = (cur, target, rate, dt) => cur + (target - cur) * (1 - Math.exp(-rate * dt));

// Damped spring for hit reactions / landing.
// zeta >= 1 (critical damping) => the body returns to rest WITHOUT overshooting, so there is no "bounce back".
// When a limit is reached, the velocity pushing into the limit is dropped, so the joint never sits pinned at
// the limit and then gets flung back off it (that was the over-bend followed by the snap).
function springStep(o, pk, vk, k, zeta, dt, min, max) {
  const c = 2 * Math.sqrt(k) * zeta;
  o[vk] += (-k * o[pk] - c * o[vk]) * dt;
  let x = o[pk] + o[vk] * dt;
  if (x > max) { x = max; if (o[vk] > 0) o[vk] = 0; }
  else if (x < min) { x = min; if (o[vk] < 0) o[vk] = 0; }
  o[pk] = x;
}

// Smooth limiters: identity inside the allowed range, then compress smoothly toward the limit (never overshoots).
function softLimit(x, lim) { return lim * Math.tanh(x / lim); }
function softClamp(x, lo, hi, band = 0.15) {
  if (x > hi - band) return (hi - band) + band * Math.tanh((x - (hi - band)) / band);
  if (x < lo + band) return (lo + band) - band * Math.tanh(((lo + band) - x) / band);
  return x;
}
function softOver(x, start, band) {        // symmetric: |x| <= start is untouched, above it eases into start + band
  const a = Math.abs(x);
  return a <= start ? x : Math.sign(x) * (start + band * Math.tanh((a - start) / band));
}

// ---------------------------------------------------------------------------------------------------------
// Soft-limited hit reaction (replaces the spring for every hit / flinch channel).
// A spring + hard clamp reaches the limit in ONE frame (snap) and is then pulled back (bounce). This channel has
// NO restoring force at all, so it cannot overshoot, recoil or oscillate:
//   1. a hit only feeds o[vk] (a push speed). Drag bleeds it off, so the joint EASES toward its limit over a few frames
//   2. the push fades to 0 as the joint nears the limit -> it simply stops there (stiff), there is no hard wall
//   3. while pushed, and for a moment afterwards, the joint is HELD (stiff, a bit longer if it hit the limit)
//   4. then it drifts back to 0 slowly (speed capped, eased in). It never crosses 0 and never drives itself harder than
//      that cap, so a new hit simply takes over instead of fighting it
// ---------------------------------------------------------------------------------------------------------
function reactStep(o, pk, vk, dt, min, max, opt) {
  const drag = opt?.drag ?? 20;           // how fast the push speed dies out (1/s)
  const gain = opt?.gain ?? 0.5;          // travel per unit of push speed: a light hit bends a little, a hard hit bends more
  const hold = opt?.hold ?? 0.10;         // seconds to stay put after the push has stopped
  const holdLim = opt?.holdLimit ?? 0.14; // extra seconds to stay stiff when it was pushed all the way to the limit
  const retRate = opt?.retRate ?? 4.0;    // return speed = distance * retRate (1/s) ...
  const retMax = opt?.retMax ?? 1.1;      // ... capped at this many units per second
  const hk = pk + '_hold', rk = pk + '_relax';
  let x = o[pk], v = o[vk];

  // a push can never be bigger than what would carry the joint across its whole range
  const vCap = (v > 0 ? max : -min) * drag / gain;
  if (v > vCap) v = vCap; else if (v < -vCap) v = -vCap;

  if (Math.abs(v) > 0.25) {
    const lim = v > 0 ? max : min;
    const f = lim !== 0 ? clamp(x / lim, 0, 1) : 1;      // 0 = at rest / far side, 1 = at the limit
    v *= Math.exp(-drag * dt) * (1 - f * f);             // drag + soft stop
    x += v * gain * dt;
    o[hk] = f > 0.92 ? hold + holdLim : hold;
    o[rk] = 0;
  } else {
    v = 0;
    const h = o[hk] || 0;
    if (h > 0) {
      o[hk] = h - dt;                                    // stiff: stay exactly where it is
    } else if (x !== 0) {
      const r = Math.min(1, (o[rk] || 0) + dt * 3);      // ease the return in over ~0.33 s
      o[rk] = r;
      const ax = Math.abs(x);
      const sp = Math.min(ax * retRate, retMax) * r * r * (3 - 2 * r);
      const nx = Math.max(0, ax - sp * dt);              // moves toward 0 only, can never cross it
      x = nx < 1e-4 ? 0 : Math.sign(x) * nx;
    }
  }
  o[pk] = clamp(x, min, max);                            // safety net only
  o[vk] = v;
}

// ============================================================================
// 1. CATALOGS: HAIRSTYLES, OUTFITS & JUMP STYLES
// ============================================================================
export const FEMALE_HAIRSTYLES = [
  { id: 'ponytail',   label: 'หางม้าหนา 9 ช่อ + หน้าม้า & ข้างแก้ม (Physics)' },
  { id: 'twin_tails', label: 'ทวินเทลคู่หนา 12 ช่อ + หน้าม้า (Physics)' },
  { id: 'long_wave',  label: 'ผมยาวสยายหนาเต็มแผ่นหลัง (Cloth Physics)' },
  { id: 'bob_cut',    label: 'ผมบ๊อบสั้นหนาคลุมรอบหัว (Cloth Physics)' }
];

export const MALE_HAIRSTYLES = [
  { id: 'helmet',     label: 'หมวกเหล็กยุทธวิธี + แว่นโค้ง' },
  { id: 'undercut',   label: 'ผมรองทรง Undercut หนา + หูฟัง' },
  { id: 'spiky',      label: 'ผมตั้งหนาหลายชั้น (Spiky Action)' },
  { id: 'buzz_beret', label: 'หมวกเบเรต์หน่วยรบพิเศษ' }
];

export const FEMALE_OUTFITS = [
  { id: 'tactical_suit',    label: 'ชุดยุทธวิธีมาตรฐาน' },
  { id: 'combat_skirt',     label: 'ชุดกระโปรงยาวละเอียด (Cloth Physics)' },
  { id: 'jacket_coat',      label: 'ชุดเสื้อโค้ทยาวเปิดหน้า ยึดลำตัวบน (Cloth Physics)' },
  { id: 'stealth_bodysuit', label: 'ชุดสายลับ + ผ้าพันคอ (Cloth Physics)' }
];

export const MALE_OUTFITS = [
  { id: 'specops_vest',  label: 'ชุดคอมมานโดมาตรฐาน' },
  { id: 'heavy_armor',   label: 'เกราะหนัก Tasset (Armor Physics)' },
  { id: 'tactical_coat', label: 'เสื้อโค้ทยาวทหารเปิดหน้า ยึดลำตัวบน (Cloth Physics)' },
  { id: 'ghillie_cloak', label: 'ผ้าคลุมพรางตัวละเอียด (Cloth Physics)' }
];

export const JUMP_STYLES = [
  { id: 'standard',      label: 'กระโดดมาตรฐาน (Tuck Jump)' },
  { id: 'sprint_leap',   label: 'กระโดดพุ่งตัว (Sprint Leap)' },
  { id: 'tactical_side', label: 'กระโดดหลบข้าง (Tactical Evasive)' },
  { id: 'vault',         label: 'กระโดดข้ามสิ่งกีดขวาง (Parkour Vault)' }
];

export const CHARACTER_PROFILES = {
  male: {
    gender: 'male',
    label: 'Male Soldier (ชาย)',
    hipY: 0.94,
    pelvisW: 0.34, pelvisH: 0.15, pelvisD: 0.24,
    waistW: 0.31, waistH: 0.17, waistD: 0.21,
    chestW: 0.42, chestH: 0.33, chestD: 0.26,
    shoulderX: 0.25, upperArmR: 0.062, forearmR: 0.050,
    armL1: 0.28, armL2: 0.27,
    hipX: 0.115, thighR: 0.088, shinR: 0.068,
    thighL: 0.40, shinL: 0.40, footH: 0.11,
    headScale: [1.0, 1.0, 1.0],
    hasBustPhysics: false,
    gait: { hipSwayZ: 0.025, hipTwistY: 0.060, strideLen: 0.62, cadence: 1.0 }
  },
  female: {
    gender: 'female',
    label: 'Female Operative (หญิง)',
    hipY: 0.92,
    pelvisW: 0.35, pelvisH: 0.14, pelvisD: 0.25,
    waistW: 0.23, waistH: 0.17, waistD: 0.17,
    chestW: 0.33, chestH: 0.31, chestD: 0.20,
    shoulderX: 0.195, upperArmR: 0.047, forearmR: 0.038,
    armL1: 0.26, armL2: 0.25,
    hipX: 0.105, thighR: 0.083, shinR: 0.057,
    thighL: 0.39, shinL: 0.39, footH: 0.11,
    headScale: [0.92, 0.95, 0.92],
    hasBustPhysics: true,
    gait: { hipSwayZ: 0.055, hipTwistY: 0.095, strideLen: 0.58, cadence: 1.08 }
  }
};

function createCharacterMaterials(team = 'red', gender = 'male') {
  const palette = team === 'blue'
    ? {
        armor: 0x2563eb,
        innerShirt: 0x3b82f6,
        cloth: 0x243b6b,
        pants: 0x1e293b,
        accent: 0x93c5fd,
        visor: 0x93c5fd,
        coat: 0x172554
      }
    : team === 'specops'
    ? {
        armor: 0x334155,
        innerShirt: 0x475569,
        cloth: 0x293548,
        pants: 0x181f2a,
        accent: 0x38bdf8,
        visor: 0x38bdf8,
        coat: 0x0f172a
      }
    : {
        armor: 0xdc2626,
        innerShirt: 0xef4444,
        cloth: 0x6b1d24,
        pants: 0x291a1d,
        accent: 0xfca5a5,
        visor: 0xfca5a5,
        coat: 0x450a0a
      };

  return {
    skin: new THREE.MeshStandardMaterial({ color: gender === 'female' ? 0xe8beaa : 0xd9a98b, roughness: 0.66 }),
    innerShirt: new THREE.MeshStandardMaterial({ color: palette.innerShirt, roughness: 0.72 }),
    cloth: new THREE.MeshStandardMaterial({ color: palette.cloth, roughness: 0.78 }),
    pants: new THREE.MeshStandardMaterial({ color: palette.pants, roughness: 0.84 }),
    armor: new THREE.MeshStandardMaterial({ color: palette.armor, roughness: 0.44, metalness: 0.24, side: THREE.DoubleSide }),
    accent: new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.42, metalness: 0.35, side: THREE.DoubleSide }),
    coat: new THREE.MeshStandardMaterial({ color: palette.coat, roughness: 0.76, side: THREE.DoubleSide }),
    darkGear: new THREE.MeshStandardMaterial({ color: 0x15181e, roughness: 0.62, metalness: 0.3 }),
    visor: new THREE.MeshStandardMaterial({ color: palette.visor, roughness: 0.18, metalness: 0.85 }),
    hair: new THREE.MeshStandardMaterial({ color: gender === 'female' ? 0x281812 : 0x1f1713, roughness: 0.80, side: THREE.DoubleSide }),
    hairHighlight: new THREE.MeshStandardMaterial({ color: gender === 'female' ? 0x43291f : 0x31251e, roughness: 0.76, side: THREE.DoubleSide }),
    lip: new THREE.MeshStandardMaterial({ color: 0xc46b68, roughness: 0.55 }),
    eyeWhite: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }),
    eyePupil: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 }),
    medkit: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }),
    // matte fabric for skirts: no metalness, high roughness; colour comes from per-vertex colours
    skirtFabric: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.93, metalness: 0.0, side: THREE.DoubleSide, vertexColors: true }),
    skirtBelt: new THREE.MeshStandardMaterial({ color: new THREE.Color(palette.armor).multiplyScalar(0.42), roughness: 0.7, metalness: 0.05 }),
    palette
  };
}

function makeMesh(geo, mat, x = 0, y = 0, z = 0, cs = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = cs;
  m.receiveShadow = true;
  return m;
}

// ============================================================================
// 2. PHYSICS ENGINES:
//    A) BustPuddingPhysics (Soft Pudding + Real Weapon Compression & Bulge)
//    B) VerletClothSheet (Soft Gravity-Draped Cloth with Asymmetric Pleating)
//    C) VerletStrand (Lush Multi-Layered Tapered Hair Strands & Locks)
// ============================================================================
const BUST_SQUASH_CENTER = V3(0, -0.008, -0.050);   // centre of the bust sphere, in the bust pivot's space
const BUST_CONTACT = {
  meshRadius: 0.080,  // radius of the bust sphere geometry (the contact ellipsoid is built from the real mesh matrix)
  skin: 0.005,        // extra reach added to the contact size (so the flattening starts on touch)
  maxDepth: 0.075,    // deepest squash (m)
  rateIn: 38,         // 1/s: how quickly it flattens when pressed
  rateOut: 11         // 1/s: how slowly it relaxes afterwards (exponential, no overshoot)
};

class BustPuddingPhysics {
  constructor() {
    this.k = 170;
    this.c = 17.0;
    this.left = { pos: V3(), vel: V3(), compress: 0 };
    this.right = { pos: V3(), vel: V3(), compress: 0 };
    this.init = false;
    this.prevChestPos = V3();
    this.prevChestVel = V3();
    this.breathPhase = Math.random() * Math.PI * 2;
    this.pressPush = { L: V3(), R: V3(), cL: 0, cR: 0 };
  }

  addImpulse(ix, iy, iz, side = 0) {
    if (side <= 0) { this.left.vel.x += ix * 0.92; this.left.vel.y += iy; this.left.vel.z += iz; }
    if (side >= 0) { this.right.vel.x += ix * 1.08; this.right.vel.y += iy * 0.95; this.right.vel.z += iz; }
  }

  step(dt, chestBone) {
    chestBone.updateWorldMatrix(true, false);
    const invChestQ = new THREE.Quaternion();
    chestBone.getWorldQuaternion(invChestQ).invert();
    const chestPos = chestBone.getWorldPosition(V3());

    if (!this.init || chestPos.distanceTo(this.prevChestPos) > 1.2) {
      this.prevChestPos.copy(chestPos);
      this.prevChestVel.set(0, 0, 0);
      this.init = true;
      return;
    }

    const instVel = chestPos.clone().sub(this.prevChestPos).divideScalar(dt);
    const smoothVel = this.prevChestVel.clone().lerp(instVel, clamp(dt * 14, 0, 1));
    const accWorld = smoothVel.clone().sub(this.prevChestVel).divideScalar(dt);
    this.prevChestPos.copy(chestPos);
    this.prevChestVel.copy(smoothVel);
    if (accWorld.lengthSq() > 28 * 28) accWorld.setLength(28);

    const gravity = V3(0, -9.81, 0);
    const fLocal = gravity.clone().sub(accWorld).applyQuaternion(invChestQ);
    fLocal.y += 9.81;

    this.breathPhase += dt * 2.1;
    fLocal.y += Math.cos(this.breathPhase) * 0.65;
    fLocal.z += Math.sin(this.breathPhase) * 0.55;

    const sub = Math.max(1, Math.min(4, Math.ceil(dt / 0.008)));
    const h = dt / sub;
    const solve = (node, fx, fy, fz, press, targetCompress) => {
      node.compress = damp(node.compress, targetCompress, 26, dt);
      for (let i = 0; i < sub; i++) {
        const ax = -this.k * node.pos.x - this.c * node.vel.x + fx * 0.72 + press.x;
        const ay = -this.k * node.pos.y - this.c * node.vel.y + fy * 0.92 + press.y;
        const az = -this.k * node.pos.z - this.c * node.vel.z + fz * 0.68 + press.z;
        node.vel.x += ax * h; node.vel.y += ay * h; node.vel.z += az * h;
        node.pos.x = clamp(node.pos.x + node.vel.x * h, -0.17, 0.17);
        node.pos.y = clamp(node.pos.y + node.vel.y * h, -0.24, 0.22);
        node.pos.z += node.vel.z * h;
        if (node.pos.z > 0.14) { node.pos.z = 0.14; if (node.vel.z > 0) node.vel.z *= -0.40; }
        else if (node.pos.z < -0.17) node.pos.z = -0.17;
      }
      press.set(0, 0, 0);
    };

    solve(this.left, fLocal.x, fLocal.y, fLocal.z, this.pressPush.L, this.pressPush.cL);
    solve(this.right, fLocal.x * 0.94, fLocal.y * 1.06, fLocal.z, this.pressPush.R, this.pressPush.cR);
    this.pressPush.cL = 0;
    this.pressPush.cR = 0;
  }
}

// High-Resolution Soft Verlet Cloth Sheet with Real Gravity, Asymmetric Pleating & Edge-Midpoint Limb Collision
class VerletClothSheet {
  constructor({
    anchorBone, pinsLocal, cols, rows, rowHeight, flareOut = 0.005, closedLoop = false,
    mat, root, parentGroup, castShadow = true, damping = 1.65, airDrag = null, flutter = 0.18,
    stretchV = 0.94, compressV = 0.65, stretchH = 0.78, compressH = 0.05,
    shearStretch = 0.20, shearCompress = 0.03, bendV = 0.06, bendH = 0.03,
    // --- elastic cloth / anti-clipping ---
    elasticity = 0.6,   // 0 = stiff as before, 0.9 = very stretchy near rest length
    maxStretch = 1.28,  // hard limit: a link can never stretch beyond 128% (no tearing / rubber-band)
    skin = 0.012,       // cloth "thickness": cloth is kept this far outside the body spheres
    maxMove = 0.08,     // max travel of a cloth vertex per sub-step (anti tunnelling)
    maxSpeed = 3.5,     // relative cloth speed cap; anchor movement is carried separately
    // --- skirt-oriented options (all optional; coats / cloaks keep their old behaviour) ---
    collide = null,     // { tag: radiusScale }  only spheres with these tags are used (null = all, scale 1)
    tether = null,      // { top, bottom, curve }  soft pull of every vertex back to its draped rest pose
    pleatDepth = 0,     // pleats get deeper towards the hem (metres at the last row)
    liftScale = 1,      // scales the "wind lift" while moving (0 = no lift at all)
    colorFn = null      // (row, col, rows, cols) => THREE.Color   per-vertex colour (needs vertexColors material)
  }) {
    this.anchorBone = anchorBone;
    this.pinsLocal = pinsLocal.map((p) => p.clone());
    this.cols = cols;
    this.rows = rows;
    this.rowHeight = rowHeight;
    this.flareOut = flareOut;
    this.closedLoop = closedLoop;
    this.root = root;
    this.damping = airDrag != null ? clamp((1 - airDrag) * 24, 3.2, 7.0) : clamp(damping, 3.2, 7.0);
    this.flutter = flutter * 0.35;
    this.elasticity = clamp(elasticity, 0, 0.9);
    this.maxStretch = Math.max(1.05, maxStretch);
    this.skin = skin;
    this.maxMove = maxMove;
    this.maxSpeed = maxSpeed;
    this.collide = collide;
    this.liftScale = liftScale * 0.25;
    this.tetherScale = 1;                 // callers lower this for a ragdoll (cloth should fall, not hug a lying pelvis)
    this._fbuf = null;                    // filtered collision list (re-used every frame)
    this._sp = null;      // working (swept) collision spheres
    this._prevC = null;   // sphere centres of the previous frame
    this._pinW = Array.from({ length: cols }, () => V3());
    this._prevAnchorInverse = new THREE.Matrix4();
    this._anchorDelta = new THREE.Matrix4();
    this._anchorFrameReady = false;
    this.init = false;
    this.time = Math.random() * 10;

    const totalPts = cols * rows;
    this.pts = Array.from({ length: totalPts }, () => V3());
    this.old = Array.from({ length: totalPts }, () => V3());
    this.constraints = [];

    const rest = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pin = this.pinsLocal[c];
        const radial = V3(pin.x, 0, pin.z);
        if (radial.lengthSq() > 1e-5) radial.normalize();
        else radial.set(0, 0, 1);
        const pl = pleatDepth > 0 ? (c % 2 === 0 ? 1 : -1) * pleatDepth * (r / Math.max(1, rows - 1)) : 0;
        rest.push(pin.clone().addScaledVector(radial, r * flareOut + pl).add(V3(0, -r * rowHeight, 0)));
      }
    }
    this.restLocal = rest;
    this._tgtW = rest.map(() => V3());
    this._tetherK = new Float32Array(totalPts);
    if (tether) {
      const curve = tether.curve ?? 2;
      for (let r = 0; r < rows; r++) {
        const t = r / Math.max(1, rows - 1);
        const k = tether.top * Math.pow(1 - t, curve) + tether.bottom * t;
        for (let c = 0; c < cols; c++) this._tetherK[r * cols + c] = k;
      }
    }
    this._hasTether = !!tether;

    const idx = (r, c) => r * cols + ((c % cols + cols) % cols);
    const addC = (a, b, stretch, compress, minRatio = 0.0, elastic = false) =>
      this.constraints.push({ a, b, d: rest[a].distanceTo(rest[b]), stretch, compress, minRatio, elastic });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r < rows - 1) addC(idx(r, c), idx(r + 1, c), stretchV, compressV, 0.0, true);
        if (r < rows - 2) addC(idx(r, c), idx(r + 2, c), bendV, bendV * 0.5);

        if (closedLoop || c < cols - 1) {
          addC(idx(r, c), idx(r, c + 1), stretchH, compressH, 0.50, true);
          if (r < rows - 1) {
            addC(idx(r, c), idx(r + 1, c + 1), shearStretch, shearCompress);
            addC(idx(r, c + 1), idx(r + 1, c), shearStretch, shearCompress);
          }
        }
        if (closedLoop || c < cols - 2) {
          addC(idx(r, c), idx(r, c + 2), bendH, bendH * 0.4);
        }
      }
    }

    const indices = [];
    for (let r = 0; r < rows - 1; r++) {
      const maxC = closedLoop ? cols : cols - 1;
      for (let c = 0; c < maxC; c++) {
        const a = idx(r, c), b = idx(r, c + 1), c0 = idx(r + 1, c), d = idx(r + 1, c + 1);
        indices.push(a, c0, b, b, c0, d);
      }
    }
    this.posAttr = new THREE.BufferAttribute(new Float32Array(totalPts * 3), 3);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', this.posAttr);
    if (colorFn) {
      const col = new Float32Array(totalPts * 3);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const k = colorFn(r, c, rows, cols); const o = (r * cols + c) * 3;
        col[o] = k.r; col[o + 1] = k.g; col[o + 2] = k.b;
      }
      this.geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    }
    this.geo.setIndex(indices);
    this.mesh = new THREE.Mesh(this.geo, mat);
    this.mesh.castShadow = castShadow;
    this.mesh.receiveShadow = true;
    this.mesh.frustumCulled = false;
    parentGroup.add(this.mesh);
  }

  addImpulse(ix, iy, iz) {
    for (let i = this.cols; i < this.pts.length; i++) {
      const r = Math.floor(i / this.cols);
      const k = (r / Math.max(1, this.rows - 1)) * 0.016;
      this.old[i].x -= ix * k; this.old[i].y -= iy * k; this.old[i].z -= iz * k;
    }
  }

  // Sweep the body spheres from last frame's pose to this frame's pose (t = 0..1) so that a fast
  // moving body (e.g. a falling corpse) can never jump through the cloth between two frames.
  _syncSpheres(src, t) {
    const n = src.length;
    if (!this._sp || this._sp.length !== n) {
      this._sp = src.map((sp) => ({ c: sp.c.clone(), r: sp.r + this.skin }));
      this._prevC = src.map((sp) => sp.c.clone());
    }
    for (let k = 0; k < n; k++) {
      const sp = this._sp[k];
      sp.c.lerpVectors(this._prevC[k], src[k].c, t);
      sp.r = src[k].r + this.skin;
    }
  }

  _rememberSpheres(src) {
    for (let k = 0; k < src.length; k++) this._prevC[k].copy(src[k].c);
  }

  // Keeps only the spheres this sheet cares about (e.g. a skirt ignores arms / head) and scales their
  // radii (the shared body spheres are inflated for coats; a skirt must hug the real legs).
  _filterSpheres(src) {
    if (!this.collide) return src;
    if (!this._fbuf) this._fbuf = [];
    let n = 0;
    for (let k = 0; k < src.length; k++) {
      const s = this.collide[src[k].tag];
      if (!s) continue;
      const e = this._fbuf[n] || (this._fbuf[n] = { c: null, r: 0 });
      e.c = src[k].c; e.r = src[k].r * s; n++;
    }
    this._fbuf.length = n;
    return this._fbuf;
  }

  step(dt, collisionSpheres = [], floorY = 0) {
    collisionSpheres = this._filterSpheres(collisionSpheres);
    this.anchorBone.updateWorldMatrix(true, false);
    const anchorWorld = this.anchorBone.matrixWorld;
    if (this.init && this._anchorFrameReady) {
      // Carry particles with the anchor's rigid motion; only relative motion should create sway.
      this._anchorDelta.multiplyMatrices(anchorWorld, this._prevAnchorInverse);
      for (let i = 0; i < this.pts.length; i++) {
        this.pts[i].applyMatrix4(this._anchorDelta);
        this.old[i].applyMatrix4(this._anchorDelta);
      }
    }
    this._prevAnchorInverse.copy(anchorWorld).invert();
    this._anchorFrameReady = true;
    const cols = this.cols;
    // pin positions are constant during one step -> compute once (no per-iteration allocations)
    for (let c = 0; c < cols; c++) this._pinW[c].copy(this.pinsLocal[c]).applyMatrix4(this.anchorBone.matrixWorld);
    const pin0W = this._pinW[0];
    if (this._hasTether) {
      const mw = this.anchorBone.matrixWorld;
      for (let i = cols; i < this.pts.length; i++) this._tgtW[i].copy(this.restLocal[i]).applyMatrix4(mw);
    }
    const floorAt = (x, z) => {
      const fy = typeof floorY === 'function' ? floorY(x, z) : floorY;
      return Number.isFinite(fy) ? fy : 0;
    };

    const mid = V3();
    this._syncSpheres(collisionSpheres, 1);

    // Push one point out of every body sphere. When the body lies on the floor the point can be
    // squeezed between sphere and floor: then it slides along the floor to the sphere's rim
    // instead of being forced through the body (that was the "cloth pokes through the corpse" bug).
    const collidePoint = (p, fl) => {
      const sps = this._sp;
      for (let k = 0; k < sps.length; k++) {
        const sp = sps[k], c = sp.c, r = sp.r;
        const dx = p.x - c.x, dy = p.y - c.y, dz = p.z - c.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r * r) continue;
        const d = Math.sqrt(d2);
        if (d > 1e-5) { const k2 = r / d; p.set(c.x + dx * k2, c.y + dy * k2, c.z + dz * k2); }
        else p.set(c.x, c.y + r, c.z);
        if (p.y < fl) {
          const dyf = fl - c.y;
          const rh2 = r * r - dyf * dyf;
          const hl = Math.hypot(dx, dz);
          if (rh2 > 0 && hl > 1e-5) {
            const k3 = Math.sqrt(rh2) / hl;
            p.x = c.x + dx * k3;
            p.z = c.z + dz * k3;
          }
          p.y = fl;
        }
      }
    };

    // Edge midpoints (ic = -1) and quad centres (4 indices): keeps the cloth *surface* outside the
    // body, not only its vertices. Pinned (top row) vertices never move; their share goes to the free ones.
    const pushMid = (ia, ib, ic, id) => {
      const quad = ic >= 0;
      const pa = this.pts[ia], pb = this.pts[ib];
      if (quad) {
        const pc = this.pts[ic], pd = this.pts[id];
        mid.set((pa.x + pb.x + pc.x + pd.x) * 0.25, (pa.y + pb.y + pc.y + pd.y) * 0.25, (pa.z + pb.z + pc.z + pd.z) * 0.25);
      } else {
        mid.set((pa.x + pb.x) * 0.5, (pa.y + pb.y) * 0.5, (pa.z + pb.z) * 0.5);
      }
      let free = (ia >= cols ? 1 : 0) + (ib >= cols ? 1 : 0);
      if (quad) free += (ic >= cols ? 1 : 0) + (id >= cols ? 1 : 0);
      if (free === 0) return;
      const n = quad ? 4 : 2;
      const sps = this._sp;
      for (let k = 0; k < sps.length; k++) {
        const sp = sps[k], c = sp.c, r = sp.r;
        const dx = mid.x - c.x, dy = mid.y - c.y, dz = mid.z - c.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= r * r) continue;
        const d = Math.sqrt(d2);
        if (d < 1e-5) continue;
        const amt = ((r - d) / d) * (n / free) * 0.75;
        if (ia >= cols) pa.set(pa.x + dx * amt, pa.y + dy * amt, pa.z + dz * amt);
        if (ib >= cols) pb.set(pb.x + dx * amt, pb.y + dy * amt, pb.z + dz * amt);
        if (quad) {
          const pc = this.pts[ic], pd = this.pts[id];
          if (ic >= cols) pc.set(pc.x + dx * amt, pc.y + dy * amt, pc.z + dz * amt);
          if (id >= cols) pd.set(pd.x + dx * amt, pd.y + dy * amt, pd.z + dz * amt);
        }
      }
    };

    const maxC = this.closedLoop ? cols : cols - 1;
    const pushOutCollisions = () => {
      const n = this.pts.length;
      for (let i = cols; i < n; i++) {
        const p = this.pts[i];
        collidePoint(p, floorAt(p.x, p.z) + 0.018);
        const fl = floorAt(p.x, p.z) + 0.018;
        if (p.y < fl) {
          p.y = fl;
          this.old[i].y = p.y;                 // cloth does not bounce off the floor
          this.old[i].x += (p.x - this.old[i].x) * 0.25;
          this.old[i].z += (p.z - this.old[i].z) * 0.25;
        }
      }
      for (let r = 0; r < this.rows - 1; r++) {
        for (let c = 0; c < cols; c++) pushMid(r * cols + c, (r + 1) * cols + c, -1, -1);
      }
      for (let r = 1; r < this.rows; r++) {
        for (let c = 0; c < maxC; c++) pushMid(r * cols + c, r * cols + ((c + 1) % cols), -1, -1);
      }
      for (let r = 0; r < this.rows - 1; r++) {
        for (let c = 0; c < maxC; c++) {
          const c1 = (c + 1) % cols;
          pushMid(r * cols + c, r * cols + c1, (r + 1) * cols + c, (r + 1) * cols + c1);
        }
      }
    };

    if (!this.init || pin0W.distanceTo(this.pts[0]) > 1.8) {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const pin = this.pinsLocal[c];
          const rad = V3(pin.x, 0, pin.z);
          if (rad.lengthSq() > 1e-5) rad.normalize();
          const p = this.anchorBone.localToWorld(pin.clone().addScaledVector(rad, r * this.flareOut));
          p.y -= r * this.rowHeight;
          const fl = floorAt(p.x, p.z) + 0.018;
          if (p.y < fl) p.y = fl;
          this.pts[i].copy(p);
          this.old[i].copy(p);
        }
      }
      this._rememberSpheres(collisionSpheres);
      this._syncSpheres(collisionSpheres, 1);
      pushOutCollisions();
      for (let i = 0; i < this.pts.length; i++) this.old[i].copy(this.pts[i]);
      this.init = true;
      return;
    }

    const sub = 3;
    const iters = 6;
    const h = dt / sub;
    const gStep = -9.81 * h * h;
    const drag = Math.exp(-this.damping * h);
    const invH = 1 / Math.max(1e-4, h);
    const maxS = this.maxStretch, el = this.elasticity, maxMove = this.maxMove, maxSpeed = this.maxSpeed;

    for (let s = 0; s < sub; s++) {
      this.time += h;
      this._syncSpheres(collisionSpheres, (s + 1) / sub);   // swept body pose for this sub-step
      for (let c = 0; c < cols; c++) {
        this.pts[c].copy(this._pinW[c]);
        this.old[c].copy(this._pinW[c]);
      }

      for (let i = cols; i < this.pts.length; i++) {
        const p = this.pts[i], o = this.old[i];
        let vx = (p.x - o.x) * drag;
        let vy = (p.y - o.y) * drag;
        let vz = (p.z - o.z) * drag;
        const vl = Math.hypot(vx, vy, vz);
        const speed = Math.min(vl * invH, maxSpeed);
        const maxTravel = Math.min(maxMove, maxSpeed * h);
        if (vl > maxTravel) { const k = maxTravel / vl; vx *= k; vy *= k; vz *= k; }
        const moveFactor = clamp((speed - 0.22) * 0.14, 0, 0.45);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const rowFactor = row / Math.max(1, this.rows - 1);
        const waveX = Math.sin(this.time * 8.5 + col * 0.75 + row * 0.55) * this.flutter * moveFactor * rowFactor * h * h;
        const waveZ = Math.cos(this.time * 7.2 + col * 0.65 + row * 0.45) * this.flutter * moveFactor * rowFactor * h * h;
        const airLift = moveFactor * rowFactor * 0.4 * this.liftScale * h * h;
        o.copy(p);
        p.x += vx + waveX;
        p.y += vy + gStep + airLift;
        p.z += vz + waveZ;
      }

      // soft tether to the draped rest pose: keeps the waist area hugging the hips (no stiff "shelf" or
      // sticking up) while the hem stays loose. Moves p and (mostly) old together -> acts like a damped spring.
      if (this._hasTether && this.tetherScale > 0) {
        const tk = this._tetherK, ts = this.tetherScale;
        for (let i = cols; i < this.pts.length; i++) {
          const k = tk[i] * ts;
          if (k <= 0) continue;
          const p = this.pts[i], o = this.old[i], g = this._tgtW[i];
          const dx = (g.x - p.x) * k, dy = (g.y - p.y) * k, dz = (g.z - p.z) * k;
          p.x += dx; p.y += dy; p.z += dz;
          o.x += dx * 0.85; o.y += dy * 0.85; o.z += dz * 0.85;
        }
      }

      for (let it = 0; it < iters; it++) {
        for (let c = 0; c < cols; c++) this.pts[c].copy(this._pinW[c]);
        for (const con of this.constraints) {
          if (con.b < cols) continue;                       // both ends pinned
          const pa = this.pts[con.a], pb = this.pts[con.b];
          const dx = pb.x - pa.x, dy = pb.y - pa.y, dz = pb.z - pa.z;
          const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (len < 1e-5) continue;
          const ratio = len / Math.max(1e-4, con.d);
          let target = con.d, stiff;
          if (len >= con.d) {
            if (ratio > maxS) { target = con.d * maxS; stiff = 1; }   // hard stretch limit
            else {
              stiff = con.stretch;
              // elastic zone: soft near rest length, stiffening as the link approaches the limit
              if (con.elastic) {
                const t = Math.min(1, (ratio - 1) / (maxS - 1));
                stiff *= 1 - el * (1 - t * t);
              }
            }
          } else {
            stiff = con.compress;
            if (con.minRatio > 0 && ratio < con.minRatio) stiff = 0.45;
          }
          if (stiff <= 0) continue;
          const diff = ((len - target) / len) * stiff;
          if (con.a < cols) {
            pb.set(pb.x - dx * diff, pb.y - dy * diff, pb.z - dz * diff);
          } else {
            const hd = diff * 0.5;
            pa.set(pa.x + dx * hd, pa.y + dy * hd, pa.z + dz * hd);
            pb.set(pb.x - dx * hd, pb.y - dy * hd, pb.z - dz * hd);
          }
        }
        // collisions run on every other iteration and always last, so the body always wins over the springs
        if (it & 1) pushOutCollisions();
      }
    }
    this._rememberSpheres(collisionSpheres);
  }

  syncVisuals() {
    this.root.updateMatrixWorld(true);
    const loc = V3();
    for (let i = 0; i < this.pts.length; i++) {
      loc.copy(this.pts[i]);
      this.root.worldToLocal(loc);
      this.posAttr.setXYZ(i, loc.x, loc.y, loc.z);
    }
    this.posAttr.needsUpdate = true;
    this.geo.computeVertexNormals();
  }
}

class VerletStrand {
  constructor(anchorBone, localAnchor, localRestDir, segmentCount, segmentLen, radii, mat, root, parentGroup, castShadow = true, damping = 4.5) {
    this.anchorBone = anchorBone;
    this.localAnchor = localAnchor.clone();
    this.localRestDir = localRestDir.clone().normalize();
    this.count = segmentCount;
    this.segLen = segmentLen;
    this.root = root;
    this.damping = Math.max(3.5, damping);
    this.maxSpeed = 3.8;
    this.pts = Array.from({ length: segmentCount + 1 }, () => V3());
    this.old = Array.from({ length: segmentCount + 1 }, () => V3());
    this.meshes = [];
    const first = radii?.[0];
    this.boxy = Array.isArray(first) && first.length === 3;                       // armour plates (box segments)
    this.margin = this.boxy ? 0.5 * Math.min(first[0], first[2]) + 0.01 : 0;      // half plate thickness + gap
    this.init = false;
    this._prevAnchorInverse = new THREE.Matrix4();
    this._anchorDelta = new THREE.Matrix4();
    this._anchorFrameReady = false;

    for (let i = 0; i < segmentCount; i++) {
      const spec = radii[i];
      const geo = Array.isArray(spec) && spec.length === 3
        ? new THREE.BoxGeometry(spec[0], segmentLen * 1.15, spec[2])
        : new THREE.CylinderGeometry(spec?.[0] ?? 0.032, spec?.[1] ?? 0.020, segmentLen * 1.18, 10);
      const m = makeMesh(geo, mat, 0, 0, 0, castShadow);
      parentGroup.add(m);
      this.meshes.push(m);
    }
  }

  addImpulse(ix, iy, iz) {
    for (let i = 1; i <= this.count; i++) {
      const k = (i / this.count) * 0.016;
      this.old[i].x -= ix * k; this.old[i].y -= iy * k; this.old[i].z -= iz * k;
    }
  }

  step(dt, collisionSpheres = [], floorY = 0) {
    this.anchorBone.updateWorldMatrix(true, false);
    const anchorWorld = this.anchorBone.matrixWorld;
    if (this.init && this._anchorFrameReady) {
      this._anchorDelta.multiplyMatrices(anchorWorld, this._prevAnchorInverse);
      for (let i = 0; i <= this.count; i++) {
        this.pts[i].applyMatrix4(this._anchorDelta);
        this.old[i].applyMatrix4(this._anchorDelta);
      }
    }
    this._prevAnchorInverse.copy(anchorWorld).invert();
    this._anchorFrameReady = true;
    const anchorW = this.anchorBone.localToWorld(this.localAnchor.clone());
    const dirW = this.anchorBone.localToWorld(this.localAnchor.clone().add(this.localRestDir)).sub(anchorW).normalize();
    const floorAt = (x, z) => {
      const fy = typeof floorY === 'function' ? floorY(x, z) : floorY;
      return Number.isFinite(fy) ? fy : 0;
    };

    if (!this.init || anchorW.distanceTo(this.pts[0]) > 1.8) {
      for (let i = 0; i <= this.count; i++) {
        this.pts[i].copy(anchorW).addScaledVector(dirW, i * this.segLen * 0.55).add(V3(0, -i * this.segLen * 0.72, 0));
        const fl = floorAt(this.pts[i].x, this.pts[i].z) + 0.022;
        if (this.pts[i].y < fl) this.pts[i].y = fl;
        this.old[i].copy(this.pts[i]);
      }
      this.init = true;
      return;
    }

    const sub = 2;
    const h = dt / sub;
    const gStep = -9.81 * h * h;
    const drag = Math.exp(-this.damping * h);
    const tmp = V3(), mid = V3();

    for (let s = 0; s < sub; s++) {
      this.pts[0].copy(anchorW); this.old[0].copy(anchorW);
      for (let i = 1; i <= this.count; i++) {
        const p = this.pts[i], o = this.old[i];
        let vx = (p.x - o.x) * drag, vy = (p.y - o.y) * drag, vz = (p.z - o.z) * drag;
        const travel = Math.hypot(vx, vy, vz), maxTravel = this.maxSpeed * h;
        if (travel > maxTravel) { const k = maxTravel / travel; vx *= k; vy *= k; vz *= k; }
        o.copy(p);
        p.x += vx; p.y += vy + gStep; p.z += vz;
      }

      for (let it = 0; it < 4; it++) {
        this.pts[0].copy(anchorW);
        for (let i = 1; i <= this.count; i++) {
          const pa = this.pts[i - 1], pb = this.pts[i];
          tmp.subVectors(pb, pa);
          const d = tmp.length();
          if (d > 1e-5) {
            const diff = (d - this.segLen) / d;
            if (i === 1) pb.addScaledVector(tmp, -diff);
            else { pa.addScaledVector(tmp, diff * 0.35); pb.addScaledVector(tmp, -diff * 0.65); }
          }
          const m = this.margin;
          for (const sp of collisionSpheres) {
            tmp.subVectors(pb, sp.c);
            const sd = tmp.length();
            const rr = sp.r + m;
            if (sd < rr && sd > 1e-5) pb.copy(sp.c).addScaledVector(tmp, rr / sd);
          }
          mid.addVectors(pa, pb).multiplyScalar(0.5);
          for (const sp of collisionSpheres) {
            tmp.subVectors(mid, sp.c);
            const sd = tmp.length();
            const rr = sp.r + m;
            if (sd < rr && sd > 1e-5) {
              tmp.multiplyScalar((rr - sd) / sd);
              if (i > 1) { pa.add(tmp); pb.add(tmp); } else pb.addScaledVector(tmp, 2);
            }
          }
          const fl = floorAt(pb.x, pb.z) + 0.022;
          if (pb.y < fl) {
            pb.y = fl;
            this.old[i].y = pb.y;                // no bounce off the floor
            this.old[i].x += (pb.x - this.old[i].x) * 0.25;
            this.old[i].z += (pb.z - this.old[i].z) * 0.25;
          }
        }
      }
    }
  }

  syncVisuals() {
    this.root.updateMatrixWorld(true);
    const a = V3(), b = V3(), d = V3(), yAxis = V3(0, 1, 0);
    for (let i = 0; i < this.count; i++) {
      a.copy(this.pts[i]); b.copy(this.pts[i + 1]);
      this.root.worldToLocal(a); this.root.worldToLocal(b);
      const m = this.meshes[i];
      m.position.copy(a).lerp(b, 0.5);
      d.subVectors(b, a);
      const len = d.length();
      if (len > 1e-4) { d.divideScalar(len); m.quaternion.setFromUnitVectors(yAxis, d.negate()); }
    }
  }
}

// ============================================================================
// 3. BUILD ARTICULATED CHARACTER
// ============================================================================
export function createArticulatedCharacter({
  gender = 'male', team = 'red', hairstyle = null, outfit = null, weaponId = 'ar_aug', castShadow = true, buildWeaponFn = null
} = {}) {
  const prof = CHARACTER_PROFILES[gender] || CHARACTER_PROFILES.male;
  const chosenHair = hairstyle || (prof.gender === 'female' ? 'ponytail' : 'helmet');
  const chosenOutfit = outfit || (prof.gender === 'female' ? 'tactical_suit' : 'specops_vest');
  const mats = createCharacterMaterials(team, prof.gender);
  const root = new THREE.Group();
  root.rotation.order = 'YXZ';

  // ---- HIPS ----
  const hips = new THREE.Group();
  hips.position.set(0, prof.hipY, 0);
  hips.add(
    makeMesh(new THREE.BoxGeometry(prof.pelvisW, prof.pelvisH, prof.pelvisD), mats.pants, 0, 0.02, 0, castShadow),
    makeMesh(new THREE.BoxGeometry(prof.pelvisW + 0.032, 0.055, prof.pelvisD + 0.032), mats.darkGear, 0, 0.068, 0, castShadow),
    makeMesh(new THREE.BoxGeometry(0.08, 0.058, 0.03), mats.accent, 0, 0.068, -prof.pelvisD * 0.56, false)
  );
  if (prof.gender === 'female') {
    hips.add(
      makeMesh(new THREE.SphereGeometry(0.115, 10, 8), mats.pants, -0.095, 0.0, 0.02, castShadow),
      makeMesh(new THREE.SphereGeometry(0.115, 10, 8), mats.pants, 0.095, 0.0, 0.02, castShadow)
    );
  }
  root.add(hips);

  // ---- WAIST -> CHEST ----
  const waist = new THREE.Group();
  waist.position.set(0, 0.08, 0);
  waist.add(
    makeMesh(new THREE.CylinderGeometry(prof.waistW * 0.49, prof.pelvisW * 0.47, prof.waistH, 14), mats.innerShirt, 0, prof.waistH * 0.5, 0, castShadow),
    makeMesh(new THREE.BoxGeometry(prof.waistW * 0.72, prof.waistH * 0.75, prof.waistD + 0.025), mats.accent, 0, prof.waistH * 0.52, -0.005, false)
  );
  hips.add(waist);

  const chest = new THREE.Group();
  chest.position.set(0, prof.waistH - 0.01, 0);
  chest.add(
    makeMesh(new THREE.BoxGeometry(prof.chestW, prof.chestH, prof.chestD), mats.innerShirt, 0, prof.chestH * 0.5, 0, castShadow),
    makeMesh(new THREE.BoxGeometry(prof.chestW * 0.80, prof.chestH * 0.74, prof.chestD + 0.032), mats.armor, 0, prof.chestH * 0.50, 0, castShadow),
    makeMesh(new THREE.BoxGeometry(prof.chestW * 0.52, 0.065, prof.chestD + 0.048), mats.accent, 0, prof.chestH * 0.74, -0.005, false),
    makeMesh(new THREE.BoxGeometry(prof.chestW * 0.65, 0.072, prof.chestD + 0.052), mats.darkGear, 0, prof.chestH * 0.24, 0, castShadow)
  );
  waist.add(chest);

  // ---- FEMALE LOCKED-ANCHOR SOFT PUDDING BUST ----
  let bustL = null, bustR = null, breastPhysics = null;
  if (prof.hasBustPhysics) {
    chest.add(makeMesh(new THREE.BoxGeometry(0.24, 0.095, 0.07), mats.armor, 0, prof.chestH * 0.62, -prof.chestD * 0.36, castShadow));
    const mkBust = (side) => {
      const pivot = new THREE.Group();
      pivot.position.set(side * 0.086, prof.chestH * 0.62, -prof.chestD * 0.31);
      const outer = new THREE.Mesh(new THREE.SphereGeometry(0.080, 18, 16), mats.armor);
      outer.scale.set(0.96, 0.88, 1.06); outer.position.set(0, 0, 0); outer.castShadow = castShadow;
      const inner = new THREE.Mesh(new THREE.SphereGeometry(0.066, 14, 12), mats.innerShirt);
      inner.scale.set(0.92, 0.84, 0.92); inner.position.set(0, 0.002, -0.010);
      // contact squash group: sits on the centre of the bust sphere, so flattening happens about that centre
      // (see updateBustContactSquash). Visual only: it never feeds anything back into the body.
      const squash = new THREE.Group();
      squash.position.copy(BUST_SQUASH_CENTER);
      squash.add(outer, inner);
      pivot.add(squash);
      pivot.userData.squash = squash;
      pivot.userData.rest = pivot.position.clone();
      chest.add(pivot);
      return pivot;
    };
    bustL = mkBust(-1); bustR = mkBust(1);
    breastPhysics = new BustPuddingPhysics();
  }

  // ---- NECK & HEAD ----
  const neck = new THREE.Group();
  neck.position.set(0, prof.chestH, 0);
  neck.add(
    makeMesh(new THREE.CylinderGeometry(0.056, 0.064, 0.11, 10), mats.skin, 0, 0.055, 0, castShadow),
    makeMesh(new THREE.CylinderGeometry(0.088, 0.098, 0.048, 12), mats.armor, 0, 0.022, 0, castShadow)
  );
  chest.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 0.10, 0);
  const headRig = new THREE.Group();
  headRig.scale.set(...prof.headScale);
  const eyeOpenMeshes = [
    makeMesh(new THREE.BoxGeometry(0.044, 0.024, 0.02), mats.eyeWhite, -0.055, 0.145, -0.126, false),
    makeMesh(new THREE.BoxGeometry(0.044, 0.024, 0.02), mats.eyeWhite, 0.055, 0.145, -0.126, false),
    makeMesh(new THREE.BoxGeometry(0.022, 0.022, 0.022), mats.eyePupil, -0.055, 0.145, -0.129, false),
    makeMesh(new THREE.BoxGeometry(0.022, 0.022, 0.022), mats.eyePupil, 0.055, 0.145, -0.129, false)
  ];
  const eyeClosedMeshes = [
    makeMesh(new THREE.BoxGeometry(0.052, 0.009, 0.012), mats.skin, -0.055, 0.145, -0.140, false),
    makeMesh(new THREE.BoxGeometry(0.052, 0.009, 0.012), mats.skin, 0.055, 0.145, -0.140, false)
  ];
  for (const mesh of eyeClosedMeshes) mesh.visible = false;
  const mouthMeshes = [];
  const headSkinMesh = makeMesh(new THREE.BoxGeometry(0.24, 0.25, 0.25), mats.skin, 0, 0.125, 0, castShadow);
  headRig.add(
    headSkinMesh,
    ...eyeOpenMeshes,
    ...eyeClosedMeshes
  );

  // ---- THICK VOLUMINOUS LAYERED HAIRSTYLES + PHYSICS ----
  const dynamicStrands = [];
  const clothSheets = [];
  const strandGroup = new THREE.Group();
  root.add(strandGroup);

  if (prof.gender === 'female') {
    const lipMesh = makeMesh(new THREE.BoxGeometry(0.045, 0.015, 0.02), mats.lip, 0, 0.055, -0.126, false);
    mouthMeshes.push(lipMesh);
    const crown = makeMesh(new THREE.SphereGeometry(0.165, 16, 12), mats.hair, 0, 0.228, 0.015, castShadow);
    crown.scale.set(0.95, 0.56, 1.02);
    const topWave = makeMesh(new THREE.SphereGeometry(0.148, 14, 10), mats.hairHighlight, 0, 0.260, 0.012, castShadow);
    topWave.scale.set(0.92, 0.42, 0.96);
    const backCap = makeMesh(new THREE.SphereGeometry(0.158, 16, 12), mats.hair, 0, 0.150, 0.058, castShadow);
    backCap.scale.set(0.94, 0.92, 0.72);
    const templeL = makeMesh(new THREE.SphereGeometry(0.088, 12, 10), mats.hair, -0.105, 0.175, 0.020, castShadow);
    templeL.scale.set(0.55, 1.05, 1.05);
    const templeR = makeMesh(new THREE.SphereGeometry(0.088, 12, 10), mats.hair, 0.105, 0.175, 0.020, castShadow);
    templeR.scale.set(0.55, 1.05, 1.05);
    headRig.add(
      crown, topWave, backCap, templeL, templeR,
      makeMesh(new THREE.BoxGeometry(0.258, 0.16, 0.12), mats.hair, 0, 0.135, 0.088, castShadow),
      lipMesh
    );

    const bangsSpecs = [
      [-0.105, 0.024, 0.082], [-0.072, 0.026, 0.076], [-0.036, 0.028, 0.068],
      [0.0, 0.028, 0.064], [0.036, 0.028, 0.068], [0.072, 0.026, 0.076], [0.105, 0.024, 0.082]
    ];
    bangsSpecs.forEach(([bx, r, len], idx) => {
      dynamicStrands.push(
        new VerletStrand(
          head,
          V3(bx, 0.225, -0.125 + Math.abs(bx) * 0.18),
          V3(bx * 0.35, -0.92, -0.25),
          2, len * 0.55,
          [[r, r * 0.85], [r * 0.85, 0.008]],
          idx % 2 === 0 ? mats.hair : mats.hairHighlight,
          root, strandGroup, false
        )
      );
    });

    for (const side of [-1, 1]) {
      for (const [oz, rad, segL, matH] of [
        [-0.070, 0.034, 0.068, mats.hair],
        [-0.020, 0.038, 0.075, mats.hairHighlight],
        [0.035, 0.036, 0.078, mats.hair]
      ]) {
        dynamicStrands.push(
          new VerletStrand(
            head,
            V3(side * 0.134, 0.185, oz),
            V3(side * 0.40, -0.90, oz * 0.5),
            3, segL,
            [[rad, rad * 0.84], [rad * 0.84, rad * 0.58], [rad * 0.58, 0.010]],
            matH, root, strandGroup, castShadow
          )
        );
      }
    }

    if (chosenHair === 'ponytail') {
      headRig.add(
        makeMesh(new THREE.TorusGeometry(0.056, 0.022, 8, 16), mats.accent, 0, 0.185, 0.148, false),
        makeMesh(new THREE.SphereGeometry(0.064, 10, 8), mats.hair, 0, 0.185, 0.152, castShadow)
      );
      const ptClusters = [
        [0, 0.19, 0.058, mats.hair, 0.095],
        [-0.030, 0.195, 0.045, mats.hairHighlight, 0.092],
        [0.030, 0.195, 0.045, mats.hairHighlight, 0.092],
        [-0.042, 0.172, 0.040, mats.hair, 0.090],
        [0.042, 0.172, 0.040, mats.hair, 0.090],
        [0, 0.215, 0.044, mats.hairHighlight, 0.094],
        [0, 0.160, 0.046, mats.hair, 0.092],
        [-0.022, 0.155, 0.034, mats.hairHighlight, 0.088],
        [0.022, 0.155, 0.034, mats.hairHighlight, 0.088]
      ];
      for (const [ox, oy, rad, matH, segL] of ptClusters) {
        dynamicStrands.push(
          new VerletStrand(
            head,
            V3(ox, oy, 0.152),
            V3(ox * 1.1, -0.45, 0.88),
            5, segL,
            [[rad, rad * 0.92], [rad * 0.92, rad * 0.78], [rad * 0.78, rad * 0.58], [rad * 0.58, rad * 0.35], [rad * 0.35, 0.008]],
            matH, root, strandGroup, castShadow
          )
        );
      }
    } else if (chosenHair === 'twin_tails') {
      headRig.add(
        makeMesh(new THREE.SphereGeometry(0.052, 10, 8), mats.accent, -0.144, 0.20, 0.048, false),
        makeMesh(new THREE.SphereGeometry(0.052, 10, 8), mats.accent, 0.144, 0.20, 0.048, false)
      );
      for (const side of [-1, 1]) {
        const twinSpecs = [
          [0.032, 0.205, 0.046, mats.hair],
          [0.056, 0.195, 0.048, mats.hairHighlight],
          [0.082, 0.185, 0.044, mats.hair],
          [0.042, 0.175, 0.038, mats.hair],
          [0.072, 0.210, 0.038, mats.hairHighlight],
          [0.096, 0.170, 0.034, mats.hairHighlight]
        ];
        for (const [oz, oy, rad, matH] of twinSpecs) {
          dynamicStrands.push(
            new VerletStrand(
              head,
              V3(side * 0.140, oy, oz),
              V3(side * 0.55, -0.62, 0.45),
              5, 0.088,
              [[rad, rad * 0.90], [rad * 0.90, rad * 0.75], [rad * 0.75, rad * 0.55], [rad * 0.55, rad * 0.32], [rad * 0.32, 0.008]],
              matH, root, strandGroup, castShadow
            )
          );
        }
      }
    } else if (chosenHair === 'long_wave') {
      const pins = [];
      for (let i = 0; i < 12; i++) {
        const t = -1 + (i / 11) * 2;
        const hx = t * 0.142;
        pins.push(V3(hx, 0.185, 0.145 - Math.abs(t) * 0.085));
      }
      clothSheets.push(
        new VerletClothSheet({
          anchorBone: head, pinsLocal: pins, cols: 12, rows: 10, rowHeight: 0.052, flareOut: 0.004,
          closedLoop: false, mat: mats.hair, root, parentGroup: strandGroup, castShadow, damping: 1.50, flutter: 0.22, compressH: 0.06, bendV: 0.05, bendH: 0.03
        })
      );
      for (const [ox, rad, matH] of [[-0.08, 0.042, mats.hairHighlight], [0, 0.046, mats.hair], [0.08, 0.042, mats.hairHighlight]]) {
        dynamicStrands.push(
          new VerletStrand(head, V3(ox, 0.17, 0.128), V3(ox * 0.3, -0.8, 0.5), 5, 0.095, [[rad, rad * 0.85], [rad * 0.85, rad * 0.68], [rad * 0.68, rad * 0.5], [rad * 0.5, rad * 0.3], [rad * 0.3, 0.01]], matH, root, strandGroup, castShadow)
        );
      }
    } else if (chosenHair === 'bob_cut') {
      const pins = [];
      for (let i = 0; i < 14; i++) {
        const a = -Math.PI * 0.62 + (i / 13) * (Math.PI * 1.24);
        pins.push(V3(Math.sin(a) * 0.142, 0.180, Math.cos(a) * 0.146));
      }
      clothSheets.push(
        new VerletClothSheet({
          anchorBone: head, pinsLocal: pins, cols: 14, rows: 5, rowHeight: 0.052, flareOut: 0.003,
          closedLoop: false, mat: mats.hairHighlight, root, parentGroup: strandGroup, castShadow, damping: 1.65, flutter: 0.14, compressH: 0.08, bendV: 0.06, bendH: 0.04
        })
      );
    }
  } else {
    if (chosenHair === 'helmet') {
      const dome = makeMesh(new THREE.SphereGeometry(0.165, 16, 12), mats.darkGear, 0, 0.195, 0.010, castShadow);
      dome.scale.set(0.95, 0.68, 1.05);
      headRig.add(
        dome,
        makeMesh(new THREE.BoxGeometry(0.285, 0.075, 0.295), mats.darkGear, 0, 0.195, 0.010, castShadow),
        makeMesh(new THREE.BoxGeometry(0.065, 0.055, 0.045), mats.armor, 0, 0.225, -0.145, false),
        makeMesh(new THREE.BoxGeometry(0.245, 0.066, 0.048), mats.visor, 0, 0.150, -0.138, false)
      );
    } else if (chosenHair === 'undercut') {
      const topVol = makeMesh(new THREE.SphereGeometry(0.145, 14, 10), mats.hair, 0, 0.238, -0.005, castShadow);
      topVol.scale.set(0.92, 0.48, 1.08);
      headRig.add(
        topVol,
        makeMesh(new THREE.BoxGeometry(0.245, 0.095, 0.275), mats.hair, 0, 0.238, -0.004, castShadow),
        makeMesh(new THREE.BoxGeometry(0.215, 0.075, 0.210), mats.hairHighlight, 0.012, 0.272, -0.032, castShadow),
        makeMesh(new THREE.BoxGeometry(0.258, 0.115, 0.085), mats.hair, 0, 0.188, 0.098, castShadow),
        makeMesh(new THREE.CylinderGeometry(0.046, 0.046, 0.042, 12), mats.darkGear, -0.135, 0.13, 0.01, false),
        makeMesh(new THREE.CylinderGeometry(0.046, 0.046, 0.042, 12), mats.darkGear, 0.135, 0.13, 0.01, false)
      );
      for (const [bx, r] of [[-0.065, 0.026], [-0.020, 0.030], [0.025, 0.030], [0.070, 0.025]]) {
        dynamicStrands.push(
          new VerletStrand(head, V3(bx, 0.245, -0.125), V3(bx * 0.5, -0.6, -0.6), 2, 0.042, [[r, r * 0.78], [r * 0.78, 0.008]], mats.hairHighlight, root, strandGroup, false)
        );
      }
    } else if (chosenHair === 'spiky') {
      const base = makeMesh(new THREE.SphereGeometry(0.155, 14, 10), mats.hair, 0, 0.215, 0.008, castShadow);
      base.scale.set(0.95, 0.62, 1.02);
      headRig.add(
        base,
        makeMesh(new THREE.BoxGeometry(0.262, 0.085, 0.272), mats.hair, 0, 0.228, 0.005, castShadow),
        makeMesh(new THREE.BoxGeometry(0.258, 0.135, 0.095), mats.hair, 0, 0.165, 0.095, castShadow)
      );
      for (let i = -2; i <= 2; i++) {
        for (let r = -1; r <= 1; r++) {
          const sp = makeMesh(new THREE.ConeGeometry(0.054, 0.140, 6), (r + i) % 2 === 0 ? mats.hairHighlight : mats.hair, i * 0.048, 0.295, r * 0.062, castShadow);
          sp.rotation.x = -0.20 + r * 0.24;
          sp.rotation.z = -i * 0.12;
          headRig.add(sp);
        }
      }
      for (const bx of [-0.06, 0, 0.06]) {
        dynamicStrands.push(
          new VerletStrand(head, V3(bx, 0.235, -0.125), V3(bx, -0.5, -0.7), 2, 0.045, [[0.028, 0.018], [0.018, 0.006]], mats.hairHighlight, root, strandGroup, false)
        );
      }
    } else if (chosenHair === 'buzz_beret') {
      const beret = makeMesh(new THREE.SphereGeometry(0.168, 16, 10), mats.armor, -0.025, 0.258, 0.0, castShadow);
      beret.scale.set(1.02, 0.42, 1.05);
      beret.rotation.z = 0.18;
      headRig.add(
        makeMesh(new THREE.BoxGeometry(0.252, 0.065, 0.262), mats.hair, 0, 0.222, 0.002, castShadow),
        beret,
        makeMesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), mats.accent, -0.05, 0.245, -0.138, false)
      );
    }
  }
  head.add(headRig);
  neck.add(head);

  // ---- ARMS & LEGS ----
  function buildArm(side) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * prof.shoulderX, prof.chestH - 0.055, 0);
    shoulder.add(
      makeMesh(new THREE.SphereGeometry(prof.upperArmR * 1.18, 10, 8), mats.armor, 0, 0, 0, castShadow),
      makeMesh(new THREE.CylinderGeometry(prof.upperArmR, prof.upperArmR * 0.88, prof.armL1, 10), mats.innerShirt, 0, -prof.armL1 * 0.5, 0, castShadow)
    );
    const elbow = new THREE.Group();
    elbow.position.set(0, -prof.armL1, 0);
    elbow.add(
      makeMesh(new THREE.SphereGeometry(prof.forearmR * 1.12, 10, 8), mats.darkGear, 0, 0, 0, castShadow),
      makeMesh(new THREE.CylinderGeometry(prof.forearmR, prof.forearmR * 0.84, prof.armL2, 10), mats.skin, 0, -prof.armL2 * 0.5, 0, castShadow)
    );
    const hand = new THREE.Group();
    hand.position.set(0, -prof.armL2, 0);
    hand.add(makeMesh(new THREE.BoxGeometry(0.072, 0.088, 0.068), mats.darkGear, 0, -0.035, 0, castShadow));
    elbow.add(hand); shoulder.add(elbow); chest.add(shoulder);
    return { shoulder, elbow, hand };
  }
  const armRigL = buildArm(-1);
  const armRigR = buildArm(1);

  function buildLeg(side) {
    const hipJoint = new THREE.Group();
    hipJoint.position.set(side * prof.hipX, -0.03, 0);
    hipJoint.add(
      makeMesh(new THREE.SphereGeometry(prof.thighR * 0.96, 10, 8), mats.pants, 0, 0, 0, castShadow),
      makeMesh(new THREE.CylinderGeometry(prof.thighR, prof.thighR * 0.82, prof.thighL, 10), mats.pants, 0, -prof.thighL * 0.5, 0, castShadow)
    );
    if (side === 1) hipJoint.add(makeMesh(new THREE.BoxGeometry(0.05, 0.14, 0.11), mats.darkGear, prof.thighR * 0.9, -prof.thighL * 0.45, 0, castShadow));

    const knee = new THREE.Group();
    knee.position.set(0, -prof.thighL, 0);
    knee.add(
      makeMesh(new THREE.SphereGeometry(prof.shinR * 1.12, 10, 8), mats.pants, 0, 0, 0, castShadow),
      makeMesh(new THREE.BoxGeometry(0.11, 0.11, 0.055), mats.darkGear, 0, 0, -prof.shinR * 0.92, castShadow),
      makeMesh(new THREE.CylinderGeometry(prof.shinR, prof.shinR * 0.78, prof.shinL, 10), mats.pants, 0, -prof.shinL * 0.5, 0, castShadow)
    );
    const foot = new THREE.Group();
    foot.position.set(0, -prof.shinL, 0);
    foot.add(makeMesh(new THREE.BoxGeometry(0.115, prof.footH, 0.24), mats.darkGear, 0, -prof.footH * 0.5, -0.045, castShadow));
    knee.add(foot); hipJoint.add(knee); hips.add(hipJoint);
    return { hipJoint, knee, foot };
  }
  const legRigL = buildLeg(-1);
  const legRigR = buildLeg(1);

  // ---- HIGH-DETAIL CLOTH OUTFITS (Soft Gravity-Draped Physics) ----
  if (chosenOutfit === 'combat_skirt' && prof.gender === 'female') {
    // ---- A-line pleated skirt: matte fabric, dark waistband + hem trim, soft tether so it never "stands up" ----
    const pal = mats.palette;
    const baseCol = new THREE.Color(pal.armor).lerp(new THREE.Color(pal.cloth), 0.22);
    const beltCol = new THREE.Color(pal.armor).multiplyScalar(0.40);
    const trimCol = new THREE.Color(pal.cloth).multiplyScalar(0.75);
    const skirtColor = (r, c, rows) => {
      const k = baseCol.clone();
      k.multiplyScalar((c % 2 === 0 ? 0.84 : 1.0) * (0.80 + 0.20 * Math.min(1, r / 3)));   // pleat shading + soft AO near waist
      if (r === 0) k.copy(beltCol);                                                       // waistband
      else if (r === 1) k.lerp(beltCol, 0.45);
      if (r === rows - 1) k.copy(trimCol);                                                // hem trim
      else if (r === rows - 2) k.lerp(trimCol, 0.4);
      return k;
    };
    hips.add(makeMesh(new THREE.CylinderGeometry(prof.pelvisW * 0.53, prof.pelvisW * 0.58, 0.085, 20), mats.skirtBelt, 0, 0.026, 0, castShadow));
    const COLS = 28;
    const pins = [];
    for (let i = 0; i < COLS; i++) {
      const a = (i / COLS) * Math.PI * 2;
      const pleat = (i % 2 === 0 ? 0.008 : -0.004);
      pins.push(V3(Math.sin(a) * (0.210 + pleat), 0.025, Math.cos(a) * (0.180 + pleat)));
    }
    clothSheets.push(
      new VerletClothSheet({
        anchorBone: hips, pinsLocal: pins, cols: COLS, rows: 10, rowHeight: 0.0395, flareOut: 0.0085, pleatDepth: 0.014,
        closedLoop: true, mat: mats.skirtFabric, root, parentGroup: strandGroup, castShadow,
        damping: 1.9, flutter: 0.12, liftScale: 0.25,
        stretchH: 0.55, compressH: 0.10, bendV: 0.05, bendH: 0.03, shearStretch: 0.20,
        elasticity: 0.7, maxStretch: 1.22,
        // skirt hugs the real body: pelvis / leg spheres are shrunk (they are inflated for coats), arms & head ignored
        collide: { pelvis: 0.68, waist: 0.9, leg: 0.88, foot: 1.0 },
        tether: { top: 0.34, bottom: 0.012, curve: 2.2 },
        colorFn: skirtColor
      })
    );
  } else if (chosenOutfit === 'jacket_coat' || chosenOutfit === 'tactical_coat') {
    chest.add(
      makeMesh(new THREE.BoxGeometry(0.068, prof.chestH * 1.02, prof.chestD + 0.050), mats.coat, -prof.chestW * 0.37, prof.chestH * 0.48, 0.015, castShadow),
      makeMesh(new THREE.BoxGeometry(0.068, prof.chestH * 1.02, prof.chestD + 0.050), mats.coat, prof.chestW * 0.37, prof.chestH * 0.48, 0.015, castShadow),
      makeMesh(new THREE.BoxGeometry(prof.chestW + 0.015, prof.chestH * 1.02, 0.072), mats.coat, 0, prof.chestH * 0.48, prof.chestD * 0.48, castShadow),
      makeMesh(new THREE.BoxGeometry(0.055, 0.12, 0.05), mats.accent, -prof.chestW * 0.28, prof.chestH * 0.85, -prof.chestD * 0.46, false),
      makeMesh(new THREE.BoxGeometry(0.055, 0.12, 0.05), mats.accent, prof.chestW * 0.28, prof.chestH * 0.85, -prof.chestD * 0.46, false)
    );
    const pins = [];
    for (let i = 0; i < 24; i++) {
      const a = -Math.PI * 0.72 + (i / 23) * (Math.PI * 1.44);
      pins.push(V3(Math.sin(a) * (prof.chestW * 0.52), prof.chestH * 0.34, Math.cos(a) * (prof.chestD * 0.68) + 0.020));
    }
    clothSheets.push(
      new VerletClothSheet({
        anchorBone: chest, pinsLocal: pins, cols: 24, rows: 10, rowHeight: 0.078, flareOut: 0.008,
        closedLoop: false, mat: mats.coat, root, parentGroup: strandGroup, castShadow,
        damping: 1.75, flutter: 0.22, stretchH: 0.88, compressH: 0.12, bendV: 0.06, bendH: 0.03, shearStretch: 0.20
      })
    );
  } else if (chosenOutfit === 'stealth_bodysuit') {
    chest.add(makeMesh(new THREE.CylinderGeometry(0.118, 0.135, 0.085, 14), mats.accent, 0, prof.chestH * 0.96, 0, castShadow));
    const pins = [-0.085, -0.051, -0.017, 0.017, 0.051, 0.085].map((x) => V3(x, prof.chestH * 0.92, 0.135));
    clothSheets.push(
      new VerletClothSheet({
        anchorBone: chest, pinsLocal: pins, cols: 6, rows: 10, rowHeight: 0.062, flareOut: 0.002,
        closedLoop: false, mat: mats.accent, root, parentGroup: strandGroup, castShadow,
        damping: 1.35, flutter: 0.32, compressH: 0.04, bendV: 0.04, bendH: 0.02, shearStretch: 0.14
      })
    );
  } else if (chosenOutfit === 'heavy_armor') {
    armRigL.shoulder.add(makeMesh(new THREE.BoxGeometry(0.15, 0.14, 0.18), mats.armor, -0.02, 0.01, 0, castShadow));
    armRigR.shoulder.add(makeMesh(new THREE.BoxGeometry(0.15, 0.14, 0.18), mats.armor, 0.02, 0.01, 0, castShadow));
    dynamicStrands.push(
      new VerletStrand(hips, V3(-0.20, 0.02, 0), V3(-0.5, -0.9, 0), 2, 0.14, [[0.036, 0.14, 0.17], [0.032, 0.14, 0.15]], mats.armor, root, strandGroup, castShadow, 2.8),
      new VerletStrand(hips, V3(0.20, 0.02, 0),  V3(0.5, -0.9, 0),  2, 0.14, [[0.036, 0.14, 0.17], [0.032, 0.14, 0.15]], mats.armor, root, strandGroup, castShadow, 2.8),
      new VerletStrand(hips, V3(0, 0.01, -0.14), V3(0, -0.9, -0.35), 2, 0.11, [[0.17, 0.11, 0.032], [0.15, 0.11, 0.028]], mats.darkGear, root, strandGroup, castShadow, 2.8)
    );
  } else if (chosenOutfit === 'ghillie_cloak') {
    chest.add(makeMesh(new THREE.BoxGeometry(prof.chestW + 0.08, 0.08, prof.chestD + 0.08), mats.coat, 0, prof.chestH * 0.90, 0.02, castShadow));
    const pins = [];
    for (let i = 0; i < 16; i++) {
      const t = -1 + (i / 15) * 2;
      pins.push(V3(t * 0.23, prof.chestH * 0.90, 0.148 - Math.abs(t) * 0.03));
    }
    clothSheets.push(
      new VerletClothSheet({
        anchorBone: chest, pinsLocal: pins, cols: 16, rows: 9, rowHeight: 0.080, flareOut: 0.006,
        closedLoop: false, mat: mats.coat, root, parentGroup: strandGroup, castShadow,
        damping: 1.65, flutter: 0.24, compressH: 0.05, bendV: 0.06, bendH: 0.03, shearStretch: 0.18
      })
    );
  }

  // ---- WEAPON MOUNT ----
  const weaponHolder = new THREE.Group();
  weaponHolder.position.set(0.13, 0.16, -0.42);
  let weaponMesh = null;
  if (buildWeaponFn) {
    weaponMesh = buildWeaponFn(weaponId, true);
    if (weaponMesh) { weaponMesh.scale.setScalar(0.76); weaponHolder.add(weaponMesh); }
  }
  chest.add(weaponHolder);

  const reviveMedkit = makeMesh(new THREE.BoxGeometry(0.22, 0.10, 0.18), mats.medkit, 0, 0.05, -0.45, false);
  reviveMedkit.visible = false;
  hips.add(reviveMedkit);

  // ---- HITBOXES (BONES + DISTINCT WAIST + FEMALE BUSTS + WEAPON) ----
  const hitboxes = [];
  function addBoneHitbox(id, region, bone, cx, cy, cz, hx, hy, hz, mult = 1.0, critical = false, color = 0x22c55e) {
    const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.72, depthTest: true });
    const debugMesh = new THREE.Mesh(new THREE.BoxGeometry(hx * 2, hy * 2, hz * 2), mat);
    debugMesh.position.set(cx, cy, cz);
    debugMesh.visible = false;
    bone.add(debugMesh);
    hitboxes.push({ id, region, bone, center: V3(cx, cy, cz), half: V3(hx, hy, hz), mult, critical, baseColor: color, debugMesh, flashUntil: 0 });
  }

  addBoneHitbox('hb_head',      'head',     head,               0, 0.14, 0,                    0.15, 0.15, 0.15, 2.5, true,  0xef4444);
  addBoneHitbox('hb_neck',      'head',     neck,               0, 0.055, 0,                   0.075, 0.06, 0.075, 1.6, true, 0xf97316);
  addBoneHitbox('hb_heart',     'heart',    chest,              0, prof.chestH * 0.55, -0.04,  0.095, 0.10, 0.13, 1.5, true,  0xf43f5e);
  addBoneHitbox('hb_chest',     'torso',    chest,              0, prof.chestH * 0.50, 0,      prof.chestW * 0.52, prof.chestH * 0.52, prof.chestD * 0.62, 1.0, false, 0x38bdf8);
  addBoneHitbox('hb_waist',     'waist',    waist,              0, prof.waistH * 0.50, 0,      prof.pelvisW * 0.52, prof.waistH * 0.62, prof.pelvisD * 0.62, 0.95, false, 0x06b6d4);
  if (bustL && bustR) {
    addBoneHitbox('hb_bustL',   'bustL',    bustL,              0, -0.008, -0.05,              0.078, 0.074, 0.078, 1.05, false, 0xf472b6);
    addBoneHitbox('hb_bustR',   'bustR',    bustR,              0, -0.008, -0.05,              0.078, 0.074, 0.078, 1.05, false, 0xf472b6);
  }
  addBoneHitbox('hb_upperArmL', 'leftArm',  armRigL.shoulder,   0, -prof.armL1 * 0.5, 0,       0.085, prof.armL1 * 0.52, 0.085, 0.75, false, 0xfacc15);
  addBoneHitbox('hb_forearmL',  'leftArm',  armRigL.elbow,      0, -prof.armL2 * 0.55, 0,      0.075, prof.armL2 * 0.58, 0.075, 0.70, false, 0xfacc15);
  addBoneHitbox('hb_upperArmR', 'rightArm', armRigR.shoulder,   0, -prof.armL1 * 0.5, 0,       0.085, prof.armL1 * 0.52, 0.085, 0.75, false, 0xfacc15);
  addBoneHitbox('hb_forearmR',  'rightArm', armRigR.elbow,      0, -prof.armL2 * 0.55, 0,      0.075, prof.armL2 * 0.58, 0.075, 0.70, false, 0xfacc15);
  addBoneHitbox('hb_thighL',    'leftLeg',  legRigL.hipJoint,   0, -prof.thighL * 0.5, 0,      0.105, prof.thighL * 0.52, 0.105, 0.78, false, 0x22c55e);
  addBoneHitbox('hb_shinL',     'leftLeg',  legRigL.knee,       0, -prof.shinL * 0.55, 0,      0.095, prof.shinL * 0.58, 0.115, 0.72, false, 0x22c55e);
  addBoneHitbox('hb_thighR',    'rightLeg', legRigR.hipJoint,   0, -prof.thighL * 0.5, 0,      0.105, prof.thighL * 0.52, 0.105, 0.78, false, 0x22c55e);
  addBoneHitbox('hb_shinR',     'rightLeg', legRigR.knee,       0, -prof.shinL * 0.55, 0,      0.095, prof.shinL * 0.58, 0.115, 0.72, false, 0x22c55e);

  if (weaponMesh) {
    const bb = new THREE.Box3().setFromObject(weaponMesh);
    const sz = bb.getSize(V3()), ct = bb.getCenter(V3());
    addBoneHitbox('hb_weapon', 'weapon', weaponHolder, ct.x, ct.y, ct.z, Math.max(0.05, sz.x * 0.5), Math.max(0.06, sz.y * 0.5), Math.max(0.14, sz.z * 0.5), 0.15, false, 0xc084fc);
  }

  const firstPersonFaceMeshes = [headSkinMesh, ...eyeOpenMeshes, ...eyeClosedMeshes, ...mouthMeshes];
  const firstPersonHairMeshes = headRig.children.filter(mesh => !firstPersonFaceMeshes.includes(mesh));
  root.userData = {
    gender: prof.gender, hairstyle: chosenHair, outfit: chosenOutfit, team, profile: prof,
    currentWeaponId: weaponId, weaponDrawUntil: performance.now() + 450,
    firstPersonFaceMeshes, firstPersonHairMeshes,
    joints: {
      hips, waist, chest, neck, head, bustL, bustR, reviveMedkit,
      headSkinMesh, eyeOpenMeshes, eyeClosedMeshes,
      shoulderL: armRigL.shoulder, elbowL: armRigL.elbow, handL: armRigL.hand,
      shoulderR: armRigR.shoulder, elbowR: armRigR.elbow, handR: armRigR.hand,
      hipL: legRigL.hipJoint, kneeL: legRigL.knee, footL: legRigL.foot,
      hipR: legRigR.hipJoint, kneeR: legRigR.knee, footR: legRigR.foot
    },
    anim: {
      crouchBlend: 0, proneBlend: 0, sprintBlend: 0, walkBlend: 0, adsBlend: 0,
      downBlend: 0, reviveBlend: 0, carryBlend: 0, carriedBlend: 0,
      moveSign: 1, landCompress: 0, landVel: 0, wasOnGround: true, prevVy: 0,
      hitDip: { y: 0, vy: 0 },
      lastFireAgeHandled: 99,
      flinch: { pitch: 0, roll: 0, yaw: 0, velP: 0, velR: 0, velY: 0 },
      waistFlinch: { crunch: 0, twist: 0, side: 0, vC: 0, vT: 0, vS: 0 },
      legFlinchL: { hip: 0, knee: 0, vH: 0, vK: 0 },
      legFlinchR: { hip: 0, knee: 0, vH: 0, vK: 0 },
      stridePhase: 0
    },
    breastPhysics, dynamicStrands, clothSheets, hitboxes, hitboxDebugVisible: false,
    upperBody: chest, headGroup: head, weaponHolder,
    legL: legRigL.hipJoint, legR: legRigR.hipJoint, armL: armRigL.shoulder, armR: armRigR.shoulder
  };

  return root;
}

export function detachCharacterWeapon(root, targetScene) {
  const holder = root?.userData?.weaponHolder;
  if (!holder || !holder.children.length || !targetScene?.attach) return null;
  root.updateMatrixWorld(true);
  const hitboxes = root.userData.hitboxes || [];
  const weaponHitboxIndex = hitboxes.findIndex((hitbox) => hitbox.id === 'hb_weapon');
  if (weaponHitboxIndex >= 0) {
    const [weaponHitbox] = hitboxes.splice(weaponHitboxIndex, 1);
    if (weaponHitbox.debugMesh) {
      weaponHitbox.debugMesh.visible = false;
      weaponHitbox.debugMesh.parent?.remove(weaponHitbox.debugMesh);
    }
  }
  targetScene.attach(holder);
  root.userData.weaponHolder = null;
  return holder;
}

// ============================================================================
// 4. HITBOX RAYCAST, IMPACT STAGGER (WITH WAIST GUT-SHOT!) & SAME-MODEL RAGDOLL
// ============================================================================
const _invBoneMat = new THREE.Matrix4();
const _la = V3(), _lb = V3(), _ld = V3();

export function setCharacterHitboxDebug(root, visible) {
  const u = root?.userData;
  if (!u?.hitboxes) return;
  u.hitboxDebugVisible = !!visible;
  for (const hb of u.hitboxes) hb.debugMesh.visible = !!visible;
}

export function raycastCharacterHitboxes(root, p0, p1) {
  const u = root?.userData;
  if (!u?.hitboxes) return null;
  root.updateMatrixWorld(true);

  let best = null;
  for (const hb of u.hitboxes) {
    if (hb.id === 'hb_weapon' && u.weaponHolder && !u.weaponHolder.visible) continue;
    hb.bone.updateWorldMatrix(true, false);
    _invBoneMat.copy(hb.bone.matrixWorld).invert();
    _la.copy(p0).applyMatrix4(_invBoneMat);
    _lb.copy(p1).applyMatrix4(_invBoneMat);
    _ld.copy(_lb).sub(_la);

    const mnX = hb.center.x - hb.half.x, mxX = hb.center.x + hb.half.x;
    const mnY = hb.center.y - hb.half.y, mxY = hb.center.y + hb.half.y;
    const mnZ = hb.center.z - hb.half.z, mxZ = hb.center.z + hb.half.z;

    let tn = 0, tx = 1, hitAxis = 2, hitSign = 1, ok = true;
    for (const [axis, o, d, mn, mx] of [[0, _la.x, _ld.x, mnX, mxX], [1, _la.y, _ld.y, mnY, mxY], [2, _la.z, _ld.z, mnZ, mxZ]]) {
      if (Math.abs(d) < 1e-8) { if (o < mn || o > mx) { ok = false; break; } }
      else {
        let t1 = (mn - o) / d, t2 = (mx - o) / d, sign = d > 0 ? -1 : 1;
        if (t1 > t2) { [t1, t2] = [t2, t1]; sign = -sign; }
        if (t1 > tn) { tn = t1; hitAxis = axis; hitSign = sign; }
        tx = Math.min(tx, t2);
        if (tn > tx) { ok = false; break; }
      }
    }

    if (ok && tn >= 0 && tn <= 1) {
      const tieBonus = (hb.region === 'heart' || hb.region === 'bustL' || hb.region === 'bustR' || hb.region === 'waist') ? -0.005 : 0;
      const bestBonus = best && (best.region === 'heart' || best.region === 'bustL' || best.region === 'bustR' || best.region === 'waist') ? -0.005 : 0;
      if (!best || tn + tieBonus < best.t + bestBonus) {
        const localHit = _la.clone().addScaledVector(_ld, tn);
        const localNorm = V3(hitAxis === 0 ? hitSign : 0, hitAxis === 1 ? hitSign : 0, hitAxis === 2 ? hitSign : 0);
        const worldHit = localHit.clone().applyMatrix4(hb.bone.matrixWorld);
        const worldNorm = localNorm.clone().transformDirection(hb.bone.matrixWorld).normalize();
        best = { hit: true, t: tn, distance: p0.distanceTo(worldHit), region: hb.region, boneId: hb.id, mult: hb.mult, critical: hb.critical, hitPoint: worldHit, normal: worldNorm, hitbox: hb };
      }
    }
  }
  return best;
}

export function triggerCharacterImpulse(root, ix = 0, iy = 0, iz = 0, side = 0) {
  const bp = root.userData?.breastPhysics;
  if (bp) bp.addImpulse(ix, iy, iz, side);
  for (const st of root.userData?.dynamicStrands || []) st.addImpulse(ix * 1.3, iy, iz * 1.3);
  for (const sh of root.userData?.clothSheets || []) sh.addImpulse(ix * 1.3, iy, iz * 1.3);
}

export function applyCharacterImpact(root, worldDir, strength = 1.0, hitResult = null) {
  const u = root?.userData;
  if (!u?.anim) return;
  const invRootQ = new THREE.Quaternion();
  root.getWorldQuaternion(invRootQ).invert();
  const localDir = worldDir.clone().normalize().applyQuaternion(invRootQ);

  const s = clamp(strength, 0.2, 3.5);
  const reg = hitResult?.region || 'torso';

  if (reg === 'waist') {
    const wf = u.anim.waistFlinch;
    let sideOff = 0;
    if (hitResult?.hitPoint && u.joints?.waist) {
      const lp = u.joints.waist.worldToLocal(hitResult.hitPoint.clone());
      sideOff = clamp(lp.x * 6, -1.2, 1.2);
    }
    const frontHit = localDir.z > -0.2;
    wf.vC += (frontHit ? -7.8 : 6.4) * s;
    wf.vT += (sideOff * 6.5 - localDir.x * 4.2) * s;
    wf.vS += (-localDir.x * 5.2 - sideOff * 2.5) * s;
    (u.anim.hitDip || (u.anim.hitDip = { y: 0, vy: 0 })).vy -= 1.0 * s;
    u.anim.legFlinchL.vH += 2.8 * s; u.anim.legFlinchL.vK -= 4.8 * s;
    u.anim.legFlinchR.vH += 2.6 * s; u.anim.legFlinchR.vK -= 4.5 * s;
    triggerCharacterImpulse(root, localDir.x * 1.8 * s, -2.0 * s, localDir.z * 2.2 * s);
  } else if (reg === 'leftLeg' || reg === 'rightLeg') {
    const lf = reg === 'leftLeg' ? u.anim.legFlinchL : u.anim.legFlinchR;
    lf.vH += (localDir.z < 0 ? 7.5 : -6.5) * s;
    lf.vK -= 11.5 * s;
    (u.anim.hitDip || (u.anim.hitDip = { y: 0, vy: 0 })).vy -= 0.9 * s;
    u.anim.flinch.velR += (reg === 'leftLeg' ? -3.2 : 3.2) * s;
    triggerCharacterImpulse(root, 0, -1.4 * s, localDir.z * 0.8 * s);
  } else if (reg === 'bustL' || reg === 'bustR') {
    const side = reg === 'bustL' ? -1 : 1;
    triggerCharacterImpulse(root, localDir.x * 2.6 * s, -2.4 * s, localDir.z * 3.0 * s, side);
    u.anim.flinch.velP += localDir.z * 4.5 * s;
    u.anim.flinch.velY += side * -3.5 * s;
  } else if (reg === 'weapon') {
    u.anim.flinch.velY += (Math.random() < 0.5 ? 5.5 : -5.5) * s;
    u.anim.flinch.velP += 2.2 * s;
  } else {
    const fl = u.anim.flinch;
    fl.velP += localDir.z * 5.2 * s;
    fl.velR -= localDir.x * 4.6 * s;
    fl.velY += (reg === 'leftArm' ? 4.8 : reg === 'rightArm' ? -4.8 : (Math.random() - 0.5) * 3) * s;
    triggerCharacterImpulse(root, localDir.x * 1.5 * s, -1.3 * s, localDir.z * 1.6 * s);
  }

  if (hitResult?.hitbox) {
    const hb = hitResult.hitbox;
    hb.flashUntil = performance.now() + 260;
    hb.debugMesh.material.color.setHex(0xffffff);
  }
}

export function resolveCharacterBodyCollision(rootA, posA, velA, rootB, posB, velB, radius = 0.44) {
  const dx = posA.x - posB.x, dz = posA.z - posB.z;
  const minD = radius * 2, d2 = dx * dx + dz * dz;
  if (d2 >= minD * minD || Math.abs(posA.y - posB.y) > 1.75) return null;
  const d = Math.sqrt(Math.max(1e-5, d2));
  const nx = dx / d, nz = dz / d, overlap = minD - d;
  posA.x += nx * overlap * 0.5; posA.z += nz * overlap * 0.5;
  posB.x -= nx * overlap * 0.5; posB.z -= nz * overlap * 0.5;
  const relVx = velA.x - velB.x, relVz = velA.z - velB.z;
  const approachSpeed = -(relVx * nx + relVz * nz);
  if (approachSpeed > 0) {
    const push = approachSpeed * 0.55;
    velA.x += nx * push; velA.z += nz * push;
    velB.x -= nx * push; velB.z -= nz * push;
    if (approachSpeed > 3.0) {
      const str = Math.min(1.6, approachSpeed * 0.16);
      applyCharacterImpact(rootA, V3(nx, 0.1, nz), str);
      applyCharacterImpact(rootB, V3(-nx, 0.1, -nz), str);
    }
  }
  return { collided: true, impactSpeed: Math.max(0, approachSpeed), normal: V3(nx, 0, nz), contactPoint: V3((posA.x + posB.x) * 0.5, posA.y + 1.0, (posA.z + posB.z) * 0.5) };
}

export function resolveCharacterWallImpact(root, pos, vel, colliders, rad = 0.42, height = 1.85) {
  let maxImpact = 0, hitNorm = null;
  for (const b of colliders) {
    if (b.stairRamp) continue;
    if (pos.y + height > b.minY + 0.08 && pos.y + 0.35 < b.maxY && pos.x + rad > b.minX && pos.x - rad < b.maxX && pos.z + rad > b.minZ && pos.z - rad < b.maxZ) {
      const dx1 = pos.x + rad - b.minX, dx2 = b.maxX - (pos.x - rad);
      const dz1 = pos.z + rad - b.minZ, dz2 = b.maxZ - (pos.z - rad);
      const m = Math.min(dx1, dx2, dz1, dz2);
      let nx = 0, nz = 0;
      if (m === dx1) { pos.x = b.minX - rad; nx = -1; }
      else if (m === dx2) { pos.x = b.maxX + rad; nx = 1; }
      else if (m === dz1) { pos.z = b.minZ - rad; nz = -1; }
      else { pos.z = b.maxZ + rad; nz = 1; }
      const vn = vel.x * nx + vel.z * nz;
      if (vn < 0) {
        const imp = -vn;
        if (imp > maxImpact) { maxImpact = imp; hitNorm = V3(nx, 0, nz); }
        vel.x -= nx * vn * 1.15; vel.z -= nz * vn * 1.15;
      }
    }
  }
  if (maxImpact > 4.2 && hitNorm) applyCharacterImpact(root, hitNorm, Math.min(1.8, (maxImpact - 3.5) * 0.25));
  return maxImpact > 0 ? { impactSpeed: maxImpact, normal: hitNorm } : null;
}

// ============================================================================
// 4B. TRUE IN-PLACE 19-JOINT 3D VERLET RAGDOLL (NON-COPLANAR FRAMES + ZERO FLOOR CLIP)
// ============================================================================
// Tunables for the death fall (all in one place).
export const DEATH_PHYSICS = {
  hitSpeedScale: 0.20,   // impactSpeed -> m/s of velocity the hit gives the whole body (bigger = flung further)
  hitSpeedMin: 0.7,      // a weak hit still moves the body at least this fast (m/s)
  hitSpeedMax: 3.4,      // ...and a huge hit never gives more than this (m/s)
  inheritVelocity: 1.0,  // fraction of the pre-death velocity the corpse keeps (1 = full momentum, 0 = in place)
  maxSpin: 4.5,          // cap on the spin the hit's torque can give (rad/s)
  groundFriction: 5.5,   // sliding friction on the floor, 1/s (bigger = stops sooner)
  airDrag: 0.9           // air drag on the whole body, 1/s
};

export function createCharacterRagdoll(scene, charRoot, hitDir = V3(0, 0, 1), impactSpeed = 7.5, hitPoint = null, bodyVel = null) {
  const u = charRoot.userData, j = u.joints, prof = u.profile;
  charRoot.visible = true;
  if (u.weaponHolder) u.weaponHolder.visible = false;
  for (const eye of j.eyeOpenMeshes || []) eye.visible = false;
  for (const eyelid of j.eyeClosedMeshes || []) eyelid.visible = true;
  setCharacterHitboxDebug(charRoot, false);
  charRoot.updateMatrixWorld(true);

  const wp = (bone, off = V3()) => bone.localToWorld(off.clone());
  const mkP = (p, r) => ({ pos: p.clone(), old: p.clone(), imp: V3(), r });

  // 19 particles: 3D Non-Coplanar Ribcage {1, 17, 3, 6, 15}, 3D Pelvis {2, 17, 9, 12, 16}, Dual-sphere Head {0, 18}
  const pts = [
    mkP(wp(j.head, V3(0, 0.22, 0)), 0.145),                       // 0: headTop (crown/hair)
    mkP(wp(j.chest, V3(0, prof.chestH - 0.055, 0)), 0.165),       // 1: chestTop (shoulder line center)
    mkP(wp(j.hips, V3(0, 0, 0)), 0.140),                          // 2: hips center
    mkP(wp(j.shoulderL), 0.095),                                  // 3: shoulderL
    mkP(wp(j.elbowL), 0.075),                                     // 4: elbowL
    mkP(wp(j.handL, V3(0, -0.04, 0)), 0.065),                     // 5: handL
    mkP(wp(j.shoulderR), 0.095),                                  // 6: shoulderR
    mkP(wp(j.elbowR), 0.075),                                     // 7: elbowR
    mkP(wp(j.handR, V3(0, -0.04, 0)), 0.065),                     // 8: handR
    mkP(wp(j.hipL), 0.105),                                       // 9: hipL
    mkP(wp(j.kneeL), 0.090),                                      // 10: kneeL
    mkP(wp(j.footL, V3(0, -0.04, -0.03)), 0.095),                 // 11: footL
    mkP(wp(j.hipR), 0.105),                                       // 12: hipR
    mkP(wp(j.kneeR), 0.090),                                      // 13: kneeR
    mkP(wp(j.footR, V3(0, -0.04, -0.03)), 0.095),                 // 14: footR
    mkP(wp(j.chest, V3(0, prof.chestH * 0.55, -0.18)), 0.110),    // 15: chestFront (bust/armor clearance)
    mkP(wp(j.hips, V3(0, 0.02, -0.16)), 0.100),                   // 16: pelvisFront
    mkP(wp(j.chest, V3(0, 0, 0)), 0.165),                         // 17: chestBase (ribcage bottom / waist top)
    mkP(wp(j.head, V3(0, 0.11, -0.02)), 0.140)                    // 18: headCenter (face/chin clearance)
  ];

  // 15 (chest front) / 16 (pelvis front) are invisible orientation helpers. They must NOT touch the floor:
  // lying face-down they sit ~0.18 m BELOW the spine line, so a floor contact on them fights the rigid
  // frame (spine / shoulders / hips already rest on the floor) -> the corpse seesaws, bounces and spins.
  // That is why it only happened when falling forward.
  pts[15].helper = true;
  pts[16].helper = true;

  // ==========================================================================
  // DEATH = CUT THE CONNECTION, HAND THE WHOLE BODY TO PHYSICS
  // No scripted "crumple in place" any more (no extra downward shove, no knee-buckle kick).
  // The corpse starts from ONE rigid-body velocity field, so it keeps its momentum and falls the way
  // it was really hit:
  //   v(point) = v_before_death + dv_hit + w x (point - centreOfMass)
  //   dv_hit : linear velocity the hit gives the whole body (along the hit direction)
  //   w      : spin from the hit's torque about the centre of mass  (r_hit x dv / I)
  // Hit high on the body -> the top is pushed over and the feet slide out; hit low -> legs swept.
  // ==========================================================================
  const dir = hitDir.lengthSq() > 1e-6 ? hitDir.clone().normalize() : V3(0, 0, 1);

  // approximate mass of each particle (helper spheres 15/16 carry no mass)
  const MASS = [2.0, 6.0, 10.0, 2.0, 1.2, 0.6, 2.0, 1.2, 0.6, 5.0, 4.0, 1.5, 5.0, 4.0, 1.5, 0, 0, 8.0, 3.0];
  let totalM = 0;
  const com = V3();
  for (let i = 0; i < pts.length; i++) { totalM += MASS[i]; com.addScaledVector(pts[i].pos, MASS[i]); }
  com.multiplyScalar(1 / totalM);

  // (a) momentum the character already had when it died (running, falling, being pushed...)
  const inheritVel = V3();
  const preVel = bodyVel || u.lastVel;
  if (preVel) {
    inheritVel.set(preVel.x * DEATH_PHYSICS.inheritVelocity, 0, preVel.z * DEATH_PHYSICS.inheritVelocity);
    const hs = inheritVel.length();
    if (hs > 9) inheritVel.multiplyScalar(9 / hs);
    inheritVel.y = clamp(preVel.y, -9, 5) * DEATH_PHYSICS.inheritVelocity;
  }

  // (b) the hit itself: a velocity change for the whole body along the hit direction
  const hitSpeed = clamp(impactSpeed * DEATH_PHYSICS.hitSpeedScale, DEATH_PHYSICS.hitSpeedMin, DEATH_PHYSICS.hitSpeedMax);
  const dv = V3(dir.x, clamp(dir.y, -0.3, 0.3), dir.z).normalize().multiplyScalar(hitSpeed);

  // (c) torque about the centre of mass -> angular velocity (w = L / I about the torque axis)
  const rHit = hitPoint ? hitPoint.clone().sub(com) : V3(0, 0.25, 0);
  if (rHit.length() > 0.95) rHit.setLength(0.95);
  const omega = V3();
  const rVec = V3(), perp = V3();
  const L = V3().crossVectors(rHit, dv);
  const Lm = L.length();
  if (Lm > 1e-5) {
    const ax = L.clone().multiplyScalar(1 / Lm);
    let inertia = 0;
    for (let i = 0; i < pts.length; i++) {
      rVec.subVectors(pts[i].pos, com);
      perp.crossVectors(rVec, ax);
      inertia += MASS[i] * perp.lengthSq();
    }
    inertia = Math.max(inertia / totalM, 0.08);
    omega.copy(ax).multiplyScalar(Math.min(Lm / inertia, DEATH_PHYSICS.maxSpin));
  }

  // (d) one consistent velocity field for every particle, legs included (they are simply dead weight)
  for (let i = 0; i < pts.length; i++) {
    rVec.subVectors(pts[i].pos, com);
    pts[i].imp.copy(inheritVel).add(dv);
    pts[i].imp.add(perp.crossVectors(omega, rVec));
  }

  // Straight legs under a falling pelvis are a singular chain: with zero bend there is no sideways direction
  // to fold in, so the solver snaps the knee out violently (the "leg flick"). Make sure each knee starts with
  // a small forward (anatomical) bend. This is a POSITION change made before the constraint lengths are
  // measured, so it adds no stress and no velocity.
  const kneeSide = [1, 1];                       // which side of the hip-foot line (along n = hipAxis x legLine) is "forward"
  {
    const fwd = pts[16].pos.clone().sub(pts[2].pos);
    fwd.y = 0;
    if (fwd.lengthSq() > 1e-5) {
      fwd.normalize();
      const KNEE_MIN_BEND = 0.04;
      const line = V3(), off = V3(), axis = pts[12].pos.clone().sub(pts[9].pos).normalize(), nrm = V3();
      [[9, 10, 11], [12, 13, 14]].forEach(([hi, ki, fi], li) => {
        line.subVectors(pts[fi].pos, pts[hi].pos);
        const ll = line.lengthSq();
        if (ll < 1e-6) return;
        nrm.crossVectors(axis, line);
        if (nrm.lengthSq() > 1e-8) kneeSide[li] = nrm.dot(fwd) >= 0 ? 1 : -1;
        off.subVectors(pts[ki].pos, pts[hi].pos);
        off.addScaledVector(line, -off.dot(line) / ll);          // knee's offset from the hip-foot line
        const bend = off.dot(fwd);
        if (bend < KNEE_MIN_BEND) { pts[ki].pos.addScaledVector(fwd, KNEE_MIN_BEND - bend); pts[ki].old.copy(pts[ki].pos); }
      });
    }
  }

  const pelvisUp = pts[17].pos.clone().sub(pts[2].pos).normalize();
  const legLiftLimits = [];
  for (let li = 0; li < 2; li++) {
    const hi = li ? 12 : 9, ki = li ? 13 : 10, fi = li ? 14 : 11;
    const kneeLift = pts[ki].pos.clone().sub(pts[hi].pos).dot(pelvisUp);
    const footLift = pts[fi].pos.clone().sub(pts[hi].pos).dot(pelvisUp);
    legLiftLimits.push([
      Math.max(-0.04, kneeLift + 0.14),
      Math.max(0.08, footLift + 0.22)
    ]);
  }

  const dist = (a, b) => pts[a].pos.distanceTo(pts[b].pos);
  const constraints = [];

  // 1) Rigid 3D Chest Frame {1: chestTop, 17: chestBase, 3: shL, 6: shR, 15: chestFront}
  const chestGroup = [1, 17, 3, 6, 15];
  for (let i = 0; i < chestGroup.length; i++) {
    for (let k = i + 1; k < chestGroup.length; k++) {
      const a = chestGroup[i], b = chestGroup[k];
      constraints.push({ a, b, d: dist(a, b), s: 1.0 });
    }
  }

  // 2) Rigid Pelvis Tetrahedron {2: hips, 9: hipL, 12: hipR, 16: pelvisFront}
  const pelvisGroup = [2, 9, 12, 16];
  for (let i = 0; i < pelvisGroup.length; i++) {
    for (let k = i + 1; k < pelvisGroup.length; k++) {
      const a = pelvisGroup[i], b = pelvisGroup[k];
      constraints.push({ a, b, d: dist(a, b), s: 1.0 });
    }
  }

  // 3) Spine & Lumbar Flex Limits
  constraints.push(
    { a: 2, b: 17, d: dist(2, 17), s: 1.0 },
    { a: 2, b: 1, d: dist(2, 1) * 0.88, minOnly: true, s: 0.65 },
    { a: 16, b: 15, d: dist(16, 15) * 0.72, minOnly: true, s: 0.55 },
    { a: 9, b: 17, d: dist(9, 17) * 0.86, minOnly: true, s: 0.55 },
    { a: 12, b: 17, d: dist(12, 17) * 0.86, minOnly: true, s: 0.55 },
    { a: 9, b: 3, d: dist(9, 3) * 0.75, minOnly: true, s: 0.50 },
    { a: 12, b: 6, d: dist(12, 6) * 0.75, minOnly: true, s: 0.50 }
  );

  // 4) Head & Neck Limits {1: chestTop, 18: headCenter, 0: headTop}
  constraints.push(
    { a: 1, b: 18, d: Math.max(0.18, dist(1, 18)), s: 0.98 },
    { a: 18, b: 0, d: Math.max(0.10, dist(18, 0)), s: 1.0 },
    { a: 1, b: 0, d: dist(1, 0) * 0.92, minOnly: true, s: 0.70 },
    { a: 17, b: 18, d: dist(17, 18) * 0.84, minOnly: true, s: 0.50 },
    { a: 3, b: 18, d: dist(3, 18) * 0.78, minOnly: true, s: 0.45 },
    { a: 6, b: 18, d: dist(6, 18) * 0.78, minOnly: true, s: 0.45 },
    { a: 2, b: 0, d: 0.68, minOnly: true, s: 0.40 }
  );

  // 5) Arms (L & R)
  // Limb lengths are MEASURED from the pose at the moment of death, not taken from the profile: the hand/foot
  // particles sit a few cm past the bone end, so profile lengths were ~4 cm too short and the solver yanked
  // the limbs shut on the very first frame (this was the leg "flick" right after death).
  constraints.push(
    { a: 3, b: 4, d: dist(3, 4), s: 0.98 }, { a: 4, b: 5, d: dist(4, 5), s: 0.98 },
    { a: 6, b: 7, d: dist(6, 7), s: 0.98 }, { a: 7, b: 8, d: dist(7, 8), s: 0.98 },
    { a: 3, b: 5, d: Math.max(dist(3, 5), (dist(3, 4) + dist(4, 5)) * 0.58), minOnly: true, s: 0.50 },
    { a: 6, b: 8, d: Math.max(dist(6, 8), (dist(6, 7) + dist(7, 8)) * 0.58), minOnly: true, s: 0.50 }
  );
  // NOTE: the old arm <-> hip / chest "minimum distance" constraints (elbow/hand vs 2, 17, 1) are GONE.
  // They shoved the arms AND the pelvis / ribcage apart every iteration (the waist / hip kick).
  // Arm vs body is now handled by solveRagdollSelfCollision: touching is allowed, going through is not.

  // 6) Legs (L & R)
  constraints.push(
    { a: 9, b: 10, d: dist(9, 10), s: 0.98 },  { a: 10, b: 11, d: dist(10, 11), s: 0.98 },
    { a: 12, b: 13, d: dist(12, 13), s: 0.98 }, { a: 13, b: 14, d: dist(13, 14), s: 0.98 },
    { a: 9, b: 11, d: Math.max(dist(9, 11), (dist(9, 10) + dist(10, 11)) * 0.58), minOnly: true, s: 0.50 },
    { a: 12, b: 14, d: Math.max(dist(12, 14), (dist(12, 13) + dist(13, 14)) * 0.58), minOnly: true, s: 0.50 }
  );
  // NOTE: knee<->knee, foot<->foot and knee/foot<->pelvis "minimum distance" pushers are GONE as well.
  // Leg vs leg and leg vs body are handled by the soft contact solver (touch yes, penetrate no, push-away no).

  const group = new THREE.Group();
  scene.add(group);

  // rigid frames used by the chirality check: [chest, pelvis]; `rest` = signed distance of the helper sphere at death
  const frames = [
    { o: 17, a: 3, b: 6, f: 15 },
    { o: 2, a: 9, b: 12, f: 16 }
  ];
  for (const fr of frames) {
    const d = frameDist(pts, fr.o, fr.a, fr.b, fr.f);
    fr.rest = Number.isNaN(d) || Math.abs(d) < 0.02 ? -0.14 : d;
  }

  const collisionRadii = {
    torso: Math.max(prof.chestW * 0.48, prof.chestD * 0.5),
    waist: Math.max(prof.waistW * 0.46, prof.waistD * 0.5),
    pelvis: Math.max(prof.pelvisW * 0.46, prof.pelvisD * 0.5),
    neck: 0.082,
    head: Math.max(0.12, 0.125 * Math.max(prof.headScale[0], prof.headScale[1], prof.headScale[2]))
  };
  const invMass = MASS.map((m) => (m > 0 ? 1 / m : 0));
  return { pts, constraints, group, charRoot, frames, kneeSide, legLiftLimits, profile: prof, collisionRadii, invMass };
}

const _rX = V3(), _rY = V3(), _rZ = V3(), _rMat = new THREE.Matrix4();
const _qHips = new THREE.Quaternion(), _qChest = new THREE.Quaternion(), _qRel = new THREE.Quaternion();
const _qParentInv = new THREE.Quaternion(), _qHead = new THREE.Quaternion(), _qNeck = new THREE.Quaternion();
const _vDir = V3(), _yPos = V3(0, 1, 0), _yNeg2 = V3(0, -1, 0);
const _axY = V3(), _axX = V3(), _axBack = V3(), _vTmp = V3();
const _scD1 = V3(), _scD2 = V3(), _scR = V3(), _scP = V3(), _scQ = V3();
const _scNormal = V3(), _scCorrection = V3();
const _scFront = V3(), _scUp = V3(), _scArmAxis = V3(), _scArmFront = V3(), _scArmOffset = V3(), _scLegUp = V3();
const _qIdentity = new THREE.Quaternion();

const RAGDOLL_LIMB_CAPSULES = [
  { a: 3, b: 4, radius: 'upperArmR', anchored: true, arm: true },
  { a: 4, b: 5, radius: 'forearmR', anchored: false, arm: true },
  { a: 6, b: 7, radius: 'upperArmR', anchored: true, arm: true },
  { a: 7, b: 8, radius: 'forearmR', anchored: false, arm: true },
  { a: 9, b: 10, radius: 'thighR', anchored: true, arm: false },
  { a: 10, b: 11, radius: 'shinR', anchored: false, arm: false },
  { a: 12, b: 13, radius: 'thighR', anchored: true, arm: false },
  { a: 13, b: 14, radius: 'shinR', anchored: false, arm: false }
];

const RAGDOLL_BODY_CAPSULES = [
  { a: 17, b: 1, radius: 'torso', arms: true, legs: true },
  { a: 2, b: 17, radius: 'waist', arms: true, legs: true },
  { a: 2, b: 2, radius: 'pelvis', arms: false, legs: true },
  { a: 1, b: 18, radius: 'neck', arms: true, legs: false },
  { a: 18, b: 0, radius: 'head', arms: true, legs: false }
];

function limitRagdollRotation(q, maxAngle) {
  const angle = 2 * Math.acos(clamp(Math.abs(q.w), 0, 1));
  if (angle > maxAngle) q.slerp(_qIdentity, maxAngle / angle);
}

function buildFrameFromSpine(pBottom, pTop, pLeft, pRight, outQuat) {
  _rY.subVectors(pTop, pBottom);
  if (_rY.lengthSq() < 1e-6) _rY.set(0, 1, 0);
  else _rY.normalize();

  _rX.subVectors(pRight, pLeft);
  _rX.addScaledVector(_rY, -_rX.dot(_rY));
  if (_rX.lengthSq() < 1e-6) _rX.set(1, 0, 0);
  else _rX.normalize();

  _rZ.crossVectors(_rX, _rY); // +X x +Y = +Z (back)
  if (_rZ.lengthSq() < 1e-6) _rZ.set(0, 0, 1);
  else _rZ.normalize();
  _rMat.makeBasis(_rX, _rY, _rZ);
  outQuat.setFromRotationMatrix(_rMat);
}

// Signed distance of helper sphere f from the plane (o, a, b). The plane's unit normal is left in _cN,
// pointing towards the positive side. Returns NaN when the three plane points are degenerate.
const _cA = V3(), _cB = V3(), _cN = V3();
const _kAx = V3(), _kLn = V3(), _kN = V3(), _kOf = V3();
function frameDist(pts, o, a, b, f) {
  _cA.subVectors(pts[a].pos, pts[o].pos);
  _cB.subVectors(pts[b].pos, pts[o].pos);
  _cN.crossVectors(_cA, _cB);
  const len = _cN.length();
  if (len < 1e-5) return NaN;
  _cN.multiplyScalar(1 / len);
  _cA.subVectors(pts[f].pos, pts[o].pos);
  return _cN.dot(_cA);
}

// ---------------------------------------------------------------------------------------------------------
// SOFT SELF CONTACT (ragdoll): parts may TOUCH each other, they never go THROUGH each other, and they never
// SHOVE each other away. This replaces the old push-out (which kicked the elbows / knees away, dragged the
// pelvis / ribcage along and made the waist and hips pop):
//   * the correction is split by inverse mass, so a light arm / leg gives way and the heavy torso barely moves
//   * a limb resting on the floor is treated as immovable, so the BODY is lifted onto it instead (no squeezing)
//   * every correction moves pos AND old together  -> it adds no velocity (no separation speed = no pop)
//   * the speed the two parts were closing at is removed (restitution 0)  -> they come to rest touching
//   * a single correction is capped, so a deep overlap is eased out over a few passes, never in one snap
// ---------------------------------------------------------------------------------------------------------
const SELF_CONTACT = {
  limbScale: 1.06,   // limb radius multiplier used for the contact distance
  margin: 0.004,     // extra gap (m) so two surfaces "touch" instead of grazing inside each other
  stiffness: 0.9,    // fraction of the overlap removed per pass
  maxFix: 0.025,     // largest correction of ONE pass (m)
  rootSkip: 0.30     // the first 30 % of an anchored limb (shoulder / hip end) never collides with the torso
};
const _scVA = V3(), _scVB = V3();

function softSegmentContact(rg, ia0, ia1, ib0, ib1, required, lockA0, skipA, skipB) {
  const pts = rg.pts, inv = rg.invMass;
  const a = pts[ia0].pos, b = pts[ia1].pos, c = pts[ib0].pos, d = pts[ib1].pos;
  _scD1.subVectors(b, a);
  _scD2.subVectors(d, c);
  _scR.subVectors(a, c);

  const aa = _scD1.lengthSq(), ee = _scD2.lengthSq();
  const ff = _scD2.dot(_scR);
  let s = 0, t = 0;
  if (aa < 1e-8 && ee < 1e-8) {
    s = t = 0;
  } else if (aa < 1e-8) {
    t = clamp(ff / ee, 0, 1);
  } else {
    const cc = _scD1.dot(_scR);
    if (ee < 1e-8) {
      s = clamp(-cc / aa, 0, 1);
    } else {
      const bb = _scD1.dot(_scD2);
      const denom = aa * ee - bb * bb;
      s = denom > 1e-8 ? clamp((bb * ff - cc * ee) / denom, 0, 1) : 0;
      t = (bb * s + ff) / ee;
      if (t < 0) { t = 0; s = clamp(-cc / aa, 0, 1); }
      else if (t > 1) { t = 1; s = clamp((bb - cc) / aa, 0, 1); }
    }
  }
  if ((skipA && s < SELF_CONTACT.rootSkip) || (skipB && t < SELF_CONTACT.rootSkip)) return;

  _scP.copy(a).addScaledVector(_scD1, s);
  _scQ.copy(c).addScaledVector(_scD2, t);
  _scNormal.subVectors(_scP, _scQ);
  const distanceSq = _scNormal.lengthSq();
  if (distanceSq >= required * required) return;

  const distance = Math.sqrt(distanceSq);
  if (distance > 1e-5) _scNormal.multiplyScalar(1 / distance);
  else {
    _scNormal.subVectors(pts[15].pos, pts[17].pos);
    if (_scNormal.lengthSq() < 1e-8) _scNormal.set(0, 0, -1);
    else _scNormal.normalize();
  }

  // inverse masses: grounded particles and the locked root of an anchored limb do not move
  const iA0 = lockA0 || pts[ia0].grounded ? 0 : inv[ia0];
  const iA1 = pts[ia1].grounded ? 0 : inv[ia1];
  const iB0 = pts[ib0].grounded ? 0 : inv[ib0];
  const iB1 = pts[ib1].grounded ? 0 : inv[ib1];
  const wA = (1 - s) * (1 - s) * iA0 + s * s * iA1;
  const wB = (1 - t) * (1 - t) * iB0 + t * t * iB1;
  const wSum = wA + wB;
  if (wSum < 1e-9) return;

  const fix = Math.min((required - distance) * SELF_CONTACT.stiffness, SELF_CONTACT.maxFix);
  const lam = fix / wSum;

  // closing speed along the normal, measured BEFORE anything is moved (pos - old = per-sub-step velocity)
  _scVA.subVectors(pts[ia0].pos, pts[ia0].old).multiplyScalar(1 - s).addScaledVector(_scVB.subVectors(pts[ia1].pos, pts[ia1].old), s);
  _scVB.subVectors(pts[ib0].pos, pts[ib0].old).multiplyScalar(1 - t).addScaledVector(_scCorrection.subVectors(pts[ib1].pos, pts[ib1].old), t);
  const closing = _scNormal.dot(_scVA) - _scNormal.dot(_scVB);   // < 0 : the two surfaces are approaching
  const jn = closing < 0 ? -closing / wSum : 0;

  const move = (p, k) => {
    // k = signed amount along the normal; position and old move together (no velocity added),
    // the closing speed is then taken out of `old` (restitution 0)
    _scCorrection.copy(_scNormal).multiplyScalar(k);
    p.pos.add(_scCorrection);
    p.old.add(_scCorrection);
  };
  const stop = (p, k) => { p.old.addScaledVector(_scNormal, -k); };

  if (iA0 > 0) { const w = (1 - s) * iA0; move(pts[ia0], lam * w); stop(pts[ia0], jn * w); }
  if (iA1 > 0) { const w = s * iA1;       move(pts[ia1], lam * w); stop(pts[ia1], jn * w); }
  if (iB0 > 0) { const w = (1 - t) * iB0; move(pts[ib0], -lam * w); stop(pts[ib0], -jn * w); }
  if (iB1 > 0 && ib1 !== ib0) { const w = t * iB1; move(pts[ib1], -lam * w); stop(pts[ib1], -jn * w); }
}

// leg vs leg: both sides give way equally (neither is "the body")
const RAGDOLL_LEG_CONTACTS = [
  { a: 9,  b: 10, ra: 'thighR', ka: 1.05, rootA: true,  c: 12, d: 13, rc: 'thighR', kc: 1.05, rootC: true  },
  { a: 9,  b: 10, ra: 'thighR', ka: 1.05, rootA: true,  c: 13, d: 14, rc: 'shinR',  kc: 1.25, rootC: false },
  { a: 10, b: 11, ra: 'shinR',  ka: 1.25, rootA: false, c: 12, d: 13, rc: 'thighR', kc: 1.05, rootC: true  },
  { a: 10, b: 11, ra: 'shinR',  ka: 1.25, rootA: false, c: 13, d: 14, rc: 'shinR',  kc: 1.25, rootC: false }
];

function solveRagdollSelfCollision(rg) {
  const prof = rg.profile;
  // limb vs torso / waist / pelvis / neck / head
  for (const limb of RAGDOLL_LIMB_CAPSULES) {
    for (const body of RAGDOLL_BODY_CAPSULES) {
      if (limb.arm ? !body.arms : !body.legs) continue;
      const required = rg.collisionRadii[body.radius] + prof[limb.radius] * SELF_CONTACT.limbScale + SELF_CONTACT.margin;
      softSegmentContact(rg, limb.a, limb.b, body.a, body.b, required, limb.anchored, limb.anchored, false);
    }
  }
  // leg vs leg
  for (const lc of RAGDOLL_LEG_CONTACTS) {
    const required = prof[lc.ra] * lc.ka + prof[lc.rc] * lc.kc + SELF_CONTACT.margin;
    softSegmentContact(rg, lc.a, lc.b, lc.c, lc.d, required, false, lc.rootA, lc.rootC);
  }
}

export function stepCharacterRagdoll(rg, dt, colliders = [], floorY = 0) {
  if (!rg) return;
  const safeDt = Math.max(0.001, Math.min(0.033, dt));
  // A new impulse (bullet / explosion) wakes a corpse that has gone to sleep
  for (const p of rg.pts) {
    if (p.imp.lengthSq() > 0) { rg.sleeping = false; rg.restTime = 0; break; }
  }
  const sub = rg.sleeping ? 0 : 3;       // 3 sub-steps (was 2): rigid joints stay stable at impact speed
  const h = safeDt / 3;
  const maxStep = 0.16;                  // max travel per sub-step (anti tunnelling at high fall speed)
  const gStep = 11.5 * h * h;
  const airDamp = Math.exp(-DEATH_PHYSICS.airDrag * h);     // light air drag: momentum survives the fall (was 2.2 = bled it all off)
  const groundFric = 1 - Math.exp(-DEATH_PHYSICS.groundFriction * h); // ground friction, applied ONCE per sub-step (see below)
  const tmp = V3();
  const floorAt = (x, z) => {
    const height = typeof floorY === 'function' ? floorY(x, z) : floorY;
    return Number.isFinite(height) ? height : 0;
  };
  const resolveContacts = (p) => {
    p.grounded = false;
    if (p.helper) return;                      // orientation helpers never collide (see createCharacterRagdoll)
    const floor = floorAt(p.pos.x, p.pos.z) + p.r;
    if (p.pos.y <= floor) {
      p.pos.y = floor;
      p.old.y = p.pos.y;                       // inelastic floor: ALL vertical velocity is absorbed (no bounce)
      p.grounded = true;                       // (friction is applied once per sub-step below, not per contact call)
    }

    for (const b of colliders) {
      if (b.stairRamp || !Number.isFinite(b.minX + b.maxX + b.minY + b.maxY + b.minZ + b.maxZ)) continue;
      const minX = b.minX - p.r, maxX = b.maxX + p.r;
      const minY = b.minY - p.r, maxY = b.maxY + p.r;
      const minZ = b.minZ - p.r, maxZ = b.maxZ + p.r;
      if (p.pos.x <= minX || p.pos.x >= maxX || p.pos.y <= minY || p.pos.y >= maxY || p.pos.z <= minZ || p.pos.z >= maxZ) continue;

      if (p.old.y - p.r >= b.maxY - 0.12 && p.pos.y < maxY) {
        p.pos.y = maxY;
        p.old.y = p.pos.y;
        p.grounded = true;
        continue;
      }
      const pushes = [
        [p.pos.x - minX, -1, 0, 0], [maxX - p.pos.x, 1, 0, 0],
        [p.pos.y - minY, 0, -1, 0], [maxY - p.pos.y, 0, 1, 0],
        [p.pos.z - minZ, 0, 0, -1], [maxZ - p.pos.z, 0, 0, 1]
      ];
      let push = pushes[0];
      for (let i = 1; i < pushes.length; i++) if (pushes[i][0] < push[0]) push = pushes[i];
      p.pos.x += push[1] * push[0];
      p.pos.y += push[2] * push[0];
      p.pos.z += push[3] * push[0];
      if (push[2] === 1) p.grounded = true;

      const normalVelocity = (p.pos.x - p.old.x) * push[1]
        + (p.pos.y - p.old.y) * push[2]
        + (p.pos.z - p.old.z) * push[3];
      if (normalVelocity < 0) {
        p.old.x += push[1] * normalVelocity;
        p.old.y += push[2] * normalVelocity;
        p.old.z += push[3] * normalVelocity;
      }
    }
    const finalFloor = floorAt(p.pos.x, p.pos.z) + p.r;
    if (p.pos.y <= finalFloor) {
      p.pos.y = finalFloor;
      p.old.y = p.pos.y;
      p.grounded = true;
    }
  };

  // First step: the foot spheres start slightly inside the floor. Lift the WHOLE body by that amount
  // (rigidly) instead of letting the joint solver squeeze the legs out, which made them pop.
  if (!rg.started) {
    rg.started = true;
    let lift = 0;
    for (const p of rg.pts) if (!p.helper) lift = Math.max(lift, floorAt(p.pos.x, p.pos.z) + p.r - p.pos.y);
    if (lift > 0 && lift < 0.15) for (const p of rg.pts) { p.pos.y += lift; p.old.y += lift; }
  }

  for (const p of rg.pts) {
    if (p.imp.lengthSq() > 0) {
      p.old.copy(p.pos).addScaledVector(p.imp, -h);
      p.imp.set(0, 0, 0);
    }
  }

  for (let s = 0; s < sub; s++) {
    for (const p of rg.pts) {
      let vx = (p.pos.x - p.old.x) * airDamp;
      let vy = (p.pos.y - p.old.y) * airDamp;
      let vz = (p.pos.z - p.old.z) * airDamp;
      const vl = Math.hypot(vx, vy, vz);
      if (vl > maxStep) { const k = maxStep / vl; vx *= k; vy *= k; vz *= k; }
      p.old.copy(p.pos);
      p.pos.x += vx; p.pos.y += vy - gStep; p.pos.z += vz;
      resolveContacts(p);
      p.vyPre = p.pos.y - p.old.y;          // vertical velocity BEFORE the joints are solved
      p.sPre = Math.hypot(p.pos.x - p.old.x, p.pos.y - p.old.y, p.pos.z - p.old.z);
    }

    for (let it = 0; it < 8; it++) {
      for (const c of rg.constraints) {
        const pa = rg.pts[c.a].pos, pb = rg.pts[c.b].pos;
        tmp.subVectors(pb, pa);
        const len = tmp.length();
        if (len < 1e-4 || (c.minOnly && len >= c.d)) continue;
        const diff = ((len - c.d) / len) * 0.5 * (c.s ?? 1);
        pa.addScaledVector(tmp, diff); pb.addScaledVector(tmp, -diff);
      }

      // Chirality anti-inversion for the two "front" helper spheres (15 chest, 16 pelvis).
      // Uses the SIGNED DISTANCE from the rigid frame the helper belongs to, not the spine direction:
      // the old spine-based test misfired whenever the torso folded (falling / lying down), snapped the
      // helper ~0.2 m in one step and launched the whole corpse sideways. Now it only fires on a REAL flip,
      // and the correction is velocity-neutral (pos and old move together) so it can never add speed.
      for (const fr of rg.frames || []) {
        const fp = rg.pts[fr.f];
        if (fp.grounded) continue;
        const dist = frameDist(rg.pts, fr.o, fr.a, fr.b, fr.f);
        if (Number.isNaN(dist)) continue;
        if ((fr.rest >= 0 ? dist : -dist) < Math.abs(fr.rest) * 0.25) {
          const shift = fr.rest * 0.5 - dist;
          fp.pos.addScaledVector(_cN, shift);
          fp.old.addScaledVector(_cN, shift);
        }
      }

      // Soft anatomical knee anti-hyperextension (the knee may only fold ONE way).
      // Measured on the knee's hinge: n = hipAxis x legLine is perpendicular to both the hip line and the leg,
      // so the test is right for ANY body pose (standing, falling, lying). The old test used the pelvis'
      // "back" vector; once the body tipped over, that vector pointed at the floor and shoved the knees
      // through it one iteration after another (the knee teleported ~0.4 m in a single frame).
      _kAx.subVectors(rg.pts[12].pos, rg.pts[9].pos);
      _scUp.subVectors(rg.pts[1].pos, rg.pts[17].pos);
      _scFront.subVectors(rg.pts[15].pos, rg.pts[17].pos);
      if (_scUp.lengthSq() > 1e-8 && _scFront.lengthSq() > 1e-8) {
        _scUp.normalize();
        _scFront.addScaledVector(_scUp, -_scFront.dot(_scUp)).normalize();
      }
      for (let li = 0; li < 2; li++) {
        const si = li ? 6 : 3, ei = li ? 7 : 4, hi = li ? 8 : 5;
        _scArmAxis.subVectors(rg.pts[hi].pos, rg.pts[si].pos);
        if (_scArmAxis.lengthSq() < 1e-8 || _scFront.lengthSq() < 1e-8) continue;
        _scArmAxis.normalize();
        _scArmFront.copy(_scFront).addScaledVector(_scArmAxis, -_scFront.dot(_scArmAxis));
        if (_scArmFront.lengthSq() < 1e-8) continue;
        _scArmFront.normalize();
        _scArmOffset.subVectors(rg.pts[ei].pos, rg.pts[si].pos);
        _scArmOffset.addScaledVector(_scArmAxis, -_scArmOffset.dot(_scArmAxis));
        const elbowBend = _scArmOffset.dot(_scArmFront);
        // only on the LAST solver pass: applied on every pass it fought the joint/floor constraints, the arms kept
        // twitching and the corpse never went to sleep
        if (it === 7 && elbowBend < -0.015) {
          const correction = (-0.015 - elbowBend) * 0.8;
          rg.pts[ei].pos.addScaledVector(_scArmFront, correction);
          rg.pts[ei].old.addScaledVector(_scArmFront, correction);
        }
      }

      if (rg.kneeSide && _kAx.lengthSq() > 1e-8) {
        _kAx.normalize();
        for (let li = 0; li < 2; li++) {
          const hi = li ? 12 : 9, ki = li ? 13 : 10, fi = li ? 14 : 11;
          _kLn.subVectors(rg.pts[fi].pos, rg.pts[hi].pos);
          const ll = _kLn.length();
          if (ll < 0.12) continue;
          _kLn.multiplyScalar(1 / ll);
          _kN.crossVectors(_kAx, _kLn);
          const nl = _kN.length();
          if (nl < 1e-3) continue;
          _kN.multiplyScalar(rg.kneeSide[li] / nl);               // points to the allowed (forward) side
          _kOf.subVectors(rg.pts[ki].pos, rg.pts[hi].pos);
          _kOf.addScaledVector(_kLn, -_kOf.dot(_kLn));           // knee offset from the hip-foot line
          const bend = _kOf.dot(_kN);
          if (bend < -0.02) rg.pts[ki].pos.addScaledVector(_kN, (-0.02 - bend) * 0.45);
        }

        for (let li = 0; li < 2; li++) {
          const hi = li ? 12 : 9;
          const side = li ? 1 : -1;
          for (let pi = 0; pi < 2; pi++) {
            const idx = pi === 0 ? (li ? 13 : 10) : (li ? 14 : 11);
            // Sideways-splay limit DISABLED (limit = 9 m). The legs are already bounded by the rigid bone lengths and the
            // knee-knee minimum distance; this extra clamp fought them and the floor, and was the main source of the
            // leg "bounce" after the body landed (measured: ~90% fewer pops without it).
            const limit = 9;
            const limb = rg.pts[idx];
            const outward = _kOf.subVectors(limb.pos, rg.pts[hi].pos).dot(_kAx) * side;
            if (outward > limit) {
              const correction = (outward - limit) * side;
              limb.pos.addScaledVector(_kAx, -correction);
              limb.old.addScaledVector(_kAx, -correction);
            }
          }
        }

        _scLegUp.subVectors(rg.pts[17].pos, rg.pts[2].pos);
        if (_scLegUp.lengthSq() > 1e-8) {
          _scLegUp.normalize();
          for (let li = 0; li < 2; li++) {
            const hi = li ? 12 : 9;
            for (let pi = 0; pi < 2; pi++) {
              const idx = pi === 0 ? (li ? 13 : 10) : (li ? 14 : 11);
              const limit = rg.legLiftLimits[li][pi];
              const limb = rg.pts[idx];
              const lift = _scD1.subVectors(limb.pos, rg.pts[hi].pos).dot(_scLegUp);
              if (lift > limit) {
                // EASED, not snapped: the old 80 % correction teleported the knee / foot down in ONE pass, the rigid
                // pelvis group was dragged along and the hips kicked upward (measured up to 17 m/s). Now at most
                // 4 mm per pass, so the limit still holds but never produces a jolt.
                const correction = Math.min((lift - limit) * 0.12, 0.004);
                limb.pos.addScaledVector(_scLegUp, -correction);
                limb.old.addScaledVector(_scLegUp, -correction);
              }
            }
          }
        }
      }

      solveRagdollSelfCollision(rg);
      for (const p of rg.pts) resolveContacts(p);
    }

    // SPEED-GAIN LIMITER. Joint corrections are applied as position changes, and in Verlet every position
    // change becomes velocity. A chain that suddenly buckles (straight legs under a falling pelvis) can
    // therefore inject several m/s in one step and fling a leg into the air. A joint may not make a
    // particle faster than ~5 g worth of speed in one sub-step; real impacts only ever slow it down.
    const maxGain = 0.35 * h;
    for (const p of rg.pts) {
      const dx = p.pos.x - p.old.x, dy = p.pos.y - p.old.y, dz = p.pos.z - p.old.z;
      const sp = Math.hypot(dx, dy, dz);
      const lim = (p.sPre || 0) + maxGain;
      if (sp > lim) {
        const k = lim / sp;
        p.old.set(p.pos.x - dx * k, p.pos.y - dy * k, p.pos.z - dz * k);
      }
    }

    // NO-BOUNCE PASS. In Verlet, the joint constraints turn the floor's reaction into upward velocity
    // on the particles above the contact (that is what made the corpse hop). While the body touches
    // the ground, the joints are not allowed to ADD upward velocity any more (restitution = 0).
    let touching = 0;
    for (const p of rg.pts) if (p.grounded) touching++;
    if (touching > 0) {
      for (const p of rg.pts) {
        const cap = Math.max(p.vyPre, 0);
        if (p.pos.y - p.old.y > cap) p.old.y = p.pos.y - cap;
      }
    }

    // GROUND FRICTION (once per sub-step): a sliding corpse loses speed gradually instead of being glued
    // in place, so a hit / a run-up carries the body along the ground and it falls the way it was pushed.
    for (const p of rg.pts) {
      if (!p.grounded) continue;
      p.old.x += (p.pos.x - p.old.x) * groundFric;
      p.old.z += (p.pos.z - p.old.z) * groundFric;
    }

    // REST DAMPING: a body that already lies low on the ground and moves slowly is damped hard,
    // so leftover joint jitter dies out quickly (the fall itself is NOT affected: it is only used
    // when the body is near the floor, in contact at 4+ points and slower than ~1.5 m/s).
    if (touching >= 4) {
      let meanH = 0, maxV2 = 0;
      for (let i = 0; i < rg.pts.length; i++) {
        const p = rg.pts[i];
        meanH += p.pos.y - floorAt(p.pos.x, p.pos.z) - p.r;
        if (i === 15 || i === 16) continue;      // bust / pelvis helper spheres: not visible, ignore their jitter
        const dx = p.pos.x - p.old.x, dy = p.pos.y - p.old.y, dz = p.pos.z - p.old.z;
        const v2 = dx * dx + dy * dy + dz * dz;
        if (v2 > maxV2) maxV2 = v2;
      }
      meanH /= rg.pts.length;
      if (meanH < 0.22 && Math.sqrt(maxV2) / h < 1.5) {
        for (const p of rg.pts) p.old.lerp(p.pos, 0.25);   // keep only 75% of the velocity each sub-step
      }
    }
  }

  // Sleep: once the corpse is lying still on the ground, freeze it (no more micro-jitter / drift)
  if (sub > 0) {
    let maxV2 = 0, touching = 0;
    for (let i = 0; i < rg.pts.length; i++) {
      const p = rg.pts[i];
      if (p.grounded) touching++;
      if (i === 15 || i === 16) continue;        // helper spheres (bust / pelvis front): not visible
      const dx = p.pos.x - p.old.x, dy = p.pos.y - p.old.y, dz = p.pos.z - p.old.z;
      const v2 = dx * dx + dy * dy + dz * dz;
      if (v2 > maxV2) maxV2 = v2;
    }
    const speed = Math.sqrt(maxV2) / h;
    rg.restTime = (touching >= 3 && speed < 0.5) ? (rg.restTime || 0) + safeDt : 0;
    if (rg.restTime > 0.5) {
      rg.sleeping = true;
      for (const p of rg.pts) p.old.copy(p.pos);
    }
  }

  // Apply exact world positions & orientations to the SAME character model!
  const charRoot = rg.charRoot;
  if (!charRoot?.userData?.joints) return;
  const u = charRoot.userData;
  const j = u.joints;
  const prof = u.profile;

  charRoot.visible = true;
  if (u.weaponHolder) u.weaponHolder.visible = false;

  const pHeadTop = rg.pts[0].pos, pChestTop = rg.pts[1].pos, pHips = rg.pts[2].pos;
  const pShL = rg.pts[3].pos, pElL = rg.pts[4].pos, pHaL = rg.pts[5].pos;
  const pShR = rg.pts[6].pos, pElR = rg.pts[7].pos, pHaR = rg.pts[8].pos;
  const pHpL = rg.pts[9].pos, pKnL = rg.pts[10].pos, pFtL = rg.pts[11].pos;
  const pHpR = rg.pts[12].pos, pKnR = rg.pts[13].pos, pFtR = rg.pts[14].pos;
  const pChestBase = rg.pts[17].pos;

  charRoot.position.copy(pHips);
  charRoot.rotation.set(0, 0, 0);
  j.hips.position.set(0, 0, 0);

  buildFrameFromSpine(pHips, pChestBase, pHpL, pHpR, _qHips);
  j.hips.quaternion.copy(_qHips);

  buildFrameFromSpine(pChestBase, pChestTop, pShL, pShR, _qChest);
  _qParentInv.copy(_qHips).invert();
  _qRel.copy(_qParentInv).multiply(_qChest);
  j.waist.quaternion.identity().slerp(_qRel, 0.35);
  j.chest.quaternion.copy(j.waist.quaternion).invert().multiply(_qRel);

  charRoot.updateMatrixWorld(true);
  const pHeadCenter = rg.pts[18].pos;
  _qParentInv.copy(_qChest).invert();
  _vDir.subVectors(pHeadCenter, pChestTop);
  if (_vDir.lengthSq() > 1e-5) {
    _vDir.normalize().applyQuaternion(_qParentInv);
    _qNeck.setFromUnitVectors(_yPos, _vDir);
    limitRagdollRotation(_qNeck, 0.55);
    j.neck.quaternion.identity().slerp(_qNeck, 0.70);
  }
  _vDir.subVectors(pHeadTop, pHeadCenter);
  if (_vDir.lengthSq() > 1e-5) {
    _vDir.normalize().applyQuaternion(_qParentInv);
    _qHead.setFromUnitVectors(_yPos, _vDir);
    j.head.quaternion.copy(j.neck.quaternion).invert().multiply(_qHead);
    limitRagdollRotation(j.head.quaternion, 0.48);
  }

  const aimLimb = (boneUpper, boneLower, pRoot, pMid, pEnd, qBaseW) => {
    _qParentInv.copy(qBaseW).invert();
    _vDir.subVectors(pMid, pRoot);
    if (_vDir.lengthSq() > 1e-5) {
      _vDir.normalize().applyQuaternion(_qParentInv);
      boneUpper.quaternion.setFromUnitVectors(_yNeg2, _vDir);
    }
    _qParentInv.copy(qBaseW).multiply(boneUpper.quaternion).invert();
    _vDir.subVectors(pEnd, pMid);
    if (_vDir.lengthSq() > 1e-5) {
      _vDir.normalize().applyQuaternion(_qParentInv);
      boneLower.quaternion.setFromUnitVectors(_yNeg2, _vDir);
    }
  };

  aimLimb(j.shoulderL, j.elbowL, pShL, pElL, pHaL, _qChest);
  aimLimb(j.shoulderR, j.elbowR, pShR, pElR, pHaR, _qChest);
  aimLimb(j.hipL, j.kneeL, pHpL, pKnL, pFtL, _qHips);
  aimLimb(j.hipR, j.kneeR, pHpR, pKnR, pFtR, _qHips);
  j.footL.rotation.set(-0.15, 0, 0);
  j.footR.rotation.set(-0.15, 0, 0);

  charRoot.updateMatrixWorld(true);

  if (u.breastPhysics && j.bustL && j.bustR) {
    u.breastPhysics.step(safeDt, j.chest);
    const applyPudding = (pivot, node) => {
      pivot.rotation.set(node.pos.y * 2.6 + node.pos.z * 0.9, 0, -node.pos.x * 2.2);
      const sy = clamp(1 + node.pos.y * 1.75, 0.84, 1.18);
      const sz = clamp(1 - node.pos.z * 1.35, 0.85, 1.18);
      const sx = clamp(1 / Math.sqrt(sy * sz), 0.87, 1.15);
      pivot.scale.set(sx, sy, sz);
    };
    applyPudding(j.bustL, u.breastPhysics.left);
    applyPudding(j.bustR, u.breastPhysics.right);

    // Bust touching the floor / a wall / a forearm: it flattens (visual only), the corpse is never pushed or bounced by it.
    _bcSegs[0].a = rg.pts[4].pos; _bcSegs[0].b = rg.pts[5].pos; _bcSegs[0].r = prof.forearmR * 1.1;
    _bcSegs[1].a = rg.pts[7].pos; _bcSegs[1].b = rg.pts[8].pos; _bcSegs[1].r = prof.forearmR * 1.1;
    updateBustContactSquash(u, safeDt, floorAt, colliders, _bcSegs);
  }

  if (u.dynamicStrands?.length || u.clothSheets?.length) {
    const colSpheres = buildBodyCollisionSpheres(j, prof);
    for (const st of u.dynamicStrands || []) { st.step(safeDt, colSpheres, floorY); st.syncVisuals(); }
    for (const sh of u.clothSheets || []) { sh.tetherScale = 0.22; sh.step(safeDt, colSpheres, floorY); sh.syncVisuals(); }
  }
}

export function raycastRagdoll(rg, p0, p1, dir, impactSpeed = 9) {
  if (!rg) return null;
  const ab = p1.clone().sub(p0), lenSq = ab.lengthSq();
  if (lenSq < 1e-6) return null;
  for (let i = 0; i < rg.pts.length; i++) {
    const p = rg.pts[i];
    const t = clamp(p.pos.clone().sub(p0).dot(ab) / lenSq, 0, 1);
    const closest = p0.clone().addScaledVector(ab, t);
    if (closest.distanceToSquared(p.pos) <= (p.r + 0.10) ** 2) {
      p.imp.addScaledVector(dir.clone().normalize(), impactSpeed);
      return closest;
    }
  }
  return null;
}

// ============================================================================
// 5. 2-BONE ARM IK + WEAPON-BUST SQUASH COLLISION + FULL LOCOMOTION & POSES
// ============================================================================
const _dir = V3(), _pole = V3(), _bend = V3(), _elbow = V3(), _yNeg = V3(0, -1, 0);
const _sPos = V3(), _qInvChest = new THREE.Quaternion();
const _wMat = new THREE.Euler(), _wQuat = new THREE.Quaternion();

function keepArmTargetOutsideTorso(target, prof) {
  const chestFront = -prof.chestD * 0.5 - 0.04;
  const waistFront = -prof.waistD * 0.5 - 0.04;
  if (target.y >= 0 && target.y <= prof.chestH &&
      Math.abs(target.x) < prof.chestW * 0.52 && target.z > chestFront) {
    target.z = chestFront;
  } else if (target.y >= -prof.waistH && target.y < 0.04 &&
      Math.abs(target.x) < prof.waistW * 0.52 && target.z > waistFront) {
    target.z = waistFront;
  }
}

function solveArmIK(shoulder, elbow, targetChestLocal, L1, L2, side, customPole = null) {
  _sPos.copy(shoulder.position);
  _dir.copy(targetChestLocal).sub(_sPos);
  const rawLen = _dir.length();
  const d = clamp(rawLen, 0.08, L1 + L2 - 0.008);
  if (rawLen > 1e-5) _dir.divideScalar(rawLen);
  else _dir.set(0, -1, 0);

  if (customPole) _pole.copy(customPole).normalize();
  else _pole.set(side * 0.75, -1.0, -0.55).normalize();

  _bend.copy(_pole).addScaledVector(_dir, -_pole.dot(_dir));
  if (_bend.lengthSq() < 1e-4) _bend.set(side, 0, 0.3);
  _bend.normalize();

  const proj = (d * d + L1 * L1 - L2 * L2) / (2 * d);
  const perp = Math.sqrt(Math.max(0, L1 * L1 - proj * proj));
  _elbow.copy(_sPos).addScaledVector(_dir, proj).addScaledVector(_bend, perp);

  const upperDir = _elbow.clone().sub(_sPos).normalize();
  shoulder.quaternion.setFromUnitVectors(_yNeg, upperDir);

  const lowerDir = targetChestLocal.clone().sub(_elbow).normalize();
  _qInvChest.copy(shoulder.quaternion).invert();
  lowerDir.applyQuaternion(_qInvChest);
  elbow.quaternion.setFromUnitVectors(_yNeg, lowerDir);
}

// ---------------------------------------------------------------------------------------------------------
// BUST CONTACT SQUASH. When a bust touches the floor, a collider box or a forearm, it FLATTENS against it
// instead of poking through or shoving the body (so there is no bounce and nothing pushes the corpse):
//   * depth = how far the undeformed sphere would sink into the obstacle (floor / box / forearm)
//   * the sphere is scaled down along the contact normal and swells a little sideways, about its own centre,
//     and its centre moves away from the obstacle by half the depth, so the far side stays where it was
//   * depth is smoothed with a plain exponential (fast in, slower out): it can never overshoot or spring back
//   * purely visual: no force, no impulse, no particle is touched
// ---------------------------------------------------------------------------------------------------------
const _bcC = V3(), _bcN = V3(), _bcQ = V3(), _bcAB = V3(), _bcOut = V3();
const _bcInvQ = new THREE.Quaternion();
const _bcSegs = [{ a: null, b: null, r: 0 }, { a: null, b: null, r: 0 }];
const _bcE = [V3(), V3(), V3()];          // world axes of the bust ellipsoid (already scaled by its radius)

// how far the (squashed-free) bust ellipsoid reaches along the world direction n
function bustSupportRadius(n) {
  const a = _bcE[0].dot(n), b = _bcE[1].dot(n), c = _bcE[2].dot(n);
  return Math.sqrt(a * a + b * b + c * c);
}

function bustContactDepth(c, rIso, floorAt, colliders, segs, outN) {
  let best = 0;
  const fy = floorAt(c.x, c.z);
  const floorPen = fy + bustSupportRadius(_bcN.set(0, 1, 0)) - c.y;
  if (floorPen > best) { best = floorPen; outN.set(0, 1, 0); }

  if (colliders) {
    for (const b of colliders) {
      if (!b || b.stairRamp || !Number.isFinite(b.minX + b.maxX + b.minY + b.maxY + b.minZ + b.maxZ)) continue;
      const dx = c.x - clamp(c.x, b.minX, b.maxX);
      const dy = c.y - clamp(c.y, b.minY, b.maxY);
      const dz = c.z - clamp(c.z, b.minZ, b.maxZ);
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 >= rIso * rIso || d2 < 1e-10) continue;   // (centre inside a box = already embedded in a wall: ignore)
      const d = Math.sqrt(d2);
      if (rIso - d > best) { best = rIso - d; outN.set(dx / d, dy / d, dz / d); }
    }
  }

  if (segs) {
    for (const sg of segs) {
      _bcAB.subVectors(sg.b, sg.a);
      const l2 = _bcAB.lengthSq();
      const t = l2 > 1e-8 ? clamp(_bcQ.subVectors(c, sg.a).dot(_bcAB) / l2, 0, 1) : 0;
      _bcQ.copy(sg.a).addScaledVector(_bcAB, t);
      _bcN.subVectors(c, _bcQ);
      const d = _bcN.length();
      const pen = rIso + sg.r - d;
      if (pen > best && d > 1e-5) { best = pen; outN.copy(_bcN).multiplyScalar(1 / d); }
    }
  }
  return best;
}

// Needs up-to-date world matrices (chest and everything above it).
function updateBustContactSquash(u, dt, floorAt, colliders = null, segs = null) {
  const j = u.joints;
  if (!u.breastPhysics || !j?.bustL || !j?.bustR) return;
  const st = u.bustSquash || (u.bustSquash = { L: { d: 0, R: 0.08, n: V3(0, 0, -1) }, R: { d: 0, R: 0.08, n: V3(0, 0, -1) } });
  j.chest.getWorldQuaternion(_bcInvQ).invert();

  for (const [pivot, s] of [[j.bustL, st.L], [j.bustR, st.R]]) {
    const sq = pivot.userData?.squash;
    if (!sq) continue;
    // measure the bust WITHOUT this frame's squash (otherwise the squash would feed back into its own input)
    sq.scale.set(1, 1, 1);
    sq.position.copy(BUST_SQUASH_CENTER);
    pivot.updateMatrixWorld(true);
    const m = sq.children[0].matrixWorld.elements;
    for (let k = 0; k < 3; k++) _bcE[k].set(m[k * 4], m[k * 4 + 1], m[k * 4 + 2]).multiplyScalar(BUST_CONTACT.meshRadius);
    _bcC.setFromMatrixPosition(sq.children[0].matrixWorld);
    const rIso = (_bcE[0].length() + _bcE[1].length() + _bcE[2].length()) / 3 + BUST_CONTACT.skin;

    const pen = bustContactDepth(_bcC, rIso, floorAt, colliders, segs, _bcOut);
    const target = clamp(pen, 0, BUST_CONTACT.maxDepth);

    if (target > 0.002) {
      s.R = Math.max(0.04, bustSupportRadius(_bcOut));           // reach of the bust towards the obstacle
      _bcOut.applyQuaternion(_bcInvQ);                           // world normal -> chest space
      if (s.d < 1e-3) s.n.copy(_bcOut); else s.n.lerp(_bcOut, clamp(dt * 30, 0, 1));
      if (s.n.lengthSq() < 1e-6) s.n.set(0, 0, -1); else s.n.normalize();
    }
    s.d = damp(s.d, target > 0.002 ? target : 0, target > s.d ? BUST_CONTACT.rateIn : BUST_CONTACT.rateOut, dt);
    if (s.d < 1e-4) s.d = 0;
    if (s.d === 0) continue;                                     // (already reset to rest above)

    const f = clamp(s.d / (2 * s.R), 0, 0.5);                    // fraction the bust is flattened by
    const n = s.n;
    sq.scale.set(
      (1 - f * n.x * n.x) * (1 + 0.5 * f * (1 - n.x * n.x)),
      (1 - f * n.y * n.y) * (1 + 0.5 * f * (1 - n.y * n.y)),
      (1 - f * n.z * n.z) * (1 + 0.5 * f * (1 - n.z * n.z))
    );
    sq.position.copy(BUST_SQUASH_CENTER).addScaledVector(n, s.d * 0.5);
  }
}

function buildBodyCollisionSpheres(j, prof) {
  return [
    // Head & Upper Torso
    { c: j.head.localToWorld(V3(0, 0.13, 0.01)), r: 0.160, tag: 'head' },
    { c: j.chest.localToWorld(V3(0, prof.chestH * 0.78, 0.02)), r: 0.165, tag: 'torso' },
    { c: j.chest.localToWorld(V3(0, prof.chestH * 0.45, 0.02)), r: 0.162, tag: 'torso' },
    { c: j.chest.localToWorld(V3(0, prof.chestH * 0.15, 0.02)), r: 0.152, tag: 'torso' },
    { c: j.waist.localToWorld(V3(0, prof.waistH * 0.50, 0.01)), r: 0.148, tag: 'waist' },

    // Pelvis & Side Hips (prevents hip spheres from poking out of skirt/coat)
    { c: j.hips.localToWorld(V3(0, 0.01, -0.02)), r: 0.168, tag: 'pelvis' },
    { c: j.hips.localToWorld(V3(0, 0.01, 0.04)), r: 0.175, tag: 'pelvis' },
    { c: j.hips.localToWorld(V3(-prof.pelvisW * 0.25, 0.01, 0.02)), r: prof.gender === 'female' ? 0.155 : 0.145, tag: 'pelvis' },
    { c: j.hips.localToWorld(V3(prof.pelvisW * 0.25, 0.01, 0.02)), r: prof.gender === 'female' ? 0.155 : 0.145, tag: 'pelvis' },

    // Arms L & R (prevents shoulders, elbows, forearms & hands from clipping through coat/cloak)
    { c: j.shoulderL.localToWorld(V3(0, 0, 0)), r: prof.upperArmR * 1.45 + 0.032, tag: 'arm' },
    { c: j.shoulderL.localToWorld(V3(0, -prof.armL1 * 0.5, 0)), r: prof.upperArmR + 0.035, tag: 'arm' },
    { c: j.elbowL.localToWorld(V3(0, 0, 0)), r: prof.forearmR * 1.35 + 0.035, tag: 'arm' },
    { c: j.elbowL.localToWorld(V3(0, -prof.armL2 * 0.5, 0)), r: prof.forearmR + 0.035, tag: 'arm' },
    { c: j.handL.localToWorld(V3(0, -0.03, 0)), r: 0.072, tag: 'arm' },

    { c: j.shoulderR.localToWorld(V3(0, 0, 0)), r: prof.upperArmR * 1.45 + 0.032, tag: 'arm' },
    { c: j.shoulderR.localToWorld(V3(0, -prof.armL1 * 0.5, 0)), r: prof.upperArmR + 0.035, tag: 'arm' },
    { c: j.elbowR.localToWorld(V3(0, 0, 0)), r: prof.forearmR * 1.35 + 0.035, tag: 'arm' },
    { c: j.elbowR.localToWorld(V3(0, -prof.armL2 * 0.5, 0)), r: prof.forearmR + 0.035, tag: 'arm' },
    { c: j.handR.localToWorld(V3(0, -0.03, 0)), r: 0.072, tag: 'arm' },

    // Dense Legs L & R + Kneecaps (prevents thighs/knees/shins from poking through skirt or coat)
    { c: j.hipL.localToWorld(V3(0, -prof.thighL * 0.22, 0)), r: prof.thighR + 0.044, tag: 'leg' },
    { c: j.hipL.localToWorld(V3(0, -prof.thighL * 0.52, 0)), r: prof.thighR + 0.040, tag: 'leg' },
    { c: j.hipL.localToWorld(V3(0, -prof.thighL * 0.80, 0)), r: prof.thighR + 0.036, tag: 'leg' },
    { c: j.kneeL.localToWorld(V3(0, 0, -0.02)), r: prof.shinR * 1.35 + 0.042, tag: 'leg' },
    { c: j.kneeL.localToWorld(V3(0, -prof.shinL * 0.28, 0)), r: prof.shinR + 0.040, tag: 'leg' },
    { c: j.kneeL.localToWorld(V3(0, -prof.shinL * 0.58, 0)), r: prof.shinR + 0.036, tag: 'leg' },
    { c: j.kneeL.localToWorld(V3(0, -prof.shinL * 0.85, 0)), r: prof.shinR + 0.034, tag: 'leg' },
    { c: j.footL.localToWorld(V3(0, -0.04, -0.04)), r: 0.095, tag: 'foot' },

    { c: j.hipR.localToWorld(V3(0, -prof.thighL * 0.22, 0)), r: prof.thighR + 0.044, tag: 'leg' },
    { c: j.hipR.localToWorld(V3(0, -prof.thighL * 0.52, 0)), r: prof.thighR + 0.040, tag: 'leg' },
    { c: j.hipR.localToWorld(V3(0, -prof.thighL * 0.80, 0)), r: prof.thighR + 0.036, tag: 'leg' },
    { c: j.kneeR.localToWorld(V3(0, 0, -0.02)), r: prof.shinR * 1.35 + 0.042, tag: 'leg' },
    { c: j.kneeR.localToWorld(V3(0, -prof.shinL * 0.28, 0)), r: prof.shinR + 0.040, tag: 'leg' },
    { c: j.kneeR.localToWorld(V3(0, -prof.shinL * 0.58, 0)), r: prof.shinR + 0.036, tag: 'leg' },
    { c: j.kneeR.localToWorld(V3(0, -prof.shinL * 0.85, 0)), r: prof.shinR + 0.034, tag: 'leg' },
    { c: j.footR.localToWorld(V3(0, -0.04, -0.04)), r: 0.095, tag: 'foot' }
  ];
}

export function updateArticulatedCharacter(root, dt, now, state = {}) {
  const u = root?.userData;
  const j = u?.joints;
  const prof = u?.profile;
  const anim = u?.anim;
  if (!j || !prof || !anim) return;

  const safeDt = clamp(dt, 0.001, 0.033);
  const physicsDt = clamp(state.physicsDt ?? safeDt, 0.001, 0.1);
  const vel = state.vel || V3(0, 0, 0);
  (u.lastVel || (u.lastVel = V3())).copy(vel);   // read by createCharacterRagdoll: momentum at the moment of death
  const horizSpeed = Math.hypot(vel.x, vel.z);
  const onGround = state.onGround !== false;
  const floorY = state.floorY ?? 0;
  const pitch = clamp(state.pitch || 0, -1.1, 1.1);
  const lean = clamp(state.lean || 0, -0.9, 0.9);
  const jumpStyle = state.jumpStyle || 'standard';

  const specialMode = state.specialPose || 'normal';
  const crouch = specialMode === 'normal' && !!state.crouch && !state.prone;
  const prone = specialMode === 'normal' && !!state.prone;

  const fireAge = state.fireAge ?? 9;
  const reloadP = state.reloadProgress ?? -1;
  const meleeAge = state.meleeAge ?? 9;
  const grenadeP = clamp(state.grenadeProgress ?? 0, 0, 1);

  // ---- 1. Smooth State Blending & Recoil ----
  const isSprinting = specialMode === 'normal' && !crouch && !prone && horizSpeed > 6.4;
  const isWalking = specialMode === 'normal' && !crouch && !prone && horizSpeed > 0.35 && !isSprinting;

  anim.crouchBlend = damp(anim.crouchBlend, crouch ? 1 : 0, 11, safeDt);
  anim.proneBlend = damp(anim.proneBlend, prone ? 1 : 0, 9, safeDt);
  anim.sprintBlend = damp(anim.sprintBlend, isSprinting ? 1 : 0, 10, safeDt);
  anim.walkBlend = damp(anim.walkBlend, isWalking ? 1 : 0, 10, safeDt);
  anim.adsBlend = damp(anim.adsBlend, state.scoped && specialMode === 'normal' ? 1 : 0, 14, safeDt);
  anim.downBlend = damp(anim.downBlend, specialMode === 'downed' ? 1 : 0, 9, safeDt);
  anim.reviveBlend = damp(anim.reviveBlend, specialMode === 'reviving' ? 1 : 0, 10, safeDt);
  anim.carryBlend = damp(anim.carryBlend, specialMode === 'carrying' ? 1 : 0, 10, safeDt);
  anim.carriedBlend = damp(anim.carriedBlend, specialMode === 'carried' ? 1 : 0, 12, safeDt);

  if (fireAge < anim.lastFireAgeHandled && fireAge < 0.08) {
    triggerCharacterImpulse(root, (Math.random() - 0.5) * 0.15, -0.65, 1.2);
  }
  anim.lastFireAgeHandled = fireAge;

  if (onGround && !anim.wasOnGround && anim.prevVy < -2.5) {
    anim.landVel -= Math.min(2.2, Math.abs(anim.prevVy) * 0.22);
    triggerCharacterImpulse(root, 0, Math.max(-2.0, anim.prevVy * 0.26), 0.5);
  }
  anim.wasOnGround = onGround;
  anim.prevVy = vel.y;

  springStep(anim, 'landCompress', 'landVel', 135, 1.0, safeDt, -0.18, 0.04);

  for (const hb of u.hitboxes) {
    if (hb.flashUntil > 0 && now >= hb.flashUntil) {
      hb.flashUntil = 0;
      hb.debugMesh.material.color.setHex(hb.baseColor);
    }
  }

  // Hit reactions: soft-limited, no spring (see reactStep). Ranges are the MAX bend of each channel.
  const fl = anim.flinch;
  reactStep(fl, 'pitch', 'velP', safeDt, -0.30, 0.30);
  reactStep(fl, 'roll',  'velR', safeDt, -0.26, 0.26);
  reactStep(fl, 'yaw',   'velY', safeDt, -0.30, 0.30);

  const wf = anim.waistFlinch;
  reactStep(wf, 'crunch', 'vC', safeDt, -0.40, 0.24);
  reactStep(wf, 'twist',  'vT', safeDt, -0.34, 0.34);
  reactStep(wf, 'side',   'vS', safeDt, -0.30, 0.30);

  for (const lf of [anim.legFlinchL, anim.legFlinchR]) {
    reactStep(lf, 'hip',  'vH', safeDt, -0.30, 0.32);
    reactStep(lf, 'knee', 'vK', safeDt, -0.70, 0.0);
  }
  const hitDip = anim.hitDip || (anim.hitDip = { y: 0, vy: 0 });
  reactStep(hitDip, 'y', 'vy', safeDt, -0.06, 0.0);
  const dipY = hitDip.y;

  // The two legs may not be pushed further apart than a small amount by a flinch (this was the "split").
  // Common motion (both legs together) is untouched; only the DIFFERENCE is compressed, smoothly.
  const lfL = anim.legFlinchL, lfR = anim.legFlinchR;
  const fMean = (lfL.hip + lfR.hip) * 0.5;
  const fHalf = softLimit(lfL.hip - lfR.hip, 0.20) * 0.5;
  const flHipL = fMean + fHalf, flHipR = fMean - fHalf;

  // ---- 2. Locomotion, Jumps, Crouch, Prone, Downed, Revive, Carry ----
  const cosYaw = Math.cos(root.rotation.y), sinYaw = Math.sin(root.rotation.y);
  const fwdSpeed = -vel.x * sinYaw - vel.z * cosYaw;
  const targetSign = horizSpeed < 0.2 ? 1 : (fwdSpeed < -0.2 ? -1 : 1);
  anim.moveSign = damp(anim.moveSign, targetSign, 9, safeDt);

  const g = prof.gait;
  anim.stridePhase += safeDt * anim.moveSign * (horizSpeed > 0.25 ? (3.6 + horizSpeed * 1.02) * g.cadence : 0);
  const ph = anim.stridePhase;
  const s = Math.sin(ph), c = Math.cos(ph);
  const moveAmt = clamp(horizSpeed / 5.0, 0, 1);
  const idleAmt = 1 - moveAmt;
  const backAmt = clamp(-fwdSpeed / 4.5, 0, 1);

  let jHipL = 0, jHipR = 0, jKneeL = 0, jKneeR = 0, jLeanX = 0, jLeanZ = 0;
  if (!onGround) {
    if (jumpStyle === 'sprint_leap') { jHipL = 0.85; jKneeL = -1.25; jHipR = -0.55; jKneeR = -0.65; jLeanX = -0.24; }
    else if (jumpStyle === 'tactical_side') { jHipL = 0.55; jKneeL = -1.15; jHipR = 0.25; jKneeR = -0.95; jLeanZ = 0.25; }
    else if (jumpStyle === 'vault') { jHipL = 1.15; jKneeL = -1.75; jHipR = 0.95; jKneeR = -1.55; jLeanX = -0.38; jLeanZ = -0.18; }
    else {
      const tuck = clamp((vel.y + 4) / 10, 0, 1);
      jHipL = 0.42 + tuck * 0.35; jKneeL = -(0.65 + tuck * 0.75);
      jHipR = -0.15 + tuck * 0.30; jKneeR = -(0.35 + tuck * 0.65);
    }
  }
  // Blend the jump pose in on take-off and OUT on landing (the last airborne pose is remembered), instead of
  // switching it on/off in one frame - that instant switch was the knee/hip "pop" when jumping and landing.
  const jp = anim.jumpPose || (anim.jumpPose = { hL: 0, hR: 0, kL: 0, kR: 0, lx: 0, lz: 0 });
  if (!onGround) { jp.hL = jHipL; jp.hR = jHipR; jp.kL = jKneeL; jp.kR = jKneeR; jp.lx = jLeanX; jp.lz = jLeanZ; }
  anim.airBlend = damp(anim.airBlend ?? 0, onGround ? 0 : 1, onGround ? 13 : 20, safeDt);
  const air = anim.airBlend;
  jHipL = jp.hL * air; jHipR = jp.hR * air; jKneeL = jp.kL * air; jKneeR = jp.kR * air;
  jLeanX = jp.lx * air; jLeanZ = jp.lz * air;

  const legStride = (0.46 * anim.walkBlend + g.strideLen * 1.2 * anim.sprintBlend) * (1 - backAmt * 0.25) * (1 - 0.85 * air);
  const standHipL = s * legStride + jHipL + flHipL;
  const standHipR = -s * legStride + jHipR + flHipR;
  const swingFlexL = Math.max(0, Math.cos(ph + 0.25 * anim.moveSign));
  const swingFlexR = Math.max(0, Math.cos(ph + Math.PI + 0.25 * anim.moveSign));
  const kneeAmp = 0.72 * anim.walkBlend + 1.38 * anim.sprintBlend;
  const standKneeL = -(0.06 + swingFlexL * kneeAmp + Math.max(0, -c) * 0.14 * moveAmt) + jKneeL + anim.legFlinchL.knee;
  const standKneeR = -(0.06 + swingFlexR * kneeAmp + Math.max(0, c) * 0.14 * moveAmt) + jKneeR + anim.legFlinchR.knee;

  const crouchHipL = (1.42 * idleAmt + (1.04 + s * 0.36) * moveAmt) + flHipL;
  const crouchHipR = (0.34 * idleAmt + (1.04 - s * 0.36) * moveAmt) + flHipR;
  const crouchKneeL = -(2.15 * idleAmt + (1.80 + Math.max(0, Math.cos(ph + 0.25)) * 0.30) * moveAmt) + anim.legFlinchL.knee;
  const crouchKneeR = -(1.95 * idleAmt + (1.80 + Math.max(0, Math.cos(ph + Math.PI + 0.25)) * 0.30) * moveAmt) + anim.legFlinchR.knee;

  const crawlS = Math.sin(ph * 0.85) * moveAmt;
  const proneHipL = 0.04 + Math.max(0, crawlS) * 0.32;
  const proneHipR = 0.04 + Math.max(0, -crawlS) * 0.32;
  const proneKneeL = -0.06 - Math.max(0, crawlS) * 0.45;
  const proneKneeR = -0.06 - Math.max(0, -crawlS) * 0.45;

  const cb = anim.crouchBlend, pb = anim.proneBlend;
  let hipL_X = (standHipL * (1 - cb) + crouchHipL * cb) * (1 - pb) + proneHipL * pb;
  let hipR_X = (standHipR * (1 - cb) + crouchHipR * cb) * (1 - pb) + proneHipR * pb;
  let kneeL_X = (standKneeL * (1 - cb) + crouchKneeL * cb) * (1 - pb) + proneKneeL * pb;
  let kneeR_X = (standKneeR * (1 - cb) + crouchKneeR * cb) * (1 - pb) + proneKneeR * pb;

  const strideVault = (1 - Math.abs(s)) * (0.036 * anim.walkBlend + 0.068 * anim.sprintBlend) * (1 - air);
  const standY = prof.hipY - 0.02 * moveAmt + strideVault + anim.landCompress + dipY;
  const crouchY = prof.hipY - 0.47 + strideVault * 0.30 + anim.landCompress * 0.40 + dipY * 0.5;
  const proneY = 0.145 + Math.abs(crawlS) * 0.015;

  let hipsY = (standY * (1 - cb) + crouchY * cb) * (1 - pb) + proneY * pb;
  let hipsRotX = pb * -1.48;
  let hipsRotY = -s * g.hipTwistY * moveAmt * (1 - pb);
  let hipsRotZ = (s * g.hipSwayZ * moveAmt) * (1 - pb) + crawlS * 0.10 * pb + jLeanZ * 0.35;

  const db = anim.downBlend, rb = anim.reviveBlend, cab = anim.carryBlend, cdb = anim.carriedBlend;
  if (db > 0.01) {
    const dCrawl = Math.sin(now * 0.005) * (horizSpeed > 0.1 ? 0.22 : 0.02);
    hipsY = hipsY * (1 - db) + (0.45 + Math.abs(dCrawl) * 0.02) * db;
    hipsRotX = hipsRotX * (1 - db) + (-1.10) * db;
    hipL_X = hipL_X * (1 - db) + (0.85 + dCrawl) * db;
    hipR_X = hipR_X * (1 - db) + (0.82 - dCrawl) * db;
    kneeL_X = kneeL_X * (1 - db) + (-1.30) * db;
    kneeR_X = kneeR_X * (1 - db) + (-1.26) * db;
  }
  if (rb > 0.01) {
    hipsY = hipsY * (1 - rb) + (prof.hipY - 0.48) * rb;
    hipL_X = hipL_X * (1 - rb) + 1.45 * rb;
    hipR_X = hipR_X * (1 - rb) + 0.15 * rb;
    kneeL_X = kneeL_X * (1 - rb) + (-2.05) * rb;
    kneeR_X = kneeR_X * (1 - rb) + (-1.75) * rb;
  }
  if (cdb > 0.01) {
    const sway = Math.sin(now * 0.006) * 0.05;
    hipsY = 0;
    hipsRotX = -1.52 + sway;
    hipL_X = 1.48 + sway;
    hipR_X = 1.42 - sway;
    kneeL_X = -1.65;
    kneeR_X = -1.58;
  }

  j.hips.position.y = hipsY;
  j.hips.rotation.set(hipsRotX, hipsRotY, hipsRotZ);

  // Final soft limits on the composed leg pose: identity for every normal pose (gait, crouch, revive, carried),
  // only the extreme combinations get eased. No hard clamp -> nothing can snap.
  {
    const mean = (hipL_X + hipR_X) * 0.5;
    const half = softOver(hipL_X - hipR_X, 1.55, 0.20) * 0.5;      // max leg-to-leg opening ~100 deg
    hipL_X = softClamp(mean + half, -0.95, 1.90, 0.20);
    hipR_X = softClamp(mean - half, -0.95, 1.90, 0.20);
  }
  const standSplay = prof.gender === 'female' ? 0.02 : 0.04;
  j.hipL.rotation.set(hipL_X, 0, -standSplay - cb * 0.08 - pb * 0.09 - db * 0.10);
  j.hipR.rotation.set(hipR_X, 0, standSplay + cb * 0.08 + pb * 0.09 + db * 0.10);
  kneeL_X = softClamp(kneeL_X, -2.45, -0.02, 0.12);
  kneeR_X = softClamp(kneeR_X, -2.45, -0.02, 0.12);
  j.kneeL.rotation.set(kneeL_X, 0, 0);
  j.kneeR.rotation.set(kneeR_X, 0, 0);

  const standFootL = -(hipL_X + kneeL_X) + s * 0.22 * moveAmt * (1 - cb);
  const standFootR = -(hipR_X + kneeR_X) - s * 0.22 * moveAmt * (1 - cb);
  j.footL.rotation.set(standFootL * (1 - pb - db - cdb) - 1.22 * pb - 1.25 * db, 0, 0);
  j.footR.rotation.set(standFootR * (1 - pb - db - cdb) - 1.22 * pb - 1.25 * db, 0, 0);

  // ---- 3. Waist, Chest, Neck & Head ----
  const ads = anim.adsBlend;
  const recoilJolt = fireAge < 0.12 ? Math.sin((fireAge / 0.12) * Math.PI) * 0.075 : 0;

  let meleeBodyYaw = 0, meleeBodyPitch = 0;
  if (meleeAge < 0.48) {
    const mp = meleeAge / 0.48;
    if (mp < 0.30) { const k = mp / 0.30; meleeBodyYaw = -0.45 * k; meleeBodyPitch = 0.12 * k; }
    else if (mp < 0.65) { const k = (mp - 0.30) / 0.35; meleeBodyYaw = -0.45 + 1.15 * k; meleeBodyPitch = 0.12 - 0.34 * k; }
    else { const k = 1 - (mp - 0.65) / 0.35; meleeBodyYaw = 0.70 * k; meleeBodyPitch = -0.22 * k; }
  }

  const crouchHunch = cb * -0.26;
  const revivePump = rb * Math.sin(now * 0.008) * 0.10;
  const forwardLeanSprint = -0.18 * anim.sprintBlend + backAmt * 0.10 + jLeanX;
  const firstPersonDownBend = (state.firstPerson ? clamp(-pitch, 0, 1.2) : 0) * 0.20;
  const waistYaw = s * g.hipTwistY * 0.85 * moveAmt + meleeBodyYaw * 0.45 + fl.yaw * 0.4 + wf.twist + ads * 0.10;

  const waistRot = [
    forwardLeanSprint * 0.5 + crouchHunch * 0.55 + pb * 0.16 + db * 0.06 + rb * (-0.35 + revivePump) + cab * -0.14 + cdb * -0.20 + fl.pitch * 0.45 + wf.crunch * 0.68 + meleeBodyPitch * 0.4 - firstPersonDownBend * 0.25,
    waistYaw,
    -lean * 0.35 + fl.roll * 0.45 + wf.side * 0.65 + jLeanZ * 0.35 + cdb * 0.08
  ];
  const chestRot = [
    forwardLeanSprint * 0.5 + crouchHunch * 0.45 + pb * 0.18 + db * 0.10 + rb * (-0.32 + revivePump) + cab * -0.10 + cdb * -0.18 + pitch * 0.40 * (1 - pb - db - rb - cdb) + recoilJolt + fl.pitch * 0.55 + wf.crunch * 0.38 + meleeBodyPitch * 0.6 - firstPersonDownBend * 0.45,
    meleeBodyYaw * 0.55 + fl.yaw * 0.6 + wf.twist * 0.35 + ads * 0.14,
    -lean * 0.42 + fl.roll * 0.55 + wf.side * 0.35 + jLeanZ * 0.35
  ];
  // Soft anatomical limits for the spine (waist + chest together can not fold over more than ~70 deg forward).
  {
    let wx = softClamp(waistRot[0], -0.85, 0.45, 0.15);
    let cx = softClamp(chestRot[0], -0.85, 0.45, 0.15);
    const tot = wx + cx, lim = softClamp(tot, -1.25, 0.70, 0.20);
    if (lim !== tot && Math.abs(tot) > 1e-5) { const k = lim / tot; wx *= k; cx *= k; }
    j.waist.rotation.set(wx, softClamp(waistRot[1], -0.85, 0.85, 0.15), softClamp(waistRot[2], -0.65, 0.65, 0.12));
    j.chest.rotation.set(cx, softClamp(chestRot[1], -0.85, 0.85, 0.15), softClamp(chestRot[2], -0.65, 0.65, 0.12));
  }

  const downPain = db * Math.sin(now * 0.004) * 0.06;
  j.neck.rotation.set(pitch * 0.28 * (1 - pb - db - cdb) + pb * 0.54 + db * (0.44 + downPain) + rb * 0.15 + fl.pitch * 0.25 - wf.crunch * 0.25 - firstPersonDownBend * 0.20, -ads * 0.10 - fl.yaw * 0.3, ads * 0.08);
  j.head.rotation.set(pitch * 0.32 * (1 - pb - db - cdb) + pb * 0.50 + db * 0.42 + rb * -0.25 - firstPersonDownBend * 0.15, ads * -0.06, -lean * 0.14 + ads * 0.10);

  // ---- 4. Weapon Holder + Multi-Point Weapon-to-Bust Collision + 2-Bone Arm IK ----
  const hideWeapon = specialMode === 'downed' || specialMode === 'reviving' || specialMode === 'carried';
  u.weaponHolder.visible = !hideWeapon && !state.unarmed;
  if (j.reviveMedkit) { j.reviveMedkit.visible = rb > 0.35; j.reviveMedkit.position.set(0, 0.05, -0.52); }

  let whX = 0.13 - ads * 0.065;
  let whY = 0.17 + ads * 0.085;
  let whZ = -0.43 + ads * 0.02 + recoilJolt * 0.25;
  const weaponTransform = state.weaponTransform;
  if (weaponTransform) {
    whX = (weaponTransform.x ?? 0.13) - ads * 0.065;
    whY = (weaponTransform.y ?? 0.17) + ads * 0.085;
    whZ = (weaponTransform.z ?? -0.43) + ads * 0.02 + recoilJolt * 0.25;
  }
  let whRotX = (weaponTransform?.rx ?? 0) + pitch * 0.50 + recoilJolt * 1.25;
  let whRotY = (weaponTransform?.ry ?? 0) + ads * -0.14;
  let whRotZ = weaponTransform?.rz ?? 0;

  if (pb > 0.01) {
    const proneWhX = 0.055 - ads * 0.035;
    const proneWhY = prof.chestH + 0.13;
    const proneWhZ = -0.15 + ads * 0.03;
    whX = whX * (1 - pb) + proneWhX * pb;
    whY = whY * (1 - pb) + proneWhY * pb;
    whZ = whZ * (1 - pb) + proneWhZ * pb;
    whRotX += pb * 1.14;
  }

  if (anim.sprintBlend > 0.2 && ads < 0.2 && fireAge > 0.3 && meleeAge > 0.5 && cab < 0.2) {
    whX -= 0.05 * anim.sprintBlend; whY -= 0.08 * anim.sprintBlend;
    whRotY += 0.58 * anim.sprintBlend; whRotX -= 0.25 * anim.sprintBlend;
  }

  if (reloadP >= 0 && !hideWeapon && !state.unarmed) {
    const tilt = Math.sin(reloadP * Math.PI);
    whX -= tilt * 0.06; whY += tilt * 0.04;
    whRotX += tilt * 0.28; whRotY += tilt * 0.42; whRotZ -= tilt * 0.45;
  }

  if (meleeAge < 0.48 && !hideWeapon) {
    const mp = meleeAge / 0.48;
    if (mp < 0.30) { const k = mp / 0.30; whX += 0.18 * k; whY += 0.14 * k; whZ += 0.12 * k; whRotX += 0.85 * k; whRotZ -= 0.75 * k; }
    else if (mp < 0.65) { const k = (mp - 0.30) / 0.35; whX += 0.18 - 0.44 * k; whY += 0.14 - 0.26 * k; whZ += 0.12 - 0.24 * k; whRotX += 0.85 - 2.15 * k; whRotZ -= 0.75 - 1.35 * k; }
    else { const k = 1 - (mp - 0.65) / 0.35; whX -= 0.26 * k; whY -= 0.12 * k; whZ -= 0.12 * k; whRotX -= 1.30 * k; whRotZ += 0.60 * k; }
  }

  if (grenadeP > 0) {
    const arc = Math.sin(grenadeP * Math.PI);
    whY += arc * 0.22; whZ += (grenadeP < 0.55 ? 0.16 : -0.25) * arc; whRotX += (grenadeP < 0.55 ? 0.75 : -0.95) * arc;
  }

  if (u.weaponHolder.visible && pb < 0.3 && !weaponTransform) {
    _wMat.set(whRotX, whRotY, whRotZ);
    _wQuat.setFromEuler(_wMat);
    const chestFrontLimit = -prof.chestD * 0.50 - 0.038;

    const gunSamples = [
      [V3(0, -0.02, 0.28), 0.045],
      [V3(0, 0.0, 0.14),   0.052],
      [V3(0, -0.04, 0.02), 0.048],
      [V3(0, 0.0, -0.14),  0.042]
    ];

    if (u.breastPhysics && j.bustL && j.bustR) {
      const bCenters = [
        [-1, j.bustL.position.clone().add(V3(0, -0.008, -0.052)), u.breastPhysics.pressPush.L, 'cL'],
        [ 1, j.bustR.position.clone().add(V3(0, -0.008, -0.052)), u.breastPhysics.pressPush.R, 'cR']
      ];
      for (const [locPt, rad] of gunSamples) {
        const wPt = locPt.clone().applyQuaternion(_wQuat).add(V3(whX, whY, whZ));
        for (const [bSide, bPos, pushVec, cKey] of bCenters) {
          const delta = wPt.clone().sub(bPos);
          const dist = delta.length();
          const softRadius = 0.088 + rad;
          const hardRadius = 0.068 + rad * 0.65;
          if (dist < softRadius && dist > 1e-4) {
            const softPen = softRadius - dist;
            pushVec.z += softPen * 95;
            pushVec.y -= softPen * 32;
            pushVec.x -= bSide * softPen * 58;
            u.breastPhysics.pressPush[cKey] = Math.max(u.breastPhysics.pressPush[cKey], clamp(softPen * 14, 0, 1));

            const hardPen = Math.max(0, hardRadius - dist) + softPen * 0.45;
            const n = delta.divideScalar(dist);
            whZ += Math.min(-0.001, n.z) * hardPen * 0.95;
            whX += (n.x !== 0 ? Math.sign(n.x) : bSide) * Math.abs(n.x) * hardPen * 0.65;
            whY += Math.max(0, n.y) * hardPen * 0.35;
          }
        }
      }
    }

    for (const [locPt, rad] of gunSamples) {
      const wPt = locPt.clone().applyQuaternion(_wQuat).add(V3(whX, whY, whZ));
      if (wPt.z + rad > chestFrontLimit && wPt.x > -prof.chestW * 0.52 && wPt.x < prof.chestW * 0.52 && wPt.y > 0.02 && wPt.y < prof.chestH) {
        whZ -= (wPt.z + rad - chestFrontLimit);
      }
    }
  }

  u.weaponHolder.position.set(whX, whY, whZ);
  u.weaponHolder.rotation.set(whRotX, whRotY, whRotZ);

  _wMat.set(whRotX, whRotY, whRotZ);
  _wQuat.setFromEuler(_wMat);
  let rightTarget = V3(0.01, -0.035, 0.10).applyQuaternion(_wQuat).add(V3(whX, whY, whZ));
  let leftTarget = V3(-0.02, -0.035, -0.14).applyQuaternion(_wQuat).add(V3(whX, whY, whZ));

  if (reloadP >= 0 && !hideWeapon && !state.unarmed) {
    if (reloadP < 0.35) leftTarget.lerp(V3(whX - 0.02, whY - 0.14, whZ - 0.02), reloadP / 0.35);
    else if (reloadP < 0.65) leftTarget.lerp(V3(-0.18, -0.10, -0.06), Math.sin(((reloadP - 0.35) / 0.30) * Math.PI));
    else if (reloadP < 0.85) leftTarget.lerp(V3(whX - 0.02, whY - 0.12, whZ - 0.02), 1 - (reloadP - 0.65) / 0.20);
    else leftTarget.lerp(V3(whX - 0.05, whY + 0.03, whZ + 0.02), Math.sin(((reloadP - 0.85) / 0.15) * Math.PI));
  }
  if (meleeAge < 0.48 && !hideWeapon) {
    leftTarget.set(-prof.shoulderX - 0.04, 0.05, -0.10);
  }

  let poleR = V3(0.75, -1.0, -0.55);
  let poleL = V3(-0.85, -1.0, -0.55);
  if (pb > 0.2) {
    poleR.lerp(V3(0.75, 0.12, -1.0), pb);
    poleL.lerp(V3(-0.75, 0.12, -1.0), pb);
  }

  if (db > 0.35) {
    rightTarget.set(0.02, 0.04, -0.15);
    leftTarget.set(-0.22, prof.chestH + 0.06, -0.26);
    poleL.set(-0.75, 0.15, -1.0);
  } else if (rb > 0.35) {
    const press = Math.sin(now * 0.012) * 0.05;
    rightTarget.set(0.10, 0.06 + press, -0.38);
    leftTarget.set(-0.10, 0.06 + press, -0.38);
  } else if (cab > 0.35) {
    leftTarget.set(-0.16, prof.chestH + 0.08, -0.06);
    if (state.unarmed) rightTarget.set(prof.shoulderX + 0.04, 0.02, -0.08);
  } else if (cdb > 0.35) {
    rightTarget.set(0.14, 0.08, 0.20);
    leftTarget.set(-0.14, 0.08, 0.20);
    poleR.set(0.75, -0.5, -0.55);
    poleL.set(-0.75, -0.5, -0.55);
  } else if (state.unarmed) {
    const armPump = (0.18 * anim.walkBlend + 0.34 * anim.sprintBlend) * s;
    const armLiftR = Math.max(0, s) * 0.14 * anim.sprintBlend;
    const armLiftL = Math.max(0, -s) * 0.14 * anim.sprintBlend;
    const crawlReach = pb * crawlS * 0.22;
    rightTarget.set(prof.shoulderX + 0.04 - anim.sprintBlend * 0.06, 0.01 + armLiftR + pb * 0.26, -0.06 - armPump - crawlReach);
    leftTarget.set(-prof.shoulderX - 0.04 + anim.sprintBlend * 0.06, 0.01 + armLiftL + pb * 0.26, -0.06 + armPump + crawlReach);
  }

  keepArmTargetOutsideTorso(rightTarget, prof);
  keepArmTargetOutsideTorso(leftTarget, prof);
  solveArmIK(j.shoulderR, j.elbowR, rightTarget, prof.armL1, prof.armL2, 1, poleR);
  solveArmIK(j.shoulderL, j.elbowL, leftTarget, prof.armL1, prof.armL2, -1, poleL);

  if (cab > 0.5 && state.carriedTarget) {
    root.updateMatrixWorld(true);
    const carryPos = j.chest.localToWorld(V3(-0.04, prof.chestH + 0.12, 0.18));
    state.carriedTarget.position.copy(carryPos);
    state.carriedTarget.rotation.set(0, root.rotation.y + Math.PI * 0.5, 0);
  }

  // ---- 5. SOFT PUDDING BREAST PHYSICS + VISIBLE SQUASH & DEFORMATION ----
  const bp = u.breastPhysics;
  if (bp && j.bustL && j.bustR) {
    bp.step(physicsDt, j.chest);
    const applyPudding = (pivot, node, side) => {
      const comp = node.compress || 0;
      pivot.rotation.set(node.pos.y * 2.6 + node.pos.z * 1.1, -side * comp * 0.22, -node.pos.x * 2.3);
      const sz = clamp(1 - node.pos.z * 1.4 - comp * 0.34, 0.62, 1.22);
      const sy = clamp(1 + node.pos.y * 1.75 + comp * 0.18, 0.84, 1.26);
      const sx = clamp((1 / Math.sqrt(sy * sz)) + comp * 0.12, 0.87, 1.32);
      pivot.scale.set(sx, sy, sz);
    };
    applyPudding(j.bustL, bp.left, -1);
    applyPudding(j.bustR, bp.right, 1);
  }

  // ---- 5b. BUST TOUCHES THE FLOOR (prone / downed): flatten against it, never poke through ----
  if (bp && j.bustL && j.bustR) {
    root.updateMatrixWorld(true);
    updateBustContactSquash(u, physicsDt, (x, z) => (typeof floorY === 'function' ? floorY(x, z) : floorY));
  }

  // ---- 6. HIGH-DETAIL VERLET PHYSICS FOR HAIR STRANDS & CLOTH SHEETS ----
  if (u.dynamicStrands?.length || u.clothSheets?.length) {
    root.updateMatrixWorld(true);
    const colSpheres = buildBodyCollisionSpheres(j, prof);
    for (const st of u.dynamicStrands || []) { st.step(physicsDt, colSpheres, floorY); st.syncVisuals(); }
    for (const sh of u.clothSheets || []) { sh.tetherScale = 1; sh.step(physicsDt, colSpheres, floorY); sh.syncVisuals(); }
  }
}