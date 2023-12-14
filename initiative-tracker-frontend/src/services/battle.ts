import { api } from './api';

export const battleApi = api.injectEndpoints({
  endpoints: builder => ({
    getBattles: builder.query<GetBattlesResponse, GetBattlesRequest>({
      query: request => ({
        url: 'battle',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getBattles'],
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
      invalidatesTags: ['getBattles'],
    }),
    startBattle: builder.mutation<StartBattleResponse, StartBattleRequest>({
      query: request => ({
        url: 'battle/start',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getBattles'],
    }),
    nextInitiative: builder.mutation<
      NextInitiativeResponse,
      NextInitiativeRequest
    >({
      query: request => ({
        url: `battle/${request}/nextInitiative`,
        method: 'POST',
      }),
      invalidatesTags: ['getBattles'],
    }),
  }),
});

export interface GetBattlesRequest {}

export interface GetBattlesResponse {
  total: number;
  items: Battle[];
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

export type StartBattleResponse = Battle;

export type NextInitiativeRequest = number;
export interface NextInitiativeResponse {}

export interface Battle {
  id: number;
  roundNumber: number;
  characterAmount: number;
  currentCharacterIndex: number;
}

export const {
  useGetBattlesQuery,
  useGetBattleByIdQuery,
  useStartBattleMutation,
  useDeleteBattleMutation,
  useNextInitiativeMutation,
} = battleApi;
