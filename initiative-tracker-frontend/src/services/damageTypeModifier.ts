import { DamageType } from './damageType';

export interface DamageTypeModifier {
  statBlockId: number;
  damageType: DamageType;
  modifier: number;
}
