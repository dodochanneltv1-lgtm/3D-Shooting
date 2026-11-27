import * as THREE from 'three';

export const MAP_ID = 'maps_2';
export const MAP_NAME = 'Maps-2: Republic of Aurelia (1000 Chunks BR)';
export const MAP_HALF = 500; // 1000 x 1000 Chunks (-500 .. +500)

// ---------------- Procedural Country & Biome Textures ----------------
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

function createCountryMaterials() {
  const asphaltBump = makeTex(512, (ctx, s) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 6500; i++) {
      const g = 90 + Math.floor(Math.random() * 80);
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
  }, 40, 40, false);

  const asphaltTex = makeTex(512, (ctx, s) => {
    ctx.fillStyle = '#25292f';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 7000; i++) {
      const v = 26 + Math.floor(Math.random() * 35);
      ctx.fillStyle = `rgb(${v},${v + 2},${v + 4})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = 'rgba(54,70,40,0.20)';
      ctx.beginPath();
      ctx.arc(Math.random() * s, Math.random() * s, 12 + Math.random() * 26, 0, Math.PI * 2);
      ctx.fill();
    }
  }, 40, 40);

  const mkBiomeGround = (baseHex, spekA, spekB, rx = 36, ry = 36) => new THREE.MeshStandardMaterial({
    map: makeTex(256, (ctx, s) => {
      ctx.fillStyle = baseHex;
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2800; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? spekA : spekB;
        ctx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
      }
      for (let i = 0; i < 16; i++) {
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 10 + Math.random() * 22, 0, Math.PI * 2);
        ctx.fill();
      }
    }, rx, ry),
    roughness: 0.94
  });

  const mkBrick = (col, rx = 3, ry = 2) => new THREE.MeshStandardMaterial({
    map: makeTex(256, (ctx, s) => {
      ctx.fillStyle = '#71717a';
      ctx.fillRect(0, 0, s, s);
      const bh = s / 8, bw = s / 4;
      for (let r = 0; r < 8; r++) {
        for (let c = -1; c <= 4; c++) {
          ctx.fillStyle = col;
          ctx.globalAlpha = 0.75 + Math.random() * 0.25;
          ctx.fillRect(c * bw + (r % 2) * (bw / 2) + 2, r * bh + 2, bw - 4, bh - 4);
        }
      }
      ctx.globalAlpha = 1;
    }, rx, ry),
    roughness: 0.88
  });

  const mkConc = (hex, rx = 2, ry = 2) => new THREE.MeshStandardMaterial({
    map: makeTex(256, (ctx, s) => {
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(Math.random() * s, Math.random() * s, 3, 3);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
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
      for (let i = 0; i < 12; i++) {
        ctx.fillStyle = 'rgba(120,53,15,0.34)';
        ctx.beginPath();
        ctx.arc(Math.random() * s, Math.random() * s, 6 + Math.random() * 12, 0, Math.PI * 2);
        ctx.fill();
      }
    }, 2, 1),
    roughness: 0.55,
    metalness: 0.45
  });

  return {
    waterMat: new THREE.MeshStandardMaterial({ color: 0x1b4f68, roughness: 0.14, metalness: 0.45, transparent: true, opacity: 0.86 }),
    sandMat: mkBiomeGround('#b7a379', 'rgba(255,255,255,0.1)', 'rgba(110,90,50,0.14)', 48, 48),
    grassMat: mkBiomeGround('#4a5b3b', 'rgba(30,45,20,0.18)', 'rgba(110,130,70,0.14)', 44, 44),
    desertMat: mkBiomeGround('#967c5a', 'rgba(70,50,30,0.15)', 'rgba(210,180,130,0.12)', 24, 24),
    highlandMat: mkBiomeGround('#6b726c', 'rgba(40,45,42,0.18)', 'rgba(220,225,230,0.14)', 24, 24),
    roadMat: new THREE.MeshStandardMaterial({ map: asphaltTex, bumpMap: asphaltBump, bumpScale: 0.06, roughness: 0.85 }),
    concDarkMat: mkConc('#424850', 2, 2),
    concLightMat: mkConc('#7d848d', 2, 2),
    marbleMat: mkConc('#b8bcc2', 3, 3),
    brickRedMat: mkBrick('#7a3b32'),
    brickBrownMat: mkBrick('#6d5542'),
    brickGreyMat: mkBrick('#5a626b'),
    woodFloorMat: new THREE.MeshStandardMaterial({ color: 0x624730, roughness: 0.86 }),
    tileFloorMat: mkConc('#858f99', 4, 4),
    plankMat: new THREE.MeshStandardMaterial({ color: 0x6b4c30, roughness: 0.88 }),
    glassMat: new THREE.MeshPhysicalMaterial({ color: 0x9ec5d6, transparent: true, opacity: 0.34, roughness: 0.08, metalness: 0.2 }),
    contRedMat: mkMetal('#8c2824'),
    contBlueMat: mkMetal('#234678'),
    contGreenMat: mkMetal('#265436'),
    rustMat: mkMetal('#5c3a24'),
    steelMat: new THREE.MeshStandardMaterial({ color: 0x3b424c, roughness: 0.5, metalness: 0.72 }),
    bridgeRedMat: mkMetal('#992d25'),
    planeMat: mkConc('#cbd5e1', 2, 2),
    foliageMat: new THREE.MeshStandardMaterial({ color: 0x385229, roughness: 0.92 }),
    pineMat: new THREE.MeshStandardMaterial({ color: 0x263f2a, roughness: 0.92 }),
    barkMat: new THREE.MeshStandardMaterial({ color: 0x3f3226, roughness: 0.95 }),
    sandbagMat: new THREE.MeshStandardMaterial({ color: 0x8a795d, roughness: 0.95 }),
    tankMat: new THREE.MeshStandardMaterial({ color: 0x454a3c, roughness: 0.72, metalness: 0.42 }),
    busMat: mkMetal('#a16207'),
    tireMat: new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 }),
    whiteMat: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 }),
    beaconMat: new THREE.MeshBasicMaterial({ color: 0xfef08a }),
    rubbleMats: [0x57534e, 0x78716c, 0x3f3f46, 0x6b5b4b].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.98 }))
  };
}

// ---------------- Main Battle Royale Country Builder ----------------
export function buildMap2(scene, ctx = {}) {
  const colliders = ctx.colliders || [];
  const navNodes = ctx.navNodes || [];
  const flickeringLights = ctx.flickeringLights || [];
  const mapLights = ctx.mapLights || [];
  const stairRamps = ctx.stairRamps || [];
  const windowOpenings = ctx.windowOpenings || [];
  const spawnPoints = ctx.spawnPoints || { red: [], blue: [] };
  const supplyPoints = ctx.supplyPoints || [];
  const brSpawnPoints = ctx.brSpawnPoints || [];
  const regions = ctx.regions || [];

  colliders.length = 0;
  navNodes.length = 0;
  flickeringLights.length = 0;
  mapLights.length = 0;
  stairRamps.length = 0;
  windowOpenings.length = 0;
  spawnPoints.red = [];
  spawnPoints.blue = [];
  supplyPoints.length = 0;
  brSpawnPoints.length = 0;
  regions.length = 0;

  const mats = createCountryMaterials();
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

  function addBox(x, y, z, w, h, d, mat, col = true, cs = false) {
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

  function addRoadStrip(x, y, z, w, d, mat = mats.roadMat) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y + 0.025, z);
    m.receiveShadow = true;
    scene.add(m);
    return m;
  }

  function addStairs(x, ys, zs, w, th, len, ax, dir, mat) {
    const ramp = { x, z: zs, axis: ax, dir, width: w, length: len, baseY: ys, height: th };
    stairRamps.push(ramp);
    const st = Math.max(6, Math.ceil(th / 0.32));
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
    visual.receiveShadow = true;
    visual.userData.st = 1;
    scene.add(visual);

    const absH = Math.abs(th);
    const st = Math.max(6, Math.ceil(absH / 0.3));
    const sh = th / st;
    const sd = len / st;
    for (let i = 0; i < st; i++) {
      const h = ys + (i + 1) * sh;
      const base = Math.min(ys, h) - 0.3;
      const top = Math.max(ys, h);
      const off = dir * (i + 0.5) * sd;
      const rx = ax === 'x' ? x + off : x;
      const rz = ax === 'z' ? zs + off : zs;
      const rw = ax === 'z' ? w : sd + 0.06;
      const rd = ax === 'z' ? sd + 0.06 : w;
      colliders.push({
        minX: rx - rw / 2,
        maxX: rx + rw / 2,
        minY: base,
        maxY: top,
        minZ: rz - rd / 2,
        maxZ: rz + rd / 2,
        stairRamp: ramp
      });
    }
    return ramp;
  }

  function addWall(cx, y, cz, len, h, th, dir, tp, mat, gl = false) {
    if (tp === 'solid') {
      if (dir === 'x') addBox(cx, y, cz, len, h, th, mat, true, true);
      else addBox(cx, y, cz, th, h, len, mat, true, true);
      return;
    }
    if (tp === 'door') {
      const dw = 3.4, dh = 2.95, sd = (len - dw) / 2;
      if (dir === 'x') {
        if (sd > 0.1) {
          addBox(cx - dw / 2 - sd / 2, y, cz, sd, h, th, mat, true, true);
          addBox(cx + dw / 2 + sd / 2, y, cz, sd, h, th, mat, true, true);
        }
        if (h > dh) addBox(cx, y + dh, cz, dw, h - dh, th, mat, true, true);
      } else {
        if (sd > 0.1) {
          addBox(cx, y, cz - dw / 2 - sd / 2, th, h, sd, mat, true, true);
          addBox(cx, y, cz + dw / 2 + sd / 2, th, h, sd, mat, true, true);
        }
        if (h > dh) addBox(cx, y + dh, cz, th, h - dh, dw, mat, true, true);
      }
      return;
    }
    if (tp === 'broken') {
      const seg = Math.max(1.8, len * 0.28);
      if (dir === 'x') {
        addBox(cx - len / 2 + seg / 2, y, cz, seg, h * 0.85, th, mat, true, true);
        addBox(cx + len / 2 - seg / 2, y, cz, seg, h * 0.62, th, mat, true, true);
        addBox(cx, y, cz, len - seg * 2, 0.85, th, mat, true, true);
      } else {
        addBox(cx, y, cz - len / 2 + seg / 2, th, h * 0.85, seg, mat, true, true);
        addBox(cx, y, cz + len / 2 - seg / 2, th, h * 0.62, seg, mat, true, true);
        addBox(cx, y, cz, th, 0.85, len - seg * 2, mat, true, true);
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
      addBox(cx, y, cz, len, sh, th, mat, true, true);
      if (top > 0.1) addBox(cx, y + sh + wh, cz, len, top, th, mat, true, true);
    } else {
      addBox(cx, y, cz, th, sh, len, mat, true, true);
      if (top > 0.1) addBox(cx, y + sh + wh, cz, th, top, len, mat, true, true);
    }
    const pts = [-len / 2];
    for (const ox of ops) pts.push(ox - ww / 2, ox + ww / 2);
    pts.push(len / 2);
    for (let i = 0; i < pts.length; i += 2) {
      const sg = pts[i + 1] - pts[i];
      const mid = (pts[i] + pts[i + 1]) / 2;
      if (sg > 0.1) {
        if (dir === 'x') addBox(cx + mid, y + sh, cz, sg, wh, th, mat, true, true);
        else addBox(cx, y + sh, cz + mid, th, wh, sg, mat, true, true);
      }
    }
    if (gl) {
      for (const ox of ops) {
        if (dir === 'x') addBox(cx + ox - ww * 0.28, y + sh, cz, ww * 0.42, wh * 0.55, 0.04, mats.glassMat, false, false);
        else addBox(cx, y + sh, cz + ox - ww * 0.28, 0.04, wh * 0.55, ww * 0.42, mats.glassMat, false, false);
      }
    }
  }

  function addInteriorLight(x, y, z, color = 0xffd2a1, intensity = 1.6, dist = 24) {
    if (pointLightCount >= 4) return;
    pointLightCount++;
    const pl = new THREE.PointLight(color, intensity, dist);
    pl.position.set(x, y, z);
    scene.add(pl);
    mapLights.push(pl);
    if (Math.random() < 0.4) {
      flickeringLights.push({ light: pl, base: intensity, phase: Math.random() * 12 });
    }
  }

  function buildBuilding({
    cx, cz, baseY = 1.2, width, depth, floors, floorH = 3.9,
    extMat, intFloorMat, doorsOn1F, upperWin,
    rooftopAccess = true, streetNodeIdx = -1, stairSide = 'e'
  }) {
    const T = 0.45, sw = 3.0, sl = Math.min(6.0, depth - T * 2 - 5.0);
    const sx = stairSide === 'w'
      ? cx - width / 2 + T + sw / 2 + 0.2
      : cx + width / 2 - T - sw / 2 - 0.2;
    const ww = width - T * 2 - sw - 0.5;
    const wx = stairSide === 'w'
      ? cx + width / 2 - T - ww / 2
      : cx - width / 2 + T + ww / 2;

    addBox(cx, baseY, cz, width, 0.18, depth, intFloorMat, true, false);
    let prevN = -1;

    for (let f = 0; f < floors; f++) {
      const y0 = baseY + f * floorH;
      const wc = f === 0 ? doorsOn1F : upperWin;
      addWall(cx, y0, cz - depth / 2 + T / 2, width, floorH, T, 'x', wc.n, extMat, f > 0);
      addWall(cx, y0, cz + depth / 2 - T / 2, width, floorH, T, 'x', wc.s, extMat, f > 0);
      addWall(cx - width / 2 + T / 2, y0, cz, depth - T * 2, floorH, T, 'z', wc.w, extMat, f > 0);
      addWall(cx + width / 2 - T / 2, y0, cz, depth - T * 2, floorH, T, 'z', wc.e, extMat, f > 0);

      const rN = addNav(wx, y0 + 0.2, cz - depth * 0.24, f > 0);
      const rS = addNav(wx, y0 + 0.2, cz + depth * 0.24, f > 0);
      linkNav(rN, rS);

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
          linkNav(d, rN); linkNav(d, rS);
          if (streetNodeIdx >= 0) linkNav(streetNodeIdx, d);
        }
        if (wc.e === 'door' && stairSide !== 'e') {
          const d = addNav(cx + width / 2 + 3, baseY + 0.2, cz);
          linkNav(d, rN); linkNav(d, rS);
          if (streetNodeIdx >= 0) linkNav(streetNodeIdx, d);
        }
      }
      if (prevN >= 0) linkNav(prevN, rN);

      const up = (f < floors - 1) || rooftopAccess;
      const sy = y0 + floorH - 0.3;
      if (up) {
        addBox(wx, sy, cz, ww, 0.3, depth - T * 2, intFloorMat);
        const zs = cz + depth / 2 - T - 2.5;
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
          addBox(sx, sy, zs + 1.25, sw + 0.5, 0.3, 2.5, intFloorMat);
          sb = addNav(laneB, y0 + 0.2, zt - 1.0, true);
          st = addNav(laneB, y0 + floorH + 0.05, zs + 1.25, true);
          linkNav(rN, sb);
        }
        linkNav(sb, st);
        prevN = st;
      } else {
        addBox(cx, sy, cz, width + 0.6, 0.35, depth + 0.6, mats.concDarkMat);
      }

      if (f === 0) addInteriorLight(wx, y0 + floorH - 0.7, cz, 0xffd2a1, 1.5, 22);
      addBox(wx + (stairSide === 'w' ? ww * 0.28 : -ww * 0.28), y0 + 0.18, cz - depth * 0.2, 1.5, 0.9, 1.1, mats.plankMat);
    }

    if (rooftopAccess) {
      const ry = baseY + floors * floorH;
      addWall(cx, ry, cz - depth / 2 + 0.3, width, 1.1, 0.4, 'x', 'solid', mats.concDarkMat);
      addWall(cx, ry, cz + depth / 2 - 0.3, width, 1.1, 0.4, 'x', 'solid', mats.concDarkMat);
      addWall(cx - width / 2 + 0.3, ry, cz, depth - 0.8, 1.1, 0.4, 'z', 'solid', mats.concDarkMat);
      addWall(cx + width / 2 - 0.3, ry, cz, depth - 0.8, 1.1, 0.4, 'z', 'solid', mats.concDarkMat);
      addBox(cx - width * 0.2, ry, cz - depth * 0.2, 2.4, 1.5, 2.2, mats.rustMat);
      const rn = addNav(wx, ry + 0.1, cz, true);
      if (prevN >= 0) linkNav(prevN, rn);
    }
  }

  function buildRuinedBuilding({ cx, cz, baseY = 1.2, width, depth, floors = 2, floorH = 3.8, extMat, intFloorMat, streetNodeIdx = -1 }) {
    const T = 0.48, sw = 3.0, sl = Math.min(5.6, depth - T * 2 - 5.0);
    const sx = cx + width / 2 - T - sw / 2 - 0.2;
    const ww = width - T * 2 - sw - 0.5;
    const wx = cx - width / 2 + T + ww / 2;

    addBox(cx, baseY, cz, width, 0.18, depth, intFloorMat, true, false);
    let prevN = -1;

    for (let f = 0; f < floors; f++) {
      const y0 = baseY + f * floorH;
      addWall(cx, y0, cz - depth / 2 + T / 2, width, floorH, T, 'x', f === 0 ? 'door' : 'broken', extMat, false);
      addWall(cx, y0, cz + depth / 2 - T / 2, width, floorH, T, 'x', f === 0 ? 'door' : 'broken', extMat, false);
      addWall(cx - width / 2 + T / 2, y0, cz, depth - T * 2, floorH, T, 'z', 'broken', extMat, false);
      addWall(cx + width / 2 - T / 2, y0, cz, depth - T * 2, floorH, T, 'z', f === floors - 1 ? 'broken' : 'solid', extMat, false);

      const rN = addNav(wx, y0 + 0.2, cz - depth * 0.22, f > 0);
      const rS = addNav(wx, y0 + 0.2, cz + depth * 0.22, f > 0);
      linkNav(rN, rS);
      if (f === 0) {
        const dN = addNav(cx, baseY + 0.2, cz - depth / 2 - 3);
        const dS = addNav(cx, baseY + 0.2, cz + depth / 2 + 3);
        linkNav(dN, rN); linkNav(dS, rS);
        if (streetNodeIdx >= 0) { linkNav(streetNodeIdx, dN); linkNav(streetNodeIdx, dS); }
      }
      if (prevN >= 0) linkNav(prevN, rN);

      if (f < floors - 1) {
        const sy = y0 + floorH - 0.3;
        addBox(wx, sy, cz, ww, 0.3, depth - T * 2, intFloorMat);
        const zs = cz + depth / 2 - T - 2.4;
        const zt = zs - sl;
        const ni = cz - depth / 2 + T;
        if (zt - ni > 0.2) addBox(sx, sy, ni + (zt - ni) / 2, sw + 0.5, 0.3, zt - ni, intFloorMat);
        const lw = sw / 2, laneA = sx - lw / 2;
        addStairs(laneA, y0 + 0.18, zs, lw, floorH - 0.18, sl, 'z', -1, mats.concDarkMat);
        const sb = addNav(laneA, y0 + 0.2, zs + 1.0, f > 0);
        const st = addNav(laneA, y0 + floorH + 0.05, zt - 1.0, true);
        linkNav(rS, sb); linkNav(sb, st);
        prevN = st;
      }
    }
  }

  function buildWatchtower(cx, baseY, cz, height = 9.0, linkNode = -1) {
    const w = 5.4, hw = w / 2, p = 0.42;
    for (const sx of [-hw + p / 2, hw - p / 2]) {
      for (const sz of [-hw + p / 2, hw - p / 2]) {
        addBox(cx + sx, baseY, cz + sz, p, height, p, mats.steelMat, true, true);
      }
    }
    const midY = baseY + height / 2;
    addStairs(cx - 1.0, baseY, cz - 2.2, 1.8, height / 2, 4.4, 'z', 1, mats.plankMat);
    addBox(cx, midY - 0.25, cz + 2.2, w - 0.8, 0.25, 1.4, mats.plankMat);
    addStairs(cx + 1.0, midY, cz + 1.8, 1.8, height / 2, 4.0, 'z', -1, mats.plankMat);
    addBox(cx - 1.0, baseY + height - 0.28, cz, 2.6, 0.28, w - 0.6, mats.concDarkMat);
    addBox(cx + 1.1, baseY + height - 0.28, cz - 1.9, 1.8, 0.28, 1.6, mats.concDarkMat);
    addWall(cx, baseY + height, cz - hw + 0.22, w, 1.05, 0.35, 'x', 'solid', mats.sandbagMat);
    addWall(cx, baseY + height, cz + hw - 0.22, w, 1.05, 0.35, 'x', 'solid', mats.sandbagMat);
    addWall(cx - hw + 0.22, baseY + height, cz, w - 0.7, 1.05, 0.35, 'z', 'solid', mats.sandbagMat);
    addWall(cx + hw - 0.22, baseY + height, cz, w - 0.7, 1.05, 0.35, 'z', 'solid', mats.sandbagMat);

    const nBot = addNav(cx - 1.0, baseY + 0.2, cz - 3.3, false);
    const nMid = addNav(cx, midY + 0.1, cz + 2.2, true);
    const nTop = addNav(cx - 1.0, baseY + height + 0.1, cz, true);
    linkNav(nBot, nMid); linkNav(nMid, nTop);
    if (linkNode >= 0) linkNav(linkNode, nBot);
    return { nBot, nTop };
  }

  function buildVehicle(x, z, ry, mat, truck = false, baseY = 1.2) {
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
      for (const wz of [-len * 0.32, len * 0.32]) ap(wx, 0.38, wz, 0.3, 0.75, 0.75, mats.tireMat);
    }
    const h = Math.abs(Math.sin(ry)) > 0.5 ? [len / 2, wid / 2] : [wid / 2, len / 2];
    colliders.push({ minX: x - h[0], maxX: x + h[0], minY: baseY, maxY: baseY + (truck ? 2.1 : 1.65), minZ: z - h[1], maxZ: z + h[1] });
  }

  function buildBus(x, z, ry, baseY = 1.2) {
    const g = new THREE.Group();
    g.position.set(x, baseY, z);
    g.rotation.y = ry;
    scene.add(g);
    const len = 10.6, wid = 2.65;
    const ap = (px, py, pz, pw, ph, pd, m) => {
      const k = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), m);
      k.position.set(px, py, pz);
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
    for (const wx of [-wid / 2, wid / 2]) {
      for (const wz of [-3.4, 3.4]) ap(wx, 0.45, wz, 0.35, 0.9, 0.9, mats.tireMat);
    }
    const h = Math.abs(Math.sin(ry)) > 0.5 ? [len / 2, wid / 2] : [wid / 2, len / 2];
    colliders.push({ minX: x - h[0], maxX: x + h[0], minY: baseY, maxY: baseY + 2.65, minZ: z - h[1], maxZ: z + h[1] });
  }

  function buildTankWreck(x, z, ry, baseY = 1.2) {
    const g = new THREE.Group();
    g.position.set(x, baseY, z);
    g.rotation.y = ry;
    scene.add(g);
    const ap = (px, py, pz, pw, ph, pd, m, rx = 0) => {
      const k = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), m);
      k.position.set(px, py, pz);
      k.rotation.x = rx;
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

  // ---------------- Sky, Environment, Sun & Ocean Floor ----------------
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x2d4a66) },
      midColor: { value: new THREE.Color(0x88a1b5) },
      horizonColor: { value: new THREE.Color(0xe0bd94) },
      sunDir: { value: new THREE.Vector3(0.5, 0.38, 0.35).normalize() }
    },
    vertexShader: `varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.0);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader: `uniform vec3 topColor,midColor,horizonColor,sunDir;varying vec3 vW;void main(){vec3 d=normalize(vW);float h=clamp(d.y,0.0,1.0);vec3 c=mix(horizonColor,midColor,smoothstep(0.0,0.25,h));c=mix(c,topColor,smoothstep(0.25,0.85,h));float sd=max(dot(d,sunDir),0.0);c+=vec3(1.0,0.78,0.5)*pow(sd,24.0)*0.55+vec3(1.0,0.92,0.8)*smoothstep(0.996,0.9995,sd)*1.4;gl_FragColor=vec4(c,1.0);}`
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1400, 24, 16), skyMat));

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

  scene.fog = new THREE.Fog(0x9fb0bd, 55, 420);
  const hemiRef = new THREE.HemisphereLight(0xc2d5e8, 0x3b352a, 0.82);
  scene.add(hemiRef);

  const sunRef = new THREE.DirectionalLight(0xffe3bf, 1.75);
  sunRef.position.set(280, 240, 180);
  sunRef.castShadow = true;
  sunRef.shadow.mapSize.set(2048, 2048);
  sunRef.shadow.camera.left = -505;
  sunRef.shadow.camera.right = 505;
  sunRef.shadow.camera.top = 505;
  sunRef.shadow.camera.bottom = -505;
  sunRef.shadow.camera.far = 960;
  sunRef.shadow.bias = -0.0005;
  scene.add(sunRef);

  // Base Seabed / Riverbed (y = 0) & Coastal Beach / Water Visual
  const seabed = new THREE.Mesh(new THREE.PlaneGeometry(MAP_HALF * 2.4, MAP_HALF * 2.4), mats.sandMat);
  seabed.rotation.x = -Math.PI / 2;
  seabed.receiveShadow = true;
  scene.add(seabed);

  const waterSurface = new THREE.Mesh(new THREE.PlaneGeometry(MAP_HALF * 2.4, MAP_HALF * 2.4), mats.waterMat);
  waterSurface.rotation.x = -Math.PI / 2;
  waterSurface.position.y = 0.09;
  scene.add(waterSurface);

  // Country Perimeter Boundary (1000x1000)
  addBox(0, 0, -MAP_HALF, MAP_HALF * 2 + 4, 8, 2.5, mats.concDarkMat, true, false);
  addBox(0, 0, MAP_HALF, MAP_HALF * 2 + 4, 8, 2.5, mats.concDarkMat, true, false);
  addBox(-MAP_HALF, 0, 0, 2.5, 8, MAP_HALF * 2 + 4, mats.concDarkMat, true, false);
  addBox(MAP_HALF, 0, 0, 2.5, 8, MAP_HALF * 2 + 4, mats.concDarkMat, true, false);

  // ---------------- Sovereign Island Landmass (y = 1.2) Divided by Central River (z = -18 .. +18) ----------------
  // North Half of Country (z: -445 .. -18) & South Half (z: +18 .. +445)
  addBox(0, 0, -231.5, 890, 1.2, 427, mats.grassMat, true, false);
  addBox(0, 0, 231.5, 890, 1.2, 427, mats.grassMat, true, false);

  // Coastal Beach Ramps (from ocean shore y = 0 up onto country landmass y = 1.2)
  for (const cx of [-340, -180, 0, 180, 340]) {
    addSlopeRamp(cx, 0, -453, 14, 1.2, 8, 'z', 1, mats.sandMat);
    addSlopeRamp(cx, 0, 453, 14, 1.2, 8, 'z', -1, mats.sandMat);
  }
  for (const cz of [-340, -160, 160, 340]) {
    addSlopeRamp(-453, 0, cz, 14, 1.2, 8, 'x', 1, mats.sandMat);
    addSlopeRamp(453, 0, cz, 14, 1.2, 8, 'x', -1, mats.sandMat);
  }

  // Riverbank Access Stairs along the Central River (y = 0 -> 1.2)
  for (const rx of [-380, -300, -155, -55, 55, 155, 290, 405]) {
    addSlopeRamp(rx, 0, -12, 10, 1.2, 6, 'z', -1, mats.concDarkMat);
    addSlopeRamp(rx, 0, 12, 10, 1.2, 6, 'z', 1, mats.concDarkMat);
  }

  // ---------------- National Highway & Road Network (on y = 1.2) ----------------
  // North-South Central Expressway (x = 0)
  addRoadStrip(0, 1.2, -135, 16, 234);
  addRoadStrip(0, 1.2, 135, 16, 234);
  // North & South Ring Highways (z = -175 and z = +175)
  addRoadStrip(0, 1.2, -175, 740, 14);
  addRoadStrip(0, 1.2, 175, 740, 14);
  // West & East National Arteries (x = -260 and x = +210)
  addRoadStrip(-260, 1.2, -230, 14, 340);
  addRoadStrip(-260, 1.2, 230, 14, 340);
  addRoadStrip(210, 1.2, -230, 14, 424);
  addRoadStrip(210, 1.2, 230, 14, 424);
  // Capital Waterfront Roads (z = -42 and z = +42)
  addRoadStrip(0, 1.2, -42, 280, 12);
  addRoadStrip(0, 1.2, 42, 280, 12);

  // ---------------- National Navigation Spine ----------------
  const nCapN = addNav(0, 1.35, -44);
  const nCapMidN = addNav(0, 1.35, -135);
  const nCapS = addNav(0, 1.35, 44);
  const nCapMidS = addNav(0, 1.35, 135);

  const nRingNW = addNav(-260, 1.35, -175);
  const nRingNC = addNav(0, 1.35, -175);
  const nRingNE = addNav(210, 1.35, -175);
  const nRingSW = addNav(-260, 1.35, 175);
  const nRingSC = addNav(0, 1.35, 175);
  const nRingSE = addNav(210, 1.35, 175);

  const nAirport = addNav(-260, 1.35, -280);
  const nOilPort = addNav(310, 1.35, -285);
  const nHarbor = addNav(-305, 1.35, 290);
  const nVillage = addNav(315, 1.35, -90);
  const nFarmS = addNav(315, 1.35, 90);

  linkNav(nCapN, nCapMidN); linkNav(nCapMidN, nRingNC);
  linkNav(nCapS, nCapMidS); linkNav(nCapMidS, nRingSC);
  linkNav(nRingNW, nRingNC); linkNav(nRingNC, nRingNE);
  linkNav(nRingSW, nRingSC); linkNav(nRingSC, nRingSE);
  linkNav(nRingNW, nAirport);
  linkNav(nRingNE, nOilPort);
  linkNav(nRingNE, nVillage);
  linkNav(nRingSE, nFarmS);
  linkNav(nRingSW, nHarbor);

  // ---------------- 4 Major Bridges Across the National River ----------------
  // 1. Capital Central Arch Bridge (x = 0, z = -18 .. +18)
  addSlopeRamp(0, 1.2, -18, 16, 3.4, 10, 'z', 1, mats.roadMat);
  addBox(0, 4.2, 0, 16, 0.4, 16, mats.roadMat);
  addSlopeRamp(0, 1.2, 18, 16, 3.4, 10, 'z', -1, mats.roadMat);
  addBox(-7.7, 4.6, 0, 0.5, 1.1, 20, mats.marbleMat);
  addBox(7.7, 4.6, 0, 0.5, 1.1, 20, mats.marbleMat);
  addBox(-7.7, 4.6, 0, 0.6, 5.5, 2.2, mats.marbleMat, false, false);
  addBox(7.7, 4.6, 0, 0.6, 5.5, 2.2, mats.marbleMat, false, false);
  addBox(0, 9.8, 0, 16.2, 0.6, 1.8, mats.marbleMat, false, false);
  buildVehicle(2.5, 1, 0.2, mats.contBlueMat, false, 4.6);
  const nCapBridge = addNav(0, 4.8, 0, true);
  linkNav(nCapN, nCapBridge); linkNav(nCapBridge, nCapS);

  // 2. East Steel Truss Bridge (x = +210, z = -18 .. +18)
  addSlopeRamp(210, 1.2, -18, 12, 3.2, 10, 'z', 1, mats.steelMat);
  addBox(210, 4.0, 0, 12, 0.4, 16, mats.concDarkMat);
  addSlopeRamp(210, 1.2, 18, 12, 3.2, 10, 'z', -1, mats.steelMat);
  addBox(204.3, 4.4, 0, 0.45, 1.1, 18, mats.steelMat);
  addBox(215.7, 4.4, 0, 0.45, 1.1, 18, mats.steelMat);
  for (const bz of [-8, 0, 8]) {
    addBox(204.3, 4.4, bz, 0.45, 4.2, 0.45, mats.steelMat);
    addBox(215.7, 4.4, bz, 0.45, 4.2, 0.45, mats.steelMat);
    addBox(210, 8.4, bz, 11.8, 0.4, 0.45, mats.steelMat, false, false);
  }
  const nEastBridgeN = addNav(210, 1.35, -30);
  const nEastBridgeM = addNav(210, 4.6, 0, true);
  const nEastBridgeS = addNav(210, 1.35, 30);
  linkNav(nRingNE, nEastBridgeN); linkNav(nEastBridgeN, nEastBridgeM);
  linkNav(nEastBridgeM, nEastBridgeS); linkNav(nEastBridgeS, nRingSE);
  linkNav(nEastBridgeN, nVillage); linkNav(nEastBridgeS, nFarmS);

  // 3. East Delta Wooden Bailey Bridge (x = +355, z = -22 .. +22)
  addSlopeRamp(355, 1.2, -22, 6, 1.4, 4, 'z', 1, mats.plankMat);
  addBox(355, 2.3, 0, 6, 0.3, 36, mats.plankMat);
  addSlopeRamp(355, 1.2, 22, 6, 1.4, 4, 'z', -1, mats.plankMat);
  const nDeltaBridge = addNav(355, 2.75, 0, true);
  linkNav(nVillage, nDeltaBridge); linkNav(nDeltaBridge, nFarmS);

  // ---------------- REGION 1: Capital City ("นครหลวง — Central Metropolis") ----------------
  regions.push({ name: 'Capital City (นครหลวง)', x: 0, z: 0, radius: 145 });
  // Urban Concrete District Pads (on y = 1.2)
  addRoadStrip(0, 1.205, -92, 210, 100, mats.concDarkMat);
  addRoadStrip(0, 1.205, 86, 210, 96, mats.concDarkMat);

  // Presidential Palace / Capitol Building (cx = 0, cz = -96)
  buildBuilding({
    cx: 0, cz: -96, baseY: 1.2, width: 32, depth: 24, floors: 3, floorH: 4.2,
    extMat: mats.marbleMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nCapMidN, stairSide: 'w'
  });
  // Monument Pillars in front of Capitol
  for (const px of [-12, -6, 6, 12]) addBox(px, 1.2, -80, 0.9, 6.0, 0.9, mats.marbleMat, true, true);

  // Twin Financial Skyscrapers (6 floors + rooftop ~25m)
  buildBuilding({
    cx: -62, cz: -84, baseY: 1.2, width: 20, depth: 22, floors: 6, floorH: 3.9,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nCapN, stairSide: 'w'
  });
  buildBuilding({
    cx: 62, cz: -84, baseY: 1.2, width: 20, depth: 22, floors: 6, floorH: 3.9,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nCapN, stairSide: 'e'
  });
  buildRuinedBuilding({
    cx: -55, cz: -135, baseY: 1.2, width: 18, depth: 18, floors: 3, floorH: 3.8,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat, streetNodeIdx: nCapMidN
  });
  buildBuilding({
    cx: 55, cz: -135, baseY: 1.2, width: 18, depth: 18, floors: 3, floorH: 3.8,
    extMat: mats.brickGreyMat, intFloorMat: mats.concDarkMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nCapMidN, stairSide: 'e'
  });

  // South Bank Downtown: Grand Mall, Apartments & Ruined Offices
  buildBuilding({
    cx: 0, cz: 92, baseY: 1.2, width: 28, depth: 22, floors: 4, floorH: 4.0,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nCapMidS, stairSide: 'w'
  });
  buildRuinedBuilding({
    cx: -64, cz: 82, baseY: 1.2, width: 20, depth: 20, floors: 4, floorH: 3.8,
    extMat: mats.brickBrownMat, intFloorMat: mats.woodFloorMat, streetNodeIdx: nCapS
  });
  buildBuilding({
    cx: 64, cz: 82, baseY: 1.2, width: 20, depth: 20, floors: 4, floorH: 3.8,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nCapS, stairSide: 'e'
  });

  // Capital Street Wrecks & Checkpoints
  buildBus(-5.5, -58, 0.14);
  buildBus(5.5, 58, 3.05);
  buildTankWreck(4.5, -148, -0.35);
  buildVehicle(-34, -42, 1.45, mats.contRedMat, false);
  buildVehicle(36, 42, -1.65, mats.contBlueMat, false);
  addBox(-12, 1.2, -62, 6, 1.1, 1.1, mats.sandbagMat);
  addBox(12, 1.2, 62, 6, 1.1, 1.1, mats.sandbagMat);

  // ---------------- REGION 2: Northern Highlands & Mountain Radar Citadel (y = 4.8 -> 9.6) ----------------
  regions.push({ name: 'Northern Radar Citadel (เทือกเขาภาคเหนือ)', x: 0, z: -355, radius: 155 });
  // Tier 1 Highland Plateau (x: -175..175, z: -430..-245, top y = 4.8)
  addBox(0, 1.2, -337.5, 350, 3.6, 185, mats.highlandMat, true, false);
  addSlopeRamp(0, 1.2, -225, 14, 3.6, 20, 'z', -1, mats.roadMat);
  addSlopeRamp(-195, 1.2, -310, 12, 3.6, 20, 'x', 1, mats.roadMat);
  addSlopeRamp(195, 1.2, -310, 12, 3.6, 20, 'x', -1, mats.roadMat);

  // Tier 2 Mountain Summit (x: -85..85, z: -420..-315, top y = 9.6)
  addBox(0, 4.8, -367.5, 170, 4.8, 105, mats.highlandMat, true, false);
  addSlopeRamp(0, 4.8, -295, 12, 4.8, 20, 'z', -1, mats.roadMat);
  addSlopeRamp(-105, 4.8, -365, 10, 4.8, 20, 'x', 1, mats.concDarkMat);
  addSlopeRamp(105, 4.8, -365, 10, 4.8, 20, 'x', -1, mats.concDarkMat);

  const nHighS = addNav(0, 4.95, -265, true);
  const nHighW = addNav(-135, 4.95, -310, true);
  const nHighE = addNav(135, 4.95, -310, true);
  const nSummitS = addNav(0, 9.75, -330, true);
  const nSummitC = addNav(0, 9.75, -368, true);
  linkNav(nRingNC, nHighS); linkNav(nHighS, nHighW); linkNav(nHighS, nHighE);
  linkNav(nHighS, nSummitS); linkNav(nSummitS, nSummitC);
  linkNav(nAirport, nHighW); linkNav(nOilPort, nHighE);

  // Mountain Chalet & Guardhouse on Tier 1 (y = 4.8)
  buildBuilding({
    cx: -115, cz: -285, baseY: 4.8, width: 18, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.brickBrownMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nHighW, stairSide: 'w'
  });
  buildRuinedBuilding({
    cx: 115, cz: -285, baseY: 4.8, width: 18, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.concLightMat, intFloorMat: mats.concDarkMat, streetNodeIdx: nHighE
  });

  // Summit Radar Citadel Bunker & Tall Radar Sniper Tower (y = 9.6 -> 20.6)
  buildBuilding({
    cx: 24, cz: -372, baseY: 9.6, width: 22, depth: 20, floors: 2, floorH: 3.8,
    extMat: mats.concDarkMat, intFloorMat: mats.concLightMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nSummitC, stairSide: 'e'
  });
  buildWatchtower(-34, 9.6, -372, 10.5, nSummitC);
  // Radar Dish Pedestal on Bunker Roof
  addBox(24, 17.2, -372, 2.2, 4.5, 2.2, mats.steelMat, true, false);
  addBox(24, 21.7, -372, 6.2, 4.2, 0.8, mats.whiteMat, false, false);
  buildTankWreck(-10, -342, 0.55, 9.6);

  // ---------------- REGION 3: Northwest International Airport ("สนามบินนานาชาติ") ----------------
  regions.push({ name: 'International Airport (สนามบินนานาชาติ)', x: -320, z: -305, radius: 135 });
  // Runway & Taxiway
  addRoadStrip(-325, 1.205, -245, 210, 32, mats.roadMat);
  addRoadStrip(-325, 1.205, -315, 210, 18, mats.concDarkMat);
  // Runway Center Stripes
  for (let rx = -415; rx <= -235; rx += 18) addRoadStrip(rx, 1.22, -245, 9, 0.9, mats.whiteMat);

  // Crashed Commercial Airliner on Runway (Walk-in Fuselage!)
  const pX = -325, pZ = -245;
  addBox(pX - 10, 1.2, pZ, 30, 0.45, 5.2, mats.planeMat); // cabin floor
  addSlopeRamp(pX + 5, 1.2, pZ, 4.4, 0.45, 4, 'x', -1, mats.steelMat); // boarding ramp
  addWall(pX - 10, 1.65, pZ - 2.4, 30, 3.2, 0.35, 'x', 'double_window', mats.planeMat, true);
  addWall(pX - 10, 1.65, pZ + 2.4, 30, 3.2, 0.35, 'x', 'double_window', mats.planeMat, true);
  addBox(pX - 10, 4.85, pZ, 30, 0.35, 5.4, mats.planeMat); // cabin roof
  // Swept Wings (above player head / sloping outward) & Broken Tail Section
  addBox(pX - 8, 2.0, pZ - 11, 8, 0.35, 16, mats.planeMat, false, true);
  addBox(pX - 8, 2.0, pZ + 11, 8, 0.35, 16, mats.planeMat, false, true);
  addBox(pX - 32, 1.2, pZ + 3, 12, 3.6, 4.8, mats.rustMat);
  addBox(pX - 36, 4.8, pZ + 3, 4.2, 6.2, 0.45, mats.bridgeRedMat, false, true);

  // Air Traffic Control (ATC) Tower (5 floors + glass cab ~22m)
  buildBuilding({
    cx: -245, cz: -305, baseY: 1.2, width: 14, depth: 14, floors: 5, floorH: 3.9,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'window', s: 'window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nAirport, stairSide: 'e'
  });

  // Two Giant Open Aircraft Hangars
  for (const hz of [-345, -390]) {
    addBox(-380, 1.2, hz, 34, 0.25, 26, mats.concDarkMat, true, false);
    addWall(-380, 1.45, hz - 12.6, 34, 8.2, 0.5, 'x', 'solid', mats.steelMat);
    addWall(-380, 1.45, hz + 12.6, 34, 8.2, 0.5, 'x', 'solid', mats.steelMat);
    addWall(-396.6, 1.45, hz, 25, 8.2, 0.5, 'z', 'door', mats.steelMat);
    addBox(-380, 9.65, hz, 35, 0.4, 26.5, mats.rustMat);
    addBox(-382, 1.45, hz - 5, 3.6, 3.2, 8.0, mats.contGreenMat);
    const hn = addNav(-376, 1.55, hz, false);
    linkNav(nAirport, hn);
  }

  // Airport Terminal
  buildBuilding({
    cx: -275, cz: -380, baseY: 1.2, width: 32, depth: 20, floors: 2, floorH: 4.2,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nAirport, stairSide: 'w'
  });

  // ---------------- REGION 4: Northeast Oil Refinery & Port ("นิคมอุตสาหกรรม & ท่าเรือน้ำมัน") ----------------
  regions.push({ name: 'Northeast Oil Port (ท่าเรือน้ำมัน)', x: 325, z: -310, radius: 135 });
  addRoadStrip(325, 1.205, -310, 210, 200, mats.concDarkMat);

  // Elevated Oil Silos & Walkable Catwalk Network (y = 7.2)
  const siloMat = mats.steelMat;
  for (const [sx, sz] of [[285, -265], [345, -265], [285, -335], [345, -335]]) {
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 8.5, 6.0, 16), siloMat);
    cyl.position.set(sx, 1.2 + 3.0, sz);
    cyl.receiveShadow = true;
    cyl.userData.st = 1;
    scene.add(cyl);
    colliders.push({ minX: sx - 8.2, maxX: sx + 8.2, minY: 1.2, maxY: 7.2, minZ: sz - 8.2, maxZ: sz + 8.2 });
    addBox(sx, 7.2, sz, 11, 0.25, 11, mats.rustMat);
  }
  // Catwalks connecting Silos at y = 7.2 + stair access
  addBox(315, 7.1, -265, 50, 0.3, 4.2, mats.steelMat);
  addBox(315, 7.1, -335, 50, 0.3, 4.2, mats.steelMat);
  addBox(285, 7.1, -300, 4.2, 0.3, 60, mats.steelMat);
  addStairs(262, 1.2, -265, 4.0, 6.0, 12, 'x', 1, mats.steelMat);
  addStairs(368, 1.2, -335, 4.0, 6.0, 12, 'x', -1, mats.steelMat);

  const nSiloW = addNav(285, 7.55, -265, true);
  const nSiloE = addNav(345, 7.55, -335, true);
  linkNav(nOilPort, nSiloW); linkNav(nSiloW, nSiloE);

  // Port Containers & Crane Sniper Tower
  addBox(405, 1.2, -255, 3.6, 3.2, 9.6, mats.contRedMat);
  addBox(405, 4.4, -255, 3.6, 3.2, 9.6, mats.contBlueMat);
  addBox(405, 1.2, -305, 3.6, 3.2, 9.6, mats.contGreenMat);
  buildWatchtower(412, 1.2, -355, 12.0, nOilPort);

  buildBuilding({
    cx: 265, cz: -385, baseY: 1.2, width: 22, depth: 18, floors: 2, floorH: 4.0,
    extMat: mats.brickGreyMat, intFloorMat: mats.concDarkMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nOilPort, stairSide: 'w'
  });

  // ---------------- REGION 5: Western Desert Military Base & Gas Outpost (y = 2.8) ----------------
  regions.push({ name: 'West Military Base (ฐานทัพตะวันตก)', x: -320, z: 90, radius: 130 });
  // NW Desert Outpost Plateau (z: -155 .. -24, y = 2.8)
  addBox(-320, 1.2, -89.5, 220, 1.6, 131, mats.desertMat, true, false);
  addSlopeRamp(-320, 1.2, -167, 12, 1.6, 12, 'z', 1, mats.roadMat);
  addSlopeRamp(-198, 1.2, -85, 10, 1.6, 12, 'x', -1, mats.roadMat);

  // SW Military Base Plateau (z: +24 .. +155, y = 2.8)
  addBox(-320, 1.2, 89.5, 220, 1.6, 131, mats.desertMat, true, false);
  addSlopeRamp(-320, 1.2, 167, 12, 1.6, 12, 'z', -1, mats.roadMat);
  addSlopeRamp(-198, 1.2, 85, 10, 1.6, 12, 'x', -1, mats.roadMat);

  // West Suspension Bridge over the River (x = -260, connecting NW y=2.8 <-> SW y=2.8)
  addSlopeRamp(-260, 2.8, -24, 14, 3.4, 16, 'z', 1, mats.roadMat);
  addBox(-260, 5.8, 0, 14, 0.4, 16, mats.roadMat);
  addSlopeRamp(-260, 2.8, 24, 14, 3.4, 16, 'z', -1, mats.roadMat);
  // Suspension Bridge Red Pylons & Cables
  for (const pz of [-12, 12]) {
    addBox(-266.5, 0, pz, 1.4, 24, 1.4, mats.bridgeRedMat, true, true);
    addBox(-253.5, 0, pz, 1.4, 24, 1.4, mats.bridgeRedMat, true, true);
    addBox(-260, 22.5, pz, 14.4, 1.2, 1.2, mats.bridgeRedMat, false, false);
  }
  addBox(-266.8, 6.2, 0, 0.45, 1.1, 20, mats.bridgeRedMat);
  addBox(-253.2, 6.2, 0, 0.45, 1.1, 20, mats.bridgeRedMat);
  buildVehicle(-258, -4, 0.25, mats.rustMat, true, 6.2);

  const nDesertN = addNav(-260, 2.95, -85, true);
  const nSuspBridge = addNav(-260, 6.4, 0, true);
  const nMilBase = addNav(-320, 2.95, 85, true);
  linkNav(nAirport, nDesertN); linkNav(nDesertN, nSuspBridge);
  linkNav(nSuspBridge, nMilBase); linkNav(nMilBase, nHarbor);
  linkNav(nMilBase, nRingSW);

  // Gas Station & Diner on NW Desert Plateau (y = 2.8)
  buildBuilding({
    cx: -325, cz: -90, baseY: 2.8, width: 20, depth: 16, floors: 2, floorH: 3.6,
    extMat: mats.brickBrownMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nDesertN, stairSide: 'w'
  });
  addBox(-295, 2.8, -86, 12, 0.35, 10, mats.rustMat); // fuel canopy roof
  addBox(-299, 2.8, -90, 0.5, 4.0, 0.5, mats.steelMat);
  addBox(-291, 2.8, -82, 0.5, 4.0, 0.5, mats.steelMat);
  buildVehicle(-295, -86, 0.1, mats.contRedMat, false, 2.8);

  // Fortified Military Base on SW Plateau (y = 2.8)
  addWall(-325, 2.8, 42, 74, 3.2, 0.8, 'x', 'door', mats.concDarkMat);
  addWall(-325, 2.8, 134, 74, 3.2, 0.8, 'x', 'door', mats.concDarkMat);
  addWall(-362, 2.8, 88, 92, 3.2, 0.8, 'z', 'door', mats.concDarkMat);
  addWall(-288, 2.8, 88, 92, 3.2, 0.8, 'z', 'door', mats.concDarkMat);
  buildWatchtower(-358, 2.8, 46, 8.2, nMilBase);
  buildWatchtower(-292, 2.8, 130, 8.2, nMilBase);
  buildBuilding({
    cx: -328, cz: 88, baseY: 2.8, width: 22, depth: 20, floors: 2, floorH: 3.8,
    extMat: mats.concDarkMat, intFloorMat: mats.concLightMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nMilBase, stairSide: 'w'
  });
  buildTankWreck(-304, 65, -0.7, 2.8);
  buildVehicle(-348, 112, 1.2, mats.contGreenMat, true, 2.8);

  // ---------------- REGION 6: Eastern Countryside, Barns & Village ("ชนบท & หมู่บ้านตะวันออก") ----------------
  regions.push({ name: 'Eastern Village & Farms (ชนบทตะวันออก)', x: 325, z: 0, radius: 135 });
  // North Village Cottages & Church Belltower
  buildBuilding({
    cx: 295, cz: -75, baseY: 1.2, width: 16, depth: 16, floors: 2, floorH: 3.6,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nVillage, stairSide: 'e'
  });
  buildBuilding({
    cx: 365, cz: -105, baseY: 1.2, width: 14, depth: 16, floors: 4, floorH: 3.6,
    extMat: mats.marbleMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'window', s: 'window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nVillage, stairSide: 'e'
  });

  // South Farmland Wooden Barns & Hay Cover
  buildBuilding({
    cx: 310, cz: 82, baseY: 1.2, width: 20, depth: 24, floors: 2, floorH: 4.0,
    extMat: mats.brickBrownMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'window' },
    rooftopAccess: false, streetNodeIdx: nFarmS, stairSide: 'e'
  });
  buildRuinedBuilding({
    cx: 382, cz: 108, baseY: 1.2, width: 16, depth: 16, floors: 2, floorH: 3.6,
    extMat: mats.plankMat, intFloorMat: mats.woodFloorMat, streetNodeIdx: nFarmS
  });
  for (const [hx, hz] of [[285, 118], [345, 58], [345, 118], [335, -52]]) {
    addBox(hx, 1.2, hz, 2.6, 1.4, 2.2, mats.sandbagMat);
  }

  // ---------------- REGION 7: Southwest Harbor Town & Lighthouse ("เมืองท่า & ประภาคาร") ----------------
  regions.push({ name: 'Southwest Harbor & Lighthouse (เมืองท่า & ประภาคาร)', x: -325, z: 315, radius: 130 });
  addRoadStrip(-315, 1.205, 305, 175, 155, mats.concDarkMat);

  buildBuilding({
    cx: -285, cz: 265, baseY: 1.2, width: 18, depth: 18, floors: 3, floorH: 3.7,
    extMat: mats.brickBrownMat, intFloorMat: mats.woodFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nHarbor, stairSide: 'w'
  });
  buildRuinedBuilding({
    cx: -345, cz: 275, baseY: 1.2, width: 18, depth: 18, floors: 3, floorH: 3.7,
    extMat: mats.brickRedMat, intFloorMat: mats.woodFloorMat, streetNodeIdx: nHarbor
  });
  buildBuilding({
    cx: -285, cz: 355, baseY: 1.2, width: 20, depth: 18, floors: 2, floorH: 3.8,
    extMat: mats.concLightMat, intFloorMat: mats.tileFloorMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nHarbor, stairSide: 'w'
  });

  // Harbor Pier Extending Over Ocean Water (y = 1.2)
  addBox(-345, 0.8, 435, 16, 0.4, 65, mats.plankMat);
  addBox(-348, 1.2, 445, 3.6, 3.2, 9.6, mats.contBlueMat);

  // Coastal Lighthouse Sniper Tower (cx = -412, cz = 412, 5 floors ~20m)
  buildBuilding({
    cx: -412, cz: 412, baseY: 1.2, width: 12, depth: 12, floors: 5, floorH: 3.6,
    extMat: mats.whiteMat, intFloorMat: mats.concDarkMat,
    doorsOn1F: { n: 'door', s: 'window', e: 'door', w: 'window' },
    upperWin: { n: 'window', s: 'window', e: 'window', w: 'window' },
    rooftopAccess: true, streetNodeIdx: nHarbor, stairSide: 'w'
  });
  addBox(-412, 19.2, 412, 3.2, 2.4, 3.2, mats.beaconMat, false, false);

  // ---------------- REGION 8: Southeast Forest & Concrete Substation Fortress (y = 4.2) ----------------
  regions.push({ name: 'Southeast Forest & Fortress (ป่า & ป้อมตะวันออกเฉียงใต้)', x: 325, z: 315, radius: 130 });
  addBox(335, 1.2, 325, 140, 3.0, 140, mats.highlandMat, true, false);
  addSlopeRamp(335, 1.2, 241, 12, 3.0, 14, 'z', 1, mats.concDarkMat);
  addSlopeRamp(251, 1.2, 325, 12, 3.0, 14, 'x', 1, mats.concDarkMat);

  const nFortress = addNav(335, 4.35, 325, true);
  linkNav(nFarmS, nFortress); linkNav(nRingSE, nFortress);

  buildBuilding({
    cx: 335, cz: 325, baseY: 4.2, width: 24, depth: 22, floors: 3, floorH: 3.9,
    extMat: mats.concDarkMat, intFloorMat: mats.concLightMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'window', w: 'door' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nFortress, stairSide: 'e'
  });
  buildWatchtower(286, 4.2, 276, 8.6, nFortress);
  buildWatchtower(384, 4.2, 374, 8.6, nFortress);

  // ---------------- REGION 9: Southern Power Plant & Highway Toll Plaza (y = 2.6) ----------------
  regions.push({ name: 'Southern Power Plant (โรงไฟฟ้าภาคใต้)', x: 0, z: 335, radius: 135 });
  addBox(0, 1.2, 335, 250, 1.4, 150, mats.terraceMat, true, false);
  addSlopeRamp(0, 1.2, 246, 14, 1.4, 14, 'z', 1, mats.roadMat);
  addSlopeRamp(-139, 1.2, 335, 12, 1.4, 14, 'x', 1, mats.roadMat);
  addSlopeRamp(139, 1.2, 335, 12, 1.4, 14, 'x', -1, mats.roadMat);

  const nPowerN = addNav(0, 2.75, 278, true);
  const nPowerC = addNav(0, 2.75, 335, true);
  linkNav(nRingSC, nPowerN); linkNav(nPowerN, nPowerC);
  linkNav(nHarbor, nPowerC); linkNav(nFortress, nPowerC);

  // Turbine Hall
  buildBuilding({
    cx: 0, cz: 335, baseY: 2.6, width: 32, depth: 24, floors: 3, floorH: 4.0,
    extMat: mats.brickGreyMat, intFloorMat: mats.concDarkMat,
    doorsOn1F: { n: 'door', s: 'door', e: 'door', w: 'window' },
    upperWin: { n: 'double_window', s: 'double_window', e: 'double_window', w: 'double_window' },
    rooftopAccess: true, streetNodeIdx: nPowerC, stairSide: 'w'
  });

  // Twin Stepped Cooling Towers (walk-around iconic industrial silhouettes)
  for (const cx of [-68, 68]) {
    const cz = 355;
    const t1 = new THREE.Mesh(new THREE.CylinderGeometry(13, 16, 12, 16), mats.concLightMat);
    t1.position.set(cx, 2.6 + 6, cz); t1.userData.st = 1; scene.add(t1);
    const t2 = new THREE.Mesh(new THREE.CylinderGeometry(11, 13, 14, 16), mats.concDarkMat);
    t2.position.set(cx, 2.6 + 19, cz); t2.userData.st = 1; scene.add(t2);
    colliders.push({ minX: cx - 14.5, maxX: cx + 14.5, minY: 2.6, maxY: 28, minZ: cz - 14.5, maxZ: cz + 14.5 });
  }

  // Southern Toll Plaza Checkpoint (z = 212, jammed abandoned vehicles)
  addBox(0, 5.2, 212, 28, 1.2, 6, mats.concDarkMat);
  for (const px of [-11, -3.5, 3.5, 11]) addBox(px, 1.2, 212, 1.4, 4.0, 5.2, mats.concLightMat);
  buildVehicle(-7.2, 204, 0.08, mats.contRedMat, false, 1.2);
  buildVehicle(7.2, 219, -0.15, mats.contGreenMat, true, 1.2);

  // ---------------- Country-Wide Forests, Pines, Rocks & Highway Cover ----------------
  // Instanced Pines & Broadleaf Trees (high performance across 1000x1000)
  const treeCoords = [
    // Northern Mountain Pines
    [-160, -270, 4.8, 1], [-145, -340, 4.8, 1], [-95, -395, 4.8, 1], [95, -395, 4.8, 1],
    [145, -340, 4.8, 1], [160, -270, 4.8, 1], [-65, -260, 4.8, 1], [65, -260, 4.8, 1],
    // Central Riverbank & Rural Countryside Trees
    [-135, -45, 1.2, 0], [-165, -95, 1.2, 0], [135, -45, 1.2, 0], [155, 55, 1.2, 0],
    [-145, 125, 1.2, 0], [145, 125, 1.2, 0], [260, -135, 1.2, 0], [390, -45, 1.2, 0],
    [255, 135, 1.2, 0], [405, 52, 1.2, 0], [-170, 240, 1.2, 0], [-210, 360, 1.2, 0],
    // Southeast Dense Forest
    [225, 225, 1.2, 1], [248, 255, 1.2, 1], [220, 295, 1.2, 1], [235, 365, 1.2, 1],
    [265, 415, 1.2, 1], [315, 418, 1.2, 1], [375, 418, 1.2, 1], [415, 370, 1.2, 1],
    [420, 290, 1.2, 1], [418, 235, 1.2, 1], [365, 220, 1.2, 1], [295, 220, 1.2, 1]
  ];
  for (const [tx, tz, by, isPine] of treeCoords) {
    addBox(tx, by, tz, 0.65, 5.2, 0.65, mats.barkMat);
    const crown = new THREE.Mesh(
      isPine ? new THREE.ConeGeometry(2.8, 6.8, 7) : new THREE.DodecahedronGeometry(2.8, 0),
      isPine ? mats.pineMat : mats.foliageMat
    );
    crown.position.set(tx, by + (isPine ? 6.8 : 6.0), tz);
    crown.userData.st = 1;
    scene.add(crown);
  }

  // Highway Wrecks along Ring Roads
  buildVehicle(-140, -175, 1.55, mats.contRedMat, true, 1.2);
  buildVehicle(125, -175, -1.45, mats.contBlueMat, false, 1.2);
  buildVehicle(-145, 175, 1.62, mats.rustMat, false, 1.2);
  buildVehicle(135, 175, -1.5, mats.contGreenMat, true, 1.2);

  // ---------------- Battle Royale Drop Spawns, TDM Spawns & Loot Points ----------------
  brSpawnPoints.push(
    new THREE.Vector3(-42, 1.35, -108),  // Capital North
    new THREE.Vector3(42, 1.35, -108),
    new THREE.Vector3(-42, 1.35, 108),   // Capital South
    new THREE.Vector3(42, 1.35, 108),
    new THREE.Vector3(0, 9.75, -345),    // Northern Summit
    new THREE.Vector3(-135, 4.95, -310), // Highland West
    new THREE.Vector3(135, 4.95, -310),  // Highland East
    new THREE.Vector3(-315, 1.35, -265), // Airport Runway
    new THREE.Vector3(-365, 1.55, -345), // Airport Hangar
    new THREE.Vector3(315, 1.35, -285),  // Oil Port
    new THREE.Vector3(395, 1.35, -345),
    new THREE.Vector3(-310, 2.95, -75),  // Desert Outpost
    new THREE.Vector3(-328, 2.95, 65),   // West Military Base
    new THREE.Vector3(-260, 6.4, 0),     // Suspension Bridge
    new THREE.Vector3(315, 1.35, -95),   // East Village
    new THREE.Vector3(335, 1.35, 88),    // East Farms
    new THREE.Vector3(-305, 1.35, 310),  // SW Harbor
    new THREE.Vector3(-395, 1.35, 395),  // Lighthouse Peninsula
    new THREE.Vector3(335, 4.35, 295),   // SE Fortress
    new THREE.Vector3(0, 2.75, 295),     // Southern Power Plant
    new THREE.Vector3(0, 4.8, 0),        // Capital Central Bridge
    new THREE.Vector3(210, 4.6, 0)       // East Steel Bridge
  );

  // Also populate Red/Blue spawnPoints for TDM/Permadeath compatibility
  spawnPoints.red.push(
    new THREE.Vector3(-60, 1.35, -175),
    new THREE.Vector3(0, 1.35, -175),
    new THREE.Vector3(60, 1.35, -175),
    new THREE.Vector3(-260, 1.35, -260),
    new THREE.Vector3(260, 1.35, -260)
  );
  spawnPoints.blue.push(
    new THREE.Vector3(-60, 1.35, 175),
    new THREE.Vector3(0, 1.35, 175),
    new THREE.Vector3(60, 1.35, 175),
    new THREE.Vector3(-260, 1.35, 260),
    new THREE.Vector3(260, 1.35, 260)
  );

  // Categorized Supply / Loot Coordinates across the Country
  supplyPoints.push(
    { type: 'medkit', pos: new THREE.Vector3(0, 1.35, -78) },
    { type: 'armor', pos: new THREE.Vector3(-62, 1.35, -84) },
    { type: 'ammo', pos: new THREE.Vector3(62, 1.35, -84) },
    { type: 'medkit', pos: new THREE.Vector3(0, 1.35, 92) },
    { type: 'armor', pos: new THREE.Vector3(0, 4.8, 0) },
    { type: 'ammo', pos: new THREE.Vector3(0, 9.75, -365) },
    { type: 'armor', pos: new THREE.Vector3(24, 9.75, -372) },
    { type: 'medkit', pos: new THREE.Vector3(-335, 1.8, -245) }, // Inside crashed plane
    { type: 'ammo', pos: new THREE.Vector3(-380, 1.55, -345) },
    { type: 'armor', pos: new THREE.Vector3(-245, 1.35, -305) },
    { type: 'ammo', pos: new THREE.Vector3(285, 7.55, -265) },   // Oil silo catwalk
    { type: 'medkit', pos: new THREE.Vector3(345, 7.55, -335) },
    { type: 'armor', pos: new THREE.Vector3(-328, 2.95, 88) },   // Military base
    { type: 'ammo', pos: new THREE.Vector3(-325, 2.95, -90) },
    { type: 'medkit', pos: new THREE.Vector3(295, 1.35, -75) },
    { type: 'ammo', pos: new THREE.Vector3(310, 1.35, 82) },
    { type: 'armor', pos: new THREE.Vector3(-285, 1.35, 265) },
    { type: 'medkit', pos: new THREE.Vector3(-412, 1.35, 412) }, // Lighthouse base
    { type: 'armor', pos: new THREE.Vector3(335, 4.35, 325) },   // SE Fortress
    { type: 'ammo', pos: new THREE.Vector3(0, 2.75, 335) }       // Power Plant
  );

  // ---------------- Atmospheric Dust / Mist Across the Country ----------------
  const dg = new THREE.BufferGeometry();
  const dp = new Float32Array(1600 * 3);
  for (let i = 0; i < 1600; i++) {
    dp[i * 3] = (Math.random() - 0.5) * 940;
    dp[i * 3 + 1] = 1.0 + Math.random() * 34;
    dp[i * 3 + 2] = (Math.random() - 0.5) * 940;
  }
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
  const dustMesh = new THREE.Points(
    dg,
    new THREE.PointsMaterial({ color: 0xfde68a, size: 0.2, transparent: true, opacity: 0.36 })
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
    supplyPoints,
    brSpawnPoints,
    regions
  };
}

export const buildBattleRoyaleMap = buildMap2;