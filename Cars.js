import * as THREE from 'three';

// ============================================================================
// 1. VEHICLE SPECIFICATIONS (16 Models: 4 Super, 4 Sport, 3 Moto, 3 Offroad, 2 EV)
// ============================================================================
export const VEHICLE_SPECS = {
  // ---- SUPERCARS (4) ----
  sc_apex: {
    id: 'sc_apex', name: 'Apex V12 Hyper', category: 'supercar', label: 'SUPERCAR',
    mass: 1380, engineForce: 15800, brakeForce: 22000, topSpeedKmh: 335, reverseKmh: 75,
    steerMax: 0.56, steerSpeed: 3.1, tireGrip: 1.24, downforce: 2.8, drivetrain: 'AWD',
    suspTravel: 0.14, suspStiff: 58, suspDamp: 7.5, pitchFactor: 0.022, rollFactor: 0.024,
    energyType: 'fuel', fuelCap: 72, fuelBurn: 0.28, maxHp: 650,
    wheelRadius: 0.36, wheelWidth: 0.30, wheelBase: 2.75, trackWidth: 1.88,
    size: [2.06, 1.12, 4.55], color: 0xdc2626, accent: 0x111827, activeWing: true, openTop: false,
    seats: [[-0.42, 0.42, 0.08], [0.42, 0.42, 0.08]]
  },
  sc_valkyrie: {
    id: 'sc_valkyrie', name: 'Valkyrie GT-R', category: 'supercar', label: 'SUPERCAR',
    mass: 1320, engineForce: 16400, brakeForce: 23500, topSpeedKmh: 342, reverseKmh: 78,
    steerMax: 0.58, steerSpeed: 3.3, tireGrip: 1.30, downforce: 3.4, drivetrain: 'RWD',
    suspTravel: 0.12, suspStiff: 64, suspDamp: 8.2, pitchFactor: 0.018, rollFactor: 0.019,
    energyType: 'fuel', fuelCap: 70, fuelBurn: 0.30, maxHp: 620,
    wheelRadius: 0.36, wheelWidth: 0.32, wheelBase: 2.78, trackWidth: 1.94,
    size: [2.12, 1.14, 4.65], color: 0xf59e0b, accent: 0x0f172a, activeWing: true, openTop: false,
    seats: [[-0.42, 0.42, 0.10], [0.42, 0.42, 0.10]]
  },
  sc_solaris: {
    id: 'sc_solaris', name: 'Solaris Spyder', category: 'supercar', label: 'SUPERCAR',
    mass: 1290, engineForce: 15000, brakeForce: 21000, topSpeedKmh: 322, reverseKmh: 72,
    steerMax: 0.60, steerSpeed: 3.4, tireGrip: 1.20, downforce: 2.3, drivetrain: 'RWD',
    suspTravel: 0.15, suspStiff: 54, suspDamp: 7.0, pitchFactor: 0.024, rollFactor: 0.026,
    energyType: 'fuel', fuelCap: 68, fuelBurn: 0.27, maxHp: 600,
    wheelRadius: 0.35, wheelWidth: 0.28, wheelBase: 2.70, trackWidth: 1.86,
    size: [2.02, 1.08, 4.48], color: 0x0ea5e9, accent: 0xf8fafc, activeWing: true, openTop: true,
    seats: [[-0.40, 0.44, 0.12], [0.40, 0.44, 0.12]]
  },
  sc_phantom: {
    id: 'sc_phantom', name: 'Phantom Noir', category: 'supercar', label: 'SUPERCAR',
    mass: 1410, engineForce: 16800, brakeForce: 23000, topSpeedKmh: 350, reverseKmh: 80,
    steerMax: 0.54, steerSpeed: 3.0, tireGrip: 1.26, downforce: 3.1, drivetrain: 'AWD',
    suspTravel: 0.13, suspStiff: 60, suspDamp: 7.8, pitchFactor: 0.020, rollFactor: 0.022,
    energyType: 'fuel', fuelCap: 75, fuelBurn: 0.31, maxHp: 700,
    wheelRadius: 0.37, wheelWidth: 0.31, wheelBase: 2.86, trackWidth: 1.92,
    size: [2.08, 1.10, 4.78], color: 0x18181b, accent: 0x06b6d4, activeWing: true, openTop: false,
    seats: [[-0.42, 0.42, 0.06], [0.42, 0.42, 0.06]]
  },

  // ---- SPORTCARS (4) ----
  sp_drift: {
    id: 'sp_drift', name: 'Kurogane Silvia S15', category: 'sportcar', label: 'SPORTCAR',
    mass: 1240, engineForce: 11200, brakeForce: 16500, topSpeedKmh: 268, reverseKmh: 62,
    steerMax: 0.68, steerSpeed: 3.8, tireGrip: 1.04, downforce: 1.4, drivetrain: 'RWD',
    suspTravel: 0.16, suspStiff: 48, suspDamp: 6.5, pitchFactor: 0.028, rollFactor: 0.032,
    energyType: 'fuel', fuelCap: 62, fuelBurn: 0.22, maxHp: 720,
    wheelRadius: 0.34, wheelWidth: 0.26, wheelBase: 2.62, trackWidth: 1.78,
    size: [1.92, 1.24, 4.44], color: 0x7c3aed, accent: 0xe2e8f0, activeWing: false,
    seats: [[-0.40, 0.48, 0.05], [0.40, 0.48, 0.05]]
  },
  sp_viper: {
    id: 'sp_viper', name: 'Vipera GTS', category: 'sportcar', label: 'SPORTCAR',
    mass: 1480, engineForce: 13400, brakeForce: 18500, topSpeedKmh: 288, reverseKmh: 65,
    steerMax: 0.60, steerSpeed: 3.1, tireGrip: 1.10, downforce: 1.7, drivetrain: 'RWD',
    suspTravel: 0.15, suspStiff: 52, suspDamp: 6.8, pitchFactor: 0.027, rollFactor: 0.028,
    energyType: 'fuel', fuelCap: 68, fuelBurn: 0.26, maxHp: 780,
    wheelRadius: 0.35, wheelWidth: 0.28, wheelBase: 2.68, trackWidth: 1.84,
    size: [1.98, 1.20, 4.52], color: 0x1d4ed8, accent: 0xffffff, activeWing: false,
    seats: [[-0.42, 0.46, 0.16], [0.42, 0.46, 0.16]]
  },
  sp_monza: {
    id: 'sp_monza', name: 'Monza RS Coupe', category: 'sportcar', label: 'SPORTCAR',
    mass: 1360, engineForce: 12200, brakeForce: 18000, topSpeedKmh: 278, reverseKmh: 64,
    steerMax: 0.62, steerSpeed: 3.4, tireGrip: 1.14, downforce: 1.6, drivetrain: 'AWD',
    suspTravel: 0.16, suspStiff: 50, suspDamp: 6.8, pitchFactor: 0.025, rollFactor: 0.026,
    energyType: 'fuel', fuelCap: 64, fuelBurn: 0.23, maxHp: 750,
    wheelRadius: 0.34, wheelWidth: 0.26, wheelBase: 2.66, trackWidth: 1.80,
    size: [1.94, 1.26, 4.46], color: 0xe2e8f0, accent: 0xef4444, activeWing: false,
    seats: [[-0.40, 0.48, 0.02], [0.40, 0.48, 0.02], [-0.38, 0.48, 0.78], [0.38, 0.48, 0.78]]
  },
  sp_rally: {
    id: 'sp_rally', name: 'Impreza WRX Rally', category: 'sportcar', label: 'SPORTCAR',
    mass: 1340, engineForce: 12000, brakeForce: 17500, topSpeedKmh: 256, reverseKmh: 62,
    steerMax: 0.64, steerSpeed: 3.6, tireGrip: 1.18, downforce: 1.5, drivetrain: 'AWD', offroadBias: 0.25,
    suspTravel: 0.24, suspStiff: 44, suspDamp: 6.0, pitchFactor: 0.030, rollFactor: 0.032,
    energyType: 'fuel', fuelCap: 65, fuelBurn: 0.24, maxHp: 820,
    wheelRadius: 0.36, wheelWidth: 0.26, wheelBase: 2.64, trackWidth: 1.80,
    size: [1.94, 1.36, 4.48], color: 0x2563eb, accent: 0xfacc15, activeWing: false,
    seats: [[-0.40, 0.54, 0.0], [0.40, 0.54, 0.0], [-0.38, 0.54, 0.76], [0.38, 0.54, 0.76]]
  },

  // ---- MOTORCYCLES (3) ----
  mc_superbike: {
    id: 'mc_superbike', name: 'Ninja ZX-10R Track', category: 'motorcycle', label: 'MOTORCYCLE',
    isMoto: true, mass: 215, engineForce: 3200, brakeForce: 4800, topSpeedKmh: 298, reverseKmh: 18,
    steerMax: 0.52, steerSpeed: 4.4, tireGrip: 1.24, downforce: 0.45, drivetrain: 'RWD', maxLean: 0.62,
    suspTravel: 0.16, suspStiff: 42, suspDamp: 5.5, pitchFactor: 0.055, rollFactor: 0.0,
    energyType: 'fuel', fuelCap: 20, fuelBurn: 0.12, maxHp: 340,
    wheelRadius: 0.31, wheelWidth: 0.16, wheelBase: 1.44, trackWidth: 0,
    size: [0.76, 1.08, 2.08], color: 0x16a34a, accent: 0x111827,
    seats: [[0, 0.78, 0.10], [0, 0.88, 0.56]]
  },
  mc_cruiser: {
    id: 'mc_cruiser', name: 'Ironclad Chopper', category: 'motorcycle', label: 'MOTORCYCLE',
    isMoto: true, mass: 295, engineForce: 2700, brakeForce: 4000, topSpeedKmh: 215, reverseKmh: 16,
    steerMax: 0.56, steerSpeed: 3.4, tireGrip: 1.08, downforce: 0.2, drivetrain: 'RWD', maxLean: 0.42,
    suspTravel: 0.15, suspStiff: 38, suspDamp: 5.2, pitchFactor: 0.045, rollFactor: 0.0,
    energyType: 'fuel', fuelCap: 24, fuelBurn: 0.14, maxHp: 420,
    wheelRadius: 0.32, wheelWidth: 0.18, wheelBase: 1.66, trackWidth: 0,
    size: [0.88, 1.14, 2.34], color: 0x991b1b, accent: 0xd1d5db,
    seats: [[0, 0.66, 0.16], [0, 0.76, 0.64]]
  },
  mc_dirt: {
    id: 'mc_dirt', name: 'Crossfire 450 Dirt', category: 'motorcycle', label: 'MOTORCYCLE',
    isMoto: true, mass: 145, engineForce: 2500, brakeForce: 3800, topSpeedKmh: 175, reverseKmh: 18,
    steerMax: 0.65, steerSpeed: 4.8, tireGrip: 1.16, downforce: 0.15, drivetrain: 'RWD', maxLean: 0.56, offroadBias: 0.45,
    suspTravel: 0.28, suspStiff: 34, suspDamp: 4.8, pitchFactor: 0.065, rollFactor: 0.0,
    energyType: 'fuel', fuelCap: 16, fuelBurn: 0.10, maxHp: 360,
    wheelRadius: 0.34, wheelWidth: 0.14, wheelBase: 1.48, trackWidth: 0,
    size: [0.80, 1.18, 2.16], color: 0xea580c, accent: 0xf8fafc,
    seats: [[0, 0.86, 0.08], [0, 0.88, 0.52]]
  },

  // ---- OFFROAD (3) ----
  or_raptor: {
    id: 'or_raptor', name: 'Titan 4x4 Raptor', category: 'offroad', label: 'OFFROAD',
    mass: 2450, engineForce: 17500, brakeForce: 24000, topSpeedKmh: 192, reverseKmh: 55,
    steerMax: 0.58, steerSpeed: 2.7, tireGrip: 1.14, downforce: 0.5, drivetrain: 'AWD', offroadBias: 0.45,
    suspTravel: 0.34, suspStiff: 42, suspDamp: 5.8, pitchFactor: 0.032, rollFactor: 0.042,
    energyType: 'fuel', fuelCap: 110, fuelBurn: 0.34, maxHp: 1250,
    wheelRadius: 0.48, wheelWidth: 0.34, wheelBase: 3.30, trackWidth: 2.02,
    size: [2.22, 1.88, 5.45], color: 0x3f4d36, accent: 0x18181b,
    seats: [[-0.48, 0.92, -0.15], [0.48, 0.92, -0.15], [-0.46, 0.92, 0.72], [0.46, 0.92, 0.72]]
  },
  or_jeep: {
    id: 'or_jeep', name: 'Wrangler Rubicon 4x4', category: 'offroad', label: 'OFFROAD',
    mass: 1980, engineForce: 14800, brakeForce: 20500, topSpeedKmh: 178, reverseKmh: 52,
    steerMax: 0.62, steerSpeed: 3.0, tireGrip: 1.16, downforce: 0.4, drivetrain: 'AWD', offroadBias: 0.50,
    suspTravel: 0.36, suspStiff: 40, suspDamp: 5.5, pitchFactor: 0.034, rollFactor: 0.046,
    energyType: 'fuel', fuelCap: 92, fuelBurn: 0.30, maxHp: 1150,
    wheelRadius: 0.46, wheelWidth: 0.32, wheelBase: 2.88, trackWidth: 1.90,
    size: [2.04, 1.82, 4.55], color: 0xb45309, accent: 0x1f2937, openTop: true,
    seats: [[-0.44, 0.86, 0.02], [0.44, 0.86, 0.02], [-0.42, 0.86, 0.85], [0.42, 0.86, 0.85]]
  },
  or_buggy: {
    id: 'or_buggy', name: 'Dune Sandrail Buggy', category: 'offroad', label: 'OFFROAD',
    mass: 860, engineForce: 9200, brakeForce: 12500, topSpeedKmh: 188, reverseKmh: 55,
    steerMax: 0.68, steerSpeed: 3.8, tireGrip: 1.12, downforce: 0.6, drivetrain: 'RWD', offroadBias: 0.52,
    suspTravel: 0.40, suspStiff: 36, suspDamp: 4.8, pitchFactor: 0.038, rollFactor: 0.040,
    energyType: 'fuel', fuelCap: 55, fuelBurn: 0.20, maxHp: 740,
    wheelRadius: 0.44, wheelWidth: 0.30, wheelBase: 2.68, trackWidth: 1.96,
    size: [2.06, 1.54, 4.05], color: 0xfacc15, accent: 0x1e293b, openTop: true,
    seats: [[-0.36, 0.62, 0.14], [0.36, 0.62, 0.14]]
  },

  // ---- EV VEHICLES (2) ----
  ev_cyber: {
    id: 'ev_cyber', name: 'Volt-X Cybertruck', category: 'ev', label: 'EV',
    mass: 2780, engineForce: 22500, brakeForce: 27000, topSpeedKmh: 228, reverseKmh: 75,
    steerMax: 0.56, steerSpeed: 2.9, tireGrip: 1.20, downforce: 1.1, drivetrain: 'AWD', offroadBias: 0.35,
    suspTravel: 0.30, suspStiff: 54, suspDamp: 7.4, pitchFactor: 0.020, rollFactor: 0.024,
    energyType: 'ev', batteryCap: 125, batteryBurn: 0.28, regenRate: 0.35, maxHp: 1450,
    wheelRadius: 0.46, wheelWidth: 0.32, wheelBase: 3.35, trackWidth: 2.02,
    size: [2.18, 1.74, 5.45], color: 0x94a3b8, accent: 0x0f172a,
    seats: [[-0.48, 0.84, -0.15], [0.48, 0.84, -0.15], [-0.46, 0.84, 0.72], [0.46, 0.84, 0.72]]
  },
  ev_taycan: {
    id: 'ev_taycan', name: 'E-Tron Aero GT', category: 'ev', label: 'EV',
    mass: 1960, engineForce: 19200, brakeForce: 24500, topSpeedKmh: 286, reverseKmh: 85,
    steerMax: 0.60, steerSpeed: 3.4, tireGrip: 1.25, downforce: 2.1, drivetrain: 'AWD',
    suspTravel: 0.15, suspStiff: 58, suspDamp: 7.6, pitchFactor: 0.018, rollFactor: 0.020,
    energyType: 'ev', batteryCap: 100, batteryBurn: 0.24, regenRate: 0.42, maxHp: 880,
    wheelRadius: 0.36, wheelWidth: 0.28, wheelBase: 2.86, trackWidth: 1.88,
    size: [2.02, 1.24, 4.78], color: 0x0284c7, accent: 0x0f172a, activeWing: true,
    seats: [[-0.42, 0.46, 0.04], [0.42, 0.46, 0.04], [-0.40, 0.46, 0.84], [0.40, 0.46, 0.84]]
  }
};

export const SURFACE_GRIP = {
  asphalt: { supercar: 1.06, sportcar: 1.04, motorcycle: 1.04, offroad: 0.94, ev: 1.04, rollingDrag: 0.014 },
  dirt:    { supercar: 0.64, sportcar: 0.74, motorcycle: 0.78, offroad: 1.02, ev: 0.84, rollingDrag: 0.032 },
  grass:   { supercar: 0.58, sportcar: 0.68, motorcycle: 0.74, offroad: 0.96, ev: 0.78, rollingDrag: 0.038 },
  sand:    { supercar: 0.48, sportcar: 0.58, motorcycle: 0.66, offroad: 0.92, ev: 0.70, rollingDrag: 0.055 },
  water:   { supercar: 0.38, sportcar: 0.44, motorcycle: 0.48, offroad: 0.76, ev: 0.60, rollingDrag: 0.085 }
};


// ============================================================================
// 1B. PER-VEHICLE SOUND PROFILES & PROCEDURAL WEB AUDIO ENGINE
// ============================================================================
export const VEHICLE_SOUND_PROFILES = {
  // Supercars
  sc_apex: {
    type: 'v12', baseFreq: 52, maxFreq: 228, wave: 'sawtooth', harmWave: 'sawtooth', harmRatio: 1.5, harmGain: 0.42,
    subGain: 0.36, lpfBase: 360, lpfOpen: 3200, drive: 26, pulseHz: 0, pulseDepth: 0,
    turbo: 0.04, bov: false, exhaustPop: 0.65, starterPitch: 195, crankCount: 3, crankMs: 78,
    shiftStyle: 'dct', brakePitch: 1320, roadGain: 0.24, volume: 0.42
  },
  sc_valkyrie: {
    type: 'v8_tt', baseFreq: 41, maxFreq: 184, wave: 'sawtooth', harmWave: 'square', harmRatio: 2.0, harmGain: 0.26,
    subGain: 0.44, lpfBase: 300, lpfOpen: 2700, drive: 34, pulseHz: 0, pulseDepth: 0,
    turbo: 0.22, bov: true, exhaustPop: 0.85, starterPitch: 165, crankCount: 3, crankMs: 88,
    shiftStyle: 'dct', brakePitch: 1240, roadGain: 0.24, volume: 0.42
  },
  sc_solaris: {
    type: 'v8_fp', baseFreq: 46, maxFreq: 204, wave: 'sawtooth', harmWave: 'sawtooth', harmRatio: 1.99, harmGain: 0.34,
    subGain: 0.35, lpfBase: 340, lpfOpen: 2950, drive: 30, pulseHz: 0, pulseDepth: 0,
    turbo: 0.02, bov: false, exhaustPop: 0.78, starterPitch: 185, crankCount: 3, crankMs: 82,
    shiftStyle: 'dct', brakePitch: 1280, roadGain: 0.27, volume: 0.41
  },
  sc_phantom: {
    type: 'w16', baseFreq: 35, maxFreq: 162, wave: 'sawtooth', harmWave: 'triangle', harmRatio: 1.5, harmGain: 0.38,
    subGain: 0.52, lpfBase: 260, lpfOpen: 2350, drive: 24, pulseHz: 0, pulseDepth: 0,
    turbo: 0.26, bov: true, exhaustPop: 0.5, starterPitch: 150, crankCount: 3, crankMs: 92,
    shiftStyle: 'smooth', brakePitch: 1180, roadGain: 0.20, volume: 0.43
  },

  // Sportcars
  sp_drift: {
    type: 'i4_turbo', baseFreq: 39, maxFreq: 166, wave: 'sawtooth', harmWave: 'sawtooth', harmRatio: 2.01, harmGain: 0.30,
    subGain: 0.32, lpfBase: 310, lpfOpen: 2650, drive: 38, pulseHz: 0, pulseDepth: 0,
    turbo: 0.30, bov: 'flutter', exhaustPop: 0.9, starterPitch: 160, crankCount: 4, crankMs: 95,
    shiftStyle: 'manual', brakePitch: 1380, roadGain: 0.23, volume: 0.40
  },
  sp_viper: {
    type: 'v10', baseFreq: 31, maxFreq: 142, wave: 'sawtooth', harmWave: 'square', harmRatio: 1.5, harmGain: 0.28,
    subGain: 0.55, lpfBase: 240, lpfOpen: 2250, drive: 42, pulseHz: 0.5, pulseDepth: 0.12,
    turbo: 0.0, bov: false, exhaustPop: 0.8, starterPitch: 132, crankCount: 4, crankMs: 105,
    shiftStyle: 'manual', brakePitch: 1160, roadGain: 0.23, volume: 0.44
  },
  sp_monza: {
    type: 'i6', baseFreq: 42, maxFreq: 174, wave: 'sawtooth', harmWave: 'triangle', harmRatio: 1.5, harmGain: 0.36,
    subGain: 0.38, lpfBase: 300, lpfOpen: 2500, drive: 22, pulseHz: 0, pulseDepth: 0,
    turbo: 0.06, bov: false, exhaustPop: 0.55, starterPitch: 170, crankCount: 3, crankMs: 88,
    shiftStyle: 'dct', brakePitch: 1220, roadGain: 0.22, volume: 0.39
  },
  sp_rally: {
    type: 'boxer4', baseFreq: 34, maxFreq: 156, wave: 'sawtooth', harmWave: 'square', harmRatio: 1.33, harmGain: 0.32,
    subGain: 0.46, lpfBase: 260, lpfOpen: 2400, drive: 40, pulseHz: 11, pulseDepth: 0.24,
    turbo: 0.28, bov: 'flutter', exhaustPop: 0.95, starterPitch: 155, crankCount: 4, crankMs: 96,
    shiftStyle: 'rally', brakePitch: 1140, roadGain: 0.26, volume: 0.42
  },

  // Motorcycles
  mc_superbike: {
    type: 'i4_bike', baseFreq: 72, maxFreq: 305, wave: 'sawtooth', harmWave: 'sawtooth', harmRatio: 2.0, harmGain: 0.36,
    subGain: 0.18, lpfBase: 520, lpfOpen: 4100, drive: 28, pulseHz: 0, pulseDepth: 0,
    turbo: 0.0, bov: false, exhaustPop: 0.72, starterPitch: 245, crankCount: 3, crankMs: 70,
    shiftStyle: 'quick', brakePitch: 1520, roadGain: 0.28, volume: 0.38
  },
  mc_cruiser: {
    type: 'vtwin', baseFreq: 24, maxFreq: 96, wave: 'sawtooth', harmWave: 'square', harmRatio: 1.5, harmGain: 0.24,
    subGain: 0.60, lpfBase: 190, lpfOpen: 1450, drive: 46, pulseHz: 7.5, pulseDepth: 0.45,
    turbo: 0.0, bov: false, exhaustPop: 0.45, starterPitch: 108, crankCount: 4, crankMs: 120,
    shiftStyle: 'heavy', brakePitch: 980, roadGain: 0.22, volume: 0.45
  },
  mc_dirt: {
    type: 'thumper', baseFreq: 33, maxFreq: 138, wave: 'sawtooth', harmWave: 'triangle', harmRatio: 2.0, harmGain: 0.28,
    subGain: 0.34, lpfBase: 280, lpfOpen: 2200, drive: 44, pulseHz: 13, pulseDepth: 0.36,
    turbo: 0.0, bov: false, exhaustPop: 0.65, starterPitch: 190, crankCount: 3, crankMs: 80,
    shiftStyle: 'quick', brakePitch: 1100, roadGain: 0.25, volume: 0.39
  },

  // Offroad
  or_raptor: {
    type: 'v8_sc', baseFreq: 27, maxFreq: 114, wave: 'sawtooth', harmWave: 'square', harmRatio: 1.5, harmGain: 0.25,
    subGain: 0.58, lpfBase: 220, lpfOpen: 1750, drive: 38, pulseHz: 0.4, pulseDepth: 0.14,
    turbo: 0.16, bov: false, exhaustPop: 0.4, starterPitch: 118, crankCount: 4, crankMs: 112,
    shiftStyle: 'truck', brakePitch: 880, roadGain: 0.26, volume: 0.44
  },
  or_jeep: {
    type: 'v6_4x4', baseFreq: 29, maxFreq: 120, wave: 'sawtooth', harmWave: 'triangle', harmRatio: 1.5, harmGain: 0.30,
    subGain: 0.50, lpfBase: 230, lpfOpen: 1700, drive: 32, pulseHz: 0.3, pulseDepth: 0.10,
    turbo: 0.0, bov: false, exhaustPop: 0.3, starterPitch: 126, crankCount: 4, crankMs: 108,
    shiftStyle: 'truck', brakePitch: 920, roadGain: 0.27, volume: 0.42
  },
  or_buggy: {
    type: 'buggy_turbo', baseFreq: 43, maxFreq: 162, wave: 'sawtooth', harmWave: 'square', harmRatio: 2.0, harmGain: 0.28,
    subGain: 0.30, lpfBase: 320, lpfOpen: 2550, drive: 36, pulseHz: 10, pulseDepth: 0.20,
    turbo: 0.20, bov: true, exhaustPop: 0.7, starterPitch: 175, crankCount: 3, crankMs: 85,
    shiftStyle: 'manual', brakePitch: 1180, roadGain: 0.28, volume: 0.40
  },

  // EV
  ev_cyber: {
    type: 'ev_heavy', isEV: true, baseFreq: 86, maxFreq: 410, wave: 'sine', harmWave: 'triangle', harmRatio: 2.0, harmGain: 0.38,
    subGain: 0.22, lpfBase: 550, lpfOpen: 2400, drive: 4, pulseHz: 0, pulseDepth: 0,
    turbo: 0.22, bov: false, exhaustPop: 0, starterPitch: 290, crankCount: 1, crankMs: 90,
    shiftStyle: 'ev', brakePitch: 960, roadGain: 0.24, volume: 0.38
  },
  ev_taycan: {
    type: 'ev_sport', isEV: true, baseFreq: 118, maxFreq: 560, wave: 'sine', harmWave: 'triangle', harmRatio: 1.5, harmGain: 0.42,
    subGain: 0.16, lpfBase: 680, lpfOpen: 3200, drive: 3, pulseHz: 0, pulseDepth: 0,
    turbo: 0.28, bov: false, exhaustPop: 0, starterPitch: 360, crankCount: 1, crankMs: 90,
    shiftStyle: 'ev2speed', brakePitch: 1120, roadGain: 0.22, volume: 0.36
  }
};

class VehicleSoundEngine {
  constructor(scene, ctx = {}) {
    this.scene = scene;
    this.ctxOptions = ctx;
    this.ac = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.rigs = new Map();
    this.trackers = new Map();
    this.maxActiveRigs = 4;
    this.maxHearDist = 95;
    this.disposed = false;
    this.cachedVolume = 1;
    this.lastVolCheck = 0;
    this._camPos = new THREE.Vector3();
    this._camQuat = new THREE.Quaternion();
    this._camRight = new THREE.Vector3();
    this._toVeh = new THREE.Vector3();

    this._unlockHandler = () => this.unlock();
    for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
      window.addEventListener(ev, this._unlockHandler, { passive: true });
    }
  }

  readVolume() {
    const now = performance.now();
    if (now - this.lastVolCheck > 400) {
      this.lastVolCheck = now;
      if (typeof this.ctxOptions.getVfxVolume === 'function') {
        this.cachedVolume = Math.max(0, Math.min(1, Number(this.ctxOptions.getVfxVolume()) || 0));
      } else {
        try {
          const raw = JSON.parse(localStorage.getItem('ps3d_cfg') || 'null');
          this.cachedVolume = raw && raw.volumeVfx !== undefined ? Math.max(0, Math.min(1, Number(raw.volumeVfx) / 100)) : 1;
        } catch (_e) {
          this.cachedVolume = 1;
        }
      }
      if (this.masterGain && this.ac) {
        this.masterGain.gain.setTargetAtTime(0.82 * this.cachedVolume, this.ac.currentTime, 0.04);
      }
    }
    return this.cachedVolume;
  }

  ensureContext() {
    if (this.disposed) return null;
    if (!this.ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ac = new AC();
      this.masterGain = this.ac.createGain();
      this.masterGain.gain.value = 0.82 * this.readVolume();
      const comp = this.ac.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.knee.value = 14;
      comp.ratio.value = 5;
      comp.attack.value = 0.004;
      comp.release.value = 0.18;
      this.masterGain.connect(comp);
      comp.connect(this.ac.destination);

      // Shared seamless 2-second noise buffer
      const sr = this.ac.sampleRate;
      const len = sr * 2;
      this.noiseBuffer = this.ac.createBuffer(1, len, sr);
      const data = this.noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + w * 0.029;
        b1 = 0.985 * b1 + w * 0.032;
        b2 = 0.950 * b2 + w * 0.048;
        data[i] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + w * 0.25) * 0.7));
      }
    }
    return this.ac;
  }

  unlock() {
    const ac = this.ensureContext();
    if (ac && ac.state === 'suspended') {
      ac.resume().catch(() => {});
    }
    this.readVolume();
  }

  getProfile(vehicle) {
    return VEHICLE_SOUND_PROFILES[vehicle.spec.id] || VEHICLE_SOUND_PROFILES.sp_monza;
  }

  makeDistortionCurve(amount = 20) {
    const n = 256;
    const curve = new Float32Array(n);
    const k = Math.max(1, amount);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * (Math.PI / 180)) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  getListener(vehicles, localActorId) {
    let cam = null;
    for (const child of this.scene.children) {
      if (child.isCamera) { cam = child; break; }
    }
    if (cam) {
      cam.getWorldPosition(this._camPos);
      cam.getWorldQuaternion(this._camQuat);
      this._camRight.set(1, 0, 0).applyQuaternion(this._camQuat);
      return { pos: this._camPos, right: this._camRight };
    }
    if (localActorId !== null) {
      for (const v of vehicles) {
        if (v.seats.some((s) => s.occupantId === localActorId)) {
          this._camPos.copy(v.pos);
          this._camRight.copy(v.rightVec);
          return { pos: this._camPos, right: this._camRight };
        }
      }
    }
    return null;
  }

  spatialParams(pos, listener, isLocalVehicle = false) {
    if (isLocalVehicle || !listener) return { gain: 1.0, pan: 0, lpMul: 1.0 };
    const dist = listener.pos.distanceTo(pos);
    if (dist > this.maxHearDist) return null;
    const gain = Math.min(1, 1 / (1 + Math.pow(dist / 13, 1.42)));
    this._toVeh.copy(pos).sub(listener.pos);
    const len = this._toVeh.length();
    const pan = len > 0.1 ? Math.max(-0.92, Math.min(0.92, listener.right.dot(this._toVeh.divideScalar(len)))) : 0;
    const lpMul = Math.max(0.32, 1 - dist / 130);
    return { gain, pan, lpMul };
  }

  createRig(vehicle) {
    const ac = this.ensureContext();
    if (!ac || ac.state !== 'running') return null;
    const prof = this.getProfile(vehicle);

    const panner = ac.createStereoPanner();
    const rigGain = ac.createGain();
    rigGain.gain.value = 0.0001;
    panner.connect(rigGain);
    rigGain.connect(this.masterGain);

    // 1. Engine oscillators -> Distortion -> Dynamic LPF -> Engine Gain
    const engineGain = ac.createGain();
    engineGain.gain.value = 0.0001;
    const engineLPF = ac.createBiquadFilter();
    engineLPF.type = 'lowpass';
    engineLPF.frequency.value = prof.lpfBase;
    engineLPF.Q.value = prof.isEV ? 1.8 : 2.6;

    const shaper = ac.createWaveShaper();
    shaper.curve = this.makeDistortionCurve(prof.drive);
    shaper.oversample = '2x';

    const osc1 = ac.createOscillator();
    osc1.type = prof.wave;
    osc1.frequency.value = prof.baseFreq;

    const osc2 = ac.createOscillator();
    osc2.type = prof.harmWave;
    osc2.frequency.value = prof.baseFreq * prof.harmRatio;
    const osc2Gain = ac.createGain();
    osc2Gain.gain.value = prof.harmGain;

    const subOsc = ac.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = prof.baseFreq * 0.5;
    const subGain = ac.createGain();
    subGain.gain.value = prof.subGain;

    osc1.connect(shaper);
    osc2.connect(osc2Gain);
    osc2Gain.connect(shaper);
    subOsc.connect(subGain);
    subGain.connect(engineLPF);

    // Optional LFO chop for V-Twin / Boxer / Single-Cylinder Thumper
    let lfo = null, lfoGain = null;
    if (prof.pulseHz > 0 && prof.pulseDepth > 0) {
      lfo = ac.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = prof.pulseHz;
      lfoGain = ac.createGain();
      lfoGain.gain.value = prof.pulseDepth;
      lfo.connect(lfoGain);
      lfoGain.connect(engineGain.gain);
      lfo.start();
    }

    shaper.connect(engineLPF);
    engineLPF.connect(engineGain);
    engineGain.connect(panner);

    // 2. Turbo / Supercharger / EV Inverter Whine
    const turboOsc = ac.createOscillator();
    turboOsc.type = prof.isEV ? 'triangle' : 'sine';
    turboOsc.frequency.value = prof.isEV ? prof.baseFreq * 4 : 1800;
    const turboGain = ac.createGain();
    turboGain.gain.value = 0.0001;
    turboOsc.connect(turboGain);
    turboGain.connect(panner);

    // 3. Driving Road / Surface / Wind Noise
    const roadSrc = ac.createBufferSource();
    roadSrc.buffer = this.noiseBuffer;
    roadSrc.loop = true;
    const roadFilter = ac.createBiquadFilter();
    roadFilter.type = 'bandpass';
    roadFilter.frequency.value = 260;
    roadFilter.Q.value = 0.7;
    const roadGain = ac.createGain();
    roadGain.gain.value = 0.0001;
    roadSrc.connect(roadFilter);
    roadFilter.connect(roadGain);
    roadGain.connect(panner);

    // 4. Tire Screech / Drift + Brake Pad Hiss
    const screechSrc = ac.createBufferSource();
    screechSrc.buffer = this.noiseBuffer;
    screechSrc.loop = true;
    const screechFilter = ac.createBiquadFilter();
    screechFilter.type = 'bandpass';
    screechFilter.frequency.value = prof.brakePitch || 1200;
    screechFilter.Q.value = 8.0;
    const screechGain = ac.createGain();
    screechGain.gain.value = 0.0001;
    screechSrc.connect(screechFilter);
    screechFilter.connect(screechGain);
    screechGain.connect(panner);

    const brakeSrc = ac.createBufferSource();
    brakeSrc.buffer = this.noiseBuffer;
    brakeSrc.loop = true;
    const brakeFilter = ac.createBiquadFilter();
    brakeFilter.type = 'highpass';
    brakeFilter.frequency.value = 1600;
    const brakeGain = ac.createGain();
    brakeGain.gain.value = 0.0001;
    brakeSrc.connect(brakeFilter);
    brakeFilter.connect(brakeGain);
    brakeGain.connect(panner);

    osc1.start();
    osc2.start();
    subOsc.start();
    turboOsc.start();
    roadSrc.start();
    screechSrc.start();
    brakeSrc.start();

    const rig = {
      prof, panner, rigGain,
      osc1, osc2, osc2Gain, subOsc, subGain, engineLPF, engineGain,
      lfo, lfoGain,
      turboOsc, turboGain,
      roadSrc, roadFilter, roadGain,
      screechSrc, screechFilter, screechGain,
      brakeSrc, brakeFilter, brakeGain,
      nodes: [osc1, osc2, subOsc, turboOsc, roadSrc, screechSrc, brakeSrc].concat(lfo ? [lfo] : []),
      disconnectList: [panner, rigGain, engineGain, engineLPF, shaper, osc2Gain, subGain, turboGain, roadFilter, roadGain, screechFilter, screechGain, brakeFilter, brakeGain]
    };
    this.rigs.set(vehicle.id, rig);
    return rig;
  }

  destroyRig(vehicleId) {
    const rig = this.rigs.get(vehicleId);
    if (!rig) return;
    this.rigs.delete(vehicleId);
    for (const src of rig.nodes) {
      try { src.stop(); } catch (_e) {}
      try { src.disconnect(); } catch (_e) {}
    }
    for (const node of rig.disconnectList) {
      try { node.disconnect(); } catch (_e) {}
    }
  }

  // ---- One-Shot: Startup / Ignition (Distinct per Vehicle + EV Chime) ----
  playStartup(vehicle, spatial) {
    const ac = this.ensureContext();
    if (!ac || !spatial) return;
    if (ac.state === 'suspended') {
      ac.resume().then(() => {
        if (!this.disposed && vehicle.driverId !== null && !vehicle.destroyed) {
          this.playStartup(vehicle, spatial);
        }
      }).catch(() => {});
      return;
    }
    if (ac.state !== 'running') return;
    const prof = this.getProfile(vehicle);
    const t = ac.currentTime;
    const out = ac.createGain();
    out.gain.value = spatial.gain * prof.volume;
    const pan = ac.createStereoPanner();
    pan.pan.value = spatial.pan;
    out.connect(pan);
    pan.connect(this.masterGain);

    // Door close thud for enclosed cars
    if (!vehicle.spec.isMoto && !vehicle.spec.openTop) {
      this.playOneShotNoise(0.09, 190, 'lowpass', 0.45 * spatial.gain, spatial.pan, 0.02);
    }

    if (prof.isEV) {
      // Futuristic EV power-on chime + relay click
      const notes = vehicle.spec.id === 'ev_cyber' ? [330, 495, 660] : [440, 587, 880];
      notes.forEach((freq, i) => {
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, t + i * 0.08);
        g.gain.setValueAtTime(0.001, t + i * 0.08);
        g.gain.linearRampToValueAtTime(0.22, t + i * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.34);
        o.connect(g); g.connect(out);
        o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.36);
      });
      setTimeout(() => { try { out.disconnect(); pan.disconnect(); } catch (_e) {} }, 750);
      return;
    }

    // Combustion Starter Crank Pulses -> Ignition Flare
    const step = prof.crankMs / 1000;
    for (let i = 0; i < prof.crankCount; i++) {
      const ct = t + 0.05 + i * step;
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(prof.starterPitch, ct);
      o.frequency.exponentialRampToValueAtTime(prof.starterPitch * 0.72, ct + step * 0.8);
      g.gain.setValueAtTime(0.001, ct);
      g.gain.linearRampToValueAtTime(0.32, ct + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, ct + step * 0.85);
      o.connect(g); g.connect(out);
      o.start(ct); o.stop(ct + step * 0.9);
    }

    // Engine Catch Bark
    const catchT = t + 0.06 + prof.crankCount * step;
    const bark = ac.createOscillator();
    const barkSub = ac.createOscillator();
    const lpf = ac.createBiquadFilter();
    const bg = ac.createGain();
    bark.type = prof.wave;
    barkSub.type = 'sine';
    bark.frequency.setValueAtTime(prof.baseFreq * 2.5, catchT);
    bark.frequency.exponentialRampToValueAtTime(prof.baseFreq * 1.1, catchT + 0.42);
    barkSub.frequency.setValueAtTime(prof.baseFreq * 1.25, catchT);
    barkSub.frequency.exponentialRampToValueAtTime(prof.baseFreq * 0.55, catchT + 0.42);
    lpf.type = 'lowpass';
    lpf.frequency.setValueAtTime(prof.lpfOpen * 0.85, catchT);
    lpf.frequency.exponentialRampToValueAtTime(prof.lpfBase, catchT + 0.45);
    bg.gain.setValueAtTime(0.001, catchT);
    bg.gain.linearRampToValueAtTime(0.7, catchT + 0.04);
    bg.gain.exponentialRampToValueAtTime(0.001, catchT + 0.46);
    bark.connect(lpf); barkSub.connect(lpf); lpf.connect(bg); bg.connect(out);
    bark.start(catchT); barkSub.start(catchT);
    bark.stop(catchT + 0.5); barkSub.stop(catchT + 0.5);

    setTimeout(() => { try { out.disconnect(); pan.disconnect(); } catch (_e) {} }, (catchT - t + 0.6) * 1000);
  }

  // ---- One-Shot: Door Open/Close ----
  playDoor(vehicle, spatial, closing = false) {
    if (!spatial) return;
    if (vehicle.spec.isMoto || vehicle.spec.openTop) {
      this.playOneShotNoise(0.06, 850, 'bandpass', 0.18 * spatial.gain, spatial.pan);
    } else {
      this.playOneShotNoise(0.10, closing ? 180 : 280, 'lowpass', 0.38 * spatial.gain, spatial.pan);
    }
  }

  // ---- One-Shot: Gear Shift (Upshift, Downshift, Reverse, BOV, Exhaust Pop) ----
  playGearShift(vehicle, prevGear, nextGear, spatial) {
    const ac = this.ensureContext();
    if (!ac || ac.state !== 'running' || !spatial) return;
    const prof = this.getProfile(vehicle);
    const g = spatial.gain * prof.volume;
    const t = ac.currentTime;

    // 1. Mechanical Gearbox / Paddle Shifter Clack
    if (nextGear === -1) {
      // Reverse gear clunk + subtle safety beep on EV/Offroad
      this.playOneShotNoise(0.09, 420, 'bandpass', 0.45 * g, spatial.pan);
      if (prof.isEV || vehicle.spec.category === 'offroad') {
        const o = ac.createOscillator(), og = ac.createGain(), p = ac.createStereoPanner();
        p.pan.value = spatial.pan; o.type = 'sine'; o.frequency.value = 980;
        og.gain.setValueAtTime(0.14 * g, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        o.connect(og); og.connect(p); p.connect(this.masterGain);
        o.start(t); o.stop(t + 0.16);
      }
      return;
    }

    // Mechanical shift clack
    const clackFreq = prof.shiftStyle === 'dct' || prof.shiftStyle === 'quick' ? 1200 : 620;
    this.playOneShotNoise(0.055, clackFreq, 'bandpass', 0.35 * g, spatial.pan);

    if (prof.isEV) {
      if (prof.shiftStyle === 'ev2speed' && nextGear > prevGear) {
        const o = ac.createOscillator(), og = ac.createGain(), p = ac.createStereoPanner();
        p.pan.value = spatial.pan; o.type = 'triangle';
        o.frequency.setValueAtTime(340, t); o.frequency.exponentialRampToValueAtTime(240, t + 0.14);
        og.gain.setValueAtTime(0.16 * g, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        o.connect(og); og.connect(p); p.connect(this.masterGain);
        o.start(t); o.stop(t + 0.18);
      }
      return;
    }

    // 2. Exhaust Upshift Pop / Crackle or Downshift Rev-Match Blip
    if (nextGear > prevGear) {
      if (prof.exhaustPop > 0.25 && vehicle.throttle > 0.35) {
        const pops = prof.shiftStyle === 'rally' ? 2 : 1;
        for (let i = 0; i < pops; i++) {
          this.playOneShotNoise(0.08, 320 + i * 110, 'lowpass', 0.55 * prof.exhaustPop * g, spatial.pan, 0.02 + i * 0.055);
        }
      }
      // Turbo Blow-Off Valve (Psshh / Stututu Flutter)
      if (prof.bov) {
        const pulses = prof.bov === 'flutter' ? 3 : 1;
        for (let i = 0; i < pulses; i++) {
          this.playOneShotNoise(0.09, 3400 - i * 420, 'bandpass', (0.34 - i * 0.07) * g, spatial.pan, 0.02 + i * 0.065, 4.5);
        }
      }
    } else if (nextGear < prevGear && nextGear >= 1 && vehicle.kmh > 25) {
      // Downshift Rev-Match Blip
      const o = ac.createOscillator(), lpf = ac.createBiquadFilter(), og = ac.createGain(), p = ac.createStereoPanner();
      p.pan.value = spatial.pan; o.type = prof.wave;
      o.frequency.setValueAtTime(prof.baseFreq * 1.9, t);
      o.frequency.exponentialRampToValueAtTime(prof.baseFreq * 2.8, t + 0.07);
      o.frequency.exponentialRampToValueAtTime(prof.baseFreq * 1.7, t + 0.22);
      lpf.type = 'lowpass'; lpf.frequency.value = prof.lpfOpen * 0.7;
      og.gain.setValueAtTime(0.001, t); og.gain.linearRampToValueAtTime(0.32 * g, t + 0.03);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
      o.connect(lpf); lpf.connect(og); og.connect(p); p.connect(this.masterGain);
      o.start(t); o.stop(t + 0.26);
    }
  }

  // ---- One-Shot: Crash / Impact ----
  playCrash(vehicle, impactSpeed, spatial) {
    const ac = this.ensureContext();
    if (!ac || ac.state !== 'running' || !spatial) return;
    const strength = Math.max(0.18, Math.min(1.0, impactSpeed / 26));
    const g = spatial.gain * strength;
    const t = ac.currentTime;

    // 1. Heavy Chassis Impact Thud
    const sub = ac.createOscillator(), sg = ac.createGain(), pan = ac.createStereoPanner();
    pan.pan.value = spatial.pan;
    sub.type = 'sine';
    sub.frequency.setValueAtTime(115 + strength * 45, t);
    sub.frequency.exponentialRampToValueAtTime(28, t + 0.26);
    sg.gain.setValueAtTime(0.75 * g, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    sub.connect(sg); sg.connect(pan); pan.connect(this.masterGain);
    sub.start(t); sub.stop(t + 0.30);

    // 2. Metallic Crunch + Glass Scatter
    this.playOneShotNoise(0.28 + strength * 0.22, 950, 'bandpass', 0.82 * g, spatial.pan, 0, 0.9);
    if (impactSpeed > 9.5) {
      this.playOneShotNoise(0.22, 3600, 'highpass', 0.48 * g, spatial.pan, 0.03, 1.4);
    }
  }

  // ---- One-Shot: Tire Blowout / Bullet Hit / Explosion ----
  playTireBlowout(pos, listener) {
    const spatial = this.spatialParams(pos, listener, false);
    if (!spatial) return;
    this.playOneShotNoise(0.12, 450, 'lowpass', 0.65 * spatial.gain, spatial.pan, 0);
    this.playOneShotNoise(0.45, 3200, 'bandpass', 0.42 * spatial.gain, spatial.pan, 0.04, 2.2);
  }

  playBulletRicochet(pos, listener) {
    const spatial = this.spatialParams(pos, listener, false);
    if (!spatial) return;
    const ac = this.ensureContext();
    if (!ac || ac.state !== 'running') return;
    const t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    p.pan.value = spatial.pan;
    o.type = 'triangle';
    o.frequency.setValueAtTime(1750 + Math.random() * 650, t);
    o.frequency.exponentialRampToValueAtTime(480, t + 0.09);
    g.gain.setValueAtTime(0.22 * spatial.gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g); g.connect(p); p.connect(this.masterGain);
    o.start(t); o.stop(t + 0.11);
  }

  playExplosion(pos, listener) {
    const spatial = this.spatialParams(pos, listener, false);
    if (!spatial) return;
    const ac = this.ensureContext();
    if (!ac || ac.state !== 'running') return;
    const t = ac.currentTime;
    const o = ac.createOscillator(), g = ac.createGain(), p = ac.createStereoPanner();
    p.pan.value = spatial.pan;
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(22, t + 0.85);
    g.gain.setValueAtTime(0.85 * spatial.gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    o.connect(g); g.connect(p); p.connect(this.masterGain);
    o.start(t); o.stop(t + 0.92);
    this.playOneShotNoise(1.05, 650, 'lowpass', 0.95 * spatial.gain, spatial.pan);
  }

  playOneShotNoise(dur, freq, type, gainVal, panVal = 0, delay = 0, q = 1.0) {
    const ac = this.ensureContext();
    if (!ac || ac.state !== 'running' || !this.noiseBuffer || gainVal < 0.004) return;
    const t = ac.currentTime + delay;
    const src = ac.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t);
    filter.Q.value = q;
    const pan = ac.createStereoPanner();
    pan.pan.value = panVal;
    const g = ac.createGain();
    g.gain.setValueAtTime(Math.max(0.001, gainVal), t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter); filter.connect(pan); pan.connect(g); g.connect(this.masterGain);
    src.onended = () => {
      try { src.disconnect(); filter.disconnect(); pan.disconnect(); g.disconnect(); } catch (_e) {}
    };
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  // ---- Frame Update: Continuous Engine, Revving, Driving, Braking, Events ----
  update(vehicles, localActorId, dt, now) {
    if (this.disposed) return;
    this.readVolume();
    const ac = this.ac;
    const listener = this.getListener(vehicles, localActorId);

    // 1. Track discrete transitions (Startup, Door, Gear Shift, BOV lift, Explosion)
    const activeCandidates = [];
    for (const v of vehicles) {
      let tr = this.trackers.get(v.id);
      if (!tr) {
        tr = {
          hadDriver: v.driverId !== null,
          hadOccupants: v.hasOccupants(),
          lastGear: v.gear,
          lastThrottle: v.throttle,
          lastDestroyed: v.destroyed,
          lastKmh: v.kmh,
          lastHp: v.hp,
          shiftDipUntil: 0,
          flatThumpPhase: 0
        };
        this.trackers.set(v.id, tr);
      }

      const isLocal = localActorId !== null && v.seats.some((s) => s.occupantId === localActorId);
      const spatial = this.spatialParams(v.pos, listener, isLocal);
      const hasDriver = v.driverId !== null && !v.destroyed && v.hasEnergy();
      const hasOcc = v.hasOccupants();

      // Ignition startup when driver enters
      if (hasDriver && !tr.hadDriver) {
        this.playStartup(v, spatial);
      } else if (hasOcc !== tr.hadOccupants && tr.hadDriver === hasDriver) {
        this.playDoor(v, spatial, !hasOcc);
      }

      // Network-client fallback: detect sharp crash if HP drops suddenly or speed plunges
      if (!v.destroyed && tr.lastHp - v.hp > 25 && tr.lastKmh > 25) {
        this.playCrash(v, Math.max(10, (tr.lastKmh - v.kmh) / 3.6 + 10), spatial);
      }
      if (v.destroyed && !tr.lastDestroyed) {
        this.playExplosion(v.pos, listener);
      }

      // Gear shifts (skip transition from Park/Neutral 0 -> 1 right at startup)
      if (hasDriver && v.gear !== tr.lastGear && !(tr.lastGear === 0 && v.gear === 1 && !tr.hadDriver)) {
        this.playGearShift(v, tr.lastGear, v.gear, spatial);
        tr.shiftDipUntil = now + 110;
      }

      // Sudden throttle lift at high RPM -> Turbo BOV / Exhaust crackle
      const prof = this.getProfile(v);
      if (hasDriver && tr.lastThrottle > 0.65 && v.throttle < 0.1 && v.kmh > 45) {
        if (prof.bov) {
          this.playOneShotNoise(0.11, 3200, 'bandpass', 0.28 * (spatial?.gain || 0) * prof.volume, spatial?.pan || 0, 0, 4);
        } else if (prof.exhaustPop > 0.6) {
          this.playOneShotNoise(0.08, 340, 'lowpass', 0.36 * prof.exhaustPop * (spatial?.gain || 0) * prof.volume, spatial?.pan || 0, 0.04);
        }
      }

      tr.hadDriver = hasDriver;
      tr.hadOccupants = hasOcc;
      tr.lastGear = v.gear;
      tr.lastThrottle = v.throttle;
      tr.lastDestroyed = v.destroyed;
      tr.lastKmh = v.kmh;
      tr.lastHp = v.hp;

      const shouldRunAudio = (hasDriver || v.kmh > 1.5) && !v.destroyed && spatial !== null;
      if (shouldRunAudio) {
        const dist = isLocal ? 0 : (listener ? listener.pos.distanceTo(v.pos) : 999);
        activeCandidates.push({ v, spatial, dist, isLocal, tr });
      }
    }

    if (!ac || ac.state !== 'running') return;

    // 2. Keep continuous oscillators only for the closest/active vehicles (CPU friendly)
    activeCandidates.sort((a, b) => a.dist - b.dist);
    const keepIds = new Set(activeCandidates.slice(0, this.maxActiveRigs).map((c) => c.v.id));
    for (const id of Array.from(this.rigs.keys())) {
      if (!keepIds.has(id)) this.destroyRig(id);
    }

    const t = ac.currentTime;
    for (const item of activeCandidates.slice(0, this.maxActiveRigs)) {
      const { v, spatial, isLocal, tr } = item;
      const rig = this.rigs.get(v.id) || this.createRig(v);
      if (!rig) continue;

      const prof = rig.prof;
      const hasDriver = v.driverId !== null && !v.destroyed && v.hasEnergy();
      const maxRpm = prof.isEV ? 12400 : 8200;
      const rpmNorm = Number.isFinite(v.rpm) ? Math.max(0, Math.min(1, (v.rpm - 900) / (maxRpm - 900))) : 0;
      const throttleLoad = Math.abs(v.throttle);
      const speedNorm = Math.min(1, v.kmh / Math.max(60, v.spec.topSpeedKmh));
      const shiftDip = now < tr.shiftDipUntil ? 0.88 : 1.0;

      // Engine Pitch & Harmonics (Revving vs Idle)
      const engineFreq = Math.max(10, Number.isFinite(prof.baseFreq + (prof.maxFreq - prof.baseFreq) * Math.pow(rpmNorm, 0.86))
        ? (prof.baseFreq + (prof.maxFreq - prof.baseFreq) * Math.pow(rpmNorm, 0.86)) * shiftDip : (prof.baseFreq || 40));
      rig.osc1.frequency.setTargetAtTime(engineFreq, t, 0.035);
      rig.osc2.frequency.setTargetAtTime(engineFreq * prof.harmRatio, t, 0.035);
      rig.subOsc.frequency.setTargetAtTime(engineFreq * 0.5, t, 0.035);
      if (rig.lfo) {
        rig.lfo.frequency.setTargetAtTime(prof.pulseHz * (0.75 + rpmNorm * 1.9), t, 0.05);
      }

      // Dynamic LPF & Gain for Acceleration / Revving
      const lpfFreq = (prof.lpfBase + (prof.lpfOpen - prof.lpfBase) * (rpmNorm * 0.65 + throttleLoad * 0.35)) * spatial.lpMul;
      rig.engineLPF.frequency.setTargetAtTime(Math.max(120, lpfFreq), t, 0.045);

      const activeEngineVol = hasDriver
        ? (0.28 + throttleLoad * 0.52 + rpmNorm * 0.24) * (isLocal ? 0.85 : 1.0)
        : 0.0001;
      rig.engineGain.gain.setTargetAtTime(Math.max(0.0001, activeEngineVol), t, 0.06);

      // Turbo / Supercharger / EV Motor Whine
      if (prof.turbo > 0) {
        const boost = prof.isEV
          ? (speedNorm * 0.75 + throttleLoad * 0.25 + (v.regenActive ? 0.2 : 0))
          : Math.max(0, rpmNorm * 0.7 + throttleLoad * 0.4 - 0.15);
        const turboFreq = prof.isEV
          ? (prof.baseFreq * 3.5 + speedNorm * prof.maxFreq * 2.2)
          : (1700 + boost * 3600);
        rig.turboOsc.frequency.setTargetAtTime(turboFreq, t, 0.05);
        rig.turboGain.gain.setTargetAtTime(Math.max(0.0001, prof.turbo * boost * (hasDriver ? 0.45 : 0.12)), t, 0.06);
      }

      // Driving Road / Tire / Surface / Wind + Flat Tire Thump
      let surfFreq = 260, surfQ = 0.65, surfMul = 1.0;
      if (v.surface === 'dirt' || v.surface === 'grass') { surfFreq = 540; surfQ = 0.9; surfMul = 1.35; }
      else if (v.surface === 'sand') { surfFreq = 720; surfQ = 1.1; surfMul = 1.45; }
      else if (v.surface === 'water') { surfFreq = 420; surfQ = 0.5; surfMul = 1.75; }
      else { surfFreq = 180 + speedNorm * 680; }

      let flatCount = 0;
      for (const w of v.model.wheels) if (w.flat) flatCount++;
      let thump = 1.0;
      if (flatCount > 0 && v.kmh > 4) {
        tr.flatThumpPhase += dt * (v.kmh / 3.6) * 2.4;
        thump = 1.0 + Math.max(0, Math.sin(tr.flatThumpPhase)) * 0.85 * Math.min(2, flatCount);
        surfMul *= 1.45;
      }
      const roadVol = v.onGround && v.kmh > 2 ? Math.min(0.65, Math.pow(speedNorm, 0.78) * prof.roadGain * surfMul * thump) : 0.0001;
      rig.roadFilter.frequency.setTargetAtTime(surfFreq * spatial.lpMul, t, 0.07);
      rig.roadFilter.Q.setTargetAtTime(surfQ, t, 0.07);
      rig.roadGain.gain.setTargetAtTime(Math.max(0.0001, roadVol), t, 0.07);

      // Braking & Drift Tire Screech
      const isBraking = hasDriver && (v.brake > 0.1 || v.handbrake || (v.throttle < -0.05 && v.gear >= 1)) && v.kmh > 5;
      const hardSlide = v.isDrifting || (isBraking && (v.brake > 0.45 || v.handbrake) && v.kmh > 18);
      const isAsphalt = v.surface === 'asphalt';

      if (hardSlide && v.onGround) {
        const screechFreq = isAsphalt ? (prof.brakePitch + Math.sin(now * 0.017) * 90) : 480;
        rig.screechFilter.frequency.setTargetAtTime(screechFreq * spatial.lpMul, t, 0.04);
        rig.screechFilter.Q.setTargetAtTime(isAsphalt ? 8.5 : 2.0, t, 0.05);
        const sVol = (v.isDrifting ? 0.34 : 0.24) * Math.min(1, v.kmh / 35);
        rig.screechGain.gain.setTargetAtTime(Math.max(0.0001, sVol), t, 0.04);
      } else {
        rig.screechGain.gain.setTargetAtTime(0.0001, t, 0.06);
      }

      // Service Brake Pad Hiss
      const padVol = isBraking && v.onGround ? Math.min(0.24, 0.06 + speedNorm * 0.22) : 0.0001;
      rig.brakeGain.gain.setTargetAtTime(Math.max(0.0001, padVol), t, 0.05);

      // Spatial Pan & Distance Gain
      rig.panner.pan.setTargetAtTime(spatial.pan, t, 0.04);
      rig.rigGain.gain.setTargetAtTime(spatial.gain * prof.volume, t, 0.05);
    }
  }

  dispose() {
    this.disposed = true;
    for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
      window.removeEventListener(ev, this._unlockHandler);
    }
    for (const id of Array.from(this.rigs.keys())) {
      this.destroyRig(id);
    }
    this.trackers.clear();
    if (this.ac) {
      this.ac.close().catch(() => {});
      this.ac = null;
    }
  }
}

// ============================================================================
// 2. SHARED MATERIALS & HIGH-DETAIL PROCEDURAL VEHICLE BUILDER
// ============================================================================
function createCarMaterials() {
  return {
    rubber: new THREE.MeshStandardMaterial({ color: 0x16181c, roughness: 0.92, metalness: 0.05 }),
    shreddedTire: new THREE.MeshStandardMaterial({ color: 0x2a201b, roughness: 0.98, metalness: 0.1 }),
    alloy: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.25, metalness: 0.88 }),
    darkAlloy: new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.35, metalness: 0.82 }),
    caliper: new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35, metalness: 0.5 }),
    carbon: new THREE.MeshStandardMaterial({ color: 0x14161a, roughness: 0.42, metalness: 0.35 }),
    chrome: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.12, metalness: 0.95 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x0f172a, transparent: true, opacity: 0.58, roughness: 0.08, metalness: 0.3 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x1f242c, roughness: 0.78 }),
    headlightOn: new THREE.MeshBasicMaterial({ color: 0xfef9c3 }),
    headlightOff: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.4 }),
    brakeOff: new THREE.MeshStandardMaterial({ color: 0x6b1414, roughness: 0.35 }),
    brakeOn: new THREE.MeshBasicMaterial({ color: 0xff2222 }),
    reverseOn: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    evLed: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
    flame: new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    steelMat: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.42, metalness: 0.82 }),
    wreck: new THREE.MeshStandardMaterial({ color: 0x26211e, roughness: 0.95, metalness: 0.25 })
  };
}

function makePart(geo, mat, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, cast = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
}

function buildWheelUnit(radius, width, isRight, isSteer, mats, isMoto = false, isEV = false) {
  const mount = new THREE.Group();
  const steerGroup = new THREE.Group();
  const spinGroup = new THREE.Group();
  mount.add(steerGroup);
  steerGroup.add(spinGroup);

  const tireMat = mats.rubber.clone();
  const tire = makePart(new THREE.CylinderGeometry(radius, radius, width, 20), tireMat, 0, 0, 0, 0, 0, Math.PI / 2);
  const rimR = radius * 0.64;
  const rim = makePart(
    new THREE.CylinderGeometry(rimR, rimR, width + 0.02, 16),
    isEV ? mats.darkAlloy : mats.alloy,
    0, 0, 0, 0, 0, Math.PI / 2, false
  );
  spinGroup.add(tire, rim);

  // 5-Spoke Wheel Details
  const spokeCount = isMoto ? 6 : 5;
  const sideX = isRight ? width * 0.51 : -width * 0.51;
  for (let i = 0; i < spokeCount; i++) {
    const a = (i / spokeCount) * Math.PI * 2;
    const spoke = makePart(
      new THREE.BoxGeometry(0.025, rimR * 1.75, 0.045),
      mats.darkAlloy,
      sideX * (isMoto ? 0 : 1), 0, 0, a, 0, 0, false
    );
    spinGroup.add(spoke);
  }

  // Glowing EV Wheel Ring
  if (isEV) {
    const ring = makePart(new THREE.TorusGeometry(rimR * 0.85, 0.014, 6, 20), mats.evLed, sideX, 0, 0, 0, Math.PI / 2, 0, false);
    spinGroup.add(ring);
  }

  // Brake Disc & Caliper (does not spin with wheel, turns with steerGroup)
  const disc = makePart(new THREE.CylinderGeometry(rimR * 0.72, rimR * 0.72, 0.03, 14), mats.chrome, sideX * 0.55, 0, 0, 0, 0, Math.PI / 2, false);
  const caliper = makePart(new THREE.BoxGeometry(0.06, 0.14, 0.10), mats.caliper, sideX * 0.65, 0.08, 0.1, 0, 0, 0, false);
  steerGroup.add(disc, caliper);

  return {
    mount,
    steerGroup,
    spinGroup,
    tireMesh: tire,
    tireMat,
    isSteer,
    isRight,
    radius,
    hp: 100,
    flat: false
  };
}

export function buildVehicleModel(spec, mats = createCarMaterials()) {
  const root = new THREE.Group();
  const pitchGroup = new THREE.Group();
  const chassis = new THREE.Group();
  root.add(pitchGroup);
  pitchGroup.add(chassis);

  const paintMat = new THREE.MeshStandardMaterial({
    color: spec.color,
    roughness: spec.id === 'sc_phantom' ? 0.55 : spec.id === 'ev_cyber' ? 0.25 : 0.22,
    metalness: spec.id === 'ev_cyber' ? 0.88 : 0.58
  });
  const accentMat = new THREE.MeshStandardMaterial({ color: spec.accent, roughness: 0.35, metalness: 0.5 });

  const lights = { head: [], tail: [], reverse: [], ev: [], spot: null };
  const flames = [];
  let wingMesh = null;
  let steeringWheel = null;
  let doorLeft = null;
  let doorRight = null;
  const wheels = [];

  const [W, H, L] = spec.size;
  const r = spec.wheelRadius;

  if (spec.isMoto) {
    // ================= MOTORCYCLE DETAILED MODEL =================
    const fw = buildWheelUnit(r, spec.wheelWidth, true, true, mats, true, false);
    const rw = buildWheelUnit(r, spec.wheelWidth * 1.15, true, false, mats, true, false);
    fw.mount.position.set(0, r, -spec.wheelBase * 0.5);
    rw.mount.position.set(0, r, spec.wheelBase * 0.5);
    pitchGroup.add(fw.mount, rw.mount);
    wheels.push(fw, rw);

    // Frame, Engine Block & Swingarm
    chassis.add(makePart(new THREE.BoxGeometry(0.28, 0.36, 0.72), mats.darkAlloy, 0, r + 0.16, 0.04));
    chassis.add(makePart(new THREE.BoxGeometry(0.36, 0.28, 0.42), mats.chrome, 0, r + 0.10, -0.05));
    chassis.add(makePart(new THREE.BoxGeometry(0.16, 0.12, 0.58), mats.darkAlloy, 0, r + 0.02, 0.46));

    // Fuel Tank & Seat
    chassis.add(makePart(new THREE.BoxGeometry(0.34, 0.24, 0.56), paintMat, 0, r + 0.46, -0.22, 0.12));
    chassis.add(makePart(new THREE.BoxGeometry(0.28, 0.14, 0.68), mats.leather, 0, r + 0.44, 0.28, -0.08));

    // Fork + Handlebars (Steerable!)
    const forkGroup = new THREE.Group();
    const rake = spec.id === 'mc_cruiser' ? 0.44 : spec.id === 'mc_dirt' ? 0.28 : 0.24;
    forkGroup.position.set(0, r + 0.48, -spec.wheelBase * 0.42);
    forkGroup.add(makePart(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 10), mats.chrome, -0.11, -0.16, 0, rake));
    forkGroup.add(makePart(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 10), mats.chrome, 0.11, -0.16, 0, rake));
    const barY = spec.id === 'mc_cruiser' ? 0.30 : 0.20;
    forkGroup.add(makePart(new THREE.BoxGeometry(0.72, 0.04, 0.04), mats.darkAlloy, 0, barY, -0.04));
    forkGroup.add(makePart(new THREE.BoxGeometry(0.16, 0.045, 0.05), mats.rubber, -0.34, barY, -0.04));
    forkGroup.add(makePart(new THREE.BoxGeometry(0.16, 0.045, 0.05), mats.rubber, 0.34, barY, -0.04));
    steeringWheel = forkGroup;
    chassis.add(forkGroup);

    // Category-specific Fairings & Exhausts
    if (spec.id === 'mc_superbike') {
      chassis.add(makePart(new THREE.BoxGeometry(0.42, 0.42, 0.74), paintMat, 0, r + 0.40, -0.58, 0.22));
      chassis.add(makePart(new THREE.BoxGeometry(0.34, 0.26, 0.36), mats.glass, 0, r + 0.66, -0.60, 0.55));
      chassis.add(makePart(new THREE.BoxGeometry(0.24, 0.14, 0.44), paintMat, 0, r + 0.58, 0.64, -0.22));
    } else if (spec.id === 'mc_dirt') {
      chassis.add(makePart(new THREE.BoxGeometry(0.18, 0.06, 0.52), paintMat, 0, r + 0.46, -0.78, -0.12));
      chassis.add(makePart(new THREE.BoxGeometry(0.20, 0.06, 0.52), paintMat, 0, r + 0.60, 0.68, 0.14));
    } else {
      // Cruiser saddlebags & long fender
      chassis.add(makePart(new THREE.BoxGeometry(0.18, 0.26, 0.44), mats.leather, -0.24, r + 0.24, 0.56));
      chassis.add(makePart(new THREE.BoxGeometry(0.18, 0.26, 0.44), mats.leather, 0.24, r + 0.24, 0.56));
    }

    // Exhaust Pipe & Flame
    const pipe = makePart(new THREE.CylinderGeometry(0.05, 0.045, 0.75, 10), mats.chrome, 0.22, r + 0.06, 0.42, Math.PI / 2 - 0.15);
    const fl = makePart(new THREE.ConeGeometry(0.06, 0.32, 8), mats.flame, 0.22, r + 0.12, 0.92, Math.PI / 2, 0, 0, false);
    fl.visible = false;
    chassis.add(pipe, fl);
    flames.push(fl);

    // Lights
    const hl = makePart(new THREE.BoxGeometry(0.22, 0.11, 0.06), mats.headlightOff, 0, r + 0.48, -0.84, 0, 0, 0, false);
    const tl = makePart(new THREE.BoxGeometry(0.18, 0.07, 0.05), mats.brakeOff, 0, r + 0.54, 0.88, 0, 0, 0, false);
    chassis.add(hl, tl);
    lights.head.push(hl);
    lights.tail.push(tl);
  } else {
    // ================= 4-WHEEL AUTOMOBILE MODELS =================
    const hx = spec.trackWidth * 0.5;
    const hz = spec.wheelBase * 0.5;
    const wheelCoords = [
      [-hx, r, -hz, false, true],  // FL
      [hx, r, -hz, true, true],    // FR
      [-hx, r, hz, false, false],  // RL
      [hx, r, hz, true, false]     // RR
    ];
    for (const [wx, wy, wz, isR, isS] of wheelCoords) {
      const w = buildWheelUnit(r, spec.wheelWidth, isR, isS, mats, false, spec.energyType === 'ev');
      w.mount.position.set(wx, wy, wz);
      pitchGroup.add(w.mount);
      wheels.push(w);
    }

    const baseClear = spec.category === 'offroad' ? r + 0.10 : r * 0.78;
    const bodyY = baseClear + 0.24;

    if (spec.id === 'or_buggy') {
      // ---- Sandrail Tubular Buggy ----
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.68, 0.22, L * 0.88), mats.carbon, 0, bodyY, 0));
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.52, 0.18, 1.15), paintMat, 0, bodyY + 0.22, -1.25, 0.14));
      // Exposed Rear Engine + Turbo
      chassis.add(makePart(new THREE.BoxGeometry(0.82, 0.48, 0.78), mats.chrome, 0, bodyY + 0.34, 1.38));
      // Tubular Roll Cage
      for (const sx of [-0.62, 0.62]) {
        chassis.add(makePart(new THREE.CylinderGeometry(0.04, 0.04, 1.15, 8), paintMat, sx, bodyY + 0.55, -0.45, -0.45));
        chassis.add(makePart(new THREE.CylinderGeometry(0.04, 0.04, 1.25, 8), paintMat, sx, bodyY + 0.62, 0.92, 0.42));
        chassis.add(makePart(new THREE.BoxGeometry(0.08, 0.08, 1.35), paintMat, sx, bodyY + 1.02, 0.22));
      }
      chassis.add(makePart(new THREE.BoxGeometry(1.32, 0.08, 0.08), paintMat, 0, bodyY + 1.02, -0.2));
      chassis.add(makePart(new THREE.BoxGeometry(1.32, 0.08, 0.08), paintMat, 0, bodyY + 1.02, 0.7));
    } else if (spec.id === 'ev_cyber') {
      // ---- Angular Stainless-Steel Cybertruck ----
      chassis.add(makePart(new THREE.BoxGeometry(W, 0.62, L), paintMat, 0, bodyY + 0.16, 0));
      // Angular Wedged Roof & Vault Bed
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.94, 0.52, 2.55), paintMat, 0, bodyY + 0.66, -0.65, 0.22));
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.94, 0.46, 2.35), mats.glass, 0, bodyY + 0.68, -0.25, -0.14));
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.94, 0.28, 1.95), mats.carbon, 0, bodyY + 0.52, 1.55, -0.18));
      // Full-Width Front & Rear LED Bars
      const ledF = makePart(new THREE.BoxGeometry(W * 0.96, 0.08, 0.06), mats.headlightOff, 0, bodyY + 0.42, -L * 0.5 - 0.02, 0, 0, 0, false);
      const ledR = makePart(new THREE.BoxGeometry(W * 0.96, 0.08, 0.06), mats.brakeOff, 0, bodyY + 0.46, L * 0.5 + 0.02, 0, 0, 0, false);
      chassis.add(ledF, ledR);
      lights.head.push(ledF);
      lights.tail.push(ledR);
    } else if (spec.category === 'offroad') {
      // ---- Pickup Raptor / Wrangler Jeep ----
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.94, 0.54, L * 0.96), paintMat, 0, bodyY + 0.12, 0));
      // Bull Bar & Skid Plate
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.84, 0.34, 0.22), mats.carbon, 0, bodyY + 0.08, -L * 0.49));
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.64, 0.28, 0.14), mats.darkAlloy, 0, bodyY + 0.36, -L * 0.51));
      if (spec.id === 'or_raptor') {
        // Crew Cab + Pickup Bed + Roof Lightbar + Spare Tire
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.88, 0.68, 2.35), paintMat, 0, bodyY + 0.72, -0.25));
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.86, 0.46, 1.95), mats.glass, 0, bodyY + 0.72, -0.25));
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.86, 0.10, 1.75), mats.carbon, 0, bodyY + 0.42, 1.72));
        chassis.add(makePart(new THREE.CylinderGeometry(0.42, 0.42, 0.30, 14), mats.rubber, 0, bodyY + 0.58, 1.75, 0, 0, Math.PI / 2));
        const roofBar = makePart(new THREE.BoxGeometry(1.45, 0.12, 0.14), mats.headlightOff, 0, bodyY + 1.12, -0.78, 0, 0, 0, false);
        chassis.add(roofBar);
        lights.head.push(roofBar);
      } else {
        // Open-Top Jeep Roll Cage + External Rear Spare Wheel
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.84, 0.48, 0.12), mats.glass, 0, bodyY + 0.64, -0.82, 0.24));
        chassis.add(makePart(new THREE.BoxGeometry(0.12, 0.66, 2.2), accentMat, -W * 0.40, bodyY + 0.68, 0.45));
        chassis.add(makePart(new THREE.BoxGeometry(0.12, 0.66, 2.2), accentMat, W * 0.40, bodyY + 0.68, 0.45));
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.84, 0.10, 2.2), accentMat, 0, bodyY + 0.98, 0.45));
        chassis.add(makePart(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 14), mats.rubber, 0, bodyY + 0.38, L * 0.52, Math.PI / 2));
      }
    } else {
      // ---- Supercars, Sportcars & Sleek EV Sedan ----
      const lowH = spec.category === 'supercar' ? 0.38 : 0.48;
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.96, lowH, L * 0.96), paintMat, 0, bodyY + 0.08, 0));
      // Carbon Front Splitter & Rear Diffuser
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.98, 0.08, 0.55), mats.carbon, 0, bodyY - 0.12, -L * 0.46));
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.92, 0.12, 0.48), mats.carbon, 0, bodyY - 0.10, L * 0.46));
      // Side Skirts
      chassis.add(makePart(new THREE.BoxGeometry(0.10, 0.10, spec.wheelBase - 0.7), mats.carbon, -W * 0.47, bodyY - 0.10, 0));
      chassis.add(makePart(new THREE.BoxGeometry(0.10, 0.10, spec.wheelBase - 0.7), mats.carbon, W * 0.47, bodyY - 0.10, 0));
      // Hood Slope / Nose
      chassis.add(makePart(new THREE.BoxGeometry(W * 0.88, 0.18, 1.35), paintMat, 0, bodyY + lowH * 0.48, -L * 0.28, 0.11));

      // Cabin / Canopy
      if (spec.openTop) {
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.78, 0.34, 0.12), mats.glass, 0, bodyY + lowH * 0.6 + 0.12, -0.58, 0.55));
        // Roll Hoops Behind Seats
        chassis.add(makePart(new THREE.CylinderGeometry(0.12, 0.14, 0.28, 10), accentMat, -0.42, bodyY + lowH * 0.6 + 0.12, 0.62));
        chassis.add(makePart(new THREE.CylinderGeometry(0.12, 0.14, 0.28, 10), accentMat, 0.42, bodyY + lowH * 0.6 + 0.12, 0.62));
      } else {
        const cabH = spec.category === 'supercar' ? 0.38 : 0.46;
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.78, cabH, 2.05), mats.glass, 0, bodyY + lowH * 0.5 + cabH * 0.46, 0.15));
        chassis.add(makePart(new THREE.BoxGeometry(W * 0.74, 0.08, 1.55), spec.id === 'sc_phantom' ? mats.carbon : paintMat, 0, bodyY + lowH * 0.5 + cabH, 0.22));
      }

      // Racing Stripes / Hood Scoop / Rally Lights
      if (spec.id === 'sp_viper') {
        chassis.add(makePart(new THREE.BoxGeometry(0.18, 0.03, L * 0.94), accentMat, -0.22, bodyY + lowH * 0.6 + 0.02, 0, 0, 0, 0, false));
        chassis.add(makePart(new THREE.BoxGeometry(0.18, 0.03, L * 0.94), accentMat, 0.22, bodyY + lowH * 0.6 + 0.02, 0, 0, 0, 0, false));
      }
      if (spec.id === 'sp_rally') {
        chassis.add(makePart(new THREE.BoxGeometry(0.55, 0.12, 0.45), accentMat, 0, bodyY + lowH * 0.64, -1.2));
        for (const fx of [-0.36, -0.12, 0.12, 0.36]) {
          const fl = makePart(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 10), mats.headlightOff, fx, bodyY + 0.12, -L * 0.49, Math.PI / 2, 0, 0, false);
          chassis.add(fl);
          lights.head.push(fl);
        }
      }
      if (spec.id === 'sp_drift') {
        // Exposed Front Intercooler
        chassis.add(makePart(new THREE.BoxGeometry(0.88, 0.22, 0.10), mats.alloy, 0, bodyY - 0.02, -L * 0.48));
      }
      if (spec.id === 'ev_taycan') {
        const evAccent = makePart(new THREE.BoxGeometry(W * 0.92, 0.04, 0.06), mats.evLed, 0, bodyY + 0.22, L * 0.49, 0, 0, 0, false);
        chassis.add(evAccent);
        lights.ev.push(evAccent);
      }

      // Active Rear Spoiler / Wing
      if (spec.activeWing || spec.id === 'sp_rally' || spec.id === 'sp_drift') {
        const wingGroup = new THREE.Group();
        wingGroup.position.set(0, bodyY + lowH * 0.56, L * 0.43);
        const pylonH = spec.id === 'sc_valkyrie' || spec.id === 'sp_rally' ? 0.38 : 0.18;
        wingGroup.add(makePart(new THREE.BoxGeometry(0.06, pylonH, 0.16), mats.carbon, -0.52, pylonH * 0.5, 0));
        wingGroup.add(makePart(new THREE.BoxGeometry(0.06, pylonH, 0.16), mats.carbon, 0.52, pylonH * 0.5, 0));
        wingGroup.add(makePart(new THREE.BoxGeometry(W * 0.92, 0.06, 0.32), spec.id === 'sc_apex' ? mats.carbon : accentMat, 0, pylonH, 0.04));
        chassis.add(wingGroup);
        if (spec.activeWing) wingMesh = wingGroup;
      }
    }

    // Animated Doors (Left & Right) + Cockpit Seats & Steering Wheel
    if (!spec.openTop && spec.id !== 'or_buggy') {
      doorLeft = new THREE.Group();
      doorLeft.position.set(-W * 0.48, bodyY + 0.12, -0.45);
      doorLeft.add(makePart(new THREE.BoxGeometry(0.08, 0.36, 1.05), paintMat, 0, 0, 0.52));
      doorRight = new THREE.Group();
      doorRight.position.set(W * 0.48, bodyY + 0.12, -0.45);
      doorRight.add(makePart(new THREE.BoxGeometry(0.08, 0.36, 1.05), paintMat, 0, 0, 0.52));
      chassis.add(doorLeft, doorRight);
    }

    const seatY = spec.seats[0][1] - 0.12;
    const seatZ = spec.seats[0][2];
    chassis.add(makePart(new THREE.BoxGeometry(0.42, 0.52, 0.14), mats.leather, -0.42, seatY + 0.25, seatZ + 0.18, -0.15));
    chassis.add(makePart(new THREE.BoxGeometry(0.42, 0.52, 0.14), mats.leather, 0.42, seatY + 0.25, seatZ + 0.18, -0.15));

    const sw = new THREE.Group();
    sw.position.set(-0.42, seatY + 0.38, seatZ - 0.34);
    sw.rotation.x = -0.35;
    sw.add(makePart(new THREE.TorusGeometry(0.15, 0.022, 8, 16), mats.leather, 0, 0, 0, 0, 0, 0, false));
    sw.add(makePart(new THREE.BoxGeometry(0.26, 0.035, 0.02), mats.darkAlloy, 0, 0, 0, 0, 0, 0, false));
    chassis.add(sw);
    steeringWheel = sw;

    // Headlights, Taillights, Reverse Lights & Dual Exhausts (Non-EV)
    for (const sx of [-W * 0.34, W * 0.34]) {
      const hl = makePart(new THREE.BoxGeometry(0.32, 0.13, 0.06), mats.headlightOff, sx, bodyY + 0.14, -L * 0.49, 0, 0, 0, false);
      const tl = makePart(new THREE.BoxGeometry(0.34, 0.12, 0.06), mats.brakeOff, sx, bodyY + 0.18, L * 0.49, 0, 0, 0, false);
      const rl = makePart(new THREE.BoxGeometry(0.14, 0.08, 0.06), mats.headlightOff, sx * 0.65, bodyY + 0.18, L * 0.49, 0, 0, 0, false);
      chassis.add(hl, tl, rl);
      lights.head.push(hl);
      lights.tail.push(tl);
      lights.reverse.push(rl);
    }

    if (spec.energyType !== 'ev') {
      for (const sx of [-0.46, 0.46]) {
        const tip = makePart(new THREE.CylinderGeometry(0.055, 0.055, 0.18, 10), mats.chrome, sx, bodyY - 0.08, L * 0.48, Math.PI / 2, 0, 0, false);
        const fl = makePart(new THREE.ConeGeometry(0.075, 0.36, 8), mats.flame, sx, bodyY - 0.08, L * 0.62, Math.PI / 2, 0, 0, false);
        fl.visible = false;
        chassis.add(tip, fl);
        flames.push(fl);
      }
    }
  }

  // Headlight Night SpotLight (disabled by default until player toggles L)
  const spot = new THREE.SpotLight(0xfff6d1, 0, 55, Math.PI / 5.5, 0.45, 1.5);
  spot.position.set(0, 0.9, -L * 0.45);
  const spotTarget = new THREE.Object3D();
  spotTarget.position.set(0, 0.2, -L * 0.5 - 18);
  chassis.add(spot, spotTarget);
  spot.target = spotTarget;
  lights.spot = spot;

  return {
    root,
    pitchGroup,
    chassis,
    wheels,
    lights,
    flames,
    wingMesh,
    steeringWheel,
    doorLeft,
    doorRight,
    paintMat
  };
}

// ============================================================================
// 3. VEHICLE INSTANCE (Physics, Tire Friction, Fuel/EV, Damage, Animations)
// ============================================================================
const _vF = new THREE.Vector3();
const _vR = new THREE.Vector3();
const _vP = new THREE.Vector3();

export class VehicleInstance {
  constructor(id, spec, pos, yaw, model, mats) {
    this.id = id;
    this.spec = spec;
    this.mats = mats;
    this.model = model;
    this.root = model.root;
    this.pos = pos.clone();
    this.vel = new THREE.Vector3();
    this.yaw = yaw;
    this.angularVel = 0;

    // Handling & Drivetrain State
    this.steerAngle = 0;
    this.throttle = 0;
    this.brake = 0;
    this.handbrake = false;
    this.gear = 1; // -1 = R, 0 = N, 1..6 = Forward
    this.rpm = 900;
    this.kmh = 0;
    this.leanAngle = 0;
    this.pitchAngle = 0;
    this.rollAngle = 0;
    this.groundPitch = 0;
    this.groundRoll = 0;
    this.suspHeave = 0;
    this.suspVel = 0;
    this.onGround = true;
    this.surface = 'asphalt';
    this.isDrifting = false;
    this.regenActive = false;
    this.headlightsOn = false;
    this.doorOpenAmt = 0;
    this.doorAnimTimer = 0;
    this.backfireTimer = 0;
    this.prevGear = 1;

    // Energy & Durability
    this.isEV = spec.energyType === 'ev';
    this.fuel = this.isEV ? 0 : spec.fuelCap;
    this.maxFuel = spec.fuelCap || 0;
    this.battery = this.isEV ? spec.batteryCap : 0;
    this.maxBattery = spec.batteryCap || 0;
    this.hp = spec.maxHp;
    this.maxHp = spec.maxHp;
    this.destroyed = false;

    // Seats (index 0 = Driver, 1+ = Passengers / Pillion)
    this.seats = spec.seats.map((offset) => ({ offset, occupantId: null }));

    this.root.position.copy(this.pos);
    this.root.rotation.y = this.yaw;
  }

  get forwardVec() {
    return _vF.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
  }

  get rightVec() {
    return _vR.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
  }

  get driverId() {
    return this.seats[0].occupantId;
  }

  hasOccupants() {
    return this.seats.some((s) => s.occupantId !== null);
  }

  getEnergyPercent() {
    return this.isEV
      ? Math.max(0, (this.battery / this.maxBattery) * 100)
      : Math.max(0, (this.fuel / this.maxFuel) * 100);
  }

  hasEnergy() {
    return this.isEV ? this.battery > 0.05 : this.fuel > 0.05;
  }

  refuel(amount) {
    if (this.destroyed || this.isEV) return 0;
    const prev = this.fuel;
    this.fuel = Math.min(this.maxFuel, this.fuel + amount);
    return this.fuel - prev;
  }

  recharge(amount) {
    if (this.destroyed || !this.isEV) return 0;
    const prev = this.battery;
    this.battery = Math.min(this.maxBattery, this.battery + amount);
    return this.battery - prev;
  }

  assignSeat(actorId, preferPassenger = false) {
    if (this.destroyed) return -1;
    const existing = this.seats.findIndex((s) => s.occupantId === actorId);
    if (existing !== -1) return existing;
    const start = preferPassenger && this.seats.length > 1 ? 1 : 0;
    for (let i = start; i < this.seats.length; i++) {
      if (this.seats[i].occupantId === null) {
        this.seats[i].occupantId = actorId;
        this.doorAnimTimer = 0.7;
        return i;
      }
    }
    if (preferPassenger && this.seats[0].occupantId === null) {
      this.seats[0].occupantId = actorId;
      this.doorAnimTimer = 0.7;
      return 0;
    }
    return -1;
  }

  vacateSeat(actorId) {
    const idx = this.seats.findIndex((s) => s.occupantId === actorId);
    if (idx === -1) return false;
    this.seats[idx].occupantId = null;
    this.doorAnimTimer = 0.7;
    if (idx === 0) {
      this.throttle = 0;
      this.brake = 0;
      this.handbrake = true;
    }
    return true;
  }

  getSeatWorldPose(seatIdx) {
    const seat = this.seats[seatIdx] || this.seats[0];
    this.model.chassis.updateWorldMatrix(true, false);
    const worldPos = new THREE.Vector3(...seat.offset).applyMatrix4(this.model.chassis.matrixWorld);
    return { pos: worldPos, yaw: this.yaw, lean: this.leanAngle };
  }

  getExitPosition(seatIdx = 0) {
    const side = seatIdx % 2 === 0 ? -1 : 1;
    const offsetX = side * (this.spec.size[0] * 0.5 + 0.95);
    return this.pos.clone().addScaledVector(this.rightVec, offsetX);
  }

  damageTire(wheelIdx, dmg) {
    const w = this.model.wheels[wheelIdx];
    if (!w || w.flat) return false;
    w.hp = Math.max(0, w.hp - dmg);
    if (w.hp <= 0) {
      w.flat = true;
      w.tireMesh.material = this.mats.shreddedTire;
      w.tireMesh.scale.set(0.86, 1, 0.86);
      return true; // Tire just blew out!
    }
    return false;
  }

  applyDamage(dmg) {
    if (this.destroyed) return false;
    this.hp = Math.max(0, this.hp - dmg);
    if (this.hp <= 0) {
      this.destroyed = true;
      this.throttle = 0;
      this.brake = 1;
      this.model.paintMat.color.setHex(0x231f1e);
      this.model.paintMat.roughness = 0.96;
      this.headlightsOn = false;
      return true; // Vehicle just exploded!
    }
    return false;
  }

  stepPhysics(dt, now, input, env) {
    if (!Number.isFinite(dt) || dt <= 0) dt = 1 / 60;
    if (!this._good) this._good = {
      pos: this.pos.clone(), yaw: this.yaw, angularVel: this.angularVel, steerAngle: this.steerAngle,
      pitchAngle: this.pitchAngle, rollAngle: this.rollAngle, groundPitch: this.groundPitch,
      groundRoll: this.groundRoll, suspHeave: this.suspHeave, suspVel: this.suspVel, leanAngle: this.leanAngle
    };
    const stateIsFinite = () => Number.isFinite(this.pos.x) && Number.isFinite(this.pos.y) && Number.isFinite(this.pos.z)
      && Number.isFinite(this.vel.x) && Number.isFinite(this.vel.y) && Number.isFinite(this.vel.z)
      && Number.isFinite(this.yaw) && Number.isFinite(this.angularVel) && Number.isFinite(this.steerAngle)
      && Number.isFinite(this.pitchAngle) && Number.isFinite(this.rollAngle)
      && Number.isFinite(this.groundPitch) && Number.isFinite(this.groundRoll)
      && Number.isFinite(this.suspHeave) && Number.isFinite(this.suspVel) && Number.isFinite(this.leanAngle);
    const recoverState = () => {
      if (!this._warnedNonFiniteState) {
        console.warn('Recovered non-finite vehicle physics state:', this.id);
        this._warnedNonFiniteState = true;
      }
      this.pos.copy(this._good.pos); this.vel.set(0, 0, 0); this.yaw = this._good.yaw;
      this.angularVel = this._good.angularVel; this.steerAngle = this._good.steerAngle;
      this.pitchAngle = this._good.pitchAngle; this.rollAngle = this._good.rollAngle;
      this.groundPitch = this._good.groundPitch; this.groundRoll = this._good.groundRoll;
      this.suspHeave = this._good.suspHeave; this.suspVel = this._good.suspVel; this.leanAngle = this._good.leanAngle;
      this.rpm = 900; this.kmh = 0;
      this.root.position.copy(this.pos); this.root.rotation.y = this.yaw;
      this.model.pitchGroup.rotation.set(this.groundPitch, 0, this.groundRoll);
      this.model.chassis.position.y = this.suspHeave;
      this.model.chassis.rotation.set(this.pitchAngle, 0, this.rollAngle);
      this.root.updateMatrixWorld(true);
    };
    if (!stateIsFinite()) recoverState();
    if (!Number.isFinite(this.rpm)) this.rpm = 900;
    if (!Number.isFinite(this.angularVel)) this.angularVel = 0;
    if (!Number.isFinite(this.steerAngle)) this.steerAngle = 0;
    this._stepPhysicsInner(dt, now, input, env);
    if (stateIsFinite()) {
      this._good.pos.copy(this.pos); this._good.yaw = this.yaw;
      this._good.angularVel = this.angularVel; this._good.steerAngle = this.steerAngle;
      this._good.pitchAngle = this.pitchAngle; this._good.rollAngle = this.rollAngle;
      this._good.groundPitch = this.groundPitch; this._good.groundRoll = this.groundRoll;
      this._good.suspHeave = this.suspHeave; this._good.suspVel = this.suspVel; this._good.leanAngle = this.leanAngle;
    } else {
      recoverState();
    }
    if (!Number.isFinite(this.rpm)) this.rpm = 900;
    if (!Number.isFinite(this.kmh)) this.kmh = 0;
  }

  _stepPhysicsInner(dt, now, input, env) {
    const spec = this.spec;
    const fw = this.forwardVec;
    const rt = this.rightVec;
    const hasDriver = this.driverId !== null && !this.destroyed;

    this.throttle = hasDriver ? (input.throttle || 0) : 0;
    this.brake = hasDriver ? (input.brake || 0) : (this.destroyed ? 1 : 0.15);
    this.handbrake = hasDriver ? !!input.handbrake : !this.hasOccupants();
    const steerInput = hasDriver ? (input.steer || 0) : 0;

    // 1. Speed Decomposition
    const vFwd = this.vel.x * fw.x + this.vel.z * fw.z;
    const vLat = this.vel.x * rt.x + this.vel.z * rt.z;
    const speedAbs = Math.abs(vFwd);
    this.kmh = speedAbs * 3.6;

    // 2. Tire Health Penalties (Asymmetric Pull + Grip Loss)
    const wheels = this.model.wheels;
    let flatCount = 0;
    let steerPull = 0;
    let frontGripMul = 1;
    let rearGripMul = 1;
    for (let i = 0; i < wheels.length; i++) {
      if (!wheels[i].flat) continue;
      flatCount++;
      const isFront = wheels[i].isSteer;
      steerPull += wheels[i].isRight ? -0.18 : 0.18;
      if (isFront) frontGripMul *= 0.56;
      else rearGripMul *= 0.48;
    }
    const flatSpeedFactor = Math.max(0.45, 1 - flatCount * 0.16);

    // 3. Steering & Speed-Sensitive Angle
    const steerLimit = spec.steerMax * (1 / (1 + speedAbs * 0.022));
    const targetSteer = steerInput * steerLimit + (speedAbs > 3 ? steerPull : 0);
    this.steerAngle += (targetSteer - this.steerAngle) * Math.min(1, dt * spec.steerSpeed * 3.2);

    // 4. Surface Detection & Grip Calculation
    this.surface = env.sampleSurface(this.pos);
    const surf = SURFACE_GRIP[this.surface] || SURFACE_GRIP.asphalt;
    const catGrip = surf[spec.category] ?? 1.0;
    const offroadBonus = this.surface !== 'asphalt' && spec.offroadBias ? spec.offroadBias * 0.35 : 0;
    const downforceAccel = (spec.downforce * speedAbs * speedAbs) / spec.mass;
    const totalGrip = spec.tireGrip * (catGrip + offroadBonus) * ((frontGripMul + rearGripMul) * 0.5);

    // 5. Energy Consumption & Regenerative Braking
    this.regenActive = false;
    const powered = !this.destroyed && this.hasEnergy();
    if (powered && hasDriver) {
      const load = Math.abs(this.throttle) + (Math.abs(this.throttle) > 0.1 ? 0.15 : 0.03);
      if (this.isEV) {
        if (this.throttle !== 0) {
          this.battery = Math.max(0, this.battery - spec.batteryBurn * load * dt);
        }
        if ((this.brake > 0.1 || Math.abs(this.throttle) < 0.05) && speedAbs > 2.5) {
          const regenGain = spec.regenRate * (this.brake > 0.1 ? 1.0 : 0.35) * Math.min(1, speedAbs / 30) * dt;
          this.battery = Math.min(this.maxBattery, this.battery + regenGain);
          this.regenActive = true;
        }
      } else {
        this.fuel = Math.max(0, this.fuel - spec.fuelBurn * load * dt);
      }
    }

    // 6. Drive, Brake & Reverse Logic
    const maxFwdMs = (spec.topSpeedKmh / 3.6) * flatSpeedFactor;
    const maxRevMs = (spec.reverseKmh / 3.6) * flatSpeedFactor;
    let fwdAccel = 0;

    if (powered && hasDriver) {
      if (this.throttle > 0.05) {
        if (vFwd < -1.5) {
          // Braking from reverse
          fwdAccel = (spec.brakeForce / spec.mass) * totalGrip;
        } else if (vFwd < maxFwdMs) {
          const torqueCurve = 1 - 0.35 * Math.pow(vFwd / maxFwdMs, 1.8);
          fwdAccel = (spec.engineForce / spec.mass) * this.throttle * torqueCurve * Math.min(1.35, totalGrip);
        }
      } else if (this.throttle < -0.05) {
        if (vFwd > 1.5) {
          // Service brakes
          fwdAccel = -(spec.brakeForce / spec.mass) * Math.abs(this.throttle) * totalGrip;
        } else if (vFwd > -maxRevMs) {
          fwdAccel = -(spec.engineForce * 0.55 / spec.mass) * Math.abs(this.throttle);
        }
      }
    }

    if (this.brake > 0.05 && speedAbs > 0.2) {
      fwdAccel -= Math.sign(vFwd) * (spec.brakeForce / spec.mass) * this.brake * totalGrip;
    }
    if (this.handbrake && speedAbs > 0.1) {
      fwdAccel -= Math.sign(vFwd) * (spec.brakeForce * 0.72 / spec.mass) * rearGripMul;
    }

    // Rolling Resistance & Aero Drag
    const aeroDrag = (0.36 * speedAbs * speedAbs) / spec.mass;
    const rollDrag = surf.rollingDrag * 9.81 * (1 + flatCount * 0.8);
    if (speedAbs > 0.05) {
      fwdAccel -= Math.sign(vFwd) * (aeroDrag + rollDrag);
    }

    let nextVFwd = vFwd + fwdAccel * dt;
    if (Math.abs(this.throttle) < 0.05 && this.brake > 0 && Math.sign(nextVFwd) !== Math.sign(vFwd) && speedAbs < 1.5) {
      nextVFwd = 0;
    }

    // 7. Lateral Tire Friction (Cornering & Drifting)
    const driftFactor = this.handbrake ? 0.34 : (spec.drivetrain === 'RWD' && Math.abs(this.throttle) > 0.85 && speedAbs > 12 ? 0.72 : 1.0);
    const maxLatAccel = totalGrip * driftFactor * (9.81 + downforceAccel);
    const latGripStiff = 9.5 * driftFactor * rearGripMul;
    const desiredLatAccel = Math.max(-maxLatAccel, Math.min(maxLatAccel, -vLat * latGripStiff));
    const nextVLat = vLat + desiredLatAccel * dt;

    this.isDrifting = this.onGround && speedAbs > 8 && (Math.abs(vLat) > 3.2 || (this.handbrake && Math.abs(this.steerAngle) > 0.12));

    // Yaw Angular Motion (Bicycle Model)
    const wheelGripRatio = this.handbrake ? 1.38 : 1.0;
    const turnDir = vFwd >= -0.2 ? 1 : -1;
    const targetAngVel = (speedAbs > 0.4 ? (speedAbs / spec.wheelBase) * Math.tan(this.steerAngle) * turnDir * wheelGripRatio : 0);
    this.angularVel += (targetAngVel - this.angularVel) * Math.min(1, dt * (this.handbrake ? 5.5 : 8.5));
    if (speedAbs < 0.35 && Math.abs(this.throttle) < 0.05) this.angularVel *= 0.8;
    this.yaw += this.angularVel * dt;

    // Reconstruct World Horizontal Velocity
    const nfw = this.forwardVec;
    const nrt = this.rightVec;
    this.vel.x = nfw.x * nextVFwd + nrt.x * nextVLat;
    this.vel.z = nfw.z * nextVFwd + nrt.z * nextVLat;

    // 8. Vertical Gravity, Terrain Height & Slope Alignment + Collision
    this.vel.y -= 24 * dt;
    const prevPos = this.pos.clone();
    this.pos.addScaledVector(this.vel, dt);
    this.pos.x = Math.max(-env.mapHalf + 2.5, Math.min(env.mapHalf - 2.5, this.pos.x));
    this.pos.z = Math.max(-env.mapHalf + 2.5, Math.min(env.mapHalf - 2.5, this.pos.z));

    const groundC = env.sampleHeight(this.pos.x, this.pos.z, prevPos.y);
    if (this.pos.y <= groundC + 0.04) {
      if (!this.onGround && this.vel.y < -4) {
        this.suspVel += this.vel.y * 0.45;
      }
      this.pos.y = groundC;
      if (this.vel.y < 0) this.vel.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    // Wall & Obstacle Collisions (with Impact Sound & Damage)
    const hitInfo = env.resolveCollisions(this, prevPos);
    if (hitInfo.impactSpeed > 2.2) {
      let exploded = false;
      if (hitInfo.impactSpeed > 9.5) {
        const crashDmg = Math.round((hitInfo.impactSpeed - 8) * 14);
        exploded = this.applyDamage(crashDmg);
        this.suspVel -= Math.min(3.5, hitInfo.impactSpeed * 0.12);
      }
      env.onImpact(this, hitInfo.point, hitInfo.impactSpeed, exploded);
    }

    // 9. Gear & RPM Simulation (for Speedometer + Exhaust Backfire)
    if (!hasDriver || this.destroyed) {
      this.gear = 0;
      this.rpm += (900 - this.rpm) * Math.min(1, dt * 6);
    } else if (vFwd < -0.5) {
      this.gear = -1;
      this.rpm = 1200 + Math.min(6800, (speedAbs / maxRevMs) * 5800);
    } else {
      const ratio = Math.min(1, speedAbs / Math.max(10, maxFwdMs));
      this.gear = Math.max(1, Math.min(6, 1 + Math.floor(ratio * 5.99)));
      const gearSpan = 1 / 6;
      const inGear = (ratio - (this.gear - 1) * gearSpan) / gearSpan;
      const targetRpm = 1400 + Math.max(0, Math.min(1, inGear)) * (this.isEV ? 11000 : 6800);
      this.rpm += (targetRpm - this.rpm) * Math.min(1, dt * 10);
      if (this.gear > this.prevGear && !this.isEV && this.throttle > 0.5) {
        this.backfireTimer = 0.11;
      }
      this.prevGear = this.gear;
    }

    // 10. Advanced Procedural Animations (Suspension, Slope, Lean, Steering, Wings, Doors, Lights, Sparks)
    this.updateAnimations(dt, now, nextVFwd, fwdAccel, desiredLatAccel, env);
  }

  updateAnimations(dt, now, vFwd, fwdAccel, latAccel, env) {
    const spec = this.spec;

    // Terrain Slope Pitch & Roll
    if (this.onGround) {
      const fw = this.forwardVec, rt = this.rightVec;
      const hF = env.sampleHeight(this.pos.x + fw.x * 1.3, this.pos.z + fw.z * 1.3, this.pos.y);
      const hB = env.sampleHeight(this.pos.x - fw.x * 1.3, this.pos.z - fw.z * 1.3, this.pos.y);
      const hL = env.sampleHeight(this.pos.x - rt.x * 0.9, this.pos.z - rt.z * 0.9, this.pos.y);
      const hR = env.sampleHeight(this.pos.x + rt.x * 0.9, this.pos.z + rt.z * 0.9, this.pos.y);
      const targetGP = Math.max(-0.5, Math.min(0.5, Math.atan2(hF - hB, 2.6)));
      const targetGR = Math.max(-0.45, Math.min(0.45, Math.atan2(hL - hR, 1.8)));
      this.groundPitch += (targetGP - this.groundPitch) * Math.min(1, dt * 10);
      this.groundRoll += (targetGR - this.groundRoll) * Math.min(1, dt * 10);
    }

    // Suspension Spring-Damper Heave + Flat Tire Sag
    const accelK = -spec.suspStiff * this.suspHeave - spec.suspDamp * this.suspVel;
    this.suspVel += accelK * dt;
    this.suspHeave = Math.max(-spec.suspTravel, Math.min(spec.suspTravel, this.suspHeave + this.suspVel * dt));

    let flatPitch = 0, flatRoll = 0, flatDrop = 0;
    for (const w of this.model.wheels) {
      if (w.flat) {
        flatDrop += 0.04;
        flatPitch += w.isSteer ? -0.025 : 0.025;
        flatRoll += w.isRight ? -0.032 : 0.032;
      }
    }

    // Dynamic Body Pitch (Dive on Brake, Squat on Launch) & Roll / Motorcycle Lean
    const targetPitch = Math.max(-0.14, Math.min(0.14, -fwdAccel * spec.pitchFactor * 0.08)) + flatPitch;
    this.pitchAngle += (targetPitch - this.pitchAngle) * Math.min(1, dt * 8);

    if (spec.isMoto) {
      const targetLean = this.destroyed
        ? 1.25
        : Math.max(-spec.maxLean, Math.min(spec.maxLean, this.steerAngle * Math.min(1, Math.abs(vFwd) / 9) * 1.25));
      this.leanAngle += (targetLean - this.leanAngle) * Math.min(1, dt * 8.5);
      this.rollAngle = this.leanAngle;
    } else {
      const targetRoll = Math.max(-0.16, Math.min(0.16, -latAccel * spec.rollFactor * 0.08)) + flatRoll;
      this.rollAngle += (targetRoll - this.rollAngle) * Math.min(1, dt * 9);
    }

    // Engine Idle Vibration
    const idleShake = (this.driverId && !this.destroyed && !this.isEV) ? Math.sin(now * 0.055) * 0.003 : 0;

    this.root.position.copy(this.pos);
    this.root.rotation.y = this.yaw;
    this.model.pitchGroup.rotation.set(this.groundPitch, 0, this.groundRoll);
    this.model.chassis.position.y = this.suspHeave - flatDrop + idleShake;
    this.model.chassis.rotation.set(this.pitchAngle, 0, this.rollAngle);

    // Wheel Rolling, Steering & Independent Suspension Travel
    for (const w of this.model.wheels) {
      const drop = w.flat ? -w.radius * 0.14 : 0;
      w.mount.position.y = w.radius + drop - this.suspHeave * 0.45;
      if (w.isSteer) w.steerGroup.rotation.y = this.steerAngle;
      w.spinGroup.rotation.x -= (vFwd * dt) / w.radius;
    }

    // Steering Wheel / Motorcycle Handlebar Rotation
    if (this.model.steeringWheel) {
      if (spec.isMoto) this.model.steeringWheel.rotation.y = this.steerAngle;
      else this.model.steeringWheel.rotation.z = this.steerAngle * 3.4;
    }

    // Active Aero Spoiler (Rises with speed & tilts forward as Airbrake when braking!)
    if (this.model.wingMesh) {
      const speedLift = Math.min(0.22, Math.max(0, (this.kmh - 70) / 180) * 0.22);
      const airbrake = (this.brake > 0.2 || (this.throttle < -0.1 && vFwd > 5)) ? 0.34 : 0;
      const baseWingY = (spec.category === 'offroad' ? spec.wheelRadius + 0.34 : spec.wheelRadius * 0.78 + 0.24) + (spec.category === 'supercar' ? 0.38 : 0.48) * 0.56;
      this.model.wingMesh.position.y += (baseWingY + speedLift - this.model.wingMesh.position.y) * Math.min(1, dt * 6);
      this.model.wingMesh.rotation.x += (airbrake - this.model.wingMesh.rotation.x) * Math.min(1, dt * 10);
    }

    // Door Open/Close Swing Animation on Enter/Exit
    if (this.doorAnimTimer > 0) this.doorAnimTimer = Math.max(0, this.doorAnimTimer - dt);
    const targetDoor = this.doorAnimTimer > 0 ? 0.85 : 0;
    this.doorOpenAmt += (targetDoor - this.doorOpenAmt) * Math.min(1, dt * 9);
    if (this.model.doorLeft) this.model.doorLeft.rotation.y = -this.doorOpenAmt;
    if (this.model.doorRight) this.model.doorRight.rotation.y = this.doorOpenAmt;

    // Headlights, Taillights & Reverse Lights
    const brakingNow = (this.brake > 0.1 || (this.throttle < -0.05 && vFwd > 0.5)) && this.driverId !== null;
    const reversingNow = vFwd < -0.4 && this.driverId !== null;
    const hlMat = this.headlightsOn && !this.destroyed ? this.mats.headlightOn : this.mats.headlightOff;
    for (const m of this.model.lights.head) m.material = hlMat;
    if (this.model.lights.spot) this.model.lights.spot.intensity = this.headlightsOn && !this.destroyed ? 3.8 : 0;
    for (const m of this.model.lights.tail) m.material = brakingNow ? this.mats.brakeOn : this.mats.brakeOff;
    for (const m of this.model.lights.reverse) m.material = reversingNow ? this.mats.reverseOn : this.mats.headlightOff;

    // Exhaust Backfire Flames
    if (this.backfireTimer > 0) this.backfireTimer = Math.max(0, this.backfireTimer - dt);
    const showFlame = this.backfireTimer > 0 && !this.destroyed;
    for (const f of this.model.flames) {
      f.visible = showFlame;
      if (showFlame) f.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.8, 0.8 + Math.random() * 0.4);
    }

    // Emit Smoke / Sparks / Drift Smoke via VehicleSystem FX hooks
    env.emitVehicleFX(this, dt, now, vFwd);
  }
}

// ============================================================================
// 4. BUILT-IN SPEEDOMETER & DASHBOARD HUD (SVG Analog Needle + Gauges)
// ============================================================================
class VehicleHUD {
  constructor() {
    this.el = document.getElementById('cars-hud');
    if (!this.el) {
      const style = document.createElement('style');
      style.textContent = `
        #cars-hud{position:fixed;right:20px;bottom:140px;z-index:27;pointer-events:none;background:rgba(10,15,25,.88);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:12px 14px;width:270px;color:#f1f5f9;font-family:'Segoe UI',sans-serif;box-shadow:0 14px 36px rgba(0,0,0,.6)}
        #cars-hud.hidden{display:none!important}
        .ch-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:.76rem}
        .ch-badge{padding:2px 7px;border-radius:4px;font-weight:800;font-size:.66rem;background:#1e293b;color:#38bdf8}
        .ch-dial-wrap{display:flex;align-items:center;gap:10px}
        .ch-kmh{font-size:1.75rem;font-weight:900;line-height:1;color:#fff}
        .ch-gear{display:inline-block;margin-top:3px;padding:2px 8px;border-radius:5px;background:rgba(245,158,11,.2);border:1px solid #f59e0b;color:#fde68a;font-weight:800;font-size:.78rem}
        .ch-bars{margin-top:8px;display:flex;flex-direction:column;gap:5px;font-size:.72rem}
        .ch-bar-bg{width:100%;height:7px;background:rgba(255,255,255,.12);border-radius:4px;overflow:hidden}
        .ch-bar-fill{height:100%;transition:width .08s}
        .ch-tires{display:flex;gap:5px;margin-top:7px;justify-content:space-between}
        .ch-tire{flex:1;text-align:center;font-size:.64rem;padding:3px 2px;border-radius:4px;background:rgba(16,185,129,.22);border:1px solid #10b981;color:#a7f3d0;font-weight:700}
        .ch-tire.warn{background:rgba(245,158,11,.24);border-color:#f59e0b;color:#fde68a}
        .ch-tire.flat{background:rgba(239,68,68,.35);border-color:#ef4444;color:#fecaca}
        .ch-hints{margin-top:7px;font-size:.65rem;color:#94a3b8;text-align:center}
      `;
      document.head.appendChild(style);
      this.style = style;
      this.el = document.createElement('div');
      this.el.id = 'cars-hud';
      this.el.className = 'hidden';
      this.el.innerHTML = `
        <div class="ch-head"><strong id="ch-name">-</strong><span class="ch-badge" id="ch-cat">-</span></div>
        <div class="ch-dial-wrap">
          <svg width="108" height="74" viewBox="0 0 110 76">
            <path d="M 14 66 A 42 42 0 1 1 96 66" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="8" stroke-linecap="round"/>
            <path id="ch-arc" d="M 14 66 A 42 42 0 1 1 96 66" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" stroke-dasharray="198" stroke-dashoffset="198"/>
            <line id="ch-needle" x1="55" y1="54" x2="55" y2="18" stroke="#ef4444" stroke-width="3" stroke-linecap="round" transform="rotate(-120 55 54)"/>
            <circle cx="55" cy="54" r="4.5" fill="#f8fafc"/>
          </svg>
          <div>
            <div class="ch-kmh" id="ch-kmh">0</div>
            <div style="font-size:.68rem;color:#94a3b8;">KM/H • <span id="ch-rpm">900</span> RPM</div>
            <div class="ch-gear">GEAR <span id="ch-gear">N</span> <span id="ch-flags"></span></div>
          </div>
        </div>
        <div class="ch-bars">
          <div><div style="display:flex;justify-content:space-between;"><span id="ch-energy-lbl">น้ำมัน</span><span id="ch-energy-val">100%</span></div><div class="ch-bar-bg"><div class="ch-bar-fill" id="ch-energy-bar" style="background:#f59e0b;width:100%"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;"><span>ความทนทานรถ</span><span id="ch-hp-val">100%</span></div><div class="ch-bar-bg"><div class="ch-bar-fill" id="ch-hp-bar" style="background:#10b981;width:100%"></div></div></div>
        </div>
        <div class="ch-tires" id="ch-tires"></div>
        <div class="ch-hints">[WASD] ขับ • [Space] ดริฟท์ • [L] ไฟหน้า • [F] ลงรถ</div>
      `;
      document.body.appendChild(this.el);
    }
  }

  dispose() {
    this.el.remove();
    this.style?.remove();
  }

  update(vehicle, seatIdx = 0) {
    if (!vehicle) {
      this.el.classList.add('hidden');
      return;
    }
    this.el.classList.remove('hidden');
    const spec = vehicle.spec;
    document.getElementById('ch-name').textContent = spec.name + (seatIdx > 0 ? ' (ผู้โดยสาร)' : '');
    document.getElementById('ch-cat').textContent = spec.label;

    const kmh = Math.round(vehicle.kmh);
    const ratio = Math.min(1, vehicle.kmh / spec.topSpeedKmh);
    const angle = -120 + ratio * 240;
    document.getElementById('ch-kmh').textContent = kmh;
    document.getElementById('ch-rpm').textContent = Math.round(vehicle.rpm);
    document.getElementById('ch-needle').setAttribute('transform', `rotate(${angle.toFixed(1)} 55 54)`);
    document.getElementById('ch-arc').setAttribute('stroke-dashoffset', String((1 - ratio) * 198));
    document.getElementById('ch-arc').setAttribute('stroke', ratio > 0.82 ? '#ef4444' : vehicle.isEV ? '#06b6d4' : '#38bdf8');
    document.getElementById('ch-gear').textContent = vehicle.gear === -1 ? 'R' : vehicle.gear === 0 ? 'N' : vehicle.gear;

    const flags = [];
    if (vehicle.isDrifting) flags.push('DRIFT');
    if (vehicle.regenActive) flags.push('REGEN+');
    if (vehicle.headlightsOn) flags.push('LIGHTS');
    document.getElementById('ch-flags').textContent = flags.length ? '• ' + flags.join(' ') : '';

    const ep = Math.round(vehicle.getEnergyPercent());
    document.getElementById('ch-energy-lbl').textContent = vehicle.isEV ? 'แบตเตอรี่ EV' : 'น้ำมันเชื้อเพลิง';
    document.getElementById('ch-energy-val').textContent = vehicle.isEV
      ? `${ep}% (${vehicle.battery.toFixed(1)} kWh)`
      : `${ep}% (${vehicle.fuel.toFixed(1)} L)`;
    const eBar = document.getElementById('ch-energy-bar');
    eBar.style.width = `${ep}%`;
    eBar.style.background = ep < 20 ? '#ef4444' : vehicle.isEV ? 'linear-gradient(90deg,#0284c7,#22d3ee)' : 'linear-gradient(90deg,#d97706,#fbbf24)';

    const hpPct = Math.round((vehicle.hp / vehicle.maxHp) * 100);
    document.getElementById('ch-hp-val').textContent = `${hpPct}%`;
    const hBar = document.getElementById('ch-hp-bar');
    hBar.style.width = `${hpPct}%`;
    hBar.style.background = hpPct < 30 ? '#ef4444' : hpPct < 60 ? '#f59e0b' : '#10b981';

    const labels = spec.isMoto ? ['หน้า', 'หลัง'] : ['FL', 'FR', 'RL', 'RR'];
    document.getElementById('ch-tires').replaceChildren(...vehicle.model.wheels.map((w, i) => {
      const d = document.createElement('div');
      d.className = 'ch-tire' + (w.flat ? ' flat' : w.hp < 50 ? ' warn' : '');
      d.textContent = w.flat ? `${labels[i]} แบน` : `${labels[i]} ${Math.round(w.hp)}%`;
      return d;
    }));
  }
}

// ============================================================================
// 5. VEHICLE SYSTEM MANAGER (Spawning, Collisions, Raycast, Refuel/EV, FX)
// ============================================================================
export function createVehicleSystem(scene, ctx = {}) {
  const colliders = ctx.colliders || [];
  const stairRamps = ctx.stairRamps || [];
  const mapHalf = ctx.mapHalf || 250;
  const mats = createCarMaterials();
  const hud = new VehicleHUD();
  const soundEngine = new VehicleSoundEngine(scene, ctx);

  const vehicles = [];
  const stations = []; // { type: 'fuel'|'ev', pos: THREE.Vector3, mesh: THREE.Group }
  const fxParticles = [];
  const fxGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
  let activeLocalActorId = null;

  function spawnFX(pos, color, vel, life = 0.55, scale = 1.0) {
    if (fxParticles.length > 180) return;
    const m = new THREE.Mesh(fxGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75, depthWrite: false }));
    m.position.copy(pos);
    m.scale.setScalar(scale);
    scene.add(m);
    fxParticles.push({ mesh: m, vel, life, maxLife: life });
  }

  function sampleSurface(pos) {
    if (pos.y <= 0.14) return 'water';
    if (Math.abs(pos.x) > mapHalf - 60 || Math.abs(pos.z) > mapHalf - 60) return 'sand';
    if (pos.x < -210 && Math.abs(pos.z) < 160 && pos.y > 2.2) return 'dirt';
    if (Math.abs(pos.x) < 120 && Math.abs(pos.z) < 180) return 'asphalt';
    if (Math.abs(pos.x) < 22 || Math.abs(pos.z) < 22) return 'asphalt';
    return 'grass';
  }

  function sampleHeight(x, z, currentY) {
    let bestY = 0;
    for (const r of stairRamps) {
      const along = r.axis === 'z' ? (z - r.z) * r.dir : (x - r.x) * r.dir;
      const across = r.axis === 'z' ? Math.abs(x - r.x) : Math.abs(z - r.z);
      if (along >= -0.6 && along <= r.length + 0.6 && across <= r.width * 0.5 + 0.5) {
        const rh = r.baseY + r.height * Math.max(0, Math.min(r.length, along)) / r.length;
        if (Math.abs(rh - currentY) < 2.2 && rh > bestY) bestY = rh;
      }
    }
    for (const b of colliders) {
      if (b.stairRamp) continue;
      if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ && b.maxY <= currentY + 1.25 && b.maxY > bestY) {
        bestY = b.maxY;
      }
    }
    return bestY;
  }

  function resolveCollisions(vehicle, prevPos) {
    const hw = vehicle.spec.size[0] * 0.46;
    const hl = vehicle.spec.size[2] * 0.46;
    const fw = vehicle.forwardVec;
    const rt = vehicle.rightVec;
    let impactSpeed = 0;
    const hitPt = vehicle.pos.clone();

    // Test vehicle OBB corners against world colliders
    const corners = [
      vehicle.pos.clone().addScaledVector(fw, hl).addScaledVector(rt, hw),
      vehicle.pos.clone().addScaledVector(fw, hl).addScaledVector(rt, -hw),
      vehicle.pos.clone().addScaledVector(fw, -hl).addScaledVector(rt, hw),
      vehicle.pos.clone().addScaledVector(fw, -hl).addScaledVector(rt, -hw)
    ];

    for (const c of corners) {
      for (const b of colliders) {
        if (b.stairRamp) continue;
        if (c.x > b.minX && c.x < b.maxX && c.z > b.minZ && c.z < b.maxZ && vehicle.pos.y + 1.55 > b.minY && vehicle.pos.y + 0.6 < b.maxY) {
          const spd = vehicle.vel.length();
          if (spd > impactSpeed) { impactSpeed = spd; hitPt.copy(c); }
          const dx1 = c.x - b.minX, dx2 = b.maxX - c.x, dz1 = c.z - b.minZ, dz2 = b.maxZ - c.z;
          const m = Math.min(dx1, dx2, dz1, dz2);
          if (m === dx1) { vehicle.pos.x -= dx1 + 0.04; vehicle.vel.x = -Math.abs(vehicle.vel.x) * 0.35; }
          else if (m === dx2) { vehicle.pos.x += dx2 + 0.04; vehicle.vel.x = Math.abs(vehicle.vel.x) * 0.35; }
          else if (m === dz1) { vehicle.pos.z -= dz1 + 0.04; vehicle.vel.z = -Math.abs(vehicle.vel.z) * 0.35; }
          else { vehicle.pos.z += dz2 + 0.04; vehicle.vel.z = Math.abs(vehicle.vel.z) * 0.35; }
        }
      }
    }

    // Vehicle-to-Vehicle Bumper Collisions
    for (const other of vehicles) {
      if (other === vehicle) continue;
      const dx = vehicle.pos.x - other.pos.x, dz = vehicle.pos.z - other.pos.z;
      const minSep = (vehicle.spec.size[2] + other.spec.size[2]) * 0.38;
      const d = Math.hypot(dx, dz);
      if (d > 0.01 && d < minSep && Math.abs(vehicle.pos.y - other.pos.y) < 2.0) {
        const push = (minSep - d) * 0.5;
        const nx = dx / d, nz = dz / d;
        vehicle.pos.x += nx * push; vehicle.pos.z += nz * push;
        other.pos.x -= nx * push; other.pos.z -= nz * push;
        const relSpd = vehicle.vel.distanceTo(other.vel);
        if (relSpd > impactSpeed) impactSpeed = relSpd;
        const mRatio = other.spec.mass / (vehicle.spec.mass + other.spec.mass);
        other.vel.addScaledVector(vehicle.vel, mRatio * 0.55);
        vehicle.vel.multiplyScalar(0.55);
      }
    }

    return { impactSpeed, point: hitPt };
  }

  function emitVehicleFX(vehicle, dt, now, vFwd) {
    // 1. Drift Tire Smoke & Flat-Tire Rim Sparks
    if (vehicle.isDrifting && Math.random() < 0.7) {
      for (const w of vehicle.model.wheels) {
        if (w.isSteer && !vehicle.spec.isMoto) continue;
        w.mount.updateWorldMatrix(true, false);
        const wp = new THREE.Vector3().setFromMatrixPosition(w.mount.matrixWorld);
        wp.y -= w.radius * 0.65;
        spawnFX(wp, 0xd4d4d8, new THREE.Vector3((Math.random() - 0.5) * 1.6, 0.9, (Math.random() - 0.5) * 1.6), 0.7, 2.2);
      }
    }
    if (Math.abs(vFwd) > 5) {
      for (const w of vehicle.model.wheels) {
        if (!w.flat || Math.random() > 0.5) continue;
        w.mount.updateWorldMatrix(true, false);
        const wp = new THREE.Vector3().setFromMatrixPosition(w.mount.matrixWorld);
        wp.y -= w.radius * 0.6;
        spawnFX(wp, 0xfbbf24, new THREE.Vector3((Math.random() - 0.5) * 4, 2.2, (Math.random() - 0.5) * 4), 0.25, 0.6);
      }
    }

    // 2. Engine Damage Smoke & Fire
    const hpPct = vehicle.hp / vehicle.maxHp;
    if (vehicle.destroyed || hpPct < 0.35) {
      if (Math.random() < (vehicle.destroyed ? 0.55 : 0.35)) {
        const hood = vehicle.pos.clone().addScaledVector(vehicle.forwardVec, vehicle.spec.size[2] * 0.32);
        hood.y += 1.05;
        spawnFX(hood, vehicle.destroyed ? 0x18181b : 0x52525b, new THREE.Vector3((Math.random() - 0.5) * 1.2, 2.8, (Math.random() - 0.5) * 1.2), 1.1, 2.8);
      }
      if ((vehicle.destroyed || hpPct < 0.16) && Math.random() < 0.4) {
        const hood = vehicle.pos.clone().addScaledVector(vehicle.forwardVec, vehicle.spec.size[2] * 0.32);
        hood.y += 1.0;
        spawnFX(hood, 0xf97316, new THREE.Vector3((Math.random() - 0.5) * 1.5, 2.2, (Math.random() - 0.5) * 1.5), 0.35, 1.4);
      }
    }
  }

  function triggerExplosionFX(vehicle, pos) {
    for (let i = 0; i < 28; i++) {
      spawnFX(
        pos.clone().add(new THREE.Vector3(0, 0.9, 0)),
        i % 2 === 0 ? 0xf97316 : 0xfde047,
        new THREE.Vector3((Math.random() - 0.5) * 18, 4 + Math.random() * 12, (Math.random() - 0.5) * 18),
        0.75,
        2.6
      );
    }
    soundEngine.playExplosion(pos, soundEngine.getListener(vehicles, activeLocalActorId));
    if (typeof ctx.onVehicleExplode === 'function') {
      ctx.onVehicleExplode(vehicle, pos);
    }
  }

  const env = {
    mapHalf,
    sampleSurface,
    sampleHeight,
    resolveCollisions,
    emitVehicleFX,
    onImpact(vehicle, pt, speed, exploded) {
      const listener = soundEngine.getListener(vehicles, activeLocalActorId);
      const isLocal = activeLocalActorId !== null && vehicle.seats.some((s) => s.occupantId === activeLocalActorId);
      const spatial = soundEngine.spatialParams(pt, listener, isLocal);
      soundEngine.playCrash(vehicle, speed, spatial);
      if (speed > 4.5) {
        for (let i = 0; i < 8; i++) {
          spawnFX(pt, 0xfef08a, new THREE.Vector3((Math.random() - 0.5) * 8, 2 + Math.random() * 5, (Math.random() - 0.5) * 8), 0.3, 0.7);
        }
      }
      if (exploded) triggerExplosionFX(vehicle, vehicle.pos);
    }
  };

  // ---------------- Public API ----------------
  function spawnVehicle(typeId, pos, yaw = 0) {
    const spec = VEHICLE_SPECS[typeId];
    if (!spec) throw new Error(`Unknown vehicle spec: ${typeId}`);
    const model = buildVehicleModel(spec, mats);
    scene.add(model.root);
    const inst = new VehicleInstance(`veh_${vehicles.length + 1}`, spec, pos, yaw, model, mats);
    vehicles.push(inst);
    return inst;
  }

  function spawnStation(type, pos) {
    const g = new THREE.Group();
    g.position.copy(pos);
    const isEV = type === 'ev';
    const body = makePart(new THREE.BoxGeometry(1.1, 2.1, 0.7), new THREE.MeshStandardMaterial({ color: isEV ? 0x0284c7 : 0xdc2626, roughness: 0.4 }), 0, 1.05, 0);
    const screen = makePart(new THREE.BoxGeometry(0.65, 0.45, 0.08), new THREE.MeshBasicMaterial({ color: isEV ? 0x22d3ee : 0xfef08a }), 0, 1.45, 0.36, 0, 0, 0, false);
    const roof = makePart(new THREE.BoxGeometry(4.2, 0.28, 3.4), mats.carbon, 0, 3.2, 0);
    const post = makePart(new THREE.BoxGeometry(0.28, 3.2, 0.28), mats.steelMat, -1.6, 1.6, -1.2);
    g.add(body, screen, roof, post);
    scene.add(g);
    const st = { type, pos: pos.clone(), mesh: g };
    stations.push(st);
    return st;
  }

  function serviceNearbyVehicles(dt) {
    for (const st of stations) {
      for (const v of vehicles) {
        if (v.destroyed || v.pos.distanceTo(st.pos) > 5.2 || v.kmh > 4) continue;
        if (st.type === 'fuel' && !v.isEV) v.refuel(18 * dt);
        if (st.type === 'ev' && v.isEV) v.recharge(26 * dt);
      }
    }
  }

  function findActorVehicle(actorId) {
    for (const v of vehicles) {
      const seatIdx = v.seats.findIndex((s) => s.occupantId === actorId);
      if (seatIdx !== -1) return { vehicle: v, seatIdx };
    }
    return null;
  }

  function tryEnterNearest(actorPos, actorId, preferPassenger = false, maxDist = 4.6) {
    soundEngine.unlock();
    if (findActorVehicle(actorId)) return null;
    let best = null, bd = maxDist;
    for (const v of vehicles) {
      if (v.destroyed) continue;
      const d = actorPos.distanceTo(v.pos);
      if (d < bd) { bd = d; best = v; }
    }
    if (!best) return null;
    const seatIdx = best.assignSeat(actorId, preferPassenger);
    if (seatIdx !== -1) {
      activeLocalActorId = actorId;
      const listener = soundEngine.getListener(vehicles, activeLocalActorId);
      const spatial = soundEngine.spatialParams(best.pos, listener, true);
      if (seatIdx === 0 && best.hasEnergy()) {
        soundEngine.playStartup(best, spatial);
      } else {
        soundEngine.playDoor(best, spatial, true);
      }
      const tr = soundEngine.trackers.get(best.id);
      if (tr) {
        tr.hadDriver = best.driverId !== null && !best.destroyed && best.hasEnergy();
        tr.hadOccupants = best.hasOccupants();
      }
      return { vehicle: best, seatIdx };
    }
    return null;
  }

  function exitVehicle(actorId) {
    const info = findActorVehicle(actorId);
    if (!info) return null;
    const exitPos = info.vehicle.getExitPosition(info.seatIdx);
    const listener = soundEngine.getListener(vehicles, actorId);
    soundEngine.playDoor(info.vehicle, soundEngine.spatialParams(info.vehicle.pos, listener, true), false);
    info.vehicle.vacateSeat(actorId);
    const tr = soundEngine.trackers.get(info.vehicle.id);
    if (tr) {
      tr.hadDriver = info.vehicle.driverId !== null && !info.vehicle.destroyed && info.vehicle.hasEnergy();
      tr.hadOccupants = info.vehicle.hasOccupants();
    }
    return { exitPos, vehicle: info.vehicle };
  }

  // Raycast bullets against BOTH individual tires (for tire blowouts!) & chassis
  function raycastVehicles(p0, p1) {
    const seg = p1.clone().sub(p0);
    const segLen = seg.length();
    if (segLen < 1e-5) return null;
    const dir = seg.clone().divideScalar(segLen);
    let bestHit = null;

    for (const v of vehicles) {
      if (v.pos.distanceTo(p0) > segLen + 8) continue;

      // 1. Check Tires First (Accurate Spherical Tire Hitboxes)
      for (let i = 0; i < v.model.wheels.length; i++) {
        const w = v.model.wheels[i];
        w.mount.updateWorldMatrix(true, false);
        const wCenter = new THREE.Vector3().setFromMatrixPosition(w.mount.matrixWorld);
        const oc = wCenter.clone().sub(p0);
        const proj = oc.dot(dir);
        if (proj < 0 || proj > segLen) continue;
        const closest = p0.clone().addScaledVector(dir, proj);
        const hitR = w.radius + 0.08;
        if (closest.distanceToSquared(wCenter) <= hitR * hitR) {
          const t = proj / segLen;
          if (!bestHit || t < bestHit.t) {
            bestHit = { vehicle: v, part: 'tire', wheelIndex: i, t, hitPoint: closest };
          }
        }
      }

      // 2. Check Vehicle Chassis Local OBB
      v.root.updateMatrixWorld(true);
      const invMat = new THREE.Matrix4().copy(v.root.matrixWorld).invert();
      const la = p0.clone().applyMatrix4(invMat);
      const lb = p1.clone().applyMatrix4(invMat);
      const [W, H, L] = v.spec.size;
      const box = { minX: -W * 0.5, maxX: W * 0.5, minY: 0.15, maxY: H + 0.35, minZ: -L * 0.5, maxZ: L * 0.5 };

      let tn = 0, tx = 1;
      const d = lb.clone().sub(la);
      let hit = true;
      for (const [o, dv, mn, mx] of [[la.x, d.x, box.minX, box.maxX], [la.y, d.y, box.minY, box.maxY], [la.z, d.z, box.minZ, box.maxZ]]) {
        if (Math.abs(dv) < 1e-8) { if (o < mn || o > mx) { hit = false; break; } }
        else {
          let t1 = (mn - o) / dv, t2 = (mx - o) / dv;
          if (t1 > t2) [t1, t2] = [t2, t1];
          tn = Math.max(tn, t1); tx = Math.min(tx, t2);
          if (tn > tx) { hit = false; break; }
        }
      }
      if (hit && tn >= 0 && tn <= 1 && (!bestHit || tn < bestHit.t)) {
        const hp = p0.clone().lerp(p1, tn);
        const isEngine = la.z + d.z * tn < -L * 0.18;
        bestHit = { vehicle: v, part: isEngine ? 'engine' : 'body', wheelIndex: -1, t: tn, hitPoint: hp };
      }
    }
    return bestHit;
  }

  function applyBulletHit(hit, rawDmg) {
    if (!hit) return null;
    const { vehicle, part, wheelIndex, hitPoint } = hit;
    const listener = soundEngine.getListener(vehicles, activeLocalActorId);
    if (part === 'tire') {
      const blewOut = vehicle.damageTire(wheelIndex, rawDmg * 1.4);
      vehicle.applyDamage(rawDmg * 0.25);
      if (blewOut) {
        spawnFX(hitPoint, 0x18181b, new THREE.Vector3(0, 2.5, 0), 0.6, 1.8);
        soundEngine.playTireBlowout(hitPoint, listener);
      }
      return { part: 'tire', blewOut, exploded: false };
    }
    const dmgMult = part === 'engine' ? 1.45 : 1.0;
    const exploded = vehicle.applyDamage(rawDmg * dmgMult);
    spawnFX(hitPoint, 0xfef08a, new THREE.Vector3((Math.random() - 0.5) * 4, 2.5, (Math.random() - 0.5) * 4), 0.22, 0.5);
    soundEngine.playBulletRicochet(hitPoint, listener);
    if (exploded) triggerExplosionFX(vehicle, vehicle.pos);
    return { part, blewOut: false, exploded };
  }

  function applyExplosion(center, radius, maxDmg, sourceUid = null, sourceName = null) {
    for (const v of vehicles) {
      const d = v.pos.distanceTo(center);
      if (d > radius) continue;
      if (sourceUid) {
        v.lastHitByUid = sourceUid;
        v.lastHitByName = sourceName || 'ระเบิด';
      }
      const ratio = 1 - d / radius;
      v.vel.addScaledVector(v.pos.clone().sub(center).normalize(), ratio * 12);
      v.vel.y += ratio * 4.5;
      for (let i = 0; i < v.model.wheels.length; i++) v.damageTire(i, maxDmg * ratio * 0.85);
      const exploded = v.applyDamage(maxDmg * ratio * 3.5);
      if (exploded) triggerExplosionFX(v, v.pos);
    }
  }

  function update(dt, now, driverInputsByVehicleId = {}, localActorId = null) {
    const safeDt = Number.isFinite(dt) && dt > 0 ? Math.min(0.05, dt) : 1 / 60;
    if (localActorId !== null) activeLocalActorId = localActorId;
    serviceNearbyVehicles(safeDt);

    for (const v of vehicles) {
      const input = driverInputsByVehicleId[v.id] || { throttle: 0, brake: 0, steer: 0, handbrake: false };
      v.stepPhysics(safeDt, now, input, env);
    }

    // Update FX particles
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      const p = fxParticles[i];
      p.life -= safeDt;
      if (p.life <= 0) {
        scene.remove(p.mesh);
        p.mesh.material.dispose();
        fxParticles.splice(i, 1);
        continue;
      }
      p.vel.y -= 3.5 * safeDt;
      p.mesh.position.addScaledVector(p.vel, safeDt);
      p.mesh.scale.addScalar(0.8 * safeDt);
      p.mesh.material.opacity = Math.max(0, (p.life / p.maxLife) * 0.75);
    }

    // Update vehicle audio engine
    try { soundEngine.update(vehicles, activeLocalActorId, safeDt, now); } catch (err) { console.warn('Vehicle audio error (ignored):', err); }

    // Update HUD if localActorId is riding/driving
    if (localActorId !== null) {
      const seatInfo = findActorVehicle(localActorId);
      hud.update(seatInfo ? seatInfo.vehicle : null, seatInfo ? seatInfo.seatIdx : 0);
    }
  }

  function applyNetworkState(states, dt, now) {
    const alpha = Math.min(1, dt * 14);
    const listener = soundEngine.getListener(vehicles, activeLocalActorId);
    for (const vehicle of vehicles) {
      const state = states?.[vehicle.id];
      if (!state) continue;
      if (![state.x, state.y, state.z, state.yaw, state.vx, state.vy, state.vz, state.suspHeave, state.pitchAngle, state.rollAngle].every(Number.isFinite)) {
        if (!vehicle._warnedInvalidNetworkState) {
          console.warn('Ignoring invalid vehicle network state:', vehicle.id);
          vehicle._warnedInvalidNetworkState = true;
        }
        continue;
      }
      vehicle._warnedInvalidNetworkState = false;
      vehicle.pos.lerp(new THREE.Vector3(state.x, state.y, state.z), alpha);
      let yawDelta = (state.yaw || 0) - vehicle.yaw;
      yawDelta = Math.atan2(Math.sin(yawDelta), Math.cos(yawDelta));
      vehicle.yaw += yawDelta * alpha;
      vehicle.vel.set(state.vx || 0, state.vy || 0, state.vz || 0);
      vehicle.hp = Math.max(0, Math.min(vehicle.maxHp, Number(state.hp) || 0));
      vehicle.fuel = Math.max(0, Math.min(vehicle.maxFuel, Number(state.fuel) || 0));
      vehicle.battery = Math.max(0, Math.min(vehicle.maxBattery, Number(state.battery) || 0));
      vehicle.destroyed = !!state.destroyed;
      vehicle.headlightsOn = !!state.headlightsOn;
      vehicle.steerAngle = Number(state.steerAngle) || 0;
      vehicle.suspHeave = Number(state.suspHeave) || 0;
      vehicle.pitchAngle = Number(state.pitchAngle) || 0;
      vehicle.rollAngle = Number(state.rollAngle) || 0;
      vehicle.kmh = Number(state.kmh) || 0;
      vehicle.rpm = Number(state.rpm) || 0;

      // Sync gear & throttle estimate on client for accurate gear-shift & revving audio
      const forwardSpeed = vehicle.vel.dot(vehicle.forwardVec);
      if (vehicle.driverId === null || vehicle.destroyed) {
        vehicle.gear = 0;
        vehicle.throttle = 0;
      } else if (forwardSpeed < -0.5) {
        vehicle.gear = -1;
        vehicle.throttle = -0.6;
      } else {
        const maxFwd = Math.max(10, vehicle.spec.topSpeedKmh / 3.6);
        const ratio = Math.min(1, Math.abs(forwardSpeed) / maxFwd);
        vehicle.gear = Math.max(1, Math.min(6, 1 + Math.floor(ratio * 5.99)));
        vehicle.throttle = vehicle.rpm > 2400 ? Math.min(1, (vehicle.rpm - 1400) / 5000) : 0;
      }
      vehicle.isDrifting = vehicle.kmh > 30 && Math.abs(vehicle.vel.dot(vehicle.rightVec)) > 3.2;

      for (let i = 0; i < vehicle.model.wheels.length; i++) {
        const wheelState = state.wheels?.[i];
        if (!wheelState) continue;
        const wheel = vehicle.model.wheels[i];
        wheel.hp = Math.max(0, Math.min(100, Number(wheelState.hp) || 0));
        if (wheelState.flat && !wheel.flat) {
          wheel.flat = true;
          wheel.tireMesh.material = vehicle.mats.shreddedTire;
          wheel.tireMesh.scale.set(0.86, 1, 0.86);
          soundEngine.playTireBlowout(vehicle.pos, listener);
        }
      }
      if (vehicle.destroyed) {
        vehicle.model.paintMat.color.setHex(0x231f1e);
        vehicle.model.paintMat.roughness = 0.96;
      }
      vehicle.updateAnimations(dt, now, forwardSpeed, 0, 0, env);
    }
    soundEngine.update(vehicles, activeLocalActorId, Math.min(0.05, dt), now);
  }

  function dispose() {
    soundEngine.dispose();
    const geometries = new Set([fxGeo]);
    const materials = new Set();
    for (const item of [...vehicles, ...stations, ...fxParticles.map((particle) => ({ mesh: particle.mesh }))]) {
      const root = item.root || item.mesh;
      if (!root) continue;
      scene.remove(root);
      root.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (!object.material) return;
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          materials.add(material);
        }
      });
    }
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    vehicles.length = 0;
    stations.length = 0;
    fxParticles.length = 0;
    hud.dispose();
  }

  // Spawn a ready-to-drive Showcase / Fleet across any map
  function spawnShowcaseFleet(centerPos = new THREE.Vector3(0, 0, -45)) {
    const ids = Object.keys(VEHICLE_SPECS);
    const cols = 4;
    const spacingX = 7.5, spacingZ = 9.0;
    ids.forEach((id, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const p = new THREE.Vector3(
        centerPos.x + (col - (cols - 1) / 2) * spacingX,
        centerPos.y,
        centerPos.z + row * spacingZ
      );
      p.y = sampleHeight(p.x, p.z, centerPos.y + 1);
      spawnVehicle(id, p, 0);
    });
  }

  return {
    vehicles,
    stations,
    hud,
    soundEngine,
    spawnVehicle,
    spawnStation,
    spawnShowcaseFleet,
    findActorVehicle,
    tryEnterNearest,
    exitVehicle,
    raycastVehicles,
    applyBulletHit,
    applyExplosion,
    update,
    applyNetworkState,
    dispose
  };
}