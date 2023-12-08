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

export const { useGetBattlesQuery, useStartBattleMutation } = battleApi;
