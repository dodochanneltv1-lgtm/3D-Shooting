import * as THREE from 'three';

// ============================================================================
// SHARED BUILDER & ANIMATION HELPERS (ใช้ร่วมกันทุกอาวุธในไฟล์นี้)
// ============================================================================
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smoothstep = (u) => u * u * (3 - 2 * u);
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const addOffset = (base, dx = 0, dy = 0, dz = 0) => [base[0] + dx, base[1] + dy, base[2] + dz];

function evalKeyframes(p, frames) {
  if (p <= frames[0][0]) return frames[0].slice(1);
  for (let i = 1; i < frames.length; i++) {
    if (p <= frames[i][0]) {
      const A = frames[i - 1], B = frames[i];
      const t = smoothstep((p - A[0]) / (B[0] - A[0]));
      return A.slice(1).map((v, j) => v + (B[j + 1] - v) * t);
    }
  }
  return frames[frames.length - 1].slice(1);
}

const SHARED_MATS = {
  darkMetal: new THREE.MeshStandardMaterial({ color: 0x181b21, roughness: 0.36, metalness: 0.78 }),
  gunmetal:  new THREE.MeshStandardMaterial({ color: 0x353b45, roughness: 0.32, metalness: 0.82 }),
  steel:     new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.22, metalness: 0.90 }),
  chrome:    new THREE.MeshStandardMaterial({ color: 0xdbe3ec, roughness: 0.14, metalness: 0.94 }),
  polymer:   new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.76, metalness: 0.12 }),
  tan:       new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.58, metalness: 0.24 }),
  brass:     new THREE.MeshStandardMaterial({ color: 0xd4a437, roughness: 0.25, metalness: 0.88 }),
  copperTip: new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.35, metalness: 0.65 }),
  redShell:  new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.52, metalness: 0.08 }),
  glove:     new THREE.MeshStandardMaterial({ color: 0x1b1f27, roughness: 0.85 }),
  sleeve:    new THREE.MeshStandardMaterial({ color: 0x3b4a33, roughness: 0.90 }),
  smokeGlass:new THREE.MeshStandardMaterial({ color: 0x0b1220, transparent: true, opacity: 0.42, roughness: 0.2, depthWrite: false }),
  flash:     new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.92, depthWrite: false }),
  redDot:    new THREE.MeshBasicMaterial({ color: 0xff2a2a, depthTest: false, transparent: true })
};

function box(w, h, d, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  return m;
}

function cyl(rt, rb, len, seg, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, len, seg), mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  return m;
}

// Build rigged hands + sleeves + index finger
function attachOperatorHands(group, rigCfg, isLite) {
  if (isLite) return null;
  const mkHand = (isRight) => {
    const h = new THREE.Group();
    h.add(
      box(0.070, 0.050, 0.095, SHARED_MATS.glove),
      box(0.068, 0.026, 0.050, SHARED_MATS.glove, 0, -0.034, -0.035),
      box(0.020, 0.024, 0.055, SHARED_MATS.glove, isRight ? -0.043 : 0.043, 0.008, -0.030),
      box(0.082, 0.064, 0.050, SHARED_MATS.sleeve, 0, 0.004, 0.070)
    );
    return h;
  };
  const hR = mkHand(true);
  const hL = mkHand(false);
  const aR = box(0.085, 0.075, 1, SHARED_MATS.sleeve);
  const aL = box(0.085, 0.075, 1, SHARED_MATS.sleeve);
  const indexFinger = new THREE.Group();
  indexFinger.position.set(-0.012, -0.012, -0.040);
  indexFinger.add(box(0.014, 0.014, 0.050, SHARED_MATS.glove, 0, 0, -0.020));
  hR.add(indexFinger);

  if (rigCfg.oneHanded) {
    hL.visible = false;
    aL.visible = false;
  }
  group.add(hR, hL, aR, aL);
  return { hR, hL, aR, aL, indexFinger, anchors: { R: [0.20, -0.40, 0.55], L: [-0.22, -0.40, 0.50] } };
}

const _limbA = V3(0, 0, 0), _limbD = V3(0, 0, 0), _Z = V3(0, 0, 1);
function placeHands(hands, rightPos, leftPos) {
  if (!hands) return;
  const linkLimb = (mesh, hand, shoulder) => {
    _limbA.set(hand[0], hand[1] + 0.01, hand[2] + 0.06);
    _limbD.set(shoulder[0], shoulder[1], shoulder[2]).sub(_limbA);
    const len = _limbD.length();
    mesh.position.copy(_limbA).addScaledVector(_limbD, 0.5);
    mesh.scale.z = len;
    mesh.quaternion.setFromUnitVectors(_Z, _limbD.normalize());
  };
  hands.hR.position.set(rightPos[0], rightPos[1], rightPos[2]);
  hands.hL.position.set(leftPos[0], leftPos[1], leftPos[2]);
  linkLimb(hands.aR, rightPos, hands.anchors.R);
  if (hands.hL.visible) linkLimb(hands.aL, leftPos, hands.anchors.L);
}

// Mount standard attachments (Sights, Muzzle, Flashlight, Laser) onto any custom gun
function applyStandardAttachments(group, muzzleVec, mods, sightY, sightZ, attachmentData) {
  const mType = mods.muzzle || 'none';
  if (mType !== 'none') {
    const ext = mType === 'suppressor' ? 0.24 : mType === 'compensator' ? 0.08 : 0.05;
    const rad = mType === 'suppressor' ? 0.026 : 0.021;
    group.add(cyl(rad, rad, ext, 12, SHARED_MATS.darkMetal, 0, muzzleVec.y, muzzleVec.z - ext / 2, Math.PI / 2));
    muzzleVec.z -= ext;
  }

  const sightId = mods.sight || 'iron';
  if (sightId === 'red-dot') {
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.046, 0.05),
      new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false })
    );
    lens.position.set(0, sightY + 0.035, sightZ);
    const dot = cyl(0.0032, 0.0032, 0.002, 10, SHARED_MATS.redDot, 0, sightY + 0.035, sightZ, Math.PI / 2);
    dot.renderOrder = 10;
    group.add(
      box(0.050, 0.012, 0.070, SHARED_MATS.darkMetal, 0, sightY, sightZ),
      box(0.004, 0.055, 0.012, SHARED_MATS.darkMetal, -0.026, sightY + 0.035, sightZ),
      box(0.004, 0.055, 0.012, SHARED_MATS.darkMetal, 0.026, sightY + 0.035, sightZ),
      box(0.054, 0.004, 0.020, SHARED_MATS.darkMetal, 0, sightY + 0.064, sightZ),
      lens, dot
    );
    group.userData.adsY = -(sightY + 0.035);
  } else if (sightId !== 'iron') {
    group.add(
      cyl(0.024, 0.024, 0.24, 14, SHARED_MATS.darkMetal, 0, sightY + 0.035, sightZ, Math.PI / 2),
      cyl(0.030, 0.026, 0.04, 14, SHARED_MATS.steel, 0, sightY + 0.035, sightZ - 0.12, Math.PI / 2),
      cyl(0.028, 0.026, 0.04, 14, SHARED_MATS.steel, 0, sightY + 0.035, sightZ + 0.12, Math.PI / 2),
      box(0.036, 0.022, 0.12, SHARED_MATS.darkMetal, 0, sightY + 0.008, sightZ)
    );
    group.userData.adsY = -(sightY + 0.035);
  }

  if (mods.flashlight && mods.flashlight !== 'none' && attachmentData?.flashlights?.[mods.flashlight]) {
    const fl = attachmentData.flashlights[mods.flashlight];
    const light = new THREE.PointLight(fl.color, fl.intensity, fl.range, 2);
    light.position.set(0.055, muzzleVec.y - 0.04, muzzleVec.z + 0.22);
    group.add(box(0.032, 0.032, 0.11, SHARED_MATS.darkMetal, 0.055, muzzleVec.y - 0.04, muzzleVec.z + 0.26), light);
  }

  if (mods.laser && mods.laser !== 'none' && attachmentData?.lasers?.[mods.laser]) {
    const ls = attachmentData.lasers[mods.laser];
    const beam = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([V3(0, 0, 0), V3(0, 0, -14)]),
      new THREE.LineBasicMaterial({ color: ls.color, transparent: true, opacity: 0.62 })
    );
    beam.position.set(-0.048, muzzleVec.y - 0.03, muzzleVec.z + 0.15);
    group.add(box(0.022, 0.022, 0.045, new THREE.MeshBasicMaterial({ color: ls.color }), -0.048, muzzleVec.y - 0.03, muzzleVec.z + 0.19), beam);
  }
}

