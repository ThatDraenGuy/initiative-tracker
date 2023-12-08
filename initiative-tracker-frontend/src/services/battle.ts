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
    deleteCharacter: builder.mutation<
        DeleteCharacterBattleResponse,
        DeleteCharacterBattleRequest
    >({
      query: request => ({
        url: 'battle/' + request.characterId + '/end',
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
  }),
});

export interface GetBattlesRequest {}

export interface GetBattlesResponse {
  total: number;
  items: Battle[];
}

export interface DeleteCharacterBattleRequest {
  characterId: number;
}

export interface DeleteCharacterBattleResponse {}


export interface StartBattleRequest {
  characterIds: number[];
}

export type StartBattleResponse = Battle;

export interface Battle {
  id: number;
  roundNumber: number;
  characterAmount: number;
  currentCharacterIndex: number;
}

export const { useGetBattlesQuery, useStartBattleMutation, useDeleteCharacterMutation } = battleApi;
