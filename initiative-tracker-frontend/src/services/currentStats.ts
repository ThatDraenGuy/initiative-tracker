import { api } from './api';

const currentStatsApi = api.injectEndpoints({
  endpoints: builder => ({
    damage: builder.mutation<DamageResponse, DamageRequest>({
      query: request => ({
        url: `currentStats/${request.id}/damage`,
        method: 'PUT',
        body: request.damage,
      }),
      invalidatesTags: ['getCurrentStats'],
    }),
    heal: builder.mutation<HealResponse, HealRequest>({
      query: request => ({
        url: `currentStats/${request.id}/heal`,
        method: 'PUT',
        body: request.heal,
      }),
      invalidatesTags: ['getCurrentStats'],
    }),
    updateCurrentStats: builder.mutation<
      UpdateCurrentStatsResponse,
      UpdateCurrentStatsRequest
    >({
      query: request => ({
        url: `currentStats/${request.id}`,
        method: 'PUT',
        body: request.values,
      }),
      invalidatesTags: ['getCurrentStats'],
    }),
  }),
});

export interface DamageRequest {
  id: number;
  damage: { amount: number; damageTypeId?: number };
}
export type DamageResponse = CurrentStats;

export interface HealRequest {
  id: number;
  heal: { amount: number };
}
export type HealResponse = CurrentStats;

export interface UpdateCurrentStatsRequest {
  id: number;
  values: {
    hitPoints?: number;
    tempHitPoints: number;
    hitDiceCount?: number;
    armorClass?: number;
    speed?: number;
  };
}

export type UpdateCurrentStatsResponse = CurrentStats;
export interface CurrentStats {
  id: number;
  hitPoints?: number;
  tempHitPoints: number;
  hidDiceCount?: number;
  armorClass?: number;
  speed?: number;
}

export const {
  useDamageMutation,
  useHealMutation,
  useUpdateCurrentStatsMutation,
} = currentStatsApi;