// Helper for stacked cartridges inside translucent magazines
function buildAmmoStack(magGroup, count, maxWidth, height, isPistol = false) {
  const col = new THREE.Group();
  const len = isPistol ? 0.020 : 0.032;
  const top = height * 0.42;
  const step = (height * 0.78) / Math.max(1, count - 1);
  const rounds = [];
  for (let i = 0; i < count; i++) {
    const r = new THREE.Group();
    r.add(
      cyl(0.007, 0.007, len, 8, SHARED_MATS.brass, 0, 0, 0, Math.PI / 2),
      cyl(0.005, 0.007, 0.014, 8, SHARED_MATS.copperTip, 0, 0, -len * 0.5 - 0.006, Math.PI / 2)
    );
    r.position.set((i % 2 ? 1 : -1) * Math.min(0.007, maxWidth * 0.18), top - i * step, 0);
    col.add(r);
    rounds.push(r);
  }
  const follower = box(maxWidth * 0.82, 0.008, 0.045, SHARED_MATS.steel);
  col.add(follower);
  magGroup.add(col);
  return { rounds, follower, top, step };
}


// ============================================================================
// WEAPON 1: HK416D Tactical (Gas-Piston AR + Dust Cover + Translucent Mag)
// ============================================================================
const WEAPON_HK416 = {
  id: 'hk416_tac',
  sounds: {
    fire: ['ak47.mp3', 'gun-shot-1-530788.mp3', 'gun-shot-2-530789.mp3', 'gun-shot-3-530790.mp3'],
    reload: 'm4a1-or-m16-reload-sound-84436.mp3',
    reloadEmpty: 'rifle-reload-sound-316890.mp3'
  },

  // ----- 1. ทำโมเดล -----
  buildModel(mods, isLite, attachmentData) {
    const g = new THREE.Group();
    const magGroup = new THREE.Group();
    const boltGroup = new THREE.Group();
    const chargingHandle = new THREE.Group();
    const dustCover = new THREE.Group();

    // Upper / Lower Receiver + Quad-Rail Handguard + Buffer Tube + Crane Stock
    g.add(
      box(0.068, 0.095, 0.34, SHARED_MATS.tan, 0, 0.01, 0.02),
      box(0.072, 0.048, 0.28, SHARED_MATS.darkMetal, 0, 0.038, -0.24), // Quad-rail shroud
      box(0.036, 0.016, 0.52, SHARED_MATS.darkMetal, 0, 0.068, -0.10), // Picatinny top rail
      cyl(0.014, 0.014, 0.42, 12, SHARED_MATS.steel, 0, 0.034, -0.44, Math.PI / 2), // Barrel
      box(0.042, 0.115, 0.052, SHARED_MATS.polymer, 0, -0.078, 0.11, 0.24), // Pistol grip
      cyl(0.022, 0.022, 0.22, 10, SHARED_MATS.darkMetal, 0, 0.025, 0.28, Math.PI / 2), // Buffer tube
      box(0.058, 0.125, 0.18, SHARED_MATS.tan, 0, -0.005, 0.34), // Crane stock
      box(0.034, 0.080, 0.036, SHARED_MATS.polymer, 0, -0.045, -0.22), // Vertical foregrip
      box(0.008, 0.028, 0.075, SHARED_MATS.polymer, 0.033, 0.028, -0.01) // Dark inner bolt recess
    );

    // Trigger
    const trigger = box(0.010, 0.030, 0.012, SHARED_MATS.steel, 0, -0.045, 0.06);
    g.add(trigger);

    // Bolt Carrier + Dust Cover Hinge + T-Charging Handle
    boltGroup.add(box(0.012, 0.024, 0.070, SHARED_MATS.chrome, 0.031, 0.028, -0.01));
    dustCover.position.set(0.037, 0.015, -0.01);
    dustCover.add(box(0.004, 0.028, 0.078, SHARED_MATS.darkMetal, 0, 0.014, 0));
    chargingHandle.position.set(0, 0.054, 0.16);
    chargingHandle.add(box(0.048, 0.014, 0.022, SHARED_MATS.darkMetal), box(0.016, 0.012, 0.12, SHARED_MATS.steel, 0, 0, -0.06));

    // Translucent Polymer Magazine with Visible Cartridges
    const magShell = box(0.044, 0.18, 0.074, isLite ? SHARED_MATS.polymer : SHARED_MATS.smokeGlass, 0, -0.11, -0.06, -0.12);
    magGroup.add(magShell);
    const ammoStack = isLite ? null : buildAmmoStack(magGroup, 10, 0.044, 0.16);
    if (ammoStack) magGroup.children[1].position.set(0, -0.11, -0.06);

    const muzzle = V3(0, 0.034, -0.65);
    applyStandardAttachments(g, muzzle, mods, 0.078, 0.02, attachmentData);

    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.085, 0), SHARED_MATS.flash);
    flashMesh.position.set(muzzle.x, muzzle.y, muzzle.z - 0.05);
    flashMesh.visible = false;

    g.add(magGroup, boltGroup, dustCover, chargingHandle, flashMesh);
    g.userData = {
      ...g.userData,
      magGroup,
      boltGroup,
      muzzle,
      flashMesh,
      parts: { trigger, dustCover, chargingHandle, ammoStack, dustOpen: false }
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.08, 0.11],
    leftGrip: [0, -0.06, -0.22],
    magWell: [0, -0.10, -0.06],
    charging: [0, 0.05, 0.18],
    ejectPoint: [0.05, 0.035, -0.01],
    oneHanded: false
  },

  animate(ctx) {
    const { rig, parts, hands, fa, rl, rlE, ammo, max, dt, eject } = ctx;
    let Lp = rig.leftGrip.slice();
    const Rp = rig.rightGrip.slice();

    // Trigger pull & Bolt blowback
    const trigPull = fa < 0.08 ? 1 : 0;
    parts.trigger.position.z = 0.06 + trigPull * 0.010;
    if (fa < 0.06) parts.dustOpen = true;
    parts.dustCover.rotation.z += ((parts.dustOpen ? -1.85 : 0) - parts.dustCover.rotation.z) * clamp(dt * 24);

    let boltBack = fa < 0.065 ? Math.sin((Math.PI * fa) / 0.065) * 0.068 : 0;
    if (ammo <= 0 && rl < 0) boltBack = 0.068; // Bolt lock back on empty

    let magY = 0, magZ = 0, magVis = true, chBack = 0, shownAmmo = ammo;
    if (rl >= 0) {
      [magY, magZ] = evalKeyframes(rl, [[0, 0, 0], [0.16, 0, 0], [0.35, -0.24, -0.02], [0.46, -0.50, -0.08], [0.56, -0.50, -0.08], [0.68, -0.28, -0.02], [0.78, 0, 0], [1, 0, 0]]);
      magVis = !(rl > 0.36 && rl < 0.54);
      if (rl > 0.58) shownAmmo = max;
      const PO = [-0.28, -0.45, 0.12];
      Lp = evalKeyframes(rl, [
        [0, ...rig.leftGrip],
        [0.14, ...addOffset(rig.magWell, 0, -0.04)],
        [0.35, ...addOffset(rig.magWell, 0, -0.28)],
        [0.46, ...PO], [0.56, ...PO],
        [0.68, ...addOffset(rig.magWell, 0, -0.28)],
        [0.78, ...addOffset(rig.magWell, 0, -0.04)],
        ...(rlE ? [[0.84, ...rig.charging], [0.91, ...addOffset(rig.charging, 0, 0, 0.08)], [0.96, ...rig.charging]] : [[0.9, ...rig.leftGrip]]),
        [1, ...rig.leftGrip]
      ]);
      if (rlE && rl >= 0.84 && rl <= 0.96) {
        chBack = evalKeyframes(rl, [[0.84, 0], [0.91, 0.085], [0.96, 0]])[0];
        boltBack = Math.max(boltBack, chBack * 0.85);
      }
    }

    ctx.boltGroup.position.z = boltBack;
    parts.chargingHandle.position.z = 0.16 + chBack;
    ctx.magGroup.position.set(0, magY, magZ);
    ctx.magGroup.visible = magVis;

    if (parts.ammoStack) {
      const n = clamp(Math.ceil((shownAmmo / Math.max(1, max)) * 10), shownAmmo > 0 ? 1 : 0, 10);
      parts.ammoStack.rounds.forEach((r, idx) => { r.visible = idx < n; });
      parts.ammoStack.follower.position.y = parts.ammoStack.top - (Math.max(1, n) - 1) * parts.ammoStack.step - 0.012;
    }

    if (hands) {
      hands.indexFinger.rotation.x = -trigPull * 0.55;
      placeHands(hands, Rp, Lp);
    }
    if (ctx.justFired) eject();
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 1,
    category: 'ไรเฟิลจู่โจมลูกสูบแก๊ส',
    name: 'HK416D Tactical',
    dmg: 35,
    rpm: 780,
    mag: 30,
    magsCount: 7,
    reloadTime: 2.1,
    spread: 0.010,
    recoil: 0.030,
    pellets: 1,
    auto: true,
    moveSpeed: 1.01,
    scope: false,
    color: 0x8b7355,
    desc: 'ลูกสูบแก๊สช่วงชักสั้น ยิงนิ่ง ฝาปิดคัดปลอกเด้งเปิดอัตโนมัติ'
  },
  ammo: { name: '5.56×45mm NATO', m: 0.0040, d: 0.00570, cd: 0.295, E: 2250, Lc: 0.30, twistOpt: 36 },
  gun:  { ammo: '556_hk', L: 0.368, twist: 7, rif: 'groove' },
  wclass: 'ar',
  attachmentSupport: {
    sights: ['iron', 'red-dot', '2x', '3x', '4x', 'v1-4', 'v2-6', 'smart-x4', 'thermal-x4'],
    mags: [30, 40, 50, 60, 100],
    barrels: ['standard', 'range', 'damage', 'precision'],
    grips: ['vertical', 'angled', 'rubber', 'handstop'],
    stocks: ['tactical', 'heavy', 'lightweight', 'precision'],
    muzzles: ['suppressor', 'compensator', 'flashHider'],
    triggers: ['standard', 'match', 'rapid'],
    flashlights: ['none', 'tactical', 'highPower'],
    lasers: ['none', 'red', 'green'],
    ammunition: ['standard', 'hollowPoint', 'armorPiercing']
  }
};


