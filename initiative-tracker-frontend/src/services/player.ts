import { api } from './api';

export const playerApi = api.injectEndpoints({
  endpoints: builder => ({
    getPlayers: builder.query<GetPlayersResponse, GetPlayersRequest>({
      query: request => ({
        url: 'player',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getPlayers'],
    }),
  }),
});

export interface GetPlayersRequest {}
export interface GetPlayersResponse {
  total: number;
  items: Player[];
}

export interface Player {
  id: number;
  name: string;
}

export const { useGetPlayersQuery } = playerApi;
