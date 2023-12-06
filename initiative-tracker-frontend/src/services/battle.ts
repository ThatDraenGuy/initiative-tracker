import { api } from './api';

export const battleApi = api.injectEndpoints({
  endpoints: builder => ({
    getBattles: builder.query<GetBattlesResponse, GetBattlesRequest>({
      query: request => ({
        url: 'battle',
        params: request,
      }),
      providesTags: ['getBattles'],
    }),
  }),
});

export interface GetBattlesRequest {}

export interface GetBattlesResponse {
  total: number,
  items: Battle[]
}

export interface Battle {
  id: number,
  roundNumber: number,
  characterAmount: number,
  currentCharacterIndex: number,
}

export const { useGetBattlesQuery } = battleApi;