// ============================================================================
// WEAPON 2: M134D Vulcan Minigun (6-Barrel Rotary + Belt Feed + Heat Glow)
// ============================================================================
const WEAPON_MINIGUN = {
  id: 'm134_minigun',
  sounds: {
    fire: 'minigun-shot.mp3',
    reloadStart: 'gun-magazine-out.mp3',
    reloadInsert: 'mag-insert-1-395178.mp3',
    reloadAction: 'ammo-reload.mp3',
    reloadEmpty: 'rifle-reload-103528.mp3',
    overheat: 'minigun_overheat.mp3'
  },

  // ----- 1. ทำโมเดล -----
  buildModel(mods, isLite) {
    const g = new THREE.Group();
    const magGroup = new THREE.Group();
    const boltGroup = new THREE.Group();
    const barrelCluster = new THREE.Group();

    // Main Drive Motor Housing + Top Chainsaw Handle + Rear Spade Grips
    g.add(
      cyl(0.085, 0.085, 0.38, 14, SHARED_MATS.darkMetal, 0, -0.02, 0.05, Math.PI / 2),
      box(0.11, 0.03, 0.26, SHARED_MATS.steel, 0, 0.11, -0.04), // Top carry handle
      box(0.024, 0.09, 0.024, SHARED_MATS.darkMetal, 0, 0.06, -0.15),
      box(0.024, 0.09, 0.024, SHARED_MATS.darkMetal, 0, 0.06, 0.07),
      box(0.12, 0.08, 0.06, SHARED_MATS.polymer, 0, -0.02, 0.26) // Rear spade grip
    );

    // 6-Barrel Rotary Cluster
    barrelCluster.position.set(0, -0.02, -0.45);
    const hotBarrelsMat = SHARED_MATS.gunmetal.clone();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      barrelCluster.add(
        cyl(0.012, 0.012, 0.68, 8, hotBarrelsMat, Math.cos(a) * 0.044, Math.sin(a) * 0.044, 0, Math.PI / 2)
      );
    }
    // Barrel Clamp Discs
    for (const cz of [-0.26, 0.04, 0.24]) {
      barrelCluster.add(cyl(0.068, 0.068, 0.024, 14, SHARED_MATS.darkMetal, 0, 0, cz, Math.PI / 2));
    }
    g.add(barrelCluster);

    // Underslung Ammo Drum + Linked Belt Chute
    magGroup.add(cyl(0.11, 0.11, 0.22, 14, SHARED_MATS.tan, -0.12, -0.16, 0.02, 0, 0, Math.PI / 2));
    const beltGroup = new THREE.Group();
    const beltLinks = [];
    if (!isLite) {
      for (let i = 0; i < 8; i++) {
        const r = new THREE.Group();
        r.add(
          cyl(0.007, 0.007, 0.048, 8, SHARED_MATS.brass, 0, 0, 0, 0, Math.PI / 2),
          cyl(0.005, 0.007, 0.016, 8, SHARED_MATS.copperTip, 0.03, 0, 0, 0, 0, -Math.PI / 2),
          box(0.052, 0.006, 0.014, SHARED_MATS.steel, 0, -0.007, 0)
        );
        beltGroup.add(r);
        beltLinks.push(r);
      }
    }
    g.add(magGroup, boltGroup, beltGroup);

    const muzzle = V3(0, -0.02, -0.82);
    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.14, 0), SHARED_MATS.flash);
    flashMesh.position.set(muzzle.x, muzzle.y, muzzle.z - 0.06);
    flashMesh.visible = false;
    g.add(flashMesh);

    g.userData = {
      magGroup,
      boltGroup,
      muzzle,
      flashMesh,
      adsY: -0.14,
      parts: { barrelCluster, hotBarrelsMat, beltLinks, spinVel: 0, heat: 0, beltAdv: 0, shots: 0, lastAmmo: -1 }
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.02, 0.25],
    leftGrip: [0, 0.12, -0.04],
    magWell: [-0.12, -0.16, 0.02],
    ejectPoint: [0.09, -0.02, 0.02],
    oneHanded: false
  },

  animate(ctx) {
    const { rig, parts, hands, fa, rl, ammo, max, dt, eject } = ctx;
    const isFiring = fa < 0.09 && ammo > 0 && rl < 0;

    // Rotary Barrel Acceleration & Inertia Spin-Down + Barrel Heat Glow
    const targetVel = isFiring ? 34 : 0;
    parts.spinVel += (targetVel - parts.spinVel) * clamp(dt * (isFiring ? 14 : 2.8));
    parts.barrelCluster.rotation.z += parts.spinVel * dt;

    parts.heat = clamp(parts.heat + (isFiring ? dt * 0.35 : -dt * 0.18), 0, 1);
    parts.hotBarrelsMat.emissive.setRGB(parts.heat * 0.85, parts.heat * 0.22, 0);

    // Belt Feed Scrolling
    if (parts.lastAmmo < 0) parts.lastAmmo = ammo;
    if (ammo < parts.lastAmmo && rl < 0) parts.shots += parts.lastAmmo - ammo;
    parts.lastAmmo = ammo;
    parts.beltAdv += (parts.shots - parts.beltAdv) * clamp(dt * 22);
    parts.beltLinks.forEach((link, i) => {
      const q = ((i - parts.beltAdv) % 8 + 8) % 8;
      link.visible = q < Math.min(5.5, ammo) && !(rl > 0.35 && rl < 0.65);
      link.position.set(-0.08 - q * 0.01, -0.03 - q * 0.024, 0.02);
    });

    let Lp = rig.leftGrip.slice();
    let magY = 0;
    let magVis = true;
    if (rl >= 0) {
      [magY] = evalKeyframes(rl, [[0, 0], [0.25, -0.25], [0.45, -0.55], [0.55, -0.55], [0.80, 0], [1, 0]]);
      magVis = !(rl > 0.38 && rl < 0.54);
      Lp = evalKeyframes(rl, [[0, ...rig.leftGrip], [0.28, ...rig.magWell], [0.48, -0.32, -0.45, 0.12], [0.78, ...rig.magWell], [1, ...rig.leftGrip]]);
    }

    ctx.magGroup.position.y = magY;
    ctx.magGroup.visible = magVis;
    placeHands(hands, rig.rightGrip, Lp);
    if (ctx.justFired) eject();
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 1,
    category: 'ปืนกลหมุน 6 ลำกล้อง',
    name: 'M134D Vulcan',
    dmg: 26,
    rpm: 1500,
    mag: 200,
    magsCount: 2,
    reloadTime: 5.5,
    spread: 0.044,
    recoil: 0.026,
    pellets: 1,
    auto: true,
    moveSpeed: 0.72,
    scope: false,
    color: 0x1e293b,
    desc: '6 ลำกล้องหมุนยิงกดดัน 200 นัด สายกระสุนเลื่อนและลำกล้องร้อนแดง'
  },
  ammo: { name: '7.62×51mm Belt', m: 0.0095, d: 0.00782, cd: 0.30, E: 3500, Lc: 0.36, twistOpt: 28 },
  gun:  { ammo: '762_vulcan', L: 0.558, twist: 12, rif: 'groove' },
  wclass: 'lmg',
  attachmentSupport: {
    sights: ['iron'],
    mags: [200, 300],
    barrels: ['standard'],
    muzzles: ['none'],
    triggers: ['standard'],
    flashlights: ['none'],
    lasers: ['none', 'red', 'green'],
    ammunition: ['standard', 'armorPiercing']
  }
};


