import * as THREE from 'three';

export const MAP_ID = 'maps_1';
export const MAP_NAME = 'Maps-1: Abandoned Metropolis (500 Chunks)';
export const MAP_HALF = 250; // 500 x 500 Chunks (-250 .. +250)

// ---------------- Procedural PBR Textures ----------------
function makeTex(size, drawFn, rx = 1, ry = 1, srgb = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  drawFn(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function createMapMaterials() {
  const asphaltBump = makeTex(512, (ctx, s) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 6500; i++) {
      const g = 88 + Math.floor(Math.random() * 84);
      ctx.fillStyle = `rgb(${g},${g},${g})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 2.5;
    for (let k = 0; k < 10; k++) {
      ctx.beginPath();
      let x = Math.random() * s, y = Math.random() * s;
      ctx.moveTo(x, y);
      for (let g = 0; g < 6; g++) {
        x += (Math.random() - 0.5) * 90;
        y += (Math.random() - 0.5) * 90;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }, 64, 64, false);

  const asphaltTex = makeTex(512, (ctx, s) => {
    ctx.fillStyle = '#24282e';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 7500; i++) {
      const v = 26 + Math.floor(Math.random() * 36);
      ctx.fillStyle = `rgb(${v},${v + 2},${v + 4})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = 'rgba(54,70,40,0.22)';
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, 12 + Math.random() * 28, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 64, 64);

  const mkBrick = (col, rx = 3, ry = 2) => new THREE.MeshStandardMaterial({
    map: makeTex(256, (ctx, s) => {
      ctx.fillStyle = '#71717a';
      ctx.fillRect(0, 0, s, s);
      const bh = s / 8, bw = s / 4;
      for (let r = 0; r < 8; r++) {
        for (let c = -1; c <= 4; c++) {
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.74 + Math.random() * 0.26;
          ctx.fillRect(c * bw + (r % 2) * (bw / 2) + 2, r * bh + 2, bw - 4, bh - 4);
        }
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = 'rgba(20,26,18,0.25)';
        ctx.fillRect(Math.random() * s, Math.random() * s, 12 + Math.random() * 20, 28 + Math.random() * 55);
      }
    }, rx, ry),
    bumpMap: makeTex(256, (ctx, s) => {
      ctx.fillStyle = '#404040';
      ctx.fillRect(0, 0, s, s);
      const bh = s / 8, bw = s / 4;
      for (let r = 0; r < 8; r++) {
        for (let c = -1; c <= 4; c++) {
          ctx.fillStyle = '#d4d4d4';
          ctx.fillRect(c * bw + (r % 2) * (bw / 2) + 2, r * bh + 2, bw - 4, bh - 4);
        }
      }
    }, rx, ry, false),
    bumpScale: 0.045,
    roughness: 0.88
  });

  const mkConc = (hex, rx = 2, ry = 2) => new THREE.MeshStandardMaterial({
    map: makeTex(256, (ctx, s) => {
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2400; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
      }
      const g = ctx.createLinearGradient(0, s * 0.55, 0, s);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(18,24,16,0.46)');
      ctx.fillStyle = g;
      ctx.fillRect(0, s * 0.55, s, s * 0.45);
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, s, s / 2);
      ctx.strokeRect(0, s / 2, s, s / 2);
    }, rx, ry),
    roughness: 0.9
  });

  const mkMetal = (hex) => new THREE.MeshStandardMaterial({
    map: makeTex(128, (ctx, s) => {
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, s, s);
      for (let x = 0; x < s; x += 16) {
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fillRect(x, 0, 6, s);
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.fillRect(x + 6, 0, 3, s);
      }
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = 'rgba(120,53,15,0.38)';
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 6 + Math.random() * 14, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 2, 1),
    roughness: 0.55,
    metalness: 0.45
  });

  return {
    roadMat: new THREE.MeshStandardMaterial({ map: asphaltTex, bumpMap: asphaltBump, bumpScale: 0.07, roughness: 0.85 }),
    puddleMat: new THREE.MeshStandardMaterial({ color: 0x202830, roughness: 0.08, metalness: 0.55, transparent: true, opacity: 0.78 }),
    sidewalkMat: mkConc('#6f767e', 10, 10),
    terraceMat: mkConc('#5b6169', 6, 6),
    concDarkMat: mkConc('#424850', 2, 2),
    concLightMat: mkConc('#7d848d', 2, 2),
    concWarmMat: mkConc('#706960', 2, 2),
    brickRedMat: mkBrick('#7a3b32'),
    brickBrownMat: mkBrick('#6d5542'),
    brickGreyMat: mkBrick('#5a626b'),
    woodFloorMat: new THREE.MeshStandardMaterial({
      map: makeTex(256, (ctx, s) => {
        ctx.fillStyle = '#5c432d';
        ctx.fillRect(0, 0, s, s);
        for (let y = 0; y < s; y += 32) {
          ctx.fillStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.14})`;
          ctx.fillRect(0, y, s, 30);
          ctx.fillStyle = '#2d1e12';
          ctx.fillRect(0, y + 30, s, 2);
        }
      }, 4, 4),
      roughness: 0.82
    }),
    tileFloorMat: new THREE.MeshStandardMaterial({
      map: makeTex(256, (ctx, s) => {
        ctx.fillStyle = '#7b848f';
        ctx.fillRect(0, 0, s, s);
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#94a3b8' : '#64748b';
            ctx.fillRect(x * 64 + 2, y * 64 + 2, 60, 60);
          }
        }
      }, 4, 4),
      roughness: 0.65
    }),
    plankMat: new THREE.MeshStandardMaterial({ color: 0x6b4c30, roughness: 0.88 }),
    glassMat: new THREE.MeshPhysicalMaterial({ color: 0x9ec5d6, transparent: true, opacity: 0.32, roughness: 0.08, metalness: 0.2 }),
    contRedMat: mkMetal('#8c2824'),
    contBlueMat: mkMetal('#234678'),
    contGreenMat: mkMetal('#265436'),
    rustMat: mkMetal('#5c3a24'),
    steelMat: new THREE.MeshStandardMaterial({ color: 0x3b424c, roughness: 0.5, metalness: 0.72 }),
    foliageMat: new THREE.MeshStandardMaterial({ color: 0x3b522a, roughness: 0.92 }),
    barkMat: new THREE.MeshStandardMaterial({ color: 0x3f3226, roughness: 0.95 }),
    sandbagMat: new THREE.MeshStandardMaterial({ color: 0x8a795d, roughness: 0.95 }),
    heliMat: new THREE.MeshStandardMaterial({ color: 0x364135, roughness: 0.65, metalness: 0.38 }),
    tankMat: new THREE.MeshStandardMaterial({ color: 0x454a3c, roughness: 0.72, metalness: 0.42 }),
    busMat: mkMetal('#a16207'),
    tireMat: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 }),
    rubbleMats: [0x57534e, 0x78716c, 0x3f3f46, 0x6b5b4b].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.98 }))
  };
}

// ---------------- Main Map Builder ----------------
export function buildMap1(scene, ctx = {}) {
  const colliders = ctx.colliders || [];
  const navNodes = ctx.navNodes || [];
  const flickeringLights = ctx.flickeringLights || [];
  const mapLights = ctx.mapLights || [];
  const stairRamps = ctx.stairRamps || [];
  const windowOpenings = ctx.windowOpenings || [];
  const spawnPoints = ctx.spawnPoints || { red: [], blue: [] };
  const supplyPoints = ctx.supplyPoints || [];

  colliders.length = 0;
  navNodes.length = 0;
  flickeringLights.length = 0;
  mapLights.length = 0;
  stairRamps.length = 0;
  windowOpenings.length = 0;
  spawnPoints.red = [];
  spawnPoints.blue = [];
  supplyPoints.length = 0;

  const mats = createMapMaterials();
  let pointLightCount = 0;

  // ---- Geometry & Navigation Helpers ----
  function addNav(x, y, z, high = false) {
    const i = navNodes.length;
    navNodes.push({ pos: new THREE.Vector3(x, y, z), neighbors: [], isHigh: high });
    return i;
  }

  function linkNav(a, b) {
    if (a < 0 || b < 0 || a === b) return;
    if (!navNodes[a].neighbors.includes(b)) navNodes[a].neighbors.push(b);
    if (!navNodes[b].neighbors.includes(a)) navNodes[b].neighbors.push(a);
  }

  function addBox(x, y, z, w, h, d, mat, col = true, cs = true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y + h / 2, z);
    m.castShadow = cs;
    m.receiveShadow = true;
    m.userData.st = 1;
    scene.add(m);
    if (col) {
      colliders.push({
        minX: x - w / 2,
        maxX: x + w / 2,
        minY: y,
        maxY: y + h,
        minZ: z - d / 2,
        maxZ: z + d / 2
      });
    }
    return m;
  }

  function addStairs(x, ys, zs, w, th, len, ax, dir, mat) {
    const ramp = { x, z: zs, axis: ax, dir, width: w, length: len, baseY: ys, height: th };
    stairRamps.push(ramp);
    const st = Math.max(6, Math.ceil(th / 0.25));
    const sh = th / st;
    const sd = len / st;
    for (let i = 0; i < st; i++) {
      const h = (i + 1) * sh;
      const off = dir * (i + 0.5) * sd;
      const ci = colliders.length;
      if (ax === 'z') addBox(x, ys, zs + off, w, h, sd + 0.05, mat, true, false);
      else addBox(x + off, ys, zs, sd + 0.05, h, w, mat, true, false);
      if (colliders[ci]) colliders[ci].stairRamp = ramp;
    }
    return ramp;
  }

  // Smooth visual slope + invisible stepped stairRamp colliders for smooth walking/driving/bullet hit
  function addSlopeRamp(x, ys, zs, w, th, len, ax, dir, mat) {
    const ramp = { x, z: zs, axis: ax, dir, width: w, length: len, baseY: ys, height: th };
    stairRamps.push(ramp);

    const hyp = Math.hypot(len, th);
    const ang = Math.atan2(th, len);
    const thick = 0.36;
    const visual = new THREE.Mesh(
      new THREE.BoxGeometry(ax === 'x' ? hyp : w, thick, ax === 'z' ? hyp : w),
      mat
    );
    const cx = ax === 'x' ? x + dir * (len / 2) : x;
    const cz = ax === 'z' ? zs + dir * (len / 2) : zs;
    visual.position.set(cx, ys + th / 2 - (thick / 2) * Math.cos(ang), cz);
    if (ax === 'z') visual.rotation.x = -dir * ang;
    else visual.rotation.z = dir * ang;
    visual.castShadow = false;
    visual.receiveShadow = true;
    visual.userData.st = 1;
    scene.add(visual);

    const st = Math.max(8, Math.ceil(th / 0.28));
    const sh = th / st;
    const sd = len / st;
    for (let i = 0; i < st; i++) {
      const h = (i + 1) * sh;
      const off = dir * (i + 0.5) * sd;
      const rx = ax === 'x' ? x + off : x;
      const rz = ax === 'z' ? zs + off : zs;
      const rw = ax === 'z' ? w : sd + 0.06;
      const rd = ax === 'z' ? sd + 0.06 : w;
      colliders.push({
        minX: rx - rw / 2,
        maxX: rx + rw / 2,
        minY: ys,
        maxY: ys + h,
        minZ: rz - rd / 2,
        maxZ: rz + rd / 2,
        stairRamp: ramp
      });
    }
    return ramp;
  }

  function addWall(cx, y, cz, len, h, th, dir, tp, mat, gl = false) {
    if (tp === 'solid') {
      if (dir === 'x') addBox(cx, y, cz, len, h, th, mat);
      else addBox(cx, y, cz, th, h, len, mat);
      return;
    }
    if (tp === 'door') {
      const dw = 3.4, dh = 2.95, sd = (len - dw) / 2;
      if (dir === 'x') {
        if (sd > 0.1) {
          addBox(cx - dw / 2 - sd / 2, y, cz, sd, h, th, mat);
          addBox(cx + dw / 2 + sd / 2, y, cz, sd, h, th, mat);
        }
        if (h > dh) addBox(cx, y + dh, cz, dw, h - dh, th, mat);
      } else {
        if (sd > 0.1) {
          addBox(cx, y, cz - dw / 2 - sd / 2, th, h, sd, mat);
          addBox(cx, y, cz + dw / 2 + sd / 2, th, h, sd, mat);
        }
        if (h > dh) addBox(cx, y + dh, cz, th, h - dh, dw, mat);
      }
      return;
    }
    if (tp === 'broken') {
      // Half-collapsed ruined wall with large breach
      const seg = Math.max(1.8, len * 0.28);
      if (dir === 'x') {
        addBox(cx - len / 2 + seg / 2, y, cz, seg, h * 0.88, th, mat);
        addBox(cx + len / 2 - seg / 2, y, cz, seg, h * 0.65, th, mat);
        addBox(cx, y, cz, len - seg * 2, 0.85, th, mat);
      } else {
        addBox(cx, y, cz - len / 2 + seg / 2, th, h * 0.88, seg, mat);
        addBox(cx, y, cz + len / 2 - seg / 2, th, h * 0.65, seg, mat);
        addBox(cx, y, cz, th, 0.85, len - seg * 2, mat);
      }
      return;
    }

    const sh = 1.02, wh = 1.55, top = h - sh - wh;
    const ops = tp === 'double_window' ? [-len * 0.25, len * 0.25] : [0];
    const ww = Math.min(3.4, len * (tp === 'double_window' ? 0.26 : 0.48));
    for (const ox of ops) {
      windowOpenings.push({
        dir,
        plane: dir === 'x' ? cz : cx,
        center: (dir === 'x' ? cx : cz) + ox,
        width: ww,
        thickness: th,
        sillY: y + sh,
        topY: y + sh + wh
      });
    }
    if (dir === 'x') {
      addBox(cx, y, cz, len, sh, th, mat);
      if (top > 0.1) addBox(cx, y + sh + wh, cz, len, top, th, mat);
    } else {
      addBox(cx, y, cz, th, sh, len, mat);
      if (top > 0.1) addBox(cx, y + sh + wh, cz, th, top, len, mat);
    }
    const pts = [-len / 2];
    for (const ox of ops) pts.push(ox - ww / 2, ox + ww / 2);
    pts.push(len / 2);
    for (let i = 0; i < pts.length; i += 2) {
      const sg = pts[i + 1] - pts[i];
      const mid = (pts[i] + pts[i + 1]) / 2;
      if (sg > 0.1) {
        if (dir === 'x') addBox(cx + mid, y + sh, cz, sg, wh, th, mat);
        else addBox(cx, y + sh, cz + mid, th, wh, sg, mat);
      }
    }
    if (gl) {
      for (const ox of ops) {
        if (dir === 'x') addBox(cx + ox - ww * 0.28, y + sh, cz, ww * 0.42, wh * 0.55, 0.04, mats.glassMat, false, false);
        else addBox(cx, y + sh, cz + ox - ww * 0.28, 0.04, wh * 0.55, ww * 0.42, mats.glassMat, false, false);
      }
    }
  }

  function addInteriorLight(x, y, z, color = 0xffd2a1, intensity = 1.6, dist = 24, flickerChance = 0.45) {
    if (pointLightCount >= 4) return;
    pointLightCount++;
    const pl = new THREE.PointLight(color, intensity, dist);
    pl.position.set(x, y, z);
    scene.add(pl);
    mapLights.push(pl);
    if (Math.random() < flickerChance) {
      flickeringLights.push({ light: pl, base: intensity, phase: Math.random() * 12 });
    }
  }

  function buildBuilding({
    cx, cz, baseY = 0, width, depth, floors, floorH = 3.9,
    extMat, intFloorMat, doorsOn1F, upperWin,
    rooftopAccess = true, streetNodeIdx = -1,
    stairSide = 'e', floorOverrides = null
  }) {
    const T = 0.45;
    const sw = 3.0;
    const sl = Math.min(6.2, depth - T * 2 - 5.2);
    const sx = stairSide === 'w'
      ? cx - width / 2 + T + sw / 2 + 0.2
      : cx + width / 2 - T - sw / 2 - 0.2;
    const ww = width - T * 2 - sw - 0.5;
    const wx = stairSide === 'w'
      ? cx + width / 2 - T - ww / 2
      : cx - width / 2 + T + ww / 2;

    addBox(cx, baseY, cz, width, 0.18, depth, intFloorMat, true, false);
    let prevN = -1;
    const floorRoomNodes = [];

    for (let f = 0; f < floors; f++) {
      const y0 = baseY + f * floorH;
      const wc = { ...(f === 0 ? doorsOn1F : upperWin), ...(floorOverrides?.[f] || {}) };
      addWall(cx, y0, cz - depth / 2 + T / 2, width, floorH, T, 'x', wc.n, extMat, f > 0);
      addWall(cx, y0, cz + depth / 2 - T / 2, width, floorH, T, 'x', wc.s, extMat, f > 0);
      addWall(cx - width / 2 + T / 2, y0, cz, depth - T * 2, floorH, T, 'z', wc.w, extMat, f > 0);
      addWall(cx + width / 2 - T / 2, y0, cz, depth - T * 2, floorH, T, 'z', wc.e, extMat, f > 0);
      if (depth >= 16) {
        addWall(wx + (stairSide === 'w' ? 0.4 : -0.4), y0, cz, ww - 1.4, floorH, 0.35, 'x', 'door', mats.concLightMat, false);
      }

      const rN = addNav(wx, y0 + 0.2, cz - depth * 0.25, f > 0);
      const rS = addNav(wx, y0 + 0.2, cz + depth * 0.25, f > 0);
      linkNav(rN, rS);
      floorRoomNodes.push({ rN, rS, y: y0 + 0.2 });

      if (f === 0) {
        if (wc.n === 'door') {
          const d = addNav(cx, baseY + 0.2, cz - depth / 2 - 3);
          linkNav(d, rN);
          if (streetNodeIdx >= 0) linkNav(streetNodeIdx, d);
        }
        if (wc.s === 'door') {
          const d = addNav(cx, baseY + 0.2, cz + depth / 2 + 3);
          linkNav(d, rS);
          if (streetNodeIdx >= 0) linkNav(streetNodeIdx, d);
        }
        if (wc.w === 'door' && stairSide !== 'w') {
          const d = addNav(cx - width / 2 - 3, baseY + 0.2, cz);
          linkNav(d, rS);
          linkNav(d, rN);
          if (streetNodeIdx >= 0) linkNav(streetNodeIdx, d);
        }
        if (wc.e === 'door' && stairSide !== 'e') {
          const d = addNav(cx + width / 2 + 3, baseY + 0.2, cz);
          linkNav(d, rS);
          linkNav(d, rN);
          if (streetNodeIdx >= 0) linkNav(streetNodeIdx, d);
        }
      }
      if (prevN >= 0) linkNav(prevN, rN);

      const up = (f < floors - 1) || rooftopAccess;
      const sy = y0 + floorH - 0.3;
      if (up) {
        addBox(wx, sy, cz, ww, 0.3, depth - T * 2, intFloorMat);
        const zs = cz + depth / 2 - T - 2.6;
        const zt = zs - sl;
        const ni = cz - depth / 2 + T;
        const nd = zt - ni;
        if (nd > 0.2) addBox(sx, sy, ni + nd / 2, sw + 0.5, 0.3, nd, intFloorMat);
        const lw = sw / 2, laneA = sx - lw / 2, laneB = sx + lw / 2;
        let sb, st;
        if (f % 2 === 0) {
          addStairs(laneA, y0 + 0.18, zs, lw, floorH - 0.18, sl, 'z', -1, mats.concDarkMat);
          sb = addNav(laneA, y0 + 0.2, zs + 1.1, f > 0);
          st = addNav(laneA, y0 + floorH + 0.05, zt - 1.1, true);
          linkNav(rS, sb);
        } else {
          addStairs(laneB, y0 + 0.18, zt, lw, floorH - 0.18, sl, 'z', 1, mats.concDarkMat);
          addBox(sx, sy, zs + 1.3, sw + 0.5, 0.3, 2.6, intFloorMat);
          sb = addNav(laneB, y0 + 0.2, zt - 1.1, true);
          st = addNav(laneB, y0 + floorH + 0.05, zs + 1.3, true);
          linkNav(rN, sb);
        }
        linkNav(sb, st);
        prevN = st;
      } else {
        addBox(cx, sy, cz, width + 0.6, 0.35, depth + 0.6, mats.concDarkMat);
      }

      if (f === 0 || (f === floors - 1 && Math.random() < 0.7)) {
        addInteriorLight(wx, y0 + floorH - 0.7, cz, f === 0 ? 0xffd2a1 : 0xa5f3fc, 1.5, 22);
      }
      addBox(wx + (stairSide === 'w' ? ww * 0.3 : -ww * 0.3), y0 + 0.18, cz - depth * 0.22, 1.6, 0.9, 1.1, mats.plankMat);
    }

    let roofNode = -1;
    if (rooftopAccess) {
      const ry = baseY + floors * floorH;
      addWall(cx, ry, cz - depth / 2 + 0.3, width, 1.15, 0.4, 'x', 'solid', mats.concDarkMat);
      addWall(cx, ry, cz + depth / 2 - 0.3, width, 1.15, 0.4, 'x', 'solid', mats.concDarkMat);
      addWall(cx - width / 2 + 0.3, ry, cz, depth - 0.8, 1.15, 0.4, 'z', 'solid', mats.concDarkMat);
      addWall(cx + width / 2 - 0.3, ry, cz, depth - 0.8, 1.15, 0.4, 'z', 'solid', mats.concDarkMat);
      addBox(cx - width * 0.2, ry, cz - depth * 0.2, 2.8, 1.7, 2.4, mats.rustMat);
      addBox(cx + width * 0.18, ry, cz + depth * 0.22, 1.8, 1.2, 1.8, mats.concLightMat);
      roofNode = addNav(wx, ry + 0.1, cz, true);
      if (prevN >= 0) linkNav(prevN, roofNode);
    }

    return { floorRoomNodes, roofNode };
  }

  // Ruined / partially collapsed building shell ("ซากตึก")
  function buildRuinedBuilding({
    cx, cz, baseY = 0, width, depth, floors = 3, floorH = 3.8,
    extMat, intFloorMat, streetNodeIdx = -1
  }) {
    const T = 0.48, sw = 3.0, sl = Math.min(5.8, depth - T * 2 - 5.0);
    const sx = cx + width / 2 - T - sw / 2 - 0.2;
    const ww = width - T * 2 - sw - 0.5;
    const wx = cx - width / 2 + T + ww / 2;

    addBox(cx, baseY, cz, width, 0.18, depth, intFloorMat, true, false);
    let prevN = -1;

    for (let f = 0; f < floors; f++) {
      const y0 = baseY + f * floorH;
      const topRuined = f === floors - 1;
      addWall(cx, y0, cz - depth / 2 + T / 2, width, floorH, T, 'x', f === 0 ? 'door' : 'broken', extMat, false);
      addWall(cx, y0, cz + depth / 2 - T / 2, width, floorH, T, 'x', f === 0 ? 'door' : (topRuined ? 'broken' : 'double_window'), extMat, false);
      addWall(cx - width / 2 + T / 2, y0, cz, depth - T * 2, floorH, T, 'z', f === 0 ? 'broken' : 'window', extMat, false);
      addWall(cx + width / 2 - T / 2, y0, cz, depth - T * 2, floorH, T, 'z', topRuined ? 'broken' : 'solid', extMat, false);

      // Broken pillars & fallen rebar beams inside
      addBox(wx - ww * 0.28, y0 + 0.18, cz, 0.55, floorH - 0.3, 0.55, mats.concDarkMat);
      if (f > 0) {
        const beam = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 6.2), mats.rustMat);
        beam.position.set(wx + 1.2, y0 + 1.6, cz - 1.5);
        beam.rotation.set(0.35, 0.2, 0.18);
        beam.castShadow = true;
        beam.userData.st = 1;
        scene.add(beam);
      }

      const rN = addNav(wx, y0 + 0.2, cz - depth * 0.24, f > 0);
      const rS = addNav(wx, y0 + 0.2, cz + depth * 0.24, f > 0);
      linkNav(rN, rS);
      if (f === 0) {
        const dN = addNav(cx, baseY + 0.2, cz - depth / 2 - 3);
        const dS = addNav(cx, baseY + 0.2, cz + depth / 2 + 3);
        const dW = addNav(cx - width / 2 - 3, baseY + 0.2, cz);
        linkNav(dN, rN);
        linkNav(dS, rS);
        linkNav(dW, rN);
        linkNav(dW, rS);
        if (streetNodeIdx >= 0) {
          linkNav(streetNodeIdx, dN);
          linkNav(streetNodeIdx, dS);
          linkNav(streetNodeIdx, dW);
        }
      }
      if (prevN >= 0) linkNav(prevN, rN);

      if (f < floors - 1) {
        const sy = y0 + floorH - 0.3;
        // Partial collapsed floor slab leaving open holes
        addBox(wx, sy, cz - depth * 0.2, ww, 0.3, depth * 0.48, intFloorMat);
        addBox(wx - ww * 0.22, sy, cz + depth * 0.24, ww * 0.54, 0.3, depth * 0.42, intFloorMat);
        const zs = cz + depth / 2 - T - 2.4;
        const zt = zs - sl;
        const ni = cz - depth / 2 + T;
        const nd = zt - ni;
        if (nd > 0.2) addBox(sx, sy, ni + nd / 2, sw + 0.5, 0.3, nd, intFloorMat);
        const lw = sw / 2, laneA = sx - lw / 2, laneB = sx + lw / 2;
        let sb, st;
        if (f % 2 === 0) {
          addStairs(laneA, y0 + 0.18, zs, lw, floorH - 0.18, sl, 'z', -1, mats.concDarkMat);
          sb = addNav(laneA, y0 + 0.2, zs + 1.0, f > 0);
          st = addNav(laneA, y0 + floorH + 0.05, zt - 1.0, true);
          linkNav(rS, sb);
        } else {
          addStairs(laneB, y0 + 0.18, zt, lw, floorH - 0.18, sl, 'z', 1, mats.concDarkMat);
          addBox(sx, sy, zs + 1.2, sw + 0.5, 0.3, 2.4, intFloorMat);
          sb = addNav(laneB, y0 + 0.2, zt - 1.0, true);
          st = addNav(laneB, y0 + floorH + 0.05, zs + 1.2, true);
          linkNav(rN, sb);
        }
        linkNav(sb, st);
        prevN = st;
      }
    }

    // Rubble mounds inside and around the ruin
    const rubbleGeo = new THREE.DodecahedronGeometry(1, 0);
    for (let i = 0; i < 9; i++) {
      const s = 0.45 + Math.random() * 0.95;
      const m = new THREE.Mesh(rubbleGeo, mats.rubbleMats[i % mats.rubbleMats.length]);
      m.position.set(cx + (Math.random() - 0.5) * width * 0.8, baseY + s * 0.45, cz + (Math.random() - 0.5) * depth * 0.8);
      m.scale.set(s * 1.2, s * 0.65, s * 1.1);
      m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      m.userData.st = 1;
      scene.add(m);
    }
  }

  // Sniper Watchtower ("จุดซุ่มยิง")
  function buildWatchtower(cx, baseY, cz, height = 8.4, linkNode = -1) {
    const w = 5.4, hw = w / 2;
    const p = 0.42;
    for (const sx of [-hw + p / 2, hw - p / 2]) {
      for (const sz of [-hw + p / 2, hw - p / 2]) {
        addBox(cx + sx, baseY, cz + sz, p, height, p, mats.steelMat);
      }
    }
    const midY = baseY + height / 2;
    // Lower stair (West half, +Z direction)
    addStairs(cx - 1.0, baseY, cz - 2.2, 1.8, height / 2, 4.4, 'z', 1, mats.plankMat);
    // Mid landing
    addBox(cx, midY - 0.25, cz + 2.2, w - 0.8, 0.25, 1.4, mats.plankMat);
    // Upper stair (East half, -Z direction)
    addStairs(cx + 1.0, midY, cz + 1.8, 1.8, height / 2, 4.0, 'z', -1, mats.plankMat);
    // Top deck (leaving East stair entry hole clear)
    addBox(cx - 1.0, baseY + height - 0.28, cz, 2.6, 0.28, w - 0.6, mats.concDarkMat);
    addBox(cx + 1.1, baseY + height - 0.28, cz - 1.9, 1.8, 0.28, 1.6, mats.concDarkMat);
    // Sandbag / concrete parapets
    addWall(cx, baseY + height, cz - hw + 0.22, w, 1.05, 0.35, 'x', 'solid', mats.sandbagMat);
    addWall(cx, baseY + height, cz + hw - 0.22, w, 1.05, 0.35, 'x', 'solid', mats.sandbagMat);
    addWall(cx - hw + 0.22, baseY + height, cz, w - 0.7, 1.05, 0.35, 'z', 'solid', mats.sandbagMat);
    addWall(cx + hw - 0.22, baseY + height, cz, w - 0.7, 1.05, 0.35, 'z', 'solid', mats.sandbagMat);
    // Roof canopy posts
    for (const sx of [-hw + 0.25, hw - 0.25]) {
      for (const sz of [-hw + 0.25, hw - 0.25]) {
        addBox(cx + sx, baseY + height, cz + sz, 0.24, 2.7, 0.24, mats.steelMat);
      }
    }
    addBox(cx, baseY + height + 2.7, cz, w + 0.4, 0.22, w + 0.4, mats.rustMat);

    const nBot = addNav(cx - 1.0, baseY + 0.2, cz - 3.3, false);
    const nMid = addNav(cx, midY + 0.1, cz + 2.2, true);
    const nTop = addNav(cx - 1.0, baseY + height + 0.1, cz, true);
    linkNav(nBot, nMid);
    linkNav(nMid, nTop);
    if (linkNode >= 0) linkNav(linkNode, nBot);
    return { nBot, nTop };
  }

  // ---- Vehicles & Wrecks ("ซากรถ / ซากเฮลิคอปเตอร์ / ซากรถถัง") ----
  function buildVehicle(x, z, ry, mat, truck = false, baseY = 0) {
    const g = new THREE.Group();
    g.position.set(x, baseY, z);
    g.rotation.y = ry;
    scene.add(g);
    const len = truck ? 7.4 : 4.6, wid = truck ? 2.5 : 2.0;
    const ap = (px, py, pz, pw, ph, pd, m) => {
      const k = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), m);
      k.position.set(px, py, pz);
      k.castShadow = true;
      k.receiveShadow = true;
      k.userData.st = 1;
      g.add(k);
    };
    ap(0, 0.65, 0, wid, 0.75, len, mat);
    if (truck) {
      ap(0, 1.55, -len * 0.25, wid - 0.1, 1.1, 2.2, mat);
      ap(0, 1.45, len * 0.18, wid, 0.9, 4.3, mats.rustMat);
    } else {
      ap(0, 1.32, 0.2, wid - 0.2, 0.65, 2.2, mat);
      ap(0, 1.32, 0.2, wid - 0.15, 0.52, 1.9, mats.glassMat);
    }
    for (const wx of [-wid / 2, wid / 2]) {
      for (const wz of [-len * 0.32, len * 0.32]) {
        ap(wx, 0.38, wz, 0.3, 0.75, 0.75, mats.tireMat);
      }
    }
    const h = Math.abs(Math.sin(ry)) > 0.5 ? [len / 2, wid / 2] : [wid / 2, len / 2];
    colliders.push({ minX: x - h[0], maxX: x + h[0], minY: baseY, maxY: baseY + (truck ? 2.1 : 1.65), minZ: z - h[1], maxZ: z + h[1] });
  }

  function buildBus(x, z, ry, baseY = 0) {
    const g = new THREE.Group();
    g.position.set(x, baseY, z);
    g.rotation.y = ry;
    scene.add(g);
    const len = 10.6, wid = 2.65;
    const ap = (px, py, pz, pw, ph, pd, m) => {
      const k = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), m);
      k.position.set(px, py, pz);
      k.castShadow = true;
      k.receiveShadow = true;
      k.userData.st = 1;
      g.add(k);
    };
    ap(0, 0.8, 0, wid, 1.0, len, mats.busMat);
    ap(0, 2.45, 0, wid - 0.12, 0.35, len - 0.2, mats.rustMat);
    for (let pz = -4.2; pz <= 4.2; pz += 2.1) {
      ap(-wid / 2 + 0.1, 1.8, pz, 0.2, 1.0, 0.3, mats.busMat);
      ap(wid / 2 - 0.1, 1.8, pz, 0.2, 1.0, 0.3, mats.busMat);
    }
    ap(0, 1.8, -len / 2 + 0.15, wid, 1.0, 0.3, mats.busMat);
    ap(0, 1.8, len / 2 - 0.15, wid, 1.0, 0.3, mats.busMat);
    for (const wx of [-wid / 2, wid / 2]) {
      for (const wz of [-3.4, 3.4]) ap(wx, 0.45, wz, 0.35, 0.9, 0.9, mats.tireMat);
    }
    const h = Math.abs(Math.sin(ry)) > 0.5 ? [len / 2, wid / 2] : [wid / 2, len / 2];
    colliders.push({ minX: x - h[0], maxX: x + h[0], minY: baseY, maxY: baseY + 2.65, minZ: z - h[1], maxZ: z + h[1] });
  }

  function buildTankWreck(x, z, ry, baseY = 0) {
    const g = new THREE.Group();
    g.position.set(x, baseY, z);
    g.rotation.y = ry;
    scene.add(g);
    const ap = (px, py, pz, pw, ph, pd, m, rx = 0) => {
      const k = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), m);
      k.position.set(px, py, pz);
      k.rotation.x = rx;
      k.castShadow = true;
      k.receiveShadow = true;
      k.userData.st = 1;
      g.add(k);
    };
    ap(0, 0.72, 0, 3.6, 1.1, 6.4, mats.tankMat);
    ap(-1.7, 0.55, 0, 0.65, 0.9, 6.6, mats.tireMat);
    ap(1.7, 0.55, 0, 0.65, 0.9, 6.6, mats.tireMat);
    ap(0, 1.62, -0.3, 2.3, 0.8, 2.8, mats.rustMat);
    ap(0, 1.68, -3.4, 0.28, 0.28, 4.2, mats.steelMat, 0.08);
    const h = Math.abs(Math.sin(ry)) > 0.5 ? [3.3, 2.0] : [2.0, 3.3];
    colliders.push({ minX: x - h[0], maxX: x + h[0], minY: baseY, maxY: baseY + 2.05, minZ: z - h[1], maxZ: z + h[1] });
  }

  function buildHeliWreck(x, z, baseY = 0) {
    const g = new THREE.Group();
    g.position.set(x, baseY, z);
    g.rotation.set(0.08, 0.55, -0.14);
    scene.add(g);
    const ap = (px, py, pz, pw, ph, pd, m) => {
      const k = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), m);
      k.position.set(px, py, pz);
      k.castShadow = true;
      k.receiveShadow = true;
      k.userData.st = 1;
      g.add(k);
    };
    ap(0, 1.05, 0, 2.5, 1.9, 6.6, mats.heliMat);
    ap(0, 1.35, -3.8, 1.9, 1.3, 1.8, mats.glassMat);
    ap(0, 1.3, 5.4, 0.65, 0.75, 5.2, mats.rustMat); // tail boom
    ap(0, 2.1, 7.6, 0.3, 1.5, 1.1, mats.heliMat);   // tail fin
    // Bent rotor blades
    const b1 = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.08, 0.38), mats.steelMat);
    b1.position.set(0, 2.2, 0);
    b1.rotation.y = 0.4;
    b1.rotation.z = -0.15;
    b1.userData.st = 1;
    const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 9.2), mats.steelMat);
    b2.position.set(0, 2.25, 0);
    b2.rotation.x = 0.14;
    b2.userData.st = 1;
    g.add(b1, b2);
    colliders.push({ minX: x - 3.6, maxX: x + 3.6, minY: baseY, maxY: baseY + 2.1, minZ: z - 4.2, maxZ: z + 4.2 });
  }

  // ---------------- Sky, Environment, Sun & Ground ----------------
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x364a60) },
      midColor: { value: new THREE.Color(0x83929f) },
      horizonColor: { value: new THREE.Color(0xd7ae83) },
      sunDir: { value: new THREE.Vector3(0.55, 0.36, 0.4).normalize() }
    },
    vertexShader: `varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `uniform vec3 topColor,midColor,horizonColor,sunDir;varying vec3 vW;void main(){vec3 d=normalize(vW);float h=clamp(d.y,0.0,1.0);vec3 c=mix(horizonColor,midColor,smoothstep(0.0,0.25,h));c=mix(c,topColor,smoothstep(0.25,0.85,h));float sd=max(dot(d,sunDir),0.0);c+=vec3(1.0,0.78,0.5)*pow(sd,24.0)*0.55+vec3(1.0,0.92,0.8)*smoothstep(0.996,0.9995,sd)*1.4;gl_FragColor=vec4(c,1.0);}`
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(680, 24, 16), skyMat));

  let envTex = null;
  if (ctx.renderer) {
    try {
      const pm = new THREE.PMREMGenerator(ctx.renderer);
      const es = new THREE.Scene();
      es.add(new THREE.Mesh(new THREE.SphereGeometry(20, 16, 12), skyMat));
      envTex = pm.fromScene(es).texture;
      scene.environment = envTex;
      pm.dispose();
    } catch (_e) {}
  }

  scene.fog = new THREE.Fog(0xa09588, 40, 320);
  const hemiRef = new THREE.HemisphereLight(0xb8c8d8, 0x3a3228, 0.78);
  scene.add(hemiRef);

  const sunRef = new THREE.DirectionalLight(0xffdfb8, 1.7);
  sunRef.position.set(150, 130, 105);
  sunRef.castShadow = true;
  sunRef.shadow.mapSize.set(2048, 2048);
  sunRef.shadow.camera.left = -255;
  sunRef.shadow.camera.right = 255;
  sunRef.shadow.camera.top = 255;
  sunRef.shadow.camera.bottom = -255;
  sunRef.shadow.camera.far = 560;
  sunRef.shadow.bias = -0.0005;
  scene.add(sunRef);

  // 500x500 Asphalt Base Ground
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(MAP_HALF * 2, MAP_HALF * 2), mats.roadMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Puddles on main roads
  for (const [px, pz, r] of [
    [-8, -42, 4.8], [10, 44, 5.5], [-6, -135, 5.2], [7, 135, 4.9],
    [-122, -62, 4.5], [-126, 68, 5.0], [135, -75, 4.6], [132, 74, 4.8],
    [-65, 6, 4.4], [64, -5, 4.6], [-185, -40, 5.2], [185, 125, 4.5]
  ]) {
    const p = new THREE.Mesh(new THREE.CircleGeometry(r, 16), mats.puddleMat);
    p.rotation.x = -Math.PI / 2;
    p.position.set(px, 0.02, pz);
    p.receiveShadow = true;
    scene.add(p);
  }

  // Instanced faded yellow lane markings across the 500x500 road grid
  const dashMesh = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.45, 4.6),
    new THREE.MeshBasicMaterial({ color: 0xb5892e, transparent: true, opacity: 0.65 }),
    180
  );
  const dummy = new THREE.Object3D();
  let di = 0;
  for (let z = -230; z <= 230; z += 11) {
    if (Math.abs(z) < 34) continue;
    dummy.position.set(0, 0.03, z);
    dummy.rotation.set(-Math.PI / 2, 0, 0);
    dummy.updateMatrix();
    if (di < 180) dashMesh.setMatrixAt(di++, dummy.matrix);
  }
  for (let x = -230; x <= 230; x += 11) {
    if (Math.abs(x) < 46) continue;
    dummy.position.set(x, 0.03, 0);
    dummy.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    dummy.updateMatrix();
    if (di < 180) dashMesh.setMatrixAt(di++, dummy.matrix);
  }
  for (let x = -220; x <= 220; x += 14) {
    if (Math.abs(x) < 18) continue;
    for (const rz of [-145, 145]) {
      dummy.position.set(x, 0.03, rz);
      dummy.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
      dummy.updateMatrix();
      if (di < 180) dashMesh.setMatrixAt(di++, dummy.matrix);
    }
  }
  dashMesh.count = di;
  scene.add(dashMesh);

  // Outer Map Boundary Walls (500x500) + Distant Ruined Skyline Silhouettes
  addBox(0, 0, -MAP_HALF, MAP_HALF * 2 + 4, 10, 2.5, mats.concDarkMat);
  addBox(0, 0, MAP_HALF, MAP_HALF * 2 + 4, 10, 2.5, mats.concDarkMat);
  addBox(-MAP_HALF, 0, 0, 2.5, 10, MAP_HALF * 2 + 4, mats.concDarkMat);
  addBox(MAP_HALF, 0, 0, 2.5, 10, MAP_HALF * 2 + 4, mats.concDarkMat);

  for (let i = -7; i <= 7; i++) {
    if (i === 0) continue;
    const h1 = 26 + (Math.abs(i * 17) % 42);
    const h2 = 24 + (Math.abs(i * 23) % 46);
    addBox(i * 34, 0, -MAP_HALF - 32, 22, h1, 22, mats.concDarkMat, false, false);
    addBox(i * 34, 0, MAP_HALF + 32, 22, h2, 22, mats.concDarkMat, false, false);
    addBox(-MAP_HALF - 32, 0, i * 34, 22, h2, 22, mats.concDarkMat, false, false);
    addBox(MAP_HALF + 32, 0, i * 34, 22, h1, 22, mats.concDarkMat, false, false);
  }

  // City sidewalk blocks around outer quadrants (y = 0.25, walkable curb step)
  for (const [sx, sz, sw, sd] of [
    [-125, -165, 200, 36], [125, -165, 200, 36],
    [-125, 165, 200, 36], [125, 165, 200, 36],
    [-194, 0, 74, 228]
  ]) {
    addBox(sx, 0, sz, sw, 0.25, sd, mats.sidewalkMat, true, false);
  }

  // ---------------- Core Street Navigation Graph ----------------
  const nRedBase = addNav(0, 0.2, -205);
  const nRedW = addNav(-60, 0.2, -200);
  const nRedE = addNav(60, 0.2, -200);
  const nBlueBase = addNav(0, 0.2, 205);
  const nBlueW = addNav(-60, 0.2, 200);
  const nBlueE = addNav(60, 0.2, 200);

  const nAveN = addNav(0, 0.2, -145);
  const nAveMN = addNav(0, 0.2, -52);
  const nAveMS = addNav(0, 0.2, 52);
  const nAveS = addNav(0, 0.2, 145);

  const nRingNW = addNav(-81, 0.2, -145);
  const nRingNE = addNav(88, 0.2, -145);
  const nRingSW = addNav(-81, 0.2, 145);
  const nRingSE = addNav(88, 0.2, 145);

  const nFarNW = addNav(-180, 0.3, -145);
  const nFarNE = addNav(180, 0.3, -145);
  const nFarSW = addNav(-180, 0.3, 145);
  const nFarSE = addNav(180, 0.3, 145);

  const nMidW = addNav(-48, 0.2, 0);
  const nMidE = addNav(48, 0.2, 0);
  const nHwyGroundN = addNav(-116, 0.2, -55);
  const nHwyGroundS = addNav(-116, 0.2, 55);
  const nYardN = addNav(-188, 0.3, -60);
  const nYardS = addNav(-188, 0.3, 60);

  linkNav(nRedBase, nAveN); linkNav(nRedBase, nRedW); linkNav(nRedBase, nRedE);
  linkNav(nRedW, nRingNW); linkNav(nRedE, nRingNE);
  linkNav(nBlueBase, nAveS); linkNav(nBlueBase, nBlueW); linkNav(nBlueBase, nBlueE);
  linkNav(nBlueW, nRingSW); linkNav(nBlueE, nRingSE);
  linkNav(nAveN, nAveMN); linkNav(nAveS, nAveMS);
  linkNav(nAveN, nRingNW); linkNav(nAveN, nRingNE);
  linkNav(nAveS, nRingSW); linkNav(nAveS, nRingSE);
  linkNav(nRingNW, nFarNW); linkNav(nRingNE, nFarNE);
  linkNav(nRingSW, nFarSW); linkNav(nRingSE, nFarSE);
  linkNav(nRingNW, nHwyGroundN); linkNav(nRingSW, nHwyGroundS);
  linkNav(nHwyGroundN, nHwyGroundS);
  linkNav(nFarNW, nYardN); linkNav(nYardN, nYardS); linkNav(nYardS, nFarSW);
  linkNav(nHwyGroundN, nYardN); linkNav(nHwyGroundS, nYardS);

  // ---------------- Central Plaza (y = 1.2) + Twin High-Rises + 4F Skybridge ----------------
  addBox(0, 0, 0, 80, 1.2, 56, mats.concLightMat, true, false);
  addStairs(0, 0, -33, 12, 1.2, 5, 'z', 1, mats.concDarkMat);
  addStairs(0, 0, 33, 12, 1.2, 5, 'z', -1, mats.concDarkMat);
  addStairs(-45, 0, 0, 10, 1.2, 5, 'x', 1, mats.concDarkMat);
  addStairs(45, 0, 0, 10, 1.2, 5, 'x', -1, mats.concDarkMat);

  const nPlazaN = addNav(0, 1.35, -22, false);
  const nPlazaS = addNav(0, 1.35, 22, false);
  const nPlazaW = addNav(-11, 1.35, 0, false);
  const nPlazaE = addNav(11, 1.35, 0, false);
  linkNav(nAveMN, nPlazaN); linkNav(nAveMS, nPlazaS);
  linkNav(nMidW, nPlazaW); linkNav(nMidE, nPlazaE);
  linkNav(nPlazaN, nPlazaW); linkNav(nPlazaN, nPlazaE);
  linkNav(nPlazaS, nPlazaW); linkNav(nPlazaS, nPlazaE);

  // Crashed Helicopter & Sandbag Cover in Central Plaza
  buildHeliWreck(0, 0, 1.2);
  addBox(-7.5, 1.2, -13, 5.2, 1.05, 1.1, mats.sandbagMat);
  addBox(7.5, 1.2, 13, 5.2, 1.05, 1.1, mats.sandbagMat);

  // Twin Skyscrapers (5 floors + rooftop at y = 20.7m, Skybridge at 4F y = 12.9m)
  const westTower = buildBuilding({
    cx: -24, cz: 0, baseY: 1.2, width: 16, depth: 20, floors: 5, floorH: 3.9,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nPlazaW, stairSide: 'w',
    floorOverrides: { 3: { e: 'door' } }
  });

  const eastTower = buildBuilding({
    cx: 24, cz: 0, baseY: 1.2, width: 16, depth: 20, floors: 5, floorH: 3.9,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nPlazaE, stairSide: 'e',
    floorOverrides: { 3: { w: 'door' } }
  });

  // Elevated Skybridge connecting Floor 4 (y = 12.9) between West & East Twin Towers
  addBox(0, 12.55, 0, 32, 0.35, 6.4, mats.concDarkMat);
  addWall(0, 12.9, -3.0, 32, 3.6, 0.35, 'x', 'double_window', mats.concLightMat, true);
  addWall(0, 12.9, 3.0, 32, 3.6, 0.35, 'x', 'double_window', mats.concLightMat, true);
  addBox(0, 16.5, 0, 32, 0.3, 6.6, mats.concDarkMat);
  addBox(-6, 12.9, 0.8, 1.6, 1.0, 1.2, mats.plankMat);
  addBox(6, 12.9, -0.8, 1.6, 1.0, 1.2, mats.plankMat);
  const nSkybridge = addNav(0, 13.05, 0, true);
  if (westTower.floorRoomNodes[3]) linkNav(westTower.floorRoomNodes[3].rN, nSkybridge);
  if (eastTower.floorRoomNodes[3]) linkNav(eastTower.floorRoomNodes[3].rN, nSkybridge);

  // ---------------- West Elevated Industrial Terrace (y = 2.6) ----------------
  addBox(-81, 0, 0, 50, 2.6, 216, mats.terraceMat, true, false);
  addSlopeRamp(-81, 0, -122, 10, 2.6, 14, 'z', 1, mats.concDarkMat);
  addSlopeRamp(-81, 0, 122, 10, 2.6, 14, 'z', -1, mats.concDarkMat);
  addStairs(-50, 0, 0, 8, 2.6, 6, 'x', -1, mats.concDarkMat);
  addStairs(-112, 0, -42, 6, 2.6, 6, 'x', 1, mats.concDarkMat);
  addStairs(-112, 0, 42, 6, 2.6, 6, 'x', 1, mats.concDarkMat);

  const nWTerraceN = addNav(-81, 2.75, -96, true);
  const nWTerraceMid = addNav(-64, 2.75, 0, true);
  const nWTerraceS = addNav(-81, 2.75, 96, true);
  const nWTerraceWN = addNav(-102, 2.75, -42, true);
  const nWTerraceWS = addNav(-102, 2.75, 42, true);
  linkNav(nRingNW, nWTerraceN); linkNav(nRingSW, nWTerraceS);
  linkNav(nMidW, nWTerraceMid);
  linkNav(nHwyGroundN, nWTerraceWN); linkNav(nHwyGroundS, nWTerraceWS);
  linkNav(nWTerraceN, nWTerraceMid); linkNav(nWTerraceMid, nWTerraceS);
  linkNav(nWTerraceN, nWTerraceWN); linkNav(nWTerraceS, nWTerraceWS);
  linkNav(nWTerraceWN, nWTerraceWS);

  // Abandoned Power Plant (NW Terrace)
  buildBuilding({
    cx: -81, cz: -58, baseY: 2.6, width: 22, depth: 22, floors: 3, floorH: 4.1,
    extMat: mats.brickRedMat, intFloorMat: mats.concDarkMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nWTerraceN, stairSide: 'e'
  });

  // Ruined Factory Shell (SW Terrace)
  buildRuinedBuilding({
    cx: -81, cz: 58, baseY: 2.6, width: 22, depth: 22, floors: 3, floorH: 4.0,
    extMat: mats.brickGreyMat, intFloorMat: mats.concDarkMat,
    streetNodeIdx: nWTerraceS
  });

  // Industrial props on West Terrace
  addBox(-70, 2.6, -18, 3.2, 3.0, 8.2, mats.contRedMat);
  addBox(-72, 2.6, 18, 3.2, 3.0, 8.2, mats.contGreenMat);

  // ---------------- West Elevated Highway Viaduct & Broken Bridge (y = 5.6) ----------------
  addBox(-132, 0, -90, 14, 0.35, 150, mats.concDarkMat, false, false); // underside curb strip
  // North intact deck: z = -165 .. -14 (length 151)
  addBox(-132, 5.2, -89.5, 14, 0.4, 151, mats.concDarkMat);
  // South intact deck: z = +14 .. +165 (length 151)
  addBox(-132, 5.2, 89.5, 14, 0.4, 151, mats.concDarkMat);
  // Highway On-Ramps (North & South)
  addSlopeRamp(-132, 0, -195, 14, 5.6, 30, 'z', 1, mats.roadMat);
  addSlopeRamp(-132, 0, 195, 14, 5.6, 30, 'z', -1, mats.roadMat);

  // Collapsed Bridge Gap (-14 .. +14) bridged by sagging concrete & steel catwalk
  addSlopeRamp(-132, 5.6, -14, 5.5, -1.0, 14, 'z', 1, mats.rustMat);
  addSlopeRamp(-132, 4.6, 0, 5.5, 1.0, 14, 'z', 1, mats.rustMat);
  // Fallen slab debris underneath broken section
  addBox(-135.5, 0, -2, 6, 1.2, 9, mats.concDarkMat);

  // Highway Support Pillars
  for (const pz of [-152, -112, -72, -32, 32, 72, 112, 152]) {
    addBox(-136.5, 0, pz, 1.6, 5.2, 1.6, mats.concLightMat);
    addBox(-127.5, 0, pz, 1.6, 5.2, 1.6, mats.concLightMat);
  }
  // Highway Guardrails with sniper firing gaps
  for (const [rz, rl] of [[-142, 38], [-82, 44], [-34, 24], [34, 24], [82, 44], [142, 38]]) {
    addBox(-138.6, 5.6, rz, 0.55, 1.05, rl, mats.concLightMat);
    addBox(-125.4, 5.6, rz, 0.55, 1.05, rl, mats.concLightMat);
  }
  // Stranded vehicles on the viaduct
  buildVehicle(-130, -118, 0.18, mats.contBlueMat, false, 5.6);
  buildVehicle(-134, -52, -0.35, mats.rustMat, true, 5.6);
  buildBus(-131, 68, 0.12, 5.6);
  buildVehicle(-134, 126, 2.85, mats.contRedMat, false, 5.6);

  const nHwyN = addNav(-132, 5.75, -162, true);
  const nHwyMidN = addNav(-132, 5.75, -22, true);
  const nHwyMidS = addNav(-132, 5.75, 22, true);
  const nHwyS = addNav(-132, 5.75, 162, true);
  linkNav(nRingNW, nHwyN); linkNav(nHwyN, nHwyMidN);
  linkNav(nHwyMidN, nHwyMidS); linkNav(nHwyMidS, nHwyS);
  linkNav(nHwyS, nRingSW);

  // ---------------- Far-West Container Yard & Crane Sniper Tower ----------------
  addBox(-174, 0.25, -72, 3.6, 3.2, 9.6, mats.contRedMat);
  addBox(-174, 3.45, -72, 3.6, 3.2, 9.6, mats.contBlueMat);
  addBox(-186, 0.25, -45, 9.6, 3.2, 3.6, mats.contGreenMat);
  addBox(-208, 0.25, -80, 3.6, 3.2, 9.6, mats.rustMat);
  addBox(-174, 0.25, 68, 3.6, 3.2, 9.6, mats.contBlueMat);
  addBox(-174, 3.45, 68, 3.6, 3.2, 9.6, mats.contRedMat);
  addBox(-206, 0.25, 76, 9.6, 3.2, 3.6, mats.contGreenMat);
  // Ramp up onto stacked container catwalk
  addSlopeRamp(-182, 0.25, -26, 3.6, 3.2, 10, 'z', 1, mats.plankMat);
  addBox(-182, 0.25, -8, 3.6, 3.2, 16, mats.contGreenMat);
  addSlopeRamp(-182, 0.25, 16, 3.6, 3.2, 10, 'z', -1, mats.plankMat);

  // Far-West Sniper Scaffolding Tower (y = 0.25 -> 12.25)
  buildWatchtower(-204, 0.25, 0, 12.0, nYardN);

  // ---------------- East Multi-Tiered District (Tier 1 y = 2.6, Tier 2 Ridge y = 5.4) ----------------
  addBox(100, 0, 0, 88, 2.6, 224, mats.terraceMat, true, false);
  addSlopeRamp(88, 0, -126, 10, 2.6, 14, 'z', 1, mats.concDarkMat);
  addSlopeRamp(88, 0, 126, 10, 2.6, 14, 'z', -1, mats.concDarkMat);
  addStairs(50, 0, 0, 8, 2.6, 6, 'x', 1, mats.concDarkMat);

  const nETerraceN = addNav(86, 2.75, -96, true);
  const nETerraceMid = addNav(66, 2.75, 0, true);
  const nETerraceS = addNav(86, 2.75, 96, true);
  const nERidgeBaseN = addNav(136, 2.75, -48, true);
  const nERidgeBaseS = addNav(136, 2.75, 48, true);
  linkNav(nRingNE, nETerraceN); linkNav(nRingSE, nETerraceS);
  linkNav(nMidE, nETerraceMid);
  linkNav(nETerraceN, nETerraceMid); linkNav(nETerraceMid, nETerraceS);
  linkNav(nETerraceN, nERidgeBaseN); linkNav(nETerraceS, nERidgeBaseS);
  linkNav(nERidgeBaseN, nERidgeBaseS);

  // Abandoned Hospital / Hotel (NE Tier 1, 5 floors + rooftop = 22.1m)
  buildBuilding({
    cx: 86, cz: -58, baseY: 2.6, width: 22, depth: 24, floors: 5, floorH: 3.9,
    extMat: mats.concWarmMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nETerraceN, stairSide: 'e'
  });

  // Collapsed Residential Ruin (SE Tier 1, 4 floors ruined)
  buildRuinedBuilding({
    cx: 86, cz: 58, baseY: 2.6, width: 22, depth: 24, floors: 4, floorH: 3.8,
    extMat: mats.brickBrownMat, intFloorMat: mats.woodFloorMat,
    streetNodeIdx: nETerraceS
  });

  // East Tier 2 High Sniper Ridge (x = 156..234, z = -92..92, top y = 5.4)
  addBox(195, 0, 0, 78, 5.4, 184, mats.concWarmMat, true, false);
  addSlopeRamp(144, 2.6, -48, 8, 2.8, 12, 'x', 1, mats.concDarkMat);
  addSlopeRamp(144, 2.6, 48, 8, 2.8, 12, 'x', 1, mats.concDarkMat);
  addStairs(192, 0, -104, 8, 5.4, 12, 'z', 1, mats.concDarkMat);
  addStairs(192, 0, 104, 8, 5.4, 12, 'z', -1, mats.concDarkMat);

  const nRidgeN = addNav(172, 5.55, -48, true);
  const nRidgeMid = addNav(176, 5.55, 0, true);
  const nRidgeS = addNav(172, 5.55, 48, true);
  linkNav(nERidgeBaseN, nRidgeN); linkNav(nERidgeBaseS, nRidgeS);
  linkNav(nFarNE, nRidgeN); linkNav(nFarSE, nRidgeS);
  linkNav(nRidgeN, nRidgeMid); linkNav(nRidgeMid, nRidgeS);

  // Sniper Ridge Overlook Watchtower + Ruined Villa Bunkers
  buildWatchtower(196, 5.4, 0, 8.6, nRidgeMid);
  buildBuilding({
    cx: 196, cz: -56, baseY: 5.4, width: 16, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nRidgeN, stairSide: 'e'
  });
  buildRuinedBuilding({
    cx: 196, cz: 56, baseY: 5.4, width: 16, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.brickGreyMat, intFloorMat: mats.concDarkMat,
    streetNodeIdx: nRidgeS
  });

  // ---------------- North & South Steel Truss Cross-City Bridges (y = 4.8) ----------------
  function buildTrussBridge(zCenter, nWestTerrace, nEastTerrace) {
    const bw = 7.6;
    // Main bridge span over Central Boulevard (x = -44 .. +44, top y = 4.8)
    addBox(0, 4.4, zCenter, 88, 0.4, bw, mats.concDarkMat);
    // Ramps from West & East Terraces (y = 2.6 -> 4.8)
    addSlopeRamp(-56, 2.6, zCenter, bw, 2.2, 12, 'x', 1, mats.steelMat);
    addSlopeRamp(56, 2.6, zCenter, bw, 2.2, 12, 'x', -1, mats.steelMat);
    // Side Guardrails
    addBox(0, 4.8, zCenter - bw / 2 + 0.22, 88, 1.05, 0.35, mats.steelMat);
    addBox(0, 4.8, zCenter + bw / 2 - 0.22, 88, 1.05, 0.35, mats.steelMat);
    // Support Piers on avenue shoulders
    for (const px of [-24, 24]) {
      addBox(px, 0, zCenter - bw / 2 + 0.6, 1.4, 4.4, 1.2, mats.concLightMat);
      addBox(px, 0, zCenter + bw / 2 - 0.6, 1.4, 4.4, 1.2, mats.concLightMat);
    }
    // Overhead Steel Truss Arch (above head clearance y = 4.8 + 4.2 = 9.0)
    for (let px = -36; px <= 36; px += 12) {
      addBox(px, 4.8, zCenter - bw / 2 + 0.25, 0.42, 4.4, 0.42, mats.steelMat);
      addBox(px, 4.8, zCenter + bw / 2 - 0.25, 0.42, 4.4, 0.42, mats.steelMat);
      addBox(px, 9.0, zCenter, 0.42, 0.42, bw, mats.steelMat, false, false);
    }
    addBox(0, 9.1, zCenter - bw / 2 + 0.25, 76, 0.42, 0.42, mats.steelMat, false, false);
    addBox(0, 9.1, zCenter + bw / 2 - 0.25, 76, 0.42, 0.42, mats.steelMat, false, false);
    // Tactical cover on bridge
    addBox(-12, 4.8, zCenter - 1.2, 2.4, 1.05, 1.0, mats.sandbagMat);
    addBox(12, 4.8, zCenter + 1.2, 2.4, 1.05, 1.0, mats.sandbagMat);
    buildVehicle(0, zCenter, 0.35, mats.rustMat, false, 4.8);

    const nBW = addNav(-36, 4.95, zCenter, true);
    const nBM = addNav(0, 4.95, zCenter, true);
    const nBE = addNav(36, 4.95, zCenter, true);
    linkNav(nWestTerrace, nBW);
    linkNav(nBW, nBM);
    linkNav(nBM, nBE);
    linkNav(nBE, nEastTerrace);
  }

  buildTrussBridge(-92, nWTerraceN, nETerraceN);
  buildTrussBridge(92, nWTerraceS, nETerraceS);

  // ---------------- Outer Quadrant City Buildings (Fill 500x500 Perimeter Districts) ----------------
  buildBuilding({
    cx: -195, cz: -165, baseY: 0.25, width: 20, depth: 20, floors: 3, floorH: 3.8,
    extMat: mats.brickBrownMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'window', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nFarNW, stairSide: 'w'
  });
  buildRuinedBuilding({
    cx: -55, cz: -165, baseY: 0.25, width: 18, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.brickGreyMat, intFloorMat: mats.concDarkMat, streetNodeIdx: nRingNW
  });
  buildBuilding({
    cx: 195, cz: -165, baseY: 0.25, width: 20, depth: 20, floors: 4, floorH: 3.8,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'window', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nFarNE, stairSide: 'e'
  });
  buildRuinedBuilding({
    cx: 55, cz: -165, baseY: 0.25, width: 18, depth: 18, floors: 3, floorH: 3.8,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat, streetNodeIdx: nRingNE
  });

  buildBuilding({
    cx: -195, cz: 165, baseY: 0.25, width: 20, depth: 20, floors: 3, floorH: 3.8,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'window', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nFarSW, stairSide: 'w'
  });
  buildRuinedBuilding({
    cx: -55, cz: 165, baseY: 0.25, width: 18, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.brickBrownMat, intFloorMat: mats.concDarkMat, streetNodeIdx: nRingSW
  });
  buildBuilding({
    cx: 195, cz: 165, baseY: 0.25, width: 20, depth: 20, floors: 4, floorH: 3.8,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'window', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nFarSE, stairSide: 'e'
  });
  buildRuinedBuilding({
    cx: 55, cz: 165, baseY: 0.25, width: 18, depth: 18, floors: 3, floorH: 3.8,
    extMat: mats.brickGreyMat, intFloorMat: mats.woodFloorMat, streetNodeIdx: nRingSE
  });

  // ---------------- Fortified Team Bases (Red North / Blue South) ----------------
  function buildTeamBase(side) {
    const zSign = side === 'red' ? -1 : 1;
    const baseZ = zSign * 218;
    const frontZ = zSign * 192;
    const contMat = side === 'red' ? mats.contRedMat : mats.contBlueMat;
    const baseNode = side === 'red' ? nRedBase : nBlueBase;

    // Concrete Perimeter Blast Walls with 3 Exit Corridors
    addBox(-70, 0, frontZ, 38, 3.2, 1.4, mats.concDarkMat);
    addBox(70, 0, frontZ, 38, 3.2, 1.4, mats.concDarkMat);
    addBox(-24, 0, frontZ, 18, 2.4, 1.2, mats.concLightMat);
    addBox(24, 0, frontZ, 18, 2.4, 1.2, mats.concLightMat);

    // Command Bunker & Sandbag Trenches
    addBox(0, 0, baseZ + zSign * 14, 34, 0.22, 16, mats.concDarkMat, true, false);
    addWall(0, 0.22, baseZ + zSign * 6, 32, 3.4, 0.5, 'x', 'door', mats.concLightMat);
    addBox(0, 3.6, baseZ + zSign * 14, 35, 0.35, 17, mats.concDarkMat);
    addBox(-10, 0, frontZ - zSign * 6, 6.5, 1.15, 1.2, mats.sandbagMat);
    addBox(10, 0, frontZ - zSign * 6, 6.5, 1.15, 1.2, mats.sandbagMat);

    // Supply Containers & Military Vehicles inside Base
    addBox(-34, 0, baseZ - zSign * 4, 3.6, 3.2, 9.6, contMat);
    addBox(34, 0, baseZ - zSign * 4, 3.6, 3.2, 9.6, contMat);
    buildVehicle(-18, baseZ - zSign * 8, side === 'red' ? 0.2 : 3.0, contMat, true);
    buildVehicle(18, baseZ - zSign * 8, side === 'red' ? -0.25 : 2.9, mats.rustMat, false);

    // Base Sniper Watchtowers (Left & Right)
    buildWatchtower(-46, 0, frontZ - zSign * 6, 8.0, baseNode);
    buildWatchtower(46, 0, frontZ - zSign * 6, 8.0, baseNode);
  }

  buildTeamBase('red');
  buildTeamBase('blue');

  // Team Spawn Points (clear of all colliders)
  spawnPoints.red.push(
    new THREE.Vector3(0, 0, -214),
    new THREE.Vector3(-26, 0, -212),
    new THREE.Vector3(26, 0, -212),
    new THREE.Vector3(-62, 0, -206),
    new THREE.Vector3(62, 0, -206),
    new THREE.Vector3(-12, 0, -202),
    new THREE.Vector3(12, 0, -202)
  );
  spawnPoints.blue.push(
    new THREE.Vector3(0, 0, 214),
    new THREE.Vector3(-26, 0, 212),
    new THREE.Vector3(26, 0, 212),
    new THREE.Vector3(-62, 0, 206),
    new THREE.Vector3(62, 0, 206),
    new THREE.Vector3(-12, 0, 202),
    new THREE.Vector3(12, 0, 202)
  );

  // ---------------- Street Wrecks, Barricades, Trees & Streetlamps ----------------
  // Wrecked tanks & vehicles on Main Boulevards
  buildTankWreck(-6, -122, 0.42);
  buildTankWreck(6, 122, -2.7);
  buildBus(7, -64, 0.18);
  buildBus(-7, 64, 3.02);
  buildVehicle(-8, -166, -0.3, mats.contRedMat, false);
  buildVehicle(9, 166, 2.8, mats.contBlueMat, false);
  buildVehicle(-156, -8, 1.42, mats.rustMat, true);
  buildVehicle(150, 7, -1.55, mats.contGreenMat, false);
  buildVehicle(-24, -144, 1.5, mats.contBlueMat, false);
  buildVehicle(26, 144, -1.6, mats.contRedMat, false);

  // Concrete Jersey Barriers & Sandbag Checkpoints
  for (const [bx, bz, rot] of [
    [-10, -172, 0], [10, 172, 0], [-11, -38, 0], [11, 38, 0],
    [-152, 24, 1], [-152, -24, 1], [150, -128, 0], [-150, 128, 0],
    [-26, -148, 0], [26, 148, 0]
  ]) {
    if (rot === 0) addBox(bx, 0, bz, 8.5, 1.3, 1.15, mats.concDarkMat);
    else addBox(bx, 0, bz, 1.15, 1.3, 8.5, mats.concDarkMat);
  }

  // Abandoned Streetlamps along Grand Boulevard
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.7 });
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7 });
  for (let p = -180; p <= 180; p += 45) {
    if (Math.abs(p) < 38) continue;
    addBox(14.5, 0, p, 0.35, 6.8, 0.35, poleMat, true, false);
    addBox(13.5, 6.7, p, 1.9, 0.25, 0.35, bulbMat, false, false);
    addBox(-14.5, 0, p, 0.35, 6.8, 0.35, poleMat, true, false);
    addBox(-13.5, 6.7, p, 1.9, 0.25, 0.35, bulbMat, false, false);
  }

  // Overgrown Trees
  for (const [tx, tz] of [
    [-34, -124], [34, -124], [-34, 124], [34, 124],
    [-116, -112], [116, -112], [-116, 112], [116, 112],
    [-218, -40], [-218, 40], [220, -116], [220, 116],
    [-162, -195], [162, -195], [-162, 195], [162, 195]
  ]) {
    addBox(tx, 0, tz, 0.58, 4.8, 0.58, mats.barkMat);
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(2.6, 0), mats.foliageMat);
    crown.position.set(tx, 5.6, tz);
    crown.castShadow = true;
    crown.userData.st = 1;
    scene.add(crown);
  }

  // ---------------- Supply Pickup Coordinates ----------------
  supplyPoints.push(
    { type: 'medkit', pos: new THREE.Vector3(-6, 1.35, -16) },
    { type: 'armor', pos: new THREE.Vector3(6, 1.35, 16) },
    { type: 'ammo', pos: new THREE.Vector3(0, 13.05, 0) }, // Skybridge
    { type: 'medkit', pos: new THREE.Vector3(-81, 2.75, -58) },
    { type: 'ammo', pos: new THREE.Vector3(-81, 2.75, 58) },
    { type: 'armor', pos: new THREE.Vector3(86, 2.75, -58) },
    { type: 'medkit', pos: new THREE.Vector3(86, 2.75, 58) },
    { type: 'ammo', pos: new THREE.Vector3(-132, 5.75, -24) },
    { type: 'armor', pos: new THREE.Vector3(-132, 5.75, 24) },
    { type: 'ammo', pos: new THREE.Vector3(0, 4.95, -92) },
    { type: 'armor', pos: new THREE.Vector3(0, 4.95, 92) },
    { type: 'medkit', pos: new THREE.Vector3(196, 5.55, 0) },
    { type: 'ammo', pos: new THREE.Vector3(-204, 0.4, 0) },
    { type: 'ammo', pos: new THREE.Vector3(0, 0.2, -204) },
    { type: 'armor', pos: new THREE.Vector3(8, 0.2, -204) },
    { type: 'ammo', pos: new THREE.Vector3(0, 0.2, 204) },
    { type: 'armor', pos: new THREE.Vector3(-8, 0.2, 204) }
  );

  // ---------------- Atmospheric Dust Particles ----------------
  const dg = new THREE.BufferGeometry();
  const dp = new Float32Array(1100 * 3);
  for (let i = 0; i < 1100; i++) {
    dp[i * 3] = (Math.random() - 0.5) * 460;
    dp[i * 3 + 1] = 0.5 + Math.random() * 24;
    dp[i * 3 + 2] = (Math.random() - 0.5) * 460;
  }
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dustMesh = new THREE.Points(
    dg,
    new THREE.PointsMaterial({ color: 0xfde68a, size: 0.16, transparent: true, opacity: 0.42 })
  );
  scene.add(dustMesh);

  return {
    mapId: MAP_ID,
    mapName: MAP_NAME,
    mapHalf: MAP_HALF,
    dustMesh,
    sunRef,
    hemiRef,
    envTex,
    colliders,
    navNodes,
    flickeringLights,
    mapLights,
    stairRamps,
    windowOpenings,
    spawnPoints,
    supplyPoints
  };
}

export const buildAbandonedCityMap = buildMap1;