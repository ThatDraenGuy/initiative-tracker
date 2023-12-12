export function isEmpty(str?: string) {
  return !str || str.length === 0;
}

export function editArrElem<T>(arr: T[], index: number, value: T): T[] {
  return [...arr.slice(0, index), value, ...arr.slice(index + 1, arr.length)];
}

export function getBonusFromScore(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}