// ============================================================================
// WEAPON 3: Mossberg 590 Tactical (Pump-Action + Single Shell Feed)
// ============================================================================
const WEAPON_MOSSBERG = {
  id: 'm590_pump',
  sounds: {
    fire: 'shotgun.mp3',
    fireAction: 'shotgun-cocking-sound.mp3',
    fireActionDelay: 260,
    reload: 'ammo-reload.mp3',
    reloadAction: 'shotgun-cocking-sound.mp3'
  },

  // ----- 1. ทำโมเดล -----
  buildModel(mods, isLite, attachmentData) {
    const g = new THREE.Group();
    const magGroup = new THREE.Group();
    const boltGroup = new THREE.Group();
    const pumpForend = new THREE.Group();

    // Receiver + Stock + Barrel + Under-barrel Mag Tube
    g.add(
      box(0.070, 0.105, 0.30, SHARED_MATS.darkMetal, 0, 0.01, 0.04),
      box(0.056, 0.090, 0.30, SHARED_MATS.polymer, 0, -0.025, 0.32, 0.14), // Stock
      box(0.042, 0.100, 0.052, SHARED_MATS.polymer, 0, -0.075, 0.16, 0.25), // Grip
      cyl(0.017, 0.017, 0.52, 12, SHARED_MATS.steel, 0, 0.040, -0.36, Math.PI / 2), // Barrel
      cyl(0.015, 0.015, 0.48, 10, SHARED_MATS.darkMetal, 0, -0.005, -0.34, Math.PI / 2), // Mag tube
      box(0.008, 0.026, 0.072, SHARED_MATS.polymer, 0.034, 0.032, 0.01) // Port recess
    );

    // Chrome Bolt + Sliding Ribbed Forend Pump
    boltGroup.add(box(0.010, 0.024, 0.068, SHARED_MATS.chrome, 0.032, 0.032, 0.01));
    pumpForend.position.set(0, -0.005, -0.28);
    pumpForend.add(
      cyl(0.028, 0.028, 0.19, 12, SHARED_MATS.polymer, 0, 0, 0, Math.PI / 2),
      box(0.056, 0.020, 0.16, SHARED_MATS.darkMetal, 0, -0.012, 0)
    );

    // Single Red 12-Gauge Shell for Reload Animation
    const shell = new THREE.Group();
    shell.add(
      cyl(0.011, 0.011, 0.036, 10, SHARED_MATS.redShell, 0, 0, 0, Math.PI / 2),
      cyl(0.0115, 0.0115, 0.014, 10, SHARED_MATS.brass, 0, 0, 0.024, Math.PI / 2)
    );
    shell.visible = false;

    const trigger = box(0.010, 0.028, 0.012, SHARED_MATS.steel, 0, -0.045, 0.11);
    const muzzle = V3(0, 0.040, -0.63);
    applyStandardAttachments(g, muzzle, mods, 0.068, 0.02, attachmentData);

    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.11, 0), SHARED_MATS.flash);
    flashMesh.position.set(muzzle.x, muzzle.y, muzzle.z - 0.06);
    flashMesh.visible = false;

    g.add(magGroup, boltGroup, pumpForend, shell, trigger, flashMesh);
    g.userData = {
      ...g.userData,
      magGroup,
      boltGroup,
      muzzle,
      flashMesh,
      parts: { pumpForend, shell, trigger, ejectedThisShot: false }
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.075, 0.16],
    leftGrip: [0, -0.020, -0.28],
    loadGate: [0, -0.065, 0.04],
    ejectPoint: [0.05, 0.032, 0.01],
    oneHanded: false
  },

  animate(ctx) {
    const { rig, parts, hands, fa, rl, rlN = 1, rlMs = 480, dur, eject } = ctx;
    const trigPull = fa < 0.08 ? 1 : 0;
    parts.trigger.position.z = 0.11 + trigPull * 0.010;

    let Lp = rig.leftGrip.slice();
    let pumpZ = 0;
    let shellPos = null;

    if (rl >= 0) {
      const elapsed = rl * dur;
      if (elapsed < rlN * rlMs) {
        const idx = Math.floor(elapsed / rlMs);
        const u = (elapsed - idx * rlMs) / rlMs;
        const PO = [-0.26, -0.42, 0.10];
        Lp = evalKeyframes(u, [
          [0, ...addOffset(rig.loadGate, 0, -0.06)],
          [0.28, ...PO], [0.38, ...PO],
          [0.72, ...addOffset(rig.loadGate, 0, -0.08)],
          [0.85, ...rig.loadGate],
          [1, ...addOffset(rig.loadGate, 0, -0.06)]
        ]);
        if (idx === 0) Lp = lerp3(rig.leftGrip, Lp, smoothstep(clamp(u / 0.25)));
        if (u > 0.28 && u < 0.86) {
          shellPos = u < 0.72 ? addOffset(Lp, 0, 0.015, -0.02) : lerp3(addOffset(Lp, 0, 0.015, -0.02), rig.loadGate, (u - 0.72) / 0.14);
        }
      } else {
        // Final rack-pump cycle after inserting shells
        const q = clamp((elapsed - rlN * rlMs) / 450);
        pumpZ = evalKeyframes(q, [[0, 0], [0.45, 0.13], [0.60, 0.13], [1, 0]])[0];
        Lp = lerp3(addOffset(rig.loadGate, 0, -0.06), addOffset(rig.leftGrip, 0, 0, pumpZ), smoothstep(clamp(q / 0.2)));
      }
    } else {
      // Manual pump cycle right after firing
      const q = (fa - 0.14) / 0.48;
      if (q >= 0 && q < 1) {
        pumpZ = evalKeyframes(q, [[0, 0], [0.45, 0.13], [0.58, 0.13], [1, 0]])[0];
        Lp = addOffset(rig.leftGrip, 0, 0, pumpZ);
        if (q > 0.45 && !parts.ejectedThisShot) {
          parts.ejectedThisShot = true;
          eject();
        }
      }
      if (fa < 0.1) parts.ejectedThisShot = false;
    }

    parts.pumpForend.position.z = -0.28 + pumpZ;
    ctx.boltGroup.position.z = pumpZ * 0.65;
    parts.shell.visible = !!shellPos;
    if (shellPos) parts.shell.position.set(shellPos[0], shellPos[1], shellPos[2]);

    if (hands) {
      hands.indexFinger.rotation.x = -trigPull * 0.55;
      placeHands(hands, rig.rightGrip, Lp);
    }
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 1,
    category: 'ลูกซองปั๊มแอคชั่น',
    name: 'Mossberg 590 Tactical',
    dmg: 22,
    rpm: 72,
    mag: 8,
    reserveShells: 48,
    reloadPerShell: 0.46,
    shellByShell: true,
    spread: 0.064,
    recoil: 0.36,
    pellets: 8,
    auto: false,
    moveSpeed: 0.98,
    scope: false,
    color: 0x262930,
    desc: 'ปั๊มแอคชั่น 8 นัด ป้อนกระสุนทีละนัด หยุดรีโหลดยิงสวนได้ทันที'
  },
  ammo: { name: '12ga 00 Buckshot', m: 0.00351, d: 0.00840, cd: 0.46, E: 395, Lc: 0.25, twistOpt: 0 },
  gun:  { ammo: '12g_590', L: 0.508, twist: 0, rif: 'smooth' },
  wclass: 'sg',
  attachmentSupport: {
    sights: ['iron', 'red-dot', '2x'],
    mags: [8, 10, 12],
    barrels: ['standard', 'range'],
    muzzles: ['none', 'compensator'],
    triggers: ['standard', 'match'],
    flashlights: ['none', 'tactical', 'highPower'],
    lasers: ['none', 'red', 'green'],
    ammunition: ['standard', 'hollowPoint']
  }
};


// ============================================================================
// WEAPON 4: CheyTac M200 Pro (4-Stage Bolt-Action + Fluted Barrel + Bipod)
// ============================================================================
const WEAPON_M200 = {
  id: 'cheytac_m200_pro',
  sounds: {
    fire: ['sniper-rifle-firing-2-39885.mp3', 'shot-rifle-39-mm-37542.mp3'],
    fireAction: 'sniper-reload.mp3',
    fireActionDelay: 280,
    reloadStart: 'gun-magazine-out.mp3',
    reloadInsert: 'mag-insert-1-395178.mp3',
    reloadAction: 'sniper-reload.mp3'
  },

  // ----- 1. ทำโมเดล -----
  buildModel(mods, isLite, attachmentData) {
    const g = new THREE.Group();
    const magGroup = new THREE.Group();
    const boltGroup = new THREE.Group();

    // Chassis + Collapsible Stock + Carry Handle + Fluted Barrel + Muzzle Brake
    g.add(
      box(0.068, 0.098, 0.56, SHARED_MATS.tan, 0, -0.01, 0.06),
      box(0.054, 0.072, 0.28, SHARED_MATS.darkMetal, 0, 0.005, 0.46), // Adjustable stock
      box(0.048, 0.036, 0.14, SHARED_MATS.polymer, 0, 0.056, 0.44), // Cheek rest
      cyl(0.018, 0.022, 0.80, 12, SHARED_MATS.darkMetal, 0, 0.042, -0.58, Math.PI / 2), // Heavy fluted barrel
      box(0.054, 0.044, 0.095, SHARED_MATS.steel, 0, 0.042, -1.00), // Tank-style muzzle brake
      box(0.044, 0.115, 0.056, SHARED_MATS.polymer, 0, -0.082, 0.24, 0.20), // Grip
      // Folded Bipod Legs
      cyl(0.008, 0.008, 0.28, 8, SHARED_MATS.steel, -0.045, -0.045, -0.44, Math.PI / 2),
      cyl(0.008, 0.008, 0.28, 8, SHARED_MATS.steel, 0.045, -0.045, -0.44, Math.PI / 2)
    );

    // 4-Stage Rotating Bolt Assembly
    boltGroup.position.set(0, 0.042, 0.05);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.016, 10, 8), SHARED_MATS.darkMetal);
    knob.position.set(0.086, 0, 0);
    boltGroup.add(
      cyl(0.012, 0.012, 0.20, 10, SHARED_MATS.chrome, 0, 0, 0, Math.PI / 2),
      cyl(0.006, 0.006, 0.078, 8, SHARED_MATS.steel, 0.042, 0, 0, 0, 0, Math.PI / 2),
      knob
    );

    // Detachable Box Magazine (.408 CheyTac visible rounds)
    magGroup.add(box(0.048, 0.13, 0.105, isLite ? SHARED_MATS.darkMetal : SHARED_MATS.smokeGlass, 0, -0.10, -0.04));
    const ammoStack = isLite ? null : buildAmmoStack(magGroup, 7, 0.048, 0.11);
    if (ammoStack) magGroup.children[1].position.set(0, -0.10, -0.04);

    const trigger = box(0.010, 0.030, 0.012, SHARED_MATS.steel, 0, -0.050, 0.18);
    const muzzle = V3(0, 0.042, -1.04);
    applyStandardAttachments(g, muzzle, mods, 0.072, -0.04, attachmentData);

    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), SHARED_MATS.flash);
    flashMesh.position.set(muzzle.x, muzzle.y, muzzle.z - 0.07);
    flashMesh.visible = false;

    g.add(magGroup, boltGroup, trigger, flashMesh);
    g.userData = {
      ...g.userData,
      magGroup,
      boltGroup,
      muzzle,
      flashMesh,
      parts: { trigger, ammoStack, ejectedThisShot: false }
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.075, 0.24],
    leftGrip: [0, -0.055, -0.20],
    magWell: [0, -0.10, -0.04],
    ejectPoint: [0.05, 0.048, 0.04],
    manualBolt: true,
    oneHanded: false
  },

  animate(ctx) {
    const { rig, parts, hands, fa, rl, ammo, max, scoped, eject } = ctx;
    const trigPull = fa < 0.08 ? 1 : 0;
    parts.trigger.position.z = 0.18 + trigPull * 0.010;

    let Rp = rig.rightGrip.slice();
    let Lp = rig.leftGrip.slice();
    let magY = 0, magZ = 0, magVis = true, boltLift = 0, boltPull = 0, shownAmmo = ammo;

    // 4-Stage Bolt Action Cycle (on fire or end of reload)
    let bPhase = -1;
    if (rl >= 0.78) bPhase = (rl - 0.78) / 0.22;
    else if (rl < 0 && fa > 0.18 && fa < 1.05 && !scoped) bPhase = (fa - 0.18) / 0.87;

    if (bPhase >= 0 && bPhase < 1) {
      boltLift = evalKeyframes(bPhase, [[0, 0], [0.22, 1], [0.78, 1], [0.92, 0], [1, 0]])[0];
      boltPull = evalKeyframes(bPhase, [[0, 0], [0.22, 0], [0.50, 0.12], [0.58, 0.12], [0.80, 0], [1, 0]])[0];
      const handToBolt = evalKeyframes(bPhase, [[0, 0], [0.12, 1], [0.92, 1], [1, 0]])[0];
      Rp = lerp3(Rp, [Math.cos(boltLift * 1.1) * 0.086, 0.032 + Math.sin(boltLift * 1.1) * 0.086, 0.05 + boltPull], handToBolt);
      if (bPhase > 0.50 && !parts.ejectedThisShot && rl < 0) {
        parts.ejectedThisShot = true;
        eject();
      }
    }
    if (fa < 0.12) parts.ejectedThisShot = false;

    if (rl >= 0) {
      [magY, magZ] = evalKeyframes(rl, [[0, 0, 0], [0.16, 0, 0], [0.34, -0.22, -0.02], [0.46, -0.48, -0.08], [0.56, -0.48, -0.08], [0.70, 0, 0], [1, 0, 0]]);
      magVis = !(rl > 0.36 && rl < 0.54);
      if (rl > 0.58) shownAmmo = max;
      const PO = [-0.28, -0.44, 0.10];
      Lp = evalKeyframes(rl, [[0, ...rig.leftGrip], [0.28, ...rig.magWell], [0.46, ...PO], [0.56, ...PO], [0.72, ...rig.magWell], [0.82, ...rig.leftGrip], [1, ...rig.leftGrip]]);
    }

    ctx.boltGroup.position.z = 0.05 + boltPull;
    ctx.boltGroup.rotation.z = boltLift * 1.1;
    ctx.magGroup.position.set(0, magY, magZ);
    ctx.magGroup.visible = magVis;

    if (parts.ammoStack) {
      const n = clamp(Math.ceil((shownAmmo / Math.max(1, max)) * 7), shownAmmo > 0 ? 1 : 0, 7);
      parts.ammoStack.rounds.forEach((r, i) => { r.visible = i < n; });
      parts.ammoStack.follower.position.y = parts.ammoStack.top - (Math.max(1, n) - 1) * parts.ammoStack.step - 0.012;
    }

    if (hands) {
      hands.indexFinger.rotation.x = -trigPull * 0.55;
      placeHands(hands, Rp, Lp);
    }
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 1,
    category: 'สไนเปอร์ลูกเลื่อน 4 จังหวะ',
    name: 'CheyTac M200 Pro',
    dmg: 128,
    rpm: 42,
    mag: 7,
    magsCount: 6,
    reloadTime: 2.8,
    boltCycle: 1.05,
    spread: 0.0005,
    hipSpread: 0.085,
    recoil: 1.25,
    pellets: 1,
    auto: false,
    moveSpeed: 0.80,
    scope: true,
    color: 0x8b7355,
    desc: 'ลูกเลื่อน 4 จังหวะสมจริง กระสุน .408 CheyTac ยิงไกลแม่นยำสูงสุด'
  },
  ammo: { name: '.408 CheyTac', m: 0.0272, d: 0.01040, cd: 0.275, E: 14500, Lc: 0.45, twistOpt: 32 },
  gun:  { ammo: '408ct_pro', L: 0.762, twist: 13, rif: 'groove' },
  wclass: 'sr',
  attachmentSupport: {
    sights: ['iron', '4x', '8x', '12x', 'v4-12', 'v8-32', 'rangefinder', 'smart-x6', 'smart-x8-32', 'thermal-x4'],
    mags: [7, 10, 14],
    barrels: ['standard', 'range', 'damage', 'precision'],
    grips: ['vertical', 'angled', 'handstop'],
    stocks: ['tactical', 'heavy', 'precision'],
    muzzles: ['suppressor', 'compensator', 'flashHider'],
    triggers: ['standard', 'match'],
    flashlights: ['none', 'tactical'],
    lasers: ['none', 'red', 'green'],
    ammunition: ['standard', 'armorPiercing']
  }
};


