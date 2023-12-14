import { api } from './api';
import { Character } from './character';

export const battleApi = api.injectEndpoints({
  endpoints: builder => ({
    getBattlesBrief: builder.query<GetBattlesResponse, GetBattlesRequest>({
      query: request => ({
        url: 'battleBrief',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getBattlesBrief'],
    }),
    getBattleById: builder.query<GetBattleByIdResponse, GetBattleByIdRequest>({
      query: request => ({
        url: `battle/${request}`,
        method: 'GET',
      }),
      providesTags: ['getBattles'],
    }),
    deleteBattle: builder.mutation<DeleteBattleResponse, DeleteBattleRequest>({
      query: request => ({
        url: `battle/${request.id}/end`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getBattles', 'getBattlesBrief'],
    }),
    startBattle: builder.mutation<StartBattleResponse, StartBattleRequest>({
      query: request => ({
        url: 'battle/start',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getBattles', 'getBattlesBrief'],
    }),
    nextInitiative: builder.mutation<
      NextInitiativeResponse,
      NextInitiativeRequest
    >({
      query: request => ({
        url: `battle/${request}/nextInitiative`,
        method: 'POST',
      }),
      invalidatesTags: ['getBattles', 'getBattlesBrief'],
    }),
    damage: builder.mutation<DamageResponse, DamageRequest>({
      query: request => ({
        url: `currentStats/${request.id}/damage`,
        method: 'PUT',
        body: request.damage,
      }),
      invalidatesTags: ['getBattles'],
    }),
    heal: builder.mutation<HealResponse, HealRequest>({
      query: request => ({
        url: `currentStats/${request.id}/heal`,
        method: 'PUT',
        body: request.heal,
      }),
      invalidatesTags: ['getBattles'],
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
      invalidatesTags: ['getBattles'],
    }),
  }),
});

export interface GetBattlesRequest {}

export interface GetBattlesResponse {
  total: number;
  items: BattleBrief[];
}

export type GetBattleByIdRequest = number;
export type GetBattleByIdResponse = Battle;

export interface DeleteBattleRequest {
  id: number;
}

export interface DeleteBattleResponse {}

export interface StartBattleRequest {
  characterIds: number[];
}

export type StartBattleResponse = BattleBrief;

export type NextInitiativeRequest = number;
export interface NextInitiativeResponse {}

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

export interface BattleBrief {
  id: number;
  roundNumber: number;
  characterAmount: number;
  currentCharacterIndex: number;
}

export interface Battle extends BattleBrief {
  entries: InitiativeEntry[];
}

export interface InitiativeEntry {
  character: Character;
  currentStats: CurrentStats;
  roll: number;
}

export interface CurrentStats {
  id: number;
  hitPoints?: number;
  tempHitPoints: number;
  hidDiceCount?: number;
  armorClass?: number;
  speed?: number;
}

export const {
  useGetBattlesBriefQuery,
  useGetBattleByIdQuery,
  useStartBattleMutation,
  useDeleteBattleMutation,
  useNextInitiativeMutation,
  useDamageMutation,
  useHealMutation,
  useUpdateCurrentStatsMutation,
} = battleApi;
