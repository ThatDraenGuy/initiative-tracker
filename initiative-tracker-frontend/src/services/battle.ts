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
    postStartBattle: builder.mutation<
      PostStartBattleResponse,
      PostStartBattleRequest
    >({
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

export interface PostStartBattleRequest {
  characterIds: number[];
}

export interface PostStartBattleResponse {}

export interface Battle {
  id: number;
  roundNumber: number;
  characterAmount: number;
  currentCharacterIndex: number;
}

export const { useGetBattlesQuery, usePostStartBattleMutation } = battleApi;