// ============================================================================
// WEAPON 5: Colt Python .357 (Indexing 6-Shot Cylinder + Swing-Out Reload)
// ============================================================================
const WEAPON_PYTHON = {
  id: 'python_357',
  sounds: {
    fire: ['single-pistol-gunshot.mp3', '9mm-pistol-shot.mp3'],
    reload: 'gunreload_9-92134.mp3',
    reloadEmpty: '9mm-pistol-load-and-chamber.mp3',
    reloadAction: 'pistol-cock-6014.mp3'
  },

  // ----- 1. ทำโมเดล -----
  buildModel(mods, isLite, attachmentData) {
    const g = new THREE.Group();
    const magGroup = new THREE.Group(); // Acts as swing-out crane pivot!
    const boltGroup = new THREE.Group();
    const cylinderGroup = new THREE.Group();

    // Frame + Grip + Ventilated Rib Barrel + Underlug
    g.add(
      box(0.034, 0.056, 0.14, SHARED_MATS.chrome, 0, 0.012, 0.02),
      box(0.036, 0.115, 0.058, SHARED_MATS.tan, 0, -0.055, 0.075, 0.28), // Walnut grip
      cyl(0.011, 0.011, 0.19, 10, SHARED_MATS.chrome, 0, 0.042, -0.14, Math.PI / 2), // Barrel
      box(0.022, 0.028, 0.19, SHARED_MATS.chrome, 0, 0.024, -0.14), // Full underlug
      box(0.014, 0.012, 0.19, SHARED_MATS.chrome, 0, 0.056, -0.14) // Vent rib
    );

    // Swing-Out Crane Hinge (Left side at x = -0.022)
    magGroup.position.set(-0.022, 0.026, -0.01);
    cylinderGroup.position.set(0.022, 0, 0);
    cylinderGroup.add(cyl(0.025, 0.025, 0.056, 12, SHARED_MATS.chrome, 0, 0, 0, Math.PI / 2));

    // 6 Visible Cartridges in Chambers!
    const rounds = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const r = cyl(0.0055, 0.0055, 0.058, 8, SHARED_MATS.brass, Math.cos(a) * 0.015, Math.sin(a) * 0.015, 0, Math.PI / 2);
      cylinderGroup.add(r);
      rounds.push(r);
    }
    magGroup.add(cylinderGroup);

    // Hammer & Trigger
    const hammer = new THREE.Group();
    hammer.position.set(0, 0.038, 0.068);
    hammer.add(box(0.008, 0.024, 0.016, SHARED_MATS.steel, 0, 0.01, -0.005));
    const trigger = box(0.008, 0.026, 0.010, SHARED_MATS.steel, 0, -0.025, 0.022);

    const muzzle = V3(0, 0.042, -0.24);
    applyStandardAttachments(g, muzzle, mods, 0.064, -0.02, attachmentData);

    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), SHARED_MATS.flash);
    flashMesh.position.set(muzzle.x, muzzle.y, muzzle.z - 0.05);
    flashMesh.visible = false;

    g.add(magGroup, boltGroup, hammer, trigger, flashMesh);
    g.userData = {
      ...g.userData,
      magGroup,
      boltGroup,
      muzzle,
      flashMesh,
      parts: { cylinderGroup, rounds, hammer, trigger, cylAngle: 0, shotsSeen: 0, lastAmmo: -1 }
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.062, 0.07],
    leftGrip: [-0.015, -0.082, 0.06],
    oneHanded: false
  },

  animate(ctx) {
    const { rig, parts, hands, fa, rl, ammo, dt } = ctx;
    const trigPull = fa < 0.09 ? 1 : 0;
    parts.trigger.position.z = 0.022 + trigPull * 0.008;
    parts.hammer.rotation.x = fa < 0.08 ? -0.95 * (1 - fa / 0.08) : 0;

    // Rotate 6-Shot Cylinder 60° (PI/3) on Every Shot
    if (parts.lastAmmo < 0) parts.lastAmmo = ammo;
    if (ammo < parts.lastAmmo && rl < 0) parts.shotsSeen += (parts.lastAmmo - ammo);
    parts.lastAmmo = ammo;
    const targetRot = parts.shotsSeen * (Math.PI / 3);
    parts.cylAngle += (targetRot - parts.cylAngle) * clamp(dt * 26);
    parts.cylinderGroup.rotation.z = parts.cylAngle;

    let swing = 0, cylDropZ = 0, shown = ammo;
    let Lp = rig.leftGrip.slice();
    if (rl >= 0) {
      swing = evalKeyframes(rl, [[0, 0], [0.18, 1.35], [0.80, 1.35], [0.92, 0], [1, 0]])[0];
      cylDropZ = evalKeyframes(rl, [[0, 0], [0.22, 0], [0.35, 0.035], [0.50, 0], [1, 0]])[0];
      if (rl > 0.56) shown = 6;
      const PO = [-0.24, -0.38, 0.06];
      Lp = evalKeyframes(rl, [[0, ...rig.leftGrip], [0.22, -0.07, 0.02, -0.01], [0.46, ...PO], [0.64, -0.07, 0.02, -0.01], [0.92, ...rig.leftGrip], [1, ...rig.leftGrip]]);
    }

    ctx.magGroup.rotation.z = swing;
    parts.cylinderGroup.position.z = cylDropZ;
    parts.rounds.forEach((r, idx) => { r.visible = rl < 0 ? true : (rl > 0.42 && rl < 0.56 ? false : idx < shown); });

    if (hands) {
      hands.indexFinger.rotation.x = -trigPull * 0.55;
      placeHands(hands, rig.rightGrip, Lp);
    }
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 2,
    category: 'ปืนลูกโม่ .357 Magnum',
    name: 'Colt Python .357',
    dmg: 62,
    rpm: 135,
    mag: 6,
    magsCount: 8,
    reloadTime: 2.7,
    spread: 0.012,
    recoil: 0.058,
    pellets: 1,
    auto: false,
    moveSpeed: 1.05,
    scope: false,
    color: 0xdbe3ec,
    desc: 'ลูกโม่ 6 นัด หมุนโม่ทุกนัดที่ยิง และเหวี่ยงโม่คายปลอกเวลาเปลี่ยนกระสุน'
  },
  ammo: { name: '.357 Magnum', m: 0.0102, d: 0.00907, cd: 0.36, E: 1150, Lc: 0.14, twistOpt: 34 },
  gun:  { ammo: '357_mag', L: 0.152, twist: 14, rif: 'groove' },
  wclass: 'pistol',
  attachmentSupport: {
    sights: ['iron', 'red-dot', '2x'],
    mags: [6],
    barrels: ['standard', 'damage'],
    muzzles: ['none'],
    triggers: ['standard', 'match'],
    flashlights: ['none', 'tactical'],
    lasers: ['none', 'red', 'green'],
    ammunition: ['standard', 'hollowPoint', 'armorPiercing']
  }
};


// ============================================================================
// WEAPON 6: HK UMP-45 Tactical (Blowback SMG + Signature "HK Slap" Reload!)
// ============================================================================
const WEAPON_UMP45 = {
  id: 'ump45_tac',
  sounds: {
    fire: 'gunshot-352466.mp3',
    reload: 'gun-reload-2-511308.mp3',
    reloadEmpty: 'rifle-reload-103528.mp3',
    reloadAction: 'pistol-cock-6014.mp3'
  },

  // ----- 1. ทำโมเดล -----
  buildModel(mods, isLite, attachmentData) {
    const g = new THREE.Group();
    const magGroup = new THREE.Group();
    const boltGroup = new THREE.Group();
    const chargingHandle = new THREE.Group();

    // Polymer Receiver + Folding Skeleton Stock + Foregrip
    g.add(
      box(0.066, 0.11, 0.38, SHARED_MATS.polymer, 0, 0.005, 0.02),
      box(0.056, 0.04, 0.24, SHARED_MATS.darkMetal, 0, 0.02, 0.30), // Folding stock top bar
      box(0.044, 0.10, 0.042, SHARED_MATS.polymer, 0, -0.02, 0.40), // Buttpad
      cyl(0.014, 0.014, 0.24, 10, SHARED_MATS.steel, 0, 0.028, -0.26, Math.PI / 2),
      box(0.042, 0.11, 0.050, SHARED_MATS.polymer, 0, -0.085, 0.12, 0.22),
      box(0.032, 0.075, 0.032, SHARED_MATS.polymer, 0, -0.065, -0.18) // Vertical grip
    );

    boltGroup.add(box(0.014, 0.024, 0.065, SHARED_MATS.steel, 0.029, 0.028, -0.03));

    // Left-Front HK Charging Handle Slot (for HK Slap!)
    chargingHandle.position.set(-0.038, 0.038, -0.18);
    chargingHandle.add(cyl(0.007, 0.007, 0.034, 8, SHARED_MATS.steel, -0.014, 0, 0, 0, 0, Math.PI / 2));

    // Straight .45 ACP Magazine with Visible Rounds
    magGroup.add(box(0.040, 0.22, 0.056, isLite ? SHARED_MATS.polymer : SHARED_MATS.smokeGlass, 0, -0.14, -0.05));
    const ammoStack = isLite ? null : buildAmmoStack(magGroup, 10, 0.040, 0.19, true);
    if (ammoStack) magGroup.children[1].position.set(0, -0.14, -0.05);

    const trigger = box(0.010, 0.028, 0.012, SHARED_MATS.steel, 0, -0.048, 0.07);
    const muzzle = V3(0, 0.028, -0.38);
    applyStandardAttachments(g, muzzle, mods, 0.070, 0.0, attachmentData);

    const flashMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), SHARED_MATS.flash);
    flashMesh.position.set(muzzle.x, muzzle.y, muzzle.z - 0.05);
    flashMesh.visible = false;

    g.add(magGroup, boltGroup, chargingHandle, trigger, flashMesh);
    g.userData = {
      ...g.userData,
      magGroup,
      boltGroup,
      muzzle,
      flashMesh,
      parts: { trigger, chargingHandle, ammoStack }
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.085, 0.12],
    leftGrip: [0, -0.065, -0.18],
    magWell: [0, -0.12, -0.05],
    hkHandle: [-0.055, 0.038, -0.18],
    ejectPoint: [0.048, 0.032, -0.03],
    oneHanded: false
  },

  animate(ctx) {
    const { rig, parts, hands, fa, rl, rlE, ammo, max, eject } = ctx;
    const trigPull = fa < 0.07 ? 1 : 0;
    parts.trigger.position.z = 0.07 + trigPull * 0.010;

    let boltBack = fa < 0.06 ? Math.sin((Math.PI * fa) / 0.06) * 0.055 : 0;
    let magY = 0, magVis = true, chZ = -0.18, chRot = 0, shown = ammo;
    let Lp = rig.leftGrip.slice();

    if (rl >= 0) {
      [magY] = evalKeyframes(rl, [[0, 0], [0.22, 0], [0.36, -0.25], [0.46, -0.52], [0.56, -0.52], [0.72, 0], [1, 0]]);
      magVis = !(rl > 0.36 && rl < 0.54);
      if (rl > 0.56) shown = max;
      const PO = [-0.26, -0.44, 0.10];

      // HK Slap Reload Sequence! (Lock handle up first on empty -> swap mag -> SLAP handle down!)
      if (rlE) {
        Lp = evalKeyframes(rl, [
          [0, ...rig.leftGrip],
          [0.08, ...rig.hkHandle],
          [0.16, ...addOffset(rig.hkHandle, 0, 0.02, 0.06)], // pull & lock up
          [0.24, ...rig.magWell],
          [0.44, ...PO], [0.54, ...PO],
          [0.70, ...rig.magWell],
          [0.82, ...addOffset(rig.hkHandle, -0.04, 0.08, 0.04)], // wind up hand
          [0.89, ...addOffset(rig.hkHandle, 0, -0.02, 0.04)], // SLAP DOWN!
          [1, ...rig.leftGrip]
        ]);
        chZ = evalKeyframes(rl, [[0, -0.18], [0.08, -0.18], [0.16, -0.12], [0.87, -0.12], [0.91, -0.18], [1, -0.18]])[0];
        chRot = evalKeyframes(rl, [[0, 0], [0.14, 0], [0.18, 0.55], [0.87, 0.55], [0.91, 0], [1, 0]])[0];
        if (rl > 0.16 && rl < 0.90) boltBack = 0.058;
      } else {
        Lp = evalKeyframes(rl, [[0, ...rig.leftGrip], [0.22, ...rig.magWell], [0.46, ...PO], [0.56, ...PO], [0.74, ...rig.magWell], [1, ...rig.leftGrip]]);
      }
    }

    ctx.boltGroup.position.z = boltBack;
    parts.chargingHandle.position.z = chZ;
    parts.chargingHandle.rotation.z = chRot;
    ctx.magGroup.position.y = magY;
    ctx.magGroup.visible = magVis;

    if (parts.ammoStack) {
      const n = clamp(Math.ceil((shown / Math.max(1, max)) * 10), shown > 0 ? 1 : 0, 10);
      parts.ammoStack.rounds.forEach((r, idx) => { r.visible = idx < n; });
      parts.ammoStack.follower.position.y = parts.ammoStack.top - (Math.max(1, n) - 1) * parts.ammoStack.step - 0.012;
    }

    if (hands) {
      hands.indexFinger.rotation.x = -trigPull * 0.55;
      placeHands(hands, rig.rightGrip, Lp);
    }
    if (ctx.justFired) eject();
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 1,
    category: 'ปืนกลมือ .45 ACP (HK Slap)',
    name: 'HK UMP-45 Tactical',
    dmg: 31,
    rpm: 620,
    mag: 25,
    magsCount: 8,
    reloadTime: 2.2,
    spread: 0.019,
    recoil: 0.024,
    pellets: 1,
    auto: true,
    moveSpeed: 1.09,
    scope: false,
    color: 0x181b21,
    desc: 'กระสุน .45 ACP แรงหยุดยั้งสูง รีโหลดตบคันรั้ง HK Slap'
  },
  ammo: { name: '.45 ACP', m: 0.0149, d: 0.01143, cd: 0.37, E: 840, Lc: 0.14, twistOpt: 35 },
  gun:  { ammo: '45acp_ump', L: 0.200, twist: 16, rif: 'groove' },
  wclass: 'smg',
  attachmentSupport: {
    sights: ['iron', 'red-dot', '2x', '3x'],
    mags: [25, 35, 50],
    barrels: ['standard', 'range', 'damage'],
    grips: ['vertical', 'angled', 'handstop'],
    stocks: ['tactical', 'lightweight'],
    muzzles: ['suppressor', 'compensator', 'flashHider'],
    triggers: ['standard', 'match', 'rapid'],
    flashlights: ['none', 'tactical', 'highPower'],
    lasers: ['none', 'red', 'green'],
    ammunition: ['standard', 'hollowPoint', 'armorPiercing']
  }
};


// ============================================================================
// WEAPON 7: Tactical Katana (อาวุธประชิดละเอียด)
// ============================================================================
const WEAPON_KATANA = {
  id: 'katana_edge',
  sounds: { melee: 'melee-swish' },

  // ----- 1. ทำโมเดล -----
  buildModel() {
    const g = new THREE.Group();
    const magGroup = new THREE.Group();
    const boltGroup = new THREE.Group();

    // Wrapped Tsuka Hilt + Brass Tsuba Guard + Curved Steel Blade
    g.add(
      box(0.026, 0.032, 0.22, SHARED_MATS.polymer, 0, -0.02, 0.08), // Tsuka handle
      cyl(0.036, 0.036, 0.010, 12, SHARED_MATS.brass, 0, -0.02, -0.03, Math.PI / 2), // Tsuba guard
      box(0.008, 0.030, 0.46, SHARED_MATS.chrome, 0, -0.014, -0.26, -0.035), // Blade body
      box(0.005, 0.018, 0.12, SHARED_MATS.steel, 0, -0.002, -0.52, -0.14) // Kissaki tip
    );

    const flashMesh = new THREE.Mesh(new THREE.BoxGeometry(0.001, 0.001, 0.001), SHARED_MATS.flash);
    flashMesh.visible = false;
    g.add(magGroup, boltGroup, flashMesh);

    g.userData = {
      magGroup,
      boltGroup,
      muzzle: V3(0, 0, -0.50),
      flashMesh,
      parts: {}
    };
    return g;
  },

  // ----- 2. อนิเมชั่น -----
  rig: {
    rightGrip: [0, -0.02, 0.08],
    leftGrip: [0, -0.02, 0.08],
    oneHanded: true
  },

  animate(ctx) {
    placeHands(ctx.hands, ctx.rig.rightGrip, ctx.rig.leftGrip);
  },

  // ----- 3. สเตตัสอาวุธ -----
  stats: {
    slot: 3,
    category: 'ดาบยุทธวิธี (ระยะกว้าง)',
    name: 'Tactical Katana',
    dmg: 75,
    heavyDmg: 130,
    range: 4.1,
    rpm: 95,
    moveSpeed: 1.20,
    color: 0xdbe3ec,
    desc: 'ดาบโค้งระยะฟันไกลที่สุด ฟันหนัก 130 ดาเมจ'
  },
  ammo: null,
  gun: null,
  wclass: null,
  attachmentSupport: null
};


// ============================================================================
// WEAPON PACK REGISTRY & ENGINE INTEGRATION BRIDGE
// ============================================================================
export const CUSTOM_WEAPON_LIST = [
  WEAPON_HK416,
  WEAPON_MINIGUN,
  WEAPON_MOSSBERG,
  WEAPON_M200,
  WEAPON_PYTHON,
  WEAPON_UMP45,
  WEAPON_KATANA
];

export const CUSTOM_WEAPONS_BY_ID = Object.fromEntries(CUSTOM_WEAPON_LIST.map((w) => [w.id, w]));

// Register all weapons into the host game's WEAPONS, AMMO, GUN, WCLASS & ATTACHMENT_SUPPORT
export function registerCustomWeapons({
  WEAPONS,
  AMMO,
  GUN,
  WCLASS,
  ATTACHMENT_SUPPORT,
  buildBallistics
}) {
  for (const def of CUSTOM_WEAPON_LIST) {
    if (def.ammo && AMMO) AMMO[def.gun.ammo] = { ...def.ammo };
    if (def.gun && GUN) GUN[def.id] = { ...def.gun };
    if (def.wclass && WCLASS) WCLASS[def.id] = def.wclass;
    if (def.attachmentSupport && ATTACHMENT_SUPPORT) ATTACHMENT_SUPPORT[def.id] = { ...def.attachmentSupport };

    if (WEAPONS) {
      const entry = { id: def.id, ...def.stats };
      if (buildBallistics && def.wclass && def.gun) {
        entry.ball = buildBallistics(def.id);
        entry.speed = entry.ball.v0;
        entry.spread = (entry.spread || 0) * entry.ball.accMul;
      }
      WEAPONS[def.id] = entry;
    }
  }
  return CUSTOM_WEAPONS_BY_ID;
}

// Build a custom weapon 3D model + attach operator hands
export function createCustomWeaponModel(weaponId, mods = {}, isLite = false, attachmentData = window.NEW_ATTACHMENT_DATA) {
  const def = CUSTOM_WEAPONS_BY_ID[weaponId];
  if (!def) return null;
  const group = def.buildModel(mods, isLite, attachmentData);
  const hands = attachOperatorHands(group, def.rig, isLite);
  group.userData.customWeaponId = weaponId;
  group.userData.customHands = hands;
  group.userData.gripRight = def.rig.rightGrip;
  group.userData.gripLeft = def.rig.leftGrip;
  group.userData.magWell = def.rig.magWell;
  group.userData.weaponSlot = def.stats.slot;
  return group;
}

// Run per-frame mechanical + hand animations for a custom weapon
export function animateCustomWeapon(viewmodelMesh, state, onEjectCasing) {
  if (!viewmodelMesh) return false;
  const wid = viewmodelMesh.userData?.customWeaponId;
  const def = CUSTOM_WEAPONS_BY_ID[wid];
  if (!def) return false;

  const justFired = state.fa < 0.045 && !state.wasFiringFrame;
  state.wasFiringFrame = state.fa < 0.045;

  def.animate({
    rig: def.rig,
    parts: viewmodelMesh.userData.parts,
    hands: viewmodelMesh.userData.customHands,
    magGroup: viewmodelMesh.userData.magGroup,
    boltGroup: viewmodelMesh.userData.boltGroup,
    fa: state.fa,
    rl: state.rl,
    rlE: state.rlE,
    rlN: state.rlN,
    rlMs: state.rlMs,
    dur: state.dur,
    ammo: state.ammo,
    max: state.max,
    scoped: state.scoped,
    dt: state.dt,
    justFired,
    eject: () => {
      const ep = def.rig.ejectPoint || [0.06, 0.04, 0];
      const worldPt = viewmodelMesh.localToWorld(V3(ep[0], ep[1], ep[2]));
      onEjectCasing?.(wid, worldPt);
    }
  });
  return true;
}