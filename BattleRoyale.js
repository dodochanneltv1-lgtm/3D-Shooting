import * as THREE from 'three';

// ============================================================================
// 1. CONSTANTS, LOOT TABLES & EQUIPMENT DEFINITIONS (Lv.1 - Lv.4)
// ============================================================================
export const BR_MAX_PLAYERS = 100;
export const BR_BOARDING_WAIT_SEC = 30;

export const BR_TEAM_MODES = {
  solo:  { id: 'solo',  label: 'Solo (เดี่ยว 1 คน)',     teamSize: 1, maxTeams: 100 },
  duo:   { id: 'duo',   label: 'Duo (คู่ 2 คน)',         teamSize: 2, maxTeams: 50  },
  squad: { id: 'squad', label: 'Squad (ทีม 4 คน)',      teamSize: 4, maxTeams: 25  }
};

export const BR_ARMOR_LEVELS = {
  0: { level: 0, name: 'ไม่มีเกราะ',         reduction: 0.00, maxDurability: 0   },
  1: { level: 1, name: 'เสื้อเกราะ Lv.1',    reduction: 0.30, maxDurability: 100 },
  2: { level: 2, name: 'เสื้อเกราะ Lv.2',    reduction: 0.45, maxDurability: 150 },
  3: { level: 3, name: 'เสื้อเกราะ Lv.3',    reduction: 0.60, maxDurability: 220 },
  4: { level: 4, name: 'เกราะหนัก Lv.4',     reduction: 0.72, maxDurability: 300 }
};

export const BR_HELMET_LEVELS = {
  0: { level: 0, name: 'ไม่มีหมวก',          reduction: 0.00, maxDurability: 0   },
  1: { level: 1, name: 'หมวกกันน็อก Lv.1',   reduction: 0.30, maxDurability: 80  },
  2: { level: 2, name: 'หมวกยุทธวิธี Lv.2',  reduction: 0.45, maxDurability: 130 },
  3: { level: 3, name: 'หมวกสเป็ตสนาซ Lv.3', reduction: 0.60, maxDurability: 200 },
  4: { level: 4, name: 'หมวกไทเทเนียม Lv.4', reduction: 0.75, maxDurability: 280 }
};

export const BR_BACKPACK_LEVELS = {
  0: { level: 0, name: 'ตัวเปล่า (ไม่มีเป้)', capacity: 45  },
  1: { level: 1, name: 'กระเป๋า Lv.1',        capacity: 120 },
  2: { level: 2, name: 'กระเป๋า Lv.2',        capacity: 185 },
  3: { level: 3, name: 'กระเป๋า Lv.3',        capacity: 255 },
  4: { level: 4, name: 'กระเป๋าทหาร Lv.4',    capacity: 340 }
};

export const BR_AMMO_TYPES = {
  ammo_ar:      { id: 'ammo_ar',      name: 'กระสุน AR (5.56 / 7.62)', weight: 0.45, bundle: 30, color: 0x16a34a },
  ammo_smg:     { id: 'ammo_smg',     name: 'กระสุน SMG (.45 / 5.7)',  weight: 0.35, bundle: 35, color: 0x0284c7 },
  ammo_sniper:  { id: 'ammo_sniper',  name: 'กระสุน Sniper',           weight: 0.85, bundle: 10, color: 0xdc2626 },
  ammo_shotgun: { id: 'ammo_shotgun', name: 'กระสุน Shotgun (12G)',    weight: 0.70, bundle: 12, color: 0x991b1b },
  ammo_9mm:     { id: 'ammo_9mm',     name: 'กระสุน 9mm',              weight: 0.30, bundle: 30, color: 0xf59e0b }
};

export const BR_MED_ITEMS = {
  med_bandage:    { id: 'med_bandage',    name: 'ผ้าพันแผล (Bandage)',     weight: 2,  useSec: 2.0, heal: 15, healInjury: 15, boost: 0,  capHp: 75  },
  med_firstaid:   { id: 'med_firstaid',   name: 'กล่องปฐมพยาบาล (First Aid)', weight: 8, useSec: 4.0, heal: 60, healInjury: 45, boost: 0, capHp: 85  },
  med_medkit:     { id: 'med_medkit',     name: 'กล่องยาใหญ่ (Med Kit)',   weight: 16, useSec: 5.5, heal: 100, healInjury: 100, boost: 20, capHp: 100 },
  med_painkiller: { id: 'med_painkiller', name: 'ยาแก้ปวด / บูสต์',       weight: 4,  useSec: 3.0, heal: 10, healInjury: 10, boost: 60, capHp: 100 }
};

export const BR_GRENADE_ITEMS = {
  g_frag:  { id: 'g_frag',  name: 'ระเบิดสังหาร K-400', weight: 12 },
  g_smoke: { id: 'g_smoke', name: 'ระเบิดควัน Smoke',   weight: 10 },
  g_flash: { id: 'g_flash', name: 'ระเบิดแสง Flash',    weight: 8  }
};

export function getBRAmmoType(weaponId) {
  if (!weaponId) return 'ammo_9mm';
  if (['ar_aug', 'ak47', 'm4a1', 'scar_h', 'famas', 'lmg_mk46'].includes(weaponId)) return 'ammo_ar';
  if (['thompson', 'vector', 'vector_dual', 'p90'].includes(weaponId)) return 'ammo_smg';
  if (['sr_l115', 'kar98', 'm200', 'barrett', 'm24'].includes(weaponId)) return 'ammo_sniper';
  if (weaponId === 'sg_spas') return 'ammo_shotgun';
  return 'ammo_9mm';
}

// Default UNMODDED attachments (in BR, saved shop attachments are NEVER applied!)
export function createEmptyAttachments() {
  return {
    sight: 'iron',
    mag: 'default',
    barrel: 'standard',
    grip: 'none',
    stock: 'none',
    muzzle: 'none',
    trigger: 'standard',
    flashlight: 'none',
    laser: 'none',
    ammunition: 'standard'
  };
}

// Compute weapon stats exclusively from a BR weapon slot's attached parts
export function computeBRWeaponStats(weaponId, slotMods, WEAPONS, ATTACHMENT_SUPPORT, ATTACHMENT_DATA) {
  const base = WEAPONS[weaponId];
  if (!base) return null;
  const mods = { ...createEmptyAttachments(), ...(slotMods || {}) };
  const support = ATTACHMENT_SUPPORT?.[weaponId];
  if (!support || !ATTACHMENT_DATA) return { ...base, mods };

  const stats = { ...base, mods };
  const magNum = Number(mods.mag);
  if (mods.mag !== 'default' && support.mags?.includes(magNum)) {
    if (weaponId === 'vector_dual') {
      stats.magPerGun = magNum;
      stats.mag = magNum * 2;
    } else {
      stats.mag = magNum;
    }
  }
  if (base.mag && stats.mag !== base.mag && base.reloadTime) {
    const r = stats.mag / base.mag;
    const l2 = Math.log2(r);
    stats.reloadTime = base.reloadTime * (r > 1 ? 1 + 0.12 * l2 : 1 + 0.06 * l2);
  }

  const barrel = support.barrels?.includes(mods.barrel) ? ATTACHMENT_DATA.barrels?.[mods.barrel] : null;
  const grip = support.grips?.includes(mods.grip) ? ATTACHMENT_DATA.grips?.[mods.grip] : null;
  const stock = support.stocks?.includes(mods.stock) ? ATTACHMENT_DATA.stocks?.[mods.stock] : null;
  const muzzle = support.muzzles?.includes(mods.muzzle) ? ATTACHMENT_DATA.muzzles?.[mods.muzzle] : null;
  const trigger = support.triggers?.includes(mods.trigger) ? ATTACHMENT_DATA.triggers?.[mods.trigger] : null;
  const ammoMod = support.ammunition?.includes(mods.ammunition) ? ATTACHMENT_DATA.ammunition?.[mods.ammunition] : null;
  const laser = support.lasers?.includes(mods.laser) ? ATTACHMENT_DATA.lasers?.[mods.laser] : null;
  const flashlight = support.flashlights?.includes(mods.flashlight) ? ATTACHMENT_DATA.flashlights?.[mods.flashlight] : null;

  for (const acc of [grip, stock, muzzle, barrel, trigger]) {
    if (!acc) continue;
    if (acc.recoil) stats.recoil = (stats.recoil || 0) * acc.recoil;
    if (acc.spread) stats.spread = (stats.spread || 0) * acc.spread;
    if (acc.moveSpeed) stats.moveSpeed = (stats.moveSpeed || 1) * acc.moveSpeed;
    if (acc.rpm) stats.rpm = (stats.rpm || 1) * acc.rpm;
    if (acc.sway) stats.sway = (stats.sway || 1) * acc.sway;
  }

  if (barrel?.barrelMul) {
    stats.dmg = Math.round(stats.dmg * (1 + (barrel.barrelMul - 1) * 0.18));
    stats.speed = (stats.speed || 350) * (1 + (barrel.barrelMul - 1) * 0.25);
  }
  if (barrel?.chargeMul) {
    stats.dmg = Math.round(stats.dmg * Math.sqrt(barrel.chargeMul));
  }
  if (ammoMod) {
    stats.dmg = Math.round(stats.dmg * (ammoMod.damage || 1));
    stats.armorPierce = ammoMod.armorPierce || 0;
    if (ammoMod.recoil) stats.recoil = (stats.recoil || 0) * ammoMod.recoil;
  }
  if (laser?.hipSpread) stats.hipSpread = (base.hipSpread || base.spread) * laser.hipSpread;
  stats.flashlight = flashlight && mods.flashlight !== 'none' ? flashlight : null;
  stats.laser = laser && mods.laser !== 'none' ? laser : null;
  stats.soundRadiusMul = muzzle?.sound || 1;
  stats.flashMul = muzzle?.flash || 1;

  const sightObj = ATTACHMENT_DATA.sights?.find((x) => x.id === mods.sight);
  stats.sightId = support.sights?.includes(mods.sight) ? mods.sight : 'iron';
  stats.sightZoom = sightObj && stats.sightId !== 'iron' ? sightObj.zoom : 1.15;
  return stats;
}

// ============================================================================
// 2. PLAYER / BOT PUBG INVENTORY SYSTEM
// ============================================================================
export class BRInventory {
  constructor() {
    this.resetEmpty();
  }

  resetEmpty() {
    // Starts completely naked / empty-handed before looting!
    this.weapons = {
      1: null, // { weaponId, magAmmo, attachments: {...} }
      2: null, // Secondary / Sidearm
      3: null  // Melee
    };
    this.vest = { level: 0, durability: 0, maxDurability: 0 };
    this.helmet = { level: 0, durability: 0, maxDurability: 0 };
    this.backpackLevel = 0;

    this.ammo = {
      ammo_ar: 0,
      ammo_smg: 0,
      ammo_sniper: 0,
      ammo_shotgun: 0,
      ammo_9mm: 0
    };
    this.meds = {
      med_bandage: 0,
      med_firstaid: 0,
      med_medkit: 0,
      med_painkiller: 0
    };
    this.grenades = {
      g_frag: 0,
      g_smoke: 0,
      g_flash: 0
    };
    // Unattached weapon mods stored inside backpack
    this.looseAttachments = []; // [{ uid, slotType, modId, label }]
    this.boost = 0; // 0..100 energy boost bar
  }

  getMaxWeight() {
    return BR_BACKPACK_LEVELS[this.backpackLevel]?.capacity || 45;
  }

  getCurrentWeight() {
    let w = 0;
    for (const [k, count] of Object.entries(this.ammo)) w += count * (BR_AMMO_TYPES[k]?.weight || 0.4);
    for (const [k, count] of Object.entries(this.meds)) w += count * (BR_MED_ITEMS[k]?.weight || 5);
    for (const [k, count] of Object.entries(this.grenades)) w += count * (BR_GRENADE_ITEMS[k]?.weight || 10);
    w += this.looseAttachments.length * 4;
    return Math.round(w * 10) / 10;
  }

  canFitWeight(extraWeight) {
    return this.getCurrentWeight() + extraWeight <= this.getMaxWeight();
  }

  equipWeapon(item, WEAPONS) {
    const spec = WEAPONS[item.weaponId];
    if (!spec) return null;
    // Rifles/SMG/Shotgun/Sniper can fill Slot 1 or Slot 2; Pistols go to Slot 2 if empty; Melee goes to Slot 3
    let targetSlot = spec.slot === 3 ? 3 : spec.slot === 2 ? 2 : 1;
    if (spec.slot === 1) {
      if (!this.weapons[1]) targetSlot = 1;
      else if (!this.weapons[2]) targetSlot = 2;
      else targetSlot = 1;
    }
    const dropped = this.weapons[targetSlot];
    this.weapons[targetSlot] = {
      weaponId: item.weaponId,
      magAmmo: item.magAmmo ?? spec.mag ?? 0,
      attachments: { ...createEmptyAttachments(), ...(item.attachments || {}) }
    };
    return { slot: targetSlot, dropped };
  }

  attachModToSlot(modItem, slotNum, ATTACHMENT_SUPPORT) {
    const gun = this.weapons[slotNum];
    if (!gun) return false;
    const support = ATTACHMENT_SUPPORT?.[gun.weaponId];
    if (!support) return false;
    const fieldMap = {
      sight: 'sights',
      mag: 'mags',
      barrel: 'barrels',
      grip: 'grips',
      stock: 'stocks',
      muzzle: 'muzzles',
      trigger: 'triggers',
      flashlight: 'flashlights',
      laser: 'lasers',
      ammunition: 'ammunition'
    };
    const supKey = fieldMap[modItem.slotType];
    const allowed = support[supKey] || [];
    const checkVal = modItem.slotType === 'mag' ? Number(modItem.modId) : modItem.modId;
    if (!allowed.includes(checkVal)) return false;

    const prevMod = gun.attachments[modItem.slotType];
    gun.attachments[modItem.slotType] = modItem.modId;
    // Return replaced non-default attachment back to backpack
    const isDefault = prevMod === 'iron' || prevMod === 'default' || prevMod === 'standard' || prevMod === 'none';
    if (!isDefault) {
      this.looseAttachments.push({
        uid: 'att_' + Math.random().toString(36).slice(2, 9),
        slotType: modItem.slotType,
        modId: prevMod,
        label: `${modItem.slotType}: ${prevMod}`
      });
    }
    return true;
  }

  autoEquipAttachment(modItem, ATTACHMENT_SUPPORT) {
    for (const s of [1, 2]) {
      const gun = this.weapons[s];
      if (!gun) continue;
      const cur = gun.attachments[modItem.slotType];
      const isEmpty = cur === 'iron' || cur === 'default' || cur === 'standard' || cur === 'none';
      if (isEmpty && this.attachModToSlot(modItem, s, ATTACHMENT_SUPPORT)) {
        return s;
      }
    }
    if (!this.canFitWeight(4)) return -1;
    this.looseAttachments.push({
      uid: 'att_' + Math.random().toString(36).slice(2, 9),
      slotType: modItem.slotType,
      modId: modItem.modId,
      label: modItem.label
    });
    return 0;
  }

  serializeForDeathBox() {
    const items = [];
    for (const s of [1, 2, 3]) {
      const g = this.weapons[s];
      if (g) items.push({ kind: 'weapon', weaponId: g.weaponId, magAmmo: g.magAmmo, attachments: { ...g.attachments } });
    }
    if (this.vest.level > 0 && this.vest.durability > 5) {
      items.push({ kind: 'vest', level: this.vest.level, durability: this.vest.durability });
    }
    if (this.helmet.level > 0 && this.helmet.durability > 5) {
      items.push({ kind: 'helmet', level: this.helmet.level, durability: this.helmet.durability });
    }
    if (this.backpackLevel > 0) {
      items.push({ kind: 'backpack', level: this.backpackLevel });
    }
    for (const [k, count] of Object.entries(this.ammo)) {
      if (count > 0) items.push({ kind: 'ammo', ammoType: k, count });
    }
    for (const [k, count] of Object.entries(this.meds)) {
      if (count > 0) items.push({ kind: 'med', medId: k, count });
    }
    for (const [k, count] of Object.entries(this.grenades)) {
      if (count > 0) items.push({ kind: 'grenade', grenadeId: k, count });
    }
    for (const mod of this.looseAttachments) {
      items.push({ kind: 'attachment', slotType: mod.slotType, modId: mod.modId, label: mod.label });
    }
    return items;
  }

  serialize() {
    return {
      weapons: JSON.parse(JSON.stringify(this.weapons)),
      vest: { ...this.vest },
      helmet: { ...this.helmet },
      backpackLevel: this.backpackLevel,
      ammo: { ...this.ammo },
      meds: { ...this.meds },
      grenades: { ...this.grenades },
      looseAttachments: this.looseAttachments.map((item) => ({ ...item })),
      boost: this.boost
    };
  }
}

// ============================================================================
// 3. BATTLE ROYALE ROOM & SQUAD/DUO/SOLO MATCHMAKER (30s Boarding + Bot Fill)
// ============================================================================
export class BRRoomController {
  constructor() {
    this.roomId = null;
    this.teamMode = 'squad'; // 'solo' | 'duo' | 'squad'
    this.maxPlayers = BR_MAX_PLAYERS;
    this.waitSeconds = BR_BOARDING_WAIT_SEC;
    this.members = []; // { uid, name, squadId, isBot, ready }
  }

  createRoom({ roomName = 'PUBG Island', teamMode = 'squad', hostUid, hostName }) {
    this.teamMode = BR_TEAM_MODES[teamMode] ? teamMode : 'squad';
    this.roomId = `br_${Date.now().toString(36)}`;
    this.roomName = roomName;
    this.hostUid = hostUid;
    this.members = [{
      uid: hostUid,
      name: hostName || 'Player',
      squadId: 'squad_1',
      isBot: false,
      ready: true
    }];
    return this.getRoomSummary();
  }

  joinHumanPlayer(uid, name, preferredSquadId = null) {
    const modeCfg = BR_TEAM_MODES[this.teamMode];
    if (this.members.length >= this.maxPlayers) return false;
    const existing = this.members.find((m) => m.uid === uid);
    if (existing) {
      if (preferredSquadId) this.movePlayerToSquad(uid, preferredSquadId);
      return true;
    }

    let squadId = preferredSquadId;
    if (!squadId || this.getSquadMembers(squadId).length >= modeCfg.teamSize) {
      for (let i = 1; i <= modeCfg.maxTeams; i++) {
        const sid = `squad_${i}`;
        if (this.getSquadMembers(sid).length < modeCfg.teamSize) {
          squadId = sid;
          break;
        }
      }
    }
    if (!squadId) return false;
    this.members.push({ uid, name, squadId, isBot: false, ready: true });
    return true;
  }

  movePlayerToSquad(uid, targetSquadId) {
    const modeCfg = BR_TEAM_MODES[this.teamMode];
    const member = this.members.find((m) => m.uid === uid);
    if (!member) return false;
    if (this.getSquadMembers(targetSquadId).length >= modeCfg.teamSize) return false;
    member.squadId = targetSquadId;
    return true;
  }

  getSquadMembers(squadId) {
    return this.members.filter((m) => m.squadId === squadId);
  }

  fillBotsToMatchCapacity() {
    const modeCfg = BR_TEAM_MODES[this.teamMode];
    const botNames = [
      'Ghost', 'Viper', 'Kobra', 'Raven', 'Delta', 'Titan', 'Nova', 'Wolf',
      'Reaper', 'Shadow', 'Hawk', 'Striker', 'Falcon', 'Nomad', 'Spectre', 'Blitz'
    ];
    let botNum = 1;
    let squadCursor = 1;
    while (this.members.length < this.maxPlayers && squadCursor <= modeCfg.maxTeams) {
      const sid = `squad_${squadCursor}`;
      while (this.getSquadMembers(sid).length < modeCfg.teamSize && this.members.length < this.maxPlayers) {
        const bName = `[BOT] ${botNames[(botNum - 1) % botNames.length]}${botNum > 16 ? botNum : ''}`;
        this.members.push({
          uid: `br_bot_${botNum}`,
          name: bName,
          squadId: sid,
          isBot: true,
          ready: true
        });
        botNum++;
      }
      squadCursor++;
    }
    return this.members;
  }

  getRoomSummary() {
    const modeCfg = BR_TEAM_MODES[this.teamMode];
    return {
      roomId: this.roomId,
      roomName: this.roomName,
      teamMode: this.teamMode,
      teamSize: modeCfg.teamSize,
      humanCount: this.members.filter((m) => !m.isBot).length,
      totalCount: this.members.length,
      maxPlayers: this.maxPlayers,
      waitSeconds: this.waitSeconds
    };
  }
}

// ============================================================================
// 4. 3D MODELS (C-130 Airplane, Parachute, Airdrop, Death Box, Ground Loot)
// ============================================================================
function buildC130Plane() {
  const g = new THREE.Group();
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.55, metalness: 0.45 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, metalness: 0.5 });
  const propMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
  const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    g.add(m);
    return m;
  };
  // Fuselage & Nose
  add(new THREE.CylinderGeometry(2.6, 2.6, 28, 14), hullMat, 0, 0, 0, Math.PI / 2);
  add(new THREE.ConeGeometry(2.6, 5.5, 14), hullMat, 0, -0.2, -16.7, -Math.PI / 2);
  // High Wings
  add(new THREE.BoxGeometry(36, 0.55, 5.2), hullMat, 0, 2.2, -2);
  // Tail Stabilizers
  add(new THREE.BoxGeometry(12, 0.45, 3.2), hullMat, 0, 1.4, 13.5);
  add(new THREE.BoxGeometry(0.5, 6.2, 4.2), hullMat, 0, 4.2, 13.0);
  // Open Rear Ramp Glow
  add(new THREE.BoxGeometry(3.2, 0.3, 4.0), darkMat, 0, -2.0, 13.8, -0.32);

  // 4 Spinning Turboprop Engines
  const props = [];
  for (const ex of [-11.5, -5.8, 5.8, 11.5]) {
    add(new THREE.CylinderGeometry(0.65, 0.65, 3.6, 10), darkMat, ex, 1.8, -3.5, Math.PI / 2);
    const pGroup = new THREE.Group();
    pGroup.position.set(ex, 1.8, -5.4);
    pGroup.add(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.22, 0.08), propMat));
    pGroup.add(new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.4, 0.08), propMat));
    g.add(pGroup);
    props.push(pGroup);
  }
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  beacon.position.set(0, 7.5, 13.0);
  g.add(beacon);

  g.userData.props = props;
  return g;
}

function buildParachuteMesh(colorHex = 0xf59e0b) {
  const g = new THREE.Group();
  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(3.6, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.48),
    new THREE.MeshStandardMaterial({ color: colorHex, side: THREE.DoubleSide, roughness: 0.75 })
  );
  canopy.position.y = 4.2;
  g.add(canopy);
  const cordMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.75 });
  for (const [cx, cz] of [[-2.4, -1.6], [2.4, -1.6], [-2.4, 1.6], [2.4, 1.6]]) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 1.3, 0), new THREE.Vector3(cx, 4.3, cz)]);
    g.add(new THREE.Line(geo, cordMat));
  }
  return g;
}

function createLootVisual(item, mats) {
  const g = new THREE.Group();
  let mat = mats.weapon;
  let geo = new THREE.BoxGeometry(0.85, 0.18, 0.24);
  if (item.kind === 'vest') {
    mat = mats.levels[item.level] || mats.vest;
    geo = new THREE.BoxGeometry(0.52, 0.56, 0.26);
  } else if (item.kind === 'helmet') {
    mat = mats.levels[item.level] || mats.vest;
    geo = new THREE.SphereGeometry(0.24, 10, 8);
  } else if (item.kind === 'backpack') {
    mat = mats.levels[item.level] || mats.backpack;
    geo = new THREE.BoxGeometry(0.44, 0.54, 0.30);
  } else if (item.kind === 'ammo') {
    mat = mats.ammo[item.ammoType] || mats.ammo.ammo_ar;
    geo = new THREE.BoxGeometry(0.36, 0.22, 0.28);
  } else if (item.kind === 'med') {
    mat = mats.med;
    geo = new THREE.BoxGeometry(0.42, 0.22, 0.34);
  } else if (item.kind === 'grenade') {
    mat = mats.grenade;
    geo = new THREE.SphereGeometry(0.16, 10, 8);
  } else if (item.kind === 'attachment') {
    mat = mats.attachment;
    geo = new THREE.BoxGeometry(0.34, 0.16, 0.26);
  } else if (item.kind === 'deathbox') {
    mat = mats.deathbox;
    geo = new THREE.BoxGeometry(0.95, 0.55, 0.65);
  } else if (item.kind === 'airdrop') {
    mat = mats.airdrop;
    geo = new THREE.BoxGeometry(1.65, 1.45, 1.65);
  }
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = item.kind === 'airdrop' ? 0.72 : 0.24;
  g.add(mesh);

  if (item.kind === 'med') {
    const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.07), mats.redCross);
    c1.position.y = 0.36;
    const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.04, 0.22), mats.redCross);
    c2.position.y = 0.36;
    g.add(c1, c2);
  }
  if (item.kind === 'airdrop') {
    const flare = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 26, 8), mats.flare);
    flare.position.y = 14;
    g.add(flare);
  }
  return g;
}

// ============================================================================
// 5. PUBG INVENTORY & VICINITY UI OVERLAY
// ============================================================================
class BRInventoryUI {
  constructor(callbacks) {
    this.cb = callbacks;
    this.isOpen = false;
    this.el = document.getElementById('br-inv-overlay');
    if (!this.el) {
      const style = document.createElement('style');
      style.textContent = `
        #br-banner{position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:39;pointer-events:none;background:rgba(10,15,24,.88);border:1px solid rgba(251,191,36,.45);border-radius:10px;padding:8px 18px;font-weight:800;font-size:.95rem;color:#fde68a;text-align:center;box-shadow:0 8px 26px rgba(0,0,0,.6)}
        #br-banner.hidden{display:none!important}
        #br-boost-wrap{position:fixed;bottom:145px;left:18px;z-index:26;pointer-events:none;width:265px;background:rgba(10,14,22,.84);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:6px 10px;font-size:.72rem;color:#fde68a}
        #br-boost-wrap.hidden{display:none!important}
        .br-boost-bg{width:100%;height:6px;background:rgba(255,255,255,.12);border-radius:4px;overflow:hidden;margin-top:3px}
        .br-boost-fill{height:100%;background:linear-gradient(90deg,#f59e0b,#fde047);width:0%}
        #br-inv-overlay{position:fixed;inset:0;z-index:62;background:rgba(8,12,20,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;color:#f1f5f9;font-family:'Segoe UI',sans-serif}
        #br-inv-overlay.hidden{display:none!important}
        .br-inv-shell{width:1040px;max-width:96vw;height:82vh;background:rgba(15,23,42,.95);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:16px;display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:12px}
        @media(max-width:860px){.br-inv-shell{grid-template-columns:1fr;height:90vh;overflow-y:auto}}
        .br-col{background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px;display:flex;flex-direction:column;min-height:0}
        .br-col-title{font-size:.82rem;font-weight:800;color:#f59e0b;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center}
        .br-scroll{overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px;padding-right:3px}
        .br-item{display:flex;justify-content:space-between;align-items:center;gap:6px;padding:7px 9px;border-radius:7px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);font-size:.78rem;cursor:pointer}
        .br-item:hover{background:rgba(56,189,248,.16);border-color:#38bdf8}
        .br-gear-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}
        .br-gear-box{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:7px;font-size:.73rem;text-align:center}
        .br-wep-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:8px;margin-bottom:8px}
        .br-mod-chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
        .br-chip{font-size:.68rem;padding:3px 7px;border-radius:5px;background:rgba(15,23,42,.9);border:1px solid rgba(255,255,255,.18);color:#cbd5e1;cursor:pointer}
        .br-chip.on{border-color:#f59e0b;color:#fde68a;background:rgba(245,158,11,.18)}
        .br-prompt{position:fixed;bottom:210px;left:50%;transform:translateX(-50%);z-index:31;pointer-events:none;background:rgba(12,18,30,.9);border:1px solid #38bdf8;color:#e0f2fe;padding:6px 14px;border-radius:8px;font-size:.84rem;font-weight:700}
        .br-prompt.hidden{display:none!important}
      `;
      document.head.appendChild(style);
      this.style = style;

      this.banner = document.createElement('div');
      this.banner.id = 'br-banner';
      this.banner.className = 'hidden';

      this.prompt = document.createElement('div');
      this.prompt.id = 'br-prompt';
      this.prompt.className = 'br-prompt hidden';

      this.boostBox = document.createElement('div');
      this.boostBox.id = 'br-boost-wrap';
      this.boostBox.className = 'hidden';
      this.boostBox.innerHTML = `<div style="display:flex;justify-content:space-between;"><span>Boost พลังงาน</span><span id="br-boost-txt">0%</span></div><div class="br-boost-bg"><div class="br-boost-fill" id="br-boost-bar"></div></div><div id="br-med-cast" style="margin-top:4px;color:#34d399;font-weight:700;"></div>`;

      this.el = document.createElement('div');
      this.el.id = 'br-inv-overlay';
      this.el.className = 'hidden';
      this.el.innerHTML = `
        <div class="br-inv-shell">
          <div class="br-col">
            <div class="br-col-title"><span>ของรอบตัว / กล่องศพ (คลิกเพื่อเก็บ)</span><button id="br-inv-close" style="background:#ef4444;border:none;color:#fff;border-radius:5px;padding:3px 9px;cursor:pointer;font-weight:700;">ปิด [Tab]</button></div>
            <div class="br-scroll" id="br-vicinity-list"></div>
          </div>
          <div class="br-col">
            <div class="br-col-title"><span>กระเป๋าเป้</span><span id="br-weight-lbl">0 / 45</span></div>
            <div class="br-scroll" id="br-bag-list"></div>
          </div>
          <div class="br-col">
            <div class="br-col-title"><span>อุปกรณ์สวมใส่ & ปืน (ไม่มีของแต่งเริ่มต้น)</span><span id="br-team-lbl"></span></div>
            <div class="br-gear-grid" id="br-gear-grid"></div>
            <div class="br-scroll" id="br-weapon-slots"></div>
          </div>
        </div>
      `;
      document.body.append(this.banner, this.prompt, this.boostBox, this.el);
      document.getElementById('br-inv-close').onclick = () => this.toggle(false);
    }
  }

  toggle(force) {
    this.isOpen = force === undefined ? !this.isOpen : !!force;
    this.el.classList.toggle('hidden', !this.isOpen);
    this.cb.onToggle?.(this.isOpen);
  }

  setBanner(text) {
    if (!text) { this.banner.classList.add('hidden'); return; }
    this.banner.textContent = text;
    this.banner.classList.remove('hidden');
  }

  setPrompt(text) {
    if (!text) { this.prompt.classList.add('hidden'); return; }
    this.prompt.textContent = text;
    this.prompt.classList.remove('hidden');
  }

  updateBoost(boostVal, healState) {
    this.boostBox.classList.remove('hidden');
    document.getElementById('br-boost-txt').textContent = `${Math.round(boostVal)}%`;
    document.getElementById('br-boost-bar').style.width = `${Math.min(100, boostVal)}%`;
    const castEl = document.getElementById('br-med-cast');
    castEl.textContent = healState ? `กำลังใช้ ${healState.item.name}... ${Math.max(0, (healState.endAt - performance.now()) / 1000).toFixed(1)}s` : '';
  }

  dropButton(label, desc) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.style.cssText = 'margin-left:8px;background:#7f1d1d;border:1px solid #ef4444;color:#fecaca;border-radius:5px;padding:1px 8px;font-size:.72rem;font-weight:700;cursor:pointer;';
    btn.onclick = (event) => { event.stopPropagation(); this.cb.onDropItem?.(desc); };
    return btn;
  }

  render(inv, vicinityItems, WEAPONS, squadText) {
    if (!this.isOpen) return;
    document.getElementById('br-weight-lbl').textContent = `${inv.getCurrentWeight()} / ${inv.getMaxWeight()}`;
    document.getElementById('br-team-lbl').textContent = squadText;

    // 1. Vicinity / Death Box List
    const vicEl = document.getElementById('br-vicinity-list');
    vicEl.replaceChildren(...vicinityItems.map((entry) => {
      const row = document.createElement('div');
      row.className = 'br-item';
      row.innerHTML = `<span>${entry.label}</span><small style="color:#38bdf8;">เก็บ</small>`;
      row.onclick = () => this.cb.onPickupItem(entry);
      return row;
    }));
    if (!vicinityItems.length) {
      vicEl.innerHTML = '<div style="color:#64748b;text-align:center;padding:24px;">ไม่มีไอเทมในระยะใกล้</div>';
    }

    // 2. Backpack Contents (Ammo + Meds + Grenades + Loose Attachments)
    const bagEl = document.getElementById('br-bag-list');
    const bagRows = [];
    for (const [k, count] of Object.entries(inv.ammo)) {
      if (count <= 0) continue;
      const d = document.createElement('div');
      d.className = 'br-item';
      d.innerHTML = `<span>${BR_AMMO_TYPES[k].name}</span><b>x${count}</b>`;
      d.lastElementChild.appendChild(this.dropButton(`ทิ้ง ${Math.min(count, BR_AMMO_TYPES[k].bundle || 30)}`, { type: 'ammo', key: k }));
      bagRows.push(d);
    }
    for (const [k, count] of Object.entries(inv.meds)) {
      if (count <= 0) continue;
      const d = document.createElement('div');
      d.className = 'br-item';
      d.innerHTML = `<span>💊 ${BR_MED_ITEMS[k].name}</span><b>x${count} <small style="color:#34d399">(คลิกใช้)</small></b>`;
      d.onclick = () => this.cb.onUseMed(k);
      d.lastElementChild.appendChild(this.dropButton('ทิ้ง 1', { type: 'med', key: k }));
      bagRows.push(d);
    }
    for (const [k, count] of Object.entries(inv.grenades)) {
      if (count <= 0) continue;
      const d = document.createElement('div');
      d.className = 'br-item';
      d.innerHTML = `<span>💣 ${BR_GRENADE_ITEMS[k].name}</span><b>x${count}</b>`;
      d.lastElementChild.appendChild(this.dropButton('ทิ้ง 1', { type: 'grenade', key: k }));
      bagRows.push(d);
    }
    for (const mod of inv.looseAttachments) {
      const d = document.createElement('div');
      d.className = 'br-item';
      d.innerHTML = `<span>🔧 ${mod.label}</span><small style="color:#fde68a">คลิกติดตั้ง</small>`;
      d.onclick = () => this.cb.onEquipLooseMod(mod);
      d.lastElementChild.appendChild(this.dropButton('ทิ้ง', { type: 'attachment', uid: mod.uid }));
      bagRows.push(d);
    }
    bagEl.replaceChildren(...bagRows);
    if (!bagRows.length) {
      bagEl.innerHTML = '<div style="color:#64748b;text-align:center;padding:24px;">กระเป๋าว่างเปล่า</div>';
    }

    // 3. Gear & Weapons with Per-Slot Attachments
    document.getElementById('br-gear-grid').innerHTML = `
      <div class="br-gear-box"><b>หมวก</b><br>${BR_HELMET_LEVELS[inv.helmet.level].name}<br><small>${inv.helmet.level ? `${Math.round(inv.helmet.durability)}/${inv.helmet.maxDurability}` : '-'}</small></div>
      <div class="br-gear-box"><b>เสื้อเกราะ</b><br>${BR_ARMOR_LEVELS[inv.vest.level].name}<br><small>${inv.vest.level ? `${Math.round(inv.vest.durability)}/${inv.vest.maxDurability}` : '-'}</small></div>
      <div class="br-gear-box"><b>กระเป๋า</b><br>${BR_BACKPACK_LEVELS[inv.backpackLevel].name}<br><small>จุ ${inv.getMaxWeight()}</small></div>
    `;

    [['helmet', inv.helmet.level], ['vest', inv.vest.level], ['backpack', inv.backpackLevel]].forEach(([type, level], i) => {
      const box = document.getElementById('br-gear-grid').children[i];
      if (box && level > 0) { box.appendChild(document.createElement('br')); box.appendChild(this.dropButton('ทิ้ง', { type })); }
    });

    const wepEl = document.getElementById('br-weapon-slots');
    wepEl.replaceChildren(...[1, 2, 3].map((slot) => {
      const card = document.createElement('div');
      card.className = 'br-wep-card';
      const g = inv.weapons[slot];
      if (!g) {
        card.innerHTML = `<strong>ช่อง ${slot}: ว่าง</strong> <small style="color:#64748b;">(ไม่มีอาวุธ)</small>`;
        return card;
      }
      const spec = WEAPONS[g.weaponId];
      const ammoName = slot <= 2 ? BR_AMMO_TYPES[getBRAmmoType(g.weaponId)].name : 'ประชิด';
      card.innerHTML = `<div style="display:flex;justify-content:space-between;"><strong>ช่อง ${slot}: ${spec?.name || g.weaponId}</strong><small style="color:#38bdf8;">${ammoName} (${g.magAmmo})</small></div>`;
      card.firstElementChild.lastElementChild.appendChild(this.dropButton('ทิ้งปืน', { type: 'weapon', slot }));
      if (slot <= 2) {
        const chips = document.createElement('div');
        chips.className = 'br-mod-chips';
        for (const [k, val] of Object.entries(g.attachments)) {
          const isEmpty = val === 'iron' || val === 'default' || val === 'standard' || val === 'none';
          const chip = document.createElement('span');
          chip.className = 'br-chip' + (isEmpty ? '' : ' on');
          chip.textContent = isEmpty ? `${k}: ว่าง` : `${k}: ${val} (คลิกถอด)`;
          if (!isEmpty) chip.onclick = () => this.cb.onDetachMod(slot, k);
          chips.appendChild(chip);
        }
        card.appendChild(chips);
      }
      return card;
    }));
  }

  dispose() {
    this.banner.remove();
    this.prompt.remove();
    this.boostBox.remove();
    this.el.remove();
    this.style?.remove();
  }
}

// ============================================================================
// 6. MAIN BATTLE ROYALE ENGINE CONTROLLER
// ============================================================================
export function createBattleRoyaleSystem(scene, ctx) {
  const {
    WEAPONS,
    ATTACHMENT_SUPPORT,
    ATTACHMENT_DATA = window.NEW_ATTACHMENT_DATA,
    colliders = [],
    brSpawnPoints = [],
    mapHalf = 500,
    localPlayer,
    localUid,
    hostUid = localUid,
    hostName = ctx.localName || 'Player',
    seed = 'battle-royale',
    onPhaseChange,
    onToast,
    onSyncPlayerGear,
    claimLoot,
    getActorPosition,
    onKnocked,
    onRevived,
    onReviveTeammate,
    onBleedout
  } = ctx;
  const seedValue = String(seed);
  let randomState = 2166136261;
  for (const char of seedValue) randomState = Math.imul(randomState ^ char.charCodeAt(0), 16777619);
  const random = () => {
    randomState = (randomState + 0x6D2B79F5) | 0;
    let value = randomState;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  let lootSequence = 0;
  let airdropSequence = 0;

  const mats = {
    weapon: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.45, metalness: 0.6 }),
    vest: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.5 }),
    backpack: new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.7 }),
    med: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }),
    redCross: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
    grenade: new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.7 }),
    attachment: new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4, metalness: 0.5 }),
    deathbox: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 }),
    airdrop: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 }),
    flare: new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45, depthWrite: false }),
    ammo: {
      ammo_ar: new THREE.MeshStandardMaterial({ color: 0x16a34a }),
      ammo_smg: new THREE.MeshStandardMaterial({ color: 0x0284c7 }),
      ammo_sniper: new THREE.MeshStandardMaterial({ color: 0xdc2626 }),
      ammo_shotgun: new THREE.MeshStandardMaterial({ color: 0x991b1b }),
      ammo_9mm: new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    },
    levels: {
      1: new THREE.MeshStandardMaterial({ color: 0x64748b }),
      2: new THREE.MeshStandardMaterial({ color: 0x0284c7 }),
      3: new THREE.MeshStandardMaterial({ color: 0x7c3aed }),
      4: new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.35 })
    }
  };

  const room = new BRRoomController();
  const localInv = new BRInventory();
  const botInventories = new Map(); // botId -> BRInventory
  const BLEEDOUT_HP_PER_SECOND = 1;
  const actorStates = new Map();    // uid -> { squadId, knocked, bleedHp, downedAt, reviveProgress, airborneState, chuteMesh, parachuteColor }
  const groundLoot = [];            // { uid, kind, ..., pos, mesh, items? (for deathbox/airdrop) }

  function setActorKnocked(uid, knocked) {
    const state = actorStates.get(uid);
    if (!state) return false;
    state.knocked = !!knocked;
    if (state.knocked) {
      state.bleedHp = Math.max(1, state.bleedHp || 100);
      state.downedAt = performance.now();
    } else {
      state.bleedHp = 100;
      state.reviveProgress = 0;
    }
    return true;
  }

  function setActorEliminated(uid, eliminated = true) {
    const state = actorStates.get(uid);
    if (!state) return false;
    state.eliminated = !!eliminated;
    if (state.eliminated) {
      state.knocked = false;
      state.bleedHp = 0;
    }
    return true;
  }

  let phase = 'idle'; // 'idle' | 'boarding' | 'plane' | 'skydiving' | 'parachute' | 'playing' | 'finished'
  let boardingEndsAt = 0;
  let matchStartAt = 0;
  let planeMesh = null;
  let planeStart = new THREE.Vector3(-mapHalf * 0.9, 255, -mapHalf * 0.65);
  let planeEnd = new THREE.Vector3(mapHalf * 0.9, 255, mapHalf * 0.65);
  let planeProgress = 0;
  let planeDurationSec = 42;
  let activeHeal = null;
  let reviveTargetUid = null;
  let nextAirdropAt = 0;

  const ui = new BRInventoryUI({
    onToggle(open) {
      if (open) refreshUI();
      ctx.onInventoryToggle?.(open);
    },
    onPickupItem(entry) {
      Promise.resolve(pickupEntry(entry)).then(() => {
        syncPlayerStatsAndGear();
        refreshUI();
      }).catch((error) => onToast?.(`เก็บไอเทมไม่สำเร็จ: ${error.message}`));
    },
    onUseMed(medId) {
      startMedUse(medId);
      ui.toggle(false);
    },
    onDropItem(desc) {
      if (dropFromInventory(desc)) { syncPlayerStatsAndGear(); refreshUI(); }
    },
    onEquipLooseMod(mod) {
      const idx = localInv.looseAttachments.indexOf(mod);
      if (idx === -1) return;
      for (const s of [1, 2]) {
        if (localInv.attachModToSlot(mod, s, ATTACHMENT_SUPPORT)) {
          localInv.looseAttachments.splice(idx, 1);
          syncPlayerStatsAndGear();
          onToast?.(`ติดตั้ง ${mod.label} ในช่อง ${s}`);
          refreshUI();
          return;
        }
      }
      onToast?.('ปืนที่ถืออยู่ไม่รองรับของแต่งชิ้นนี้');
    },
    onDetachMod(slot, slotType) {
      const gun = localInv.weapons[slot];
      if (!gun) return;
      const val = gun.attachments[slotType];
      const def = slotType === 'sight' ? 'iron' : slotType === 'mag' ? 'default' : (slotType === 'barrel' || slotType === 'trigger' || slotType === 'ammunition') ? 'standard' : 'none';
      if (val === def) return;
      if (!localInv.canFitWeight(4)) { onToast?.('กระเป๋าเต็ม ไม่สามารถถอดของแต่งได้'); return; }
      gun.attachments[slotType] = def;
      localInv.looseAttachments.push({ uid: 'att_' + Math.random().toString(36).slice(2, 9), slotType, modId: val, label: `${slotType}: ${val}` });
      syncPlayerStatsAndGear();
      refreshUI();
    }
  });

  function sampleFloorY(x, z) {
    let y = 0;
    for (const b of colliders) {
      if (b.stairRamp) continue;
      if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ && b.maxY < 28 && b.maxY > y) y = b.maxY;
    }
    return y + 0.05;
  }

  function spawnGroundItem(itemData, pos) {
    const mesh = createLootVisual(itemData, mats);
    mesh.position.copy(pos);
    scene.add(mesh);
    const entry = {
      uid: 'loot_' + (++lootSequence),
      ...itemData,
      pos: pos.clone(),
      mesh
    };
    groundLoot.push(entry);
    return entry;
  }

  // ---------------- Drop item (ทิ้งของจากกระเป๋า/ช่องอาวุธ/เกราะ) ----------------
  let dropSequence = 0;
  function dropFromInventory(desc) {
    if (!desc || phase !== 'playing') return false;
    const st = actorStates.get(localUid);
    if (!st || st.knocked || st.eliminated) { onToast?.('ตอนถูกล้มไม่สามารถทิ้งของได้'); return false; }
    const yaw = Number(localPlayer.yaw) || 0;
    const pos = localPlayer.pos.clone();
    pos.x += -Math.sin(yaw) * 1.1 + (Math.random() - 0.5) * 0.5;
    pos.z += -Math.cos(yaw) * 1.1 + (Math.random() - 0.5) * 0.5;
    pos.y += 0.05;
    const mk = (data) => spawnGroundItem({ ...data, uid: `drop_${localUid}_${Date.now().toString(36)}_${++dropSequence}`, _localOnly: true }, pos);
    const tables = { vest: BR_ARMOR_LEVELS, helmet: BR_HELMET_LEVELS };

    switch (desc.type) {
      case 'ammo': {
        const have = localInv.ammo[desc.key] || 0, info = BR_AMMO_TYPES[desc.key];
        const n = Math.min(have, info?.bundle || 30);
        if (!info || n <= 0) return false;
        localInv.ammo[desc.key] -= n;
        mk({ kind: 'ammo', ammoType: desc.key, count: n, label: `${info.name} x${n}` });
        onToast?.(`ทิ้ง ${info.name} x${n}`);
        return true;
      }
      case 'med': {
        if (!(localInv.meds[desc.key] > 0)) return false;
        localInv.meds[desc.key] -= 1;
        mk({ kind: 'med', medId: desc.key, count: 1, label: BR_MED_ITEMS[desc.key].name });
        onToast?.(`ทิ้ง ${BR_MED_ITEMS[desc.key].name}`);
        return true;
      }
      case 'grenade': {
        if (!(localInv.grenades[desc.key] > 0)) return false;
        localInv.grenades[desc.key] -= 1;
        mk({ kind: 'grenade', grenadeId: desc.key, count: 1, label: BR_GRENADE_ITEMS[desc.key].name });
        onToast?.(`ทิ้ง ${BR_GRENADE_ITEMS[desc.key].name}`);
        return true;
      }
      case 'attachment': {
        const idx = localInv.looseAttachments.findIndex((m) => m.uid === desc.uid);
        if (idx === -1) return false;
        const [mod] = localInv.looseAttachments.splice(idx, 1);
        mk({ kind: 'attachment', slotType: mod.slotType, modId: mod.modId, label: `ของแต่ง: ${mod.label}` });
        onToast?.(`ทิ้ง ${mod.label}`);
        return true;
      }
      case 'weapon': {
        const gun = localInv.weapons[desc.slot];
        if (!gun) return false;
        localInv.weapons[desc.slot] = null;
        const name = WEAPONS[gun.weaponId]?.name || gun.weaponId;
        mk({ kind: 'weapon', weaponId: gun.weaponId, magAmmo: gun.magAmmo, attachments: { ...gun.attachments }, label: name });
        onToast?.(`ทิ้ง ${name}`);
        return true;
      }
      case 'vest':
      case 'helmet': {
        const cur = localInv[desc.type];
        if (!cur || cur.level <= 0) return false;
        const table = tables[desc.type];
        mk({ kind: desc.type, level: cur.level, durability: cur.durability, label: table[cur.level].name });
        onToast?.(`ทิ้ง ${table[cur.level].name}`);
        localInv[desc.type] = { level: 0, durability: 0, maxDurability: 0 };
        return true;
      }
      case 'backpack': {
        const lv = localInv.backpackLevel;
        if (lv <= 0) return false;
        mk({ kind: 'backpack', level: lv, label: BR_BACKPACK_LEVELS[lv].name });
        localInv.backpackLevel = 0;
        onToast?.(`ทิ้ง ${BR_BACKPACK_LEVELS[lv].name}`);
        return true;
      }
      default:
        return false;
    }
  }

  function populateCountryLoot() {
    clearLoot();
    const gunIds = Object.keys(WEAPONS).filter((id) => WEAPONS[id].slot <= 2);
    const medIds = Object.keys(BR_MED_ITEMS);
    const grenadeIds = Object.keys(BR_GRENADE_ITEMS);
    const attPool = [];
    if (ATTACHMENT_DATA) {
      for (const s of ATTACHMENT_DATA.sights || []) if (s.id !== 'iron') attPool.push({ slotType: 'sight', modId: s.id, label: s.label });
      for (const [id, o] of Object.entries(ATTACHMENT_DATA.muzzles || {})) if (id !== 'none') attPool.push({ slotType: 'muzzle', modId: id, label: o.label.split('(')[0] });
      for (const [id, o] of Object.entries(ATTACHMENT_DATA.barrels || {})) if (id !== 'standard') attPool.push({ slotType: 'barrel', modId: id, label: o.label.split('(')[0] });
      for (const [id, o] of Object.entries(ATTACHMENT_DATA.grips || {})) if (id !== 'none') attPool.push({ slotType: 'grip', modId: id, label: o.label.split('(')[0] });
      for (const [id, o] of Object.entries(ATTACHMENT_DATA.stocks || {})) if (id !== 'none') attPool.push({ slotType: 'stock', modId: id, label: o.label.split('(')[0] });
      for (const [id, o] of Object.entries(ATTACHMENT_DATA.lasers || {})) if (id !== 'none') attPool.push({ slotType: 'laser', modId: id, label: o.label });
      for (const [id, o] of Object.entries(ATTACHMENT_DATA.ammunition || {})) if (id !== 'standard') attPool.push({ slotType: 'ammunition', modId: id, label: o.label.split('(')[0] });
      for (const cap of [40, 50, 60, 75, 100]) attPool.push({ slotType: 'mag', modId: String(cap), label: `แม็กขยาย ${cap} นัด` });
    }

    const anchors = brSpawnPoints.length ? brSpawnPoints : [new THREE.Vector3(0, 0, 0)];
    for (const anchor of anchors) {
      for (let k = 0; k < 14; k++) {
        const px = Math.max(-mapHalf + 15, Math.min(mapHalf - 15, anchor.x + (random() - 0.5) * 65));
        const pz = Math.max(-mapHalf + 15, Math.min(mapHalf - 15, anchor.z + (random() - 0.5) * 65));
        const py = sampleFloorY(px, pz);
        if (py > 16) continue;
        const pos = new THREE.Vector3(px, py, pz);

        const roll = random();
        if (roll < 0.28) {
          // Naked gun + matching ammo bundle beside it
          const wid = gunIds[Math.floor(random() * gunIds.length)];
          const spec = WEAPONS[wid];
          spawnGroundItem({
            kind: 'weapon',
            weaponId: wid,
            magAmmo: spec.mag || 15,
            attachments: createEmptyAttachments(), // Always naked!
            label: `${spec.name} (ปืนเปล่า)`
          }, pos);
          const aType = getBRAmmoType(wid);
          spawnGroundItem({
            kind: 'ammo',
            ammoType: aType,
            count: BR_AMMO_TYPES[aType].bundle,
            label: `${BR_AMMO_TYPES[aType].name} x${BR_AMMO_TYPES[aType].bundle}`
          }, pos.clone().add(new THREE.Vector3(0.7, 0, 0.4)));
        } else if (roll < 0.46) {
          const lv = random() < 0.55 ? 1 : random() < 0.8 ? 2 : random() < 0.95 ? 3 : 4;
          const gearKind = ['vest', 'helmet', 'backpack'][Math.floor(random() * 3)];
          const table = gearKind === 'vest' ? BR_ARMOR_LEVELS : gearKind === 'helmet' ? BR_HELMET_LEVELS : BR_BACKPACK_LEVELS;
          spawnGroundItem({
            kind: gearKind,
            level: lv,
            durability: table[lv].maxDurability || 100,
            label: table[lv].name
          }, pos);
        } else if (roll < 0.65) {
          const mid = medIds[Math.floor(random() * medIds.length)];
          spawnGroundItem({ kind: 'med', medId: mid, count: 1, label: BR_MED_ITEMS[mid].name }, pos);
        } else if (roll < 0.78) {
          const gid = grenadeIds[Math.floor(random() * grenadeIds.length)];
          spawnGroundItem({ kind: 'grenade', grenadeId: gid, count: 1, label: BR_GRENADE_ITEMS[gid].name }, pos);
        } else if (roll < 0.90 && attPool.length) {
          const att = attPool[Math.floor(random() * attPool.length)];
          spawnGroundItem({ kind: 'attachment', ...att, label: `ของแต่ง: ${att.label}` }, pos);
        } else {
          const aKeys = Object.keys(BR_AMMO_TYPES);
          const aType = aKeys[Math.floor(random() * aKeys.length)];
          spawnGroundItem({
            kind: 'ammo',
            ammoType: aType,
            count: BR_AMMO_TYPES[aType].bundle,
            label: `${BR_AMMO_TYPES[aType].name} x${BR_AMMO_TYPES[aType].bundle}`
          }, pos);
        }
      }
    }
  }

  function spawnAirdrop(x, z) {
    const pos = new THREE.Vector3(x, 120, z);
    const targetY = sampleFloorY(x, z);
    const dropUid = `airdrop_${++airdropSequence}`;
    const lootItems = [
      { kind: 'vest', level: 4, durability: BR_ARMOR_LEVELS[4].maxDurability, label: BR_ARMOR_LEVELS[4].name },
      { kind: 'helmet', level: 4, durability: BR_HELMET_LEVELS[4].maxDurability, label: BR_HELMET_LEVELS[4].name },
      { kind: 'backpack', level: 4, label: BR_BACKPACK_LEVELS[4].name },
      { kind: 'weapon', weaponId: random() < 0.5 ? 'barrett' : 'm200', magAmmo: 7, attachments: createEmptyAttachments(), label: 'สไนเปอร์ Airdrop' },
      { kind: 'ammo', ammoType: 'ammo_sniper', count: 30, label: 'กระสุน Sniper x30' },
      { kind: 'med', medId: 'med_medkit', count: 1, label: BR_MED_ITEMS.med_medkit.name },
      { kind: 'attachment', slotType: 'sight', modId: 'thermal-x4', label: 'กล้องจับความร้อน x4' }
    ];
    lootItems.forEach((item, index) => { item.uid = `${dropUid}_${index}`; });
    const entry = spawnGroundItem({ uid: dropUid, kind: 'airdrop', items: lootItems, falling: true, targetY, label: 'Airdrop เสบียงระดับ Lv.4' }, pos);
    entry.chute = buildParachuteMesh(0xdc2626);
    entry.mesh.add(entry.chute);
    onToast?.('เครื่องบินกำลังทิ้ง Airdrop ลงสนามรบ!');
  }

  function dropDeathBox(actorId, pos, inv, uid = `deathbox_${actorId}_${Date.now().toString(36)}`) {
    if (!inv) return null;
    const items = inv.serializeForDeathBox();
    if (!items.length) return null;
    items.forEach((item, index) => { item.uid = `${uid}_${index}`; });
    const box = spawnDeathBox(uid, pos, items, actorId);
    return box ? { uid, items, position: box.pos.toArray(), ownerId: actorId } : null;
  }

  function spawnDeathBox(uid, pos, items, ownerId = '') {
    if (groundLoot.some((item) => item.uid === uid)) return groundLoot.find((item) => item.uid === uid);
    const dropPos = new THREE.Vector3(pos.x, sampleFloorY(pos.x, pos.z), pos.z);
    const copy = items.map((item, index) => ({
      ...item,
      uid: item.uid || `${uid}_${index}`,
      label: item.label || (item.kind === 'weapon' ? WEAPONS[item.weaponId]?.name : item.kind)
    }));
    return spawnGroundItem({ uid, kind: 'deathbox', ownerId, items: copy, label: 'กล่องศพ (มีปืนที่แต่งไว้แล้ว)' }, dropPos);
  }

  function clearLoot() {
    for (const l of groundLoot) scene.remove(l.mesh);
    groundLoot.length = 0;
  }

  // ---------------- Match Lifecycle: Boarding (30s) -> Plane -> Skydiving -> Ground ----------------
  function startBattleRoyale({ roomName = 'PUBG Island', teamMode = 'squad', players = [], bots = [], startAt = Date.now() }) {
    room.createRoom({ roomName, teamMode, hostUid, hostName });
    const orderedPlayers = [...players].filter((p) => p.uid !== hostUid).sort((a, b) =>
      (a.joinedAt || 0) - (b.joinedAt || 0) || String(a.uid).localeCompare(String(b.uid))
    );
    for (const p of orderedPlayers) room.joinHumanPlayer(p.uid, p.name, p.squadId);
    room.fillBotsToMatchCapacity();

    localInv.resetEmpty();
    botInventories.clear();
    actorStates.clear();
    const lateJoin = Date.now() >= startAt + BR_BOARDING_WAIT_SEC * 1000;
    const playerStates = new Map(players.map((player) => [player.uid, player]));

    // Everyone starts completely naked (no guns, no armor, no backpack)
    for (const m of room.members) {
      const source = playerStates.get(m.uid);
      const knocked = lateJoin && !!source?.brKnocked;
      actorStates.set(m.uid, {
        uid: m.uid,
        name: m.name,
        squadId: m.squadId,
        isBot: m.isBot,
        knocked,
        eliminated: lateJoin && source?.alive === false && Number(source?.eliminatedAt) > 0,
        bleedHp: 100,
        airborne: 'boarding',
        chuteMesh: null
      });
      if (m.isBot) {
        const bi = new BRInventory();
        bi.resetEmpty();
        botInventories.set(m.uid, bi);
      }
    }

    bindBotActors(bots);

    populateCountryLoot();

    // Phase 1: 30-second Pre-Match Boarding Island
    phase = 'boarding';
    boardingEndsAt = performance.now() + Math.max(0, startAt + BR_BOARDING_WAIT_SEC * 1000 - Date.now());
    randomState = 2166136261;
    for (const char of seedValue) randomState = Math.imul(randomState ^ char.charCodeAt(0), 16777619);
    airdropSequence = 0;
    onPhaseChange?.('boarding');
    syncPlayerStatsAndGear();
    ui.setBanner(`รอผู้เล่นขึ้นเครื่องบิน... ${BR_BOARDING_WAIT_SEC} วินาที (ตัวเปล่า — ค้นหาอาวุธและของแต่งหลังโดดร่ม)`);
  }

  function launchAirplane() {
    phase = 'plane';
    matchStartAt = performance.now();
    nextAirdropAt = matchStartAt + 75000;
    planeProgress = 0;

    const angle = random() * Math.PI * 2;
    const R = mapHalf * 0.92;
    planeStart.set(Math.cos(angle) * R, 255, Math.sin(angle) * R);
    planeEnd.set(-Math.cos(angle) * R, 255, -Math.sin(angle) * R);

    if (planeMesh) scene.remove(planeMesh);
    planeMesh = buildC130Plane();
    planeMesh.position.copy(planeStart);
    planeMesh.lookAt(planeEnd);
    scene.add(planeMesh);

    const st = actorStates.get(localUid);
    if (st) st.airborne = 'plane';
    onPhaseChange?.('plane');
    ui.setBanner('อยู่บนเครื่องบิน C-130 (ตัวเปล่า) — กด [F] หรือ [Space] เพื่อกระโดดร่ม!');
  }

  function jumpFromPlane() {
    if (phase !== 'plane') return;
    phase = 'skydiving';
    const st = actorStates.get(localUid);
    if (st) st.airborne = 'skydiving';
    localPlayer.pos.copy(planeMesh.position).add(new THREE.Vector3(0, -4, 0));
    localPlayer.vel.set(0, -24, 0);
    onPhaseChange?.('skydiving');
    ui.setBanner('กำลังดิ่งพสุธา — กด [Space] เพื่อกางร่มชูชีพ (กางอัตโนมัติที่ 115m)');
  }

  function deployParachute() {
    if (phase !== 'skydiving') return;
    phase = 'parachute';
    const st = actorStates.get(localUid);
    if (st) {
      st.airborne = 'parachute';
      if (!st.chuteMesh) {
        st.chuteMesh = buildParachuteMesh(0xf59e0b);
        scene.add(st.chuteMesh);
      }
    }
    onPhaseChange?.('parachute');
    ui.setBanner('กางร่มชูชีพแล้ว — บังคับ [WASD] ร่อนลงจุดฟาร์ม!');
  }

  function landOnGround() {
    phase = 'playing';
    const st = actorStates.get(localUid);
    if (st) {
      st.airborne = 'ground';
      if (st.chuteMesh) { scene.remove(st.chuteMesh); st.chuteMesh = null; }
    }
    onPhaseChange?.('playing');
    ui.setBanner('');
    onToast?.('ลงถึงพื้นแล้ว! เก็บปืน กระเป๋า เกราะ Lv.1-4 และของแต่งจากแมพ');
  }

  // ---------------- Weapon Stats, Reloading & Gear Sync ----------------
  function syncPlayerStatsAndGear() {
    const vest = BR_ARMOR_LEVELS[localInv.vest.level];
    const helm = BR_HELMET_LEVELS[localInv.helmet.level];
    localPlayer.armor = localInv.vest.durability;
    localPlayer.maxArmor = Math.max(1, vest.maxDurability || 100);
    localPlayer.headArmor = localInv.helmet.durability;
    localPlayer.maxHeadArmor = Math.max(1, helm.maxDurability || 100);
    onSyncPlayerGear?.(localInv, (wid, slot) => computeBRWeaponStats(wid, localInv.weapons[slot]?.attachments, WEAPONS, ATTACHMENT_SUPPORT, ATTACHMENT_DATA));
  }

  function reloadSlotFromBag(slot) {
    const gun = localInv.weapons[slot];
    if (!gun) return 0;
    const stats = computeBRWeaponStats(gun.weaponId, gun.attachments, WEAPONS, ATTACHMENT_SUPPORT, ATTACHMENT_DATA);
    const aType = getBRAmmoType(gun.weaponId);
    const avail = localInv.ammo[aType] || 0;
    const need = Math.max(0, (stats.mag || 30) - gun.magAmmo);
    const take = Math.min(need, avail);
    gun.magAmmo += take;
    localInv.ammo[aType] -= take;
    return take;
  }

  // ---------------- Pickup & Med Use ----------------
  function getVicinityEntries(radius = 3.2) {
    const out = [];
    for (const item of groundLoot) {
      if (item.pos.distanceTo(localPlayer.pos) > radius) continue;
      if (item.kind === 'deathbox' || item.kind === 'airdrop') {
        item.items.forEach((sub, idx) => {
          out.push({ ...sub, parentLoot: item, subIndex: idx,           uid: sub.uid || `${item.uid}_${idx}` });
        });
      } else {
        out.push(item);
      }
    }
    return out;
  }

  function pickupEntry(entry) {
    if (!entry) return false;
    if (entry.kind === 'backpack' && entry.level <= localInv.backpackLevel) { onToast?.('มีกระเป๋าระดับเท่ากันหรือสูงกว่าแล้ว'); return false; }
    if (entry.kind === 'vest' && entry.level < localInv.vest.level) { onToast?.('เกราะที่ใส่อยู่ระดับสูงกว่า'); return false; }
    if (entry.kind === 'helmet' && entry.level < localInv.helmet.level) { onToast?.('หมวกที่ใส่อยู่ระดับสูงกว่า'); return false; }
    if (entry.kind === 'ammo' && (localInv.getMaxWeight() - localInv.getCurrentWeight()) < BR_AMMO_TYPES[entry.ammoType].weight) {
      onToast?.('กระเป๋าเต็ม! หากระเป๋า Lv. สูงขึ้น'); return false;
    }
    if (entry.kind === 'med' && !localInv.canFitWeight(BR_MED_ITEMS[entry.medId]?.weight || Infinity)) { onToast?.('กระเป๋าเต็ม!'); return false; }
    if (entry.kind === 'grenade' && !localInv.canFitWeight(BR_GRENADE_ITEMS[entry.grenadeId]?.weight || Infinity)) { onToast?.('กระเป๋าเต็ม!'); return false; }
    if (entry.kind === 'attachment' && !localInv.canFitWeight(4)) { onToast?.('กระเป๋าเต็ม!'); return false; }
    if (claimLoot && !entry._claimResolved && !entry._localOnly) {
      const requestedCount = entry.kind === 'ammo'
        ? Math.min(entry.count, Math.floor((localInv.getMaxWeight() - localInv.getCurrentWeight()) / BR_AMMO_TYPES[entry.ammoType].weight))
        : null;
      return Promise.resolve(claimLoot(entry.uid, entry, requestedCount)).then((result) => {
        if (!result?.claimed) { onToast?.('ผู้เล่นอื่นเก็บไอเทมนี้ไปแล้ว'); return false; }
        return pickupEntry({ ...entry, count: result.taken ?? entry.count, _claimResolved: true, _claimResult: result });
      }).catch((error) => {
        onToast?.(`เก็บไอเทมไม่สำเร็จ: ${error.message}`);
        return false;
      });
    }
    const removeFromWorld = () => {
      if (entry.parentLoot) {
        const index = entry.parentLoot.items.findIndex((item) => item.uid === entry.uid);
        if (index !== -1) entry.parentLoot.items.splice(index, 1);
        if (!entry.parentLoot.items.length) {
          scene.remove(entry.parentLoot.mesh);
          const i = groundLoot.indexOf(entry.parentLoot);
          if (i !== -1) groundLoot.splice(i, 1);
        }
      } else {
        scene.remove(entry.mesh);
        const i = groundLoot.indexOf(entry);
        if (i !== -1) groundLoot.splice(i, 1);
      }
    };

    if (entry.kind === 'weapon') {
      const { dropped } = localInv.equipWeapon(entry, WEAPONS);
      removeFromWorld();
      if (dropped) {
        spawnGroundItem({ kind: 'weapon', ...dropped, label: `${WEAPONS[dropped.weaponId].name}` }, localPlayer.pos.clone());
      }
      syncPlayerStatsAndGear();
      onToast?.(`เก็บ ${WEAPONS[entry.weaponId].name}`);
      return true;
    }
    if (entry.kind === 'backpack') {
      if (entry.level <= localInv.backpackLevel) { onToast?.('มีกระเป๋าระดับเท่ากันหรือสูงกว่าแล้ว'); return false; }
      const oldLv = localInv.backpackLevel;
      localInv.backpackLevel = entry.level;
      removeFromWorld();
      if (oldLv > 0) spawnGroundItem({ kind: 'backpack', level: oldLv, label: BR_BACKPACK_LEVELS[oldLv].name }, localPlayer.pos.clone());
      onToast?.(`สวมใส่ ${BR_BACKPACK_LEVELS[entry.level].name}`);
      return true;
    }
    if (entry.kind === 'vest') {
      if (entry.level < localInv.vest.level) { onToast?.('เกราะที่ใส่อยู่ระดับสูงกว่า'); return false; }
      const old = { ...localInv.vest };
      localInv.vest = { level: entry.level, durability: entry.durability, maxDurability: BR_ARMOR_LEVELS[entry.level].maxDurability };
      removeFromWorld();
      if (old.level > 0 && old.durability > 5) spawnGroundItem({ kind: 'vest', level: old.level, durability: old.durability, label: BR_ARMOR_LEVELS[old.level].name }, localPlayer.pos.clone());
      syncPlayerStatsAndGear();
      onToast?.(`สวมใส่ ${BR_ARMOR_LEVELS[entry.level].name}`);
      return true;
    }
    if (entry.kind === 'helmet') {
      if (entry.level < localInv.helmet.level) { onToast?.('หมวกที่ใส่อยู่ระดับสูงกว่า'); return false; }
      const old = { ...localInv.helmet };
      localInv.helmet = { level: entry.level, durability: entry.durability, maxDurability: BR_HELMET_LEVELS[entry.level].maxDurability };
      removeFromWorld();
      if (old.level > 0 && old.durability > 5) spawnGroundItem({ kind: 'helmet', level: old.level, durability: old.durability, label: BR_HELMET_LEVELS[old.level].name }, localPlayer.pos.clone());
      syncPlayerStatsAndGear();
      onToast?.(`สวมใส่ ${BR_HELMET_LEVELS[entry.level].name}`);
      return true;
    }
    if (entry.kind === 'ammo') {
      const wPer = BR_AMMO_TYPES[entry.ammoType].weight;
      const roomCount = Math.floor((localInv.getMaxWeight() - localInv.getCurrentWeight()) / wPer);
      const take = Math.min(entry.count, Math.max(0, roomCount));
      if (take <= 0) { onToast?.('กระเป๋าเต็ม! หากระเป๋า Lv. สูงขึ้น'); return false; }
      localInv.ammo[entry.ammoType] += take;
      if (entry._claimResult?.remaining > 0) {
        if (entry.parentLoot) {
          const item = entry.parentLoot.items.find((sub) => sub.uid === entry.uid);
          if (item) item.count = entry._claimResult.remaining;
        }
        else entry.count = entry._claimResult.remaining;
      } else if (take >= entry.count) removeFromWorld();
      else entry.count -= take;
      onToast?.(`เก็บ ${BR_AMMO_TYPES[entry.ammoType].name} +${take}`);
      return true;
    }
    if (entry.kind === 'med') {
      const item = BR_MED_ITEMS[entry.medId];
      if (!localInv.canFitWeight(item.weight)) { onToast?.('กระเป๋าเต็ม!'); return false; }
      localInv.meds[entry.medId] += entry.count || 1;
      removeFromWorld();
      onToast?.(`เก็บ ${item.name}`);
      return true;
    }
    if (entry.kind === 'grenade') {
      const item = BR_GRENADE_ITEMS[entry.grenadeId];
      if (!localInv.canFitWeight(item.weight)) { onToast?.('กระเป๋าเต็ม!'); return false; }
      localInv.grenades[entry.grenadeId] += entry.count || 1;
      removeFromWorld();
      onToast?.(`เก็บ ${item.name}`);
      return true;
    }
    if (entry.kind === 'attachment') {
      const res = localInv.autoEquipAttachment(entry, ATTACHMENT_SUPPORT);
      if (res === -1) { onToast?.('กระเป๋าเต็ม!'); return false; }
      removeFromWorld();
      syncPlayerStatsAndGear();
      onToast?.(res > 0 ? `ติดตั้ง ${entry.label} เข้ากับปืนช่อง ${res}` : `เก็บ ${entry.label} ลงกระเป๋า`);
      return true;
    }
    return false;
  }

  function applyLootClaim(uid, claim) {
    const direct = groundLoot.find((item) => item.uid === uid);
    if (direct) {
      if (claim?.claimedBy || !(claim?.remaining > 0)) {
        scene.remove(direct.mesh);
        groundLoot.splice(groundLoot.indexOf(direct), 1);
      } else if (Number.isFinite(claim.remaining)) {
        direct.count = claim.remaining;
      }
      return;
    }
    const parent = groundLoot.find((item) => item.items?.some((sub) => sub.uid === uid));
    const subIndex = parent?.items?.findIndex((sub) => sub.uid === uid) ?? -1;
    const subItem = parent?.items?.[subIndex];
    if (!subItem) return;
    if (claim?.claimedBy || !(claim?.remaining > 0)) {
      parent.items.splice(subIndex, 1);
      if (!parent.items.length) {
        scene.remove(parent.mesh);
        groundLoot.splice(groundLoot.indexOf(parent), 1);
      }
    } else if (Number.isFinite(claim.remaining)) {
      subItem.count = claim.remaining;
    }
  }

  function startMedUse(medId) {
    const item = BR_MED_ITEMS[medId];
    if (!item || (localInv.meds[medId] || 0) <= 0 || activeHeal) return false;
    activeHeal = { medId, item, endAt: performance.now() + item.useSec * 1000 };
    onToast?.(`กำลังใช้ ${item.name}...`);
    return true;
  }

  function areHostile(uidA, uidB) {
    if (uidA === uidB) return false;
    const a = actorStates.get(uidA);
    const b = actorStates.get(uidB);
    if (!a || !b) return true;
    return a.squadId !== b.squadId;
  }

  function bindBotActors(actors = []) {
    const members = room.members.filter((member) => member.isBot);
    [...actors].sort((a, b) => String(a.id).localeCompare(String(b.id))).forEach((actor, index) => {
      const member = members[index];
      const state = member && actorStates.get(member.uid);
      if (!state || !actor?.id) return;
      actor.brId = actor.id;
      actor.brSquadId = state.squadId;
      actor.squadId = state.squadId;
      actorStates.set(actor.id, { ...state, uid: actor.id });
      const inventory = botInventories.get(member.uid);
      if (inventory) {
        botInventories.delete(member.uid);
        botInventories.set(actor.id, inventory);
        // บอทเริ่มตัวเปล่าเหมือนผู้เล่น — ห้ามแจกปืนจาก loadout ของโหมดอื่น (ต้องเก็บจากพื้นเอง)
        actor.armor = inventory.vest.durability;
        actor.headArmor = inventory.helmet.durability;
      }
    });
  }

  // ---------------- Bot Scavenging: บอทเริ่มตัวเปล่าและต้องวิ่งเก็บของเองเหมือนผู้เล่น ----------------
  const botAmmoUnit = (spec) => (spec.shellByShell ? 1 : spec.dual ? Math.max(1, Math.floor((spec.mag || 2) / 2)) : Math.max(1, spec.mag || 1));

  function makeBotUnarmed(actor) {
    actor.brUnarmed = true;
    actor.primary = null;
    actor.secondary = null;
    actor.weaponId = 'm_knife';
    actor.activeGun = 'm_knife';
    actor.magAmmo = 0;
    actor.spareMags = 0;
    actor.secMagAmmo = 0;
    actor.secSpareMags = 0;
    actor.fragLeft = 0;
    actor.smokeLeft = 0;
    actor.armor = 0;
    actor.headArmor = 0;
    actor.outOfAmmo = false;
    actor.reloadingUntil = 0;
    actor.brMeshDirty = true;
    botInventories.get(actor.id)?.resetEmpty();
  }

  // AI ของบอทนับกระสุนด้วย magAmmo/spareMags ของตัวเอง → ก่อนเก็บของหรือตาย ซิงก์ค่าเหล่านั้นกลับเข้า inventory
  function syncBotInventoryFromActor(actor) {
    const inv = botInventories.get(actor.id);
    if (!inv) return null;
    for (const key of Object.keys(inv.ammo)) inv.ammo[key] = 0;
    if (actor.brUnarmed) return inv;
    const apply = (weaponId, magAmmo, spare) => {
      const spec = weaponId && WEAPONS[weaponId];
      if (!spec) return;
      const gun = [1, 2].map((s) => inv.weapons[s]).find((g) => g?.weaponId === weaponId);
      if (gun) gun.magAmmo = Math.max(0, Math.floor(magAmmo || 0));
      inv.ammo[getBRAmmoType(weaponId)] += Math.max(0, Math.floor((spare || 0) * botAmmoUnit(spec)));
    };
    apply(actor.weaponId, actor.magAmmo, actor.spareMags);
    apply(actor.weaponId === actor.primary ? actor.secondary : actor.primary, actor.secMagAmmo, actor.secSpareMags);
    return inv;
  }

  function botCanEquip(inv, spec) {
    if (!spec || spec.slot > 2) return false;
    return spec.slot === 2 ? !inv.weapons[2] : !inv.weapons[1] || !inv.weapons[2];
  }

  // 0 = บอทไม่สนใจของชิ้นนี้ ; ยิ่งสูงยิ่งอยากได้
  function botLootValue(actor, inv, entry) {
    switch (entry.kind) {
      case 'weapon': {
        const spec = WEAPONS[entry.weaponId];
        if (!botCanEquip(inv, spec)) return 0;
        if (!inv.weapons[1] && !inv.weapons[2]) return 100;
        if (!inv.weapons[1] && spec.slot === 1) return 80;
        return 40;
      }
      case 'ammo': {
        const guns = [1, 2].map((s) => inv.weapons[s]).filter((g) => g && getBRAmmoType(g.weaponId) === entry.ammoType);
        if (!guns.length) return 0;
        if (actor.outOfAmmo) return 95;
        const low = guns.some((g) => (g.weaponId === actor.weaponId ? actor.spareMags : actor.secSpareMags) < 3);
        return low ? 70 : 0;
      }
      case 'vest': return entry.level > inv.vest.level ? 50 + entry.level * 6 : 0;
      case 'helmet': return entry.level > inv.helmet.level ? 45 + entry.level * 6 : 0;
      default: return 0;
    }
  }

  function findBotLoot(actor, radius = 45) {
    const inv = botInventories.get(actor.id);
    if (!inv || !actor.pos) return null;
    let best = null;
    let bestScore = 0;
    const consider = (entry, pos) => {
      if (actor.brIgnore?.has(entry.uid)) return;
      const value = botLootValue(actor, inv, entry);
      if (value <= 0) return;
      const d = Math.hypot(pos.x - actor.pos.x, pos.z - actor.pos.z);
      if (d > radius || Math.abs(pos.y - actor.pos.y) > 8) return;
      const score = value - d * 0.7;
      if (score > bestScore) { bestScore = score; best = { entry, pos, dist: d }; }
    };
    for (const item of groundLoot) {
      if (item.falling) continue;
      if (Math.abs(item.pos.x - actor.pos.x) > radius || Math.abs(item.pos.z - actor.pos.z) > radius) continue;
      if (item.items) {
        item.items.forEach((sub, idx) => consider({ ...sub, parentLoot: item, subIndex: idx, uid: sub.uid || `${item.uid}_${idx}` }, item.pos));
      } else {
        consider(item, item.pos);
      }
    }
    return best;
  }

  function lootEntryStillExists(entry) {
    if (entry.parentLoot) return groundLoot.includes(entry.parentLoot) && entry.parentLoot.items.some((sub) => sub.uid === entry.uid);
    return groundLoot.some((l) => l.uid === entry.uid);
  }

  function removeLootEntryFromWorld(entry) {
    if (entry.parentLoot) {
      const index = entry.parentLoot.items.findIndex((item) => item.uid === entry.uid);
      if (index !== -1) entry.parentLoot.items.splice(index, 1);
      if (!entry.parentLoot.items.length) {
        scene.remove(entry.parentLoot.mesh);
        const i = groundLoot.indexOf(entry.parentLoot);
        if (i !== -1) groundLoot.splice(i, 1);
      }
      return;
    }
    const i = groundLoot.findIndex((l) => l.uid === entry.uid);
    if (i !== -1) {
      scene.remove(groundLoot[i].mesh);
      groundLoot.splice(i, 1);
    } else if (entry.mesh) {
      scene.remove(entry.mesh);
    }
  }

  function botAmmoMags(inv, weaponId) {
    return (inv.ammo[getBRAmmoType(weaponId)] || 0) / botAmmoUnit(WEAPONS[weaponId]);
  }

  // ได้ปืนใหม่ → อัปเดตฟิลด์ที่ AI ของบอทใช้ยิง (primary/secondary/magAmmo/spareMags)
  function refreshBotActorWeapons(actor, inv, newWeaponId) {
    const spec = WEAPONS[newWeaponId];
    const gun = [inv.weapons[1], inv.weapons[2]].find((g) => g?.weaponId === newWeaponId);
    if (!spec || !gun) return;
    if (actor.brUnarmed) {
      actor.brUnarmed = false;
      actor.primary = newWeaponId;
      actor.activeGun = newWeaponId;
      actor.weaponId = newWeaponId;
      actor.secondary = null;
      actor.magAmmo = gun.magAmmo;
      actor.spareMags = botAmmoMags(inv, newWeaponId);
      actor.secMagAmmo = 0;
      actor.secSpareMags = 0;
      actor.outOfAmmo = false;
      actor.reloadingUntil = 0;
      actor.brMeshDirty = true;
      return;
    }
    const activeSpec = WEAPONS[actor.weaponId];
    if (spec.slot === 1 && activeSpec?.slot === 2) {
      // ถือปืนพกอยู่แล้วเจอปืนยาว → เปลี่ยนมาใช้ปืนยาว เก็บปืนพกเป็นรอง
      actor.secondary = actor.weaponId;
      actor.secMagAmmo = actor.magAmmo;
      actor.secSpareMags = actor.spareMags;
      actor.primary = newWeaponId;
      actor.activeGun = newWeaponId;
      actor.weaponId = newWeaponId;
      actor.magAmmo = gun.magAmmo;
      actor.spareMags = botAmmoMags(inv, newWeaponId);
      actor.outOfAmmo = false;
      actor.reloadingUntil = 0;
      actor.brMeshDirty = true;
    } else {
      actor.secondary = newWeaponId;
      actor.secMagAmmo = gun.magAmmo;
      actor.secSpareMags = botAmmoMags(inv, newWeaponId);
    }
  }

  function applyBotPickup(actor, inv, entry) {
    if (entry.kind === 'weapon') {
      if (!botCanEquip(inv, WEAPONS[entry.weaponId])) return false;
      inv.equipWeapon(entry, WEAPONS);
      removeLootEntryFromWorld(entry);
      refreshBotActorWeapons(actor, inv, entry.weaponId);
      return true;
    }
    if (entry.kind === 'vest') {
      if (entry.level <= inv.vest.level) return false;
      const max = BR_ARMOR_LEVELS[entry.level].maxDurability;
      inv.vest = { level: entry.level, durability: entry.durability ?? max, maxDurability: max };
      removeLootEntryFromWorld(entry);
      actor.armor = inv.vest.durability;
      return true;
    }
    if (entry.kind === 'helmet') {
      if (entry.level <= inv.helmet.level) return false;
      const max = BR_HELMET_LEVELS[entry.level].maxDurability;
      inv.helmet = { level: entry.level, durability: entry.durability ?? max, maxDurability: max };
      removeLootEntryFromWorld(entry);
      actor.headArmor = inv.helmet.durability;
      return true;
    }
    if (entry.kind === 'ammo') {
      const take = Math.max(0, Math.floor(entry.count || 0));
      const gun = [1, 2].map((s) => inv.weapons[s]).find((g) => g && getBRAmmoType(g.weaponId) === entry.ammoType);
      if (!take || !gun) return false;
      inv.ammo[entry.ammoType] += take;
      const addMags = take / botAmmoUnit(WEAPONS[gun.weaponId]);
      if (gun.weaponId === actor.weaponId) actor.spareMags = (actor.spareMags || 0) + addMags;
      else actor.secSpareMags = (actor.secSpareMags || 0) + addMags;
      actor.outOfAmmo = false;
      if (entry._claimResult?.remaining > 0) {
        if (entry.parentLoot) {
          const item = entry.parentLoot.items.find((sub) => sub.uid === entry.uid);
          if (item) item.count = entry._claimResult.remaining;
        } else {
          const loot = groundLoot.find((l) => l.uid === entry.uid);
          if (loot) loot.count = entry._claimResult.remaining;
        }
      } else {
        removeLootEntryFromWorld(entry);
      }
      return true;
    }
    return false;
  }

  // คืนค่า boolean (ออฟไลน์) หรือ Promise<boolean> (ออนไลน์ ต้องแย่งสิทธิ์เก็บผ่าน Firebase เหมือนผู้เล่น)
  function botPickupEntry(actor, entry) {
    const inv = syncBotInventoryFromActor(actor);
    if (!inv || !entry || !lootEntryStillExists(entry) || botLootValue(actor, inv, entry) <= 0) return false;
    if (claimLoot) {
      const requested = entry.kind === 'ammo' ? Math.max(0, Math.floor(entry.count || 0)) : null;
      return Promise.resolve(claimLoot(entry.uid, entry, requested))
        .then((result) => {
          if (!result?.claimed) return false;
          return applyBotPickup(actor, inv, { ...entry, count: result.taken ?? entry.count, _claimResult: result });
        })
        .catch(() => false);
    }
    return applyBotPickup(actor, inv, entry);
  }

  function handleDamageWithKnock(victimUid, rawDmg, isHeadshot, armorPierce = 0, region = 'torso', regionHp = undefined, healthMode = 'bodyparts') {
    const st = actorStates.get(victimUid);
    if (!st) return { eliminated: true, knocked: false, finalDmg: rawDmg };
    if (region === 'heart') region = 'torso';
    const inv = victimUid === localUid ? localInv : botInventories.get(victimUid);

    let dmg = rawDmg;
    const armorFactor = 1 - Math.max(-0.2, Math.min(0.65, Number(armorPierce) || 0));
    if (inv) {
      if (isHeadshot && inv.helmet.level > 0 && inv.helmet.durability > 0) {
        const red = BR_HELMET_LEVELS[inv.helmet.level].reduction;
        const absorbed = Math.min(inv.helmet.durability, dmg * red * armorFactor);
        inv.helmet.durability -= absorbed;
        dmg -= absorbed;
        if (inv.helmet.durability <= 0) inv.helmet = { level: 0, durability: 0, maxDurability: 0 };
      } else if (region === 'torso' && inv.vest.level > 0 && inv.vest.durability > 0) {
        const red = BR_ARMOR_LEVELS[inv.vest.level].reduction;
        const absorbed = Math.min(inv.vest.durability, dmg * red * armorFactor);
        inv.vest.durability -= absorbed;
        dmg -= absorbed;
        if (inv.vest.durability <= 0) inv.vest = { level: 0, durability: 0, maxDurability: 0 };
      }
    }

    if (st.knocked) {
      st.bleedHp -= dmg;
      if (st.bleedHp <= 0) {
        st.eliminated = true;
        st.knocked = false;
        return { eliminated: true, knocked: false, finalDmg: Math.round(dmg) };
      }
      return { eliminated: false, knocked: true, finalDmg: Math.round(dmg) };
    }

    // Bots cannot revive, so only a living human teammate can prevent immediate elimination.
    const teammatesAlive = [...actorStates.values()].some(
      (m) => m.squadId === st.squadId && m.uid !== victimUid && !m.isBot && !m.eliminated && !m.knocked
    );
    // ล้มเฉพาะตอนที่ดาเมจนี้ทำให้หัว/ลำตัวเลือดหมดจริง ๆ (เดิมล้มทันทีที่โดนดาเมจเล็กน้อย เช่น วงพายุ จนขยับ/ยิงไม่ได้)
    const hitKey = region === 'heart' ? 'torso' : region;
    const effDmg = healthMode === 'single'
      ? Math.max(0, Math.round(dmg))
      : dmg > 0 ? Math.max(5, Math.round(dmg)) : 0;
    const lethal = !Number.isFinite(regionHp)
      ? true
      : healthMode === 'single'
        ? regionHp - effDmg <= 0
        : (hitKey === 'head' || hitKey === 'torso') && regionHp - effDmg <= 0;
    if (room.teamMode !== 'solo' && teammatesAlive && lethal) {
      st.knocked = true;
      st.bleedHp = 100;
      st.downedAt = performance.now();
      st.reviveProgress = 0;
      if (victimUid === localUid) onKnocked?.();
      return { canKnock: true, finalDmg: Math.round(dmg) };
    }
    return { canKnock: false, finalDmg: Math.round(dmg) };
  }

  function reviveActor(uid, hp = 40) {
    const st = actorStates.get(uid);
    if (!st?.knocked || st.eliminated) return false;
    st.knocked = false;
    st.bleedHp = 100;
    st.reviveProgress = 0;
    if (uid === localUid) {
      localPlayer.hp = hp;
      if (localPlayer.bodyHp) {
        localPlayer.bodyHp.torso = Math.max(localPlayer.bodyHp.torso, hp);
        localPlayer.bodyHp.head = Math.max(localPlayer.bodyHp.head, hp);
      }
      onRevived?.(hp);
    }
    return true;
  }

  function tryReviveNearby(radius = 2.8) {
    const local = actorStates.get(localUid);
    if (!local || local.knocked || phase !== 'playing') return false;
    const nearby = [...actorStates.values()].find((state) => {
      if (state.uid === localUid || state.squadId !== local.squadId || !state.knocked || state.eliminated) return false;
      const position = getActorPosition?.(state.uid);
      return position && position.distanceTo(localPlayer.pos) <= radius;
    });
    if (!nearby) return false;
    if (reviveTargetUid === nearby.uid) return true;
    if (reviveTargetUid) {
      const previous = actorStates.get(reviveTargetUid);
      if (previous) previous.reviveProgress = 0;
    }
    reviveTargetUid = nearby.uid;
    nearby.reviveProgress = 0;
    onToast?.(`กำลังช่วยเพื่อน ${nearby.name} — กด F ค้าง 4 วินาที`);
    return true;
  }

  function updateRevive(dt, input) {
    if (!reviveTargetUid) return;
    const target = actorStates.get(reviveTargetUid);
    const targetPos = getActorPosition?.(reviveTargetUid);
    if (!target || !target.knocked || !targetPos || !input.interactHeld || targetPos.distanceTo(localPlayer.pos) > 2.8) {
      if (target) target.reviveProgress = 0;
      reviveTargetUid = null;
      return;
    }
    target.reviveProgress += dt;
    ui.setPrompt(`กำลังช่วยเพื่อน ${target.name} • ${Math.min(100, Math.round(target.reviveProgress / 4 * 100))}%`);
    if (target.reviveProgress >= 4) {
      reviveActor(target.uid);
      onReviveTeammate?.(target.uid, 40);
      reviveTargetUid = null;
      onToast?.(`ช่วย ${target.name} กลับเข้าสู่การต่อสู้แล้ว`);
    }
  }

  function refreshUI() {
    const st = actorStates.get(localUid);
    const sqText = st ? `${BR_TEAM_MODES[room.teamMode].label} • ${st.squadId.toUpperCase()}` : '';
    ui.render(localInv, getVicinityEntries(3.4), WEAPONS, sqText);
  }

  // ---------------- Per-Frame Update ----------------
  function update(dt, now, input = {}) {
    if (phase === 'idle' || phase === 'finished') return;

    // 1. Boarding Island Countdown (30s)
    if (phase === 'boarding') {
      const left = Math.max(0, Math.ceil((boardingEndsAt - now) / 1000));
      ui.setBanner(`รอผู้เล่นขึ้นเครื่องบิน... ${left} วินาที (ทุกคนเริ่มต้นตัวเปล่า)`);
      if (now >= boardingEndsAt) launchAirplane();
      return;
    }

    // 2. Airplane Flight & Auto-Eject
    if (phase === 'plane' || planeMesh) {
      planeProgress += dt / planeDurationSec;
      if (planeMesh) {
        planeMesh.position.lerpVectors(planeStart, planeEnd, Math.min(1, planeProgress));
        for (const p of planeMesh.userData.props || []) p.rotation.z += dt * 36;
      }
      if (phase === 'plane') {
        localPlayer.pos.copy(planeMesh.position);
        if (input.jumpPressed || input.interactPressed) jumpFromPlane();
        else if (planeProgress >= 0.96) jumpFromPlane();
      }
      if (planeProgress >= 1.1 && planeMesh) {
        scene.remove(planeMesh);
        planeMesh = null;
      }
    }

    // 3. Skydiving & Parachute Flight
    if (phase === 'skydiving' || phase === 'parachute') {
      const groundY = sampleFloorY(localPlayer.pos.x, localPlayer.pos.z);
      const alt = localPlayer.pos.y - groundY;
      const fw = new THREE.Vector3(-Math.sin(localPlayer.yaw), 0, -Math.cos(localPlayer.yaw));
      const rt = new THREE.Vector3(Math.cos(localPlayer.yaw), 0, -Math.sin(localPlayer.yaw));
      const move = new THREE.Vector3();
      if (input.forward) move.add(fw);
      if (input.backward) move.sub(fw);
      if (input.right) move.add(rt);
      if (input.left) move.sub(rt);
      if (move.lengthSq() > 0) move.normalize();

      if (phase === 'skydiving') {
        localPlayer.pos.addScaledVector(move, 22 * dt);
        localPlayer.pos.y -= 44 * dt;
        ui.setBanner(`ดิ่งพสุธา • ความสูง ${Math.max(0, Math.round(alt))}m • กด [Space] กางร่ม`);
        if (input.jumpPressed || alt <= 115) deployParachute();
      } else {
        localPlayer.pos.addScaledVector(move, 16 * dt);
        localPlayer.pos.y -= 9.5 * dt;
        const st = actorStates.get(localUid);
        if (st?.chuteMesh) st.chuteMesh.position.copy(localPlayer.pos);
        ui.setBanner(`ร่อนร่มชูชีพ • ความสูง ${Math.max(0, Math.round(alt))}m`);
      }

      if (localPlayer.pos.y <= groundY + 0.1) {
        localPlayer.pos.y = groundY;
        landOnGround();
      }
    }

    // 4. Falling Airdrops & Distance-Culled Ground Loot Animation
    if (phase === 'playing' && now >= nextAirdropAt) {
      nextAirdropAt = now + 90000;
      spawnAirdrop((random() - 0.5) * mapHalf * 0.9, (random() - 0.5) * mapHalf * 0.9);
    }
    for (const item of groundLoot) {
      if (item.falling) {
        item.pos.y -= 12 * dt;
        item.mesh.position.copy(item.pos);
        if (item.pos.y <= item.targetY) {
          item.pos.y = item.targetY;
          item.mesh.position.y = item.targetY;
          item.falling = false;
          if (item.chute) { item.mesh.remove(item.chute); item.chute = null; }
        }
      } else {
        const dSq = item.pos.distanceToSquared(localPlayer.pos);
        item.mesh.visible = dSq < 7225; // Render within 85m for high FPS across 1000x1000 map
        if (item.mesh.visible && item.kind !== 'deathbox' && item.kind !== 'airdrop') {
          item.mesh.rotation.y += 1.4 * dt;
        }
      }
    }

    // 5. Vicinity Pickup Prompt & Medical Healing / Boost Tick
    if (phase === 'playing') {
      for (const state of actorStates.values()) {
        if (!state.knocked || state.eliminated) continue;
        state.bleedHp = Math.max(0, state.bleedHp - dt * BLEEDOUT_HP_PER_SECOND);
        if (state.bleedHp <= 0) {
          state.eliminated = true;
          state.knocked = false;
          if (state.uid === localUid) {
            onBleedout?.();
            if (localPlayer.alive) localPlayer.alive = false;
          }
        }
      }
      updateRevive(dt, input);
      const near = getVicinityEntries(3.0);
      if (!reviveTargetUid) ui.setPrompt(near.length ? `[F] เก็บ: ${near[0].label}${near.length > 1 ? ` (+${near.length - 1} ชิ้น • กด Tab เปิดกระเป๋า)` : ''}` : '');

      if (activeHeal) {
        if (now >= activeHeal.endAt) {
          const m = activeHeal.item;
          localInv.meds[activeHeal.medId] = Math.max(0, localInv.meds[activeHeal.medId] - 1);
          localPlayer.hp = Math.min(m.capHp, localPlayer.hp + m.heal);
          if (localPlayer.bodyHp) {
            for (const r of Object.keys(localPlayer.bodyHp)) {
              localPlayer.bodyHp[r] = Math.min(m.capHp, localPlayer.bodyHp[r] + m.heal);
            }
          }
          localInv.boost = Math.min(100, localInv.boost + m.boost);
          onToast?.(`ใช้ ${m.name} สำเร็จ!`);
          activeHeal = null;
        }
      }
      if (localInv.boost > 0 && localPlayer.alive) {
        localInv.boost = Math.max(0, localInv.boost - dt * 1.4);
        localPlayer.hp = Math.min(100, localPlayer.hp + dt * 1.8);
      }
      ui.updateBoost(localInv.boost, activeHeal);
    }
  }

  function dispose() {
    clearLoot();
    if (planeMesh) { scene.remove(planeMesh); planeMesh = null; }
    for (const st of actorStates.values()) {
      if (st.chuteMesh) scene.remove(st.chuteMesh);
    }
    ui.dispose();
  }

  return {
    room,
    localInv,
    botInventories,
    actorStates,
    groundLoot,
    ui,
    getPhase: () => phase,
    startBattleRoyale,
    jumpFromPlane,
    deployParachute,
    getVicinityEntries,
    pickupEntry,
    applyLootClaim,
    reloadSlotFromBag,
    startMedUse,
    reviveActor,
    setActorKnocked,
    setActorEliminated,
    getActorInventory: (uid) => uid === localUid ? localInv : botInventories.get(uid) || null,
    tryReviveNearby,
    dropDeathBox,
    spawnDeathBox,
    spawnAirdrop,
    refreshInventory: refreshUI,
    areHostile,
    bindBotActors,
    makeBotUnarmed,
    findBotLoot,
    botPickupEntry,
    syncBotInventoryFromActor,
    handleDamageWithKnock,
    syncPlayerStatsAndGear,
    getSlotWeaponStats: (wid, slot) => computeBRWeaponStats(wid, localInv.weapons[slot]?.attachments, WEAPONS, ATTACHMENT_SUPPORT, ATTACHMENT_DATA),
    toggleInventory: (force) => ui.toggle(force),
    update,
    dispose
  };
}