export const DEATHMATCH_MODE_ID = 'deathmatch';
export const DEATHMATCH_PLAYER_LIMIT = 50;
export const DEATHMATCH_DURATION_MINUTES = 12;
export const DEATHMATCH_RANK_REWARDS = Object.freeze([1000, 750, 500, 300, 150]);
export const BATTLE_ROYALE_MODE_ID = 'battle_royale';
export const BATTLE_ROYALE_PLAYER_LIMIT = 100;

export function isDeathmatchMode(mode) {
  return mode === DEATHMATCH_MODE_ID;
}

export function isBattleRoyaleMode(mode) {
  return mode === BATTLE_ROYALE_MODE_ID;
}

export function deathmatchBotCount(humanCount) {
  const count = Number.isFinite(Number(humanCount)) ? Math.max(0, Math.floor(Number(humanCount))) : 0;
  return Math.max(0, DEATHMATCH_PLAYER_LIMIT - Math.min(DEATHMATCH_PLAYER_LIMIT, count));
}

export function battleRoyaleBotCount(humanCount) {
  const count = Number.isFinite(Number(humanCount)) ? Math.max(0, Math.floor(Number(humanCount))) : 0;
  return Math.max(0, BATTLE_ROYALE_PLAYER_LIMIT - Math.min(BATTLE_ROYALE_PLAYER_LIMIT, count));
}

export function rankDeathmatchParticipants(participants) {
  return participants
    .map((participant) => ({
      ...participant,
      kills: Math.max(0, Math.floor(Number(participant.kills) || 0)),
      deaths: Math.max(0, Math.floor(Number(participant.deaths) || 0))
    }))
    .sort((a, b) =>
      b.kills - a.kills ||
      a.deaths - b.deaths ||
      String(a.uid).localeCompare(String(b.uid))
    )
    .map((participant, index) => ({
      ...participant,
      rank: index + 1,
      reward: DEATHMATCH_RANK_REWARDS[index] || 0
    }));
}

export function rankBattleRoyaleParticipants(participants) {
    return participants
      .map((participant) => ({
        ...participant,
        alive: !!participant.alive,
        kills: Math.max(0, Math.floor(Number(participant.kills) || 0)),
        deaths: Math.max(0, Math.floor(Number(participant.deaths) || 0))
      }))
      .sort((a, b) =>
        Number(b.alive) - Number(a.alive) ||
        (Number(b.eliminatedAt) || 0) - (Number(a.eliminatedAt) || 0) ||
        b.kills - a.kills ||
        a.deaths - b.deaths ||
        String(a.uid).localeCompare(String(b.uid))
      )
      .map((participant, index) => ({ ...participant, rank: index + 1 }));
}
