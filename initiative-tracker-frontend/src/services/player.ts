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
    deletePlayer: builder.mutation<DeletePlayerResponse, DeletePlayerRequest>({
      query: request => ({
        url: 'player/' + request.id,
        method: 'DELETE',
      }),
      invalidatesTags: ['getPlayers'],
    }),
    createPlayer: builder.mutation<CreatePlayerResponse, CreatePlayerRequest>({
      query: request => ({
        url: 'player',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getPlayers'],
    }),
  }),
});

export interface GetPlayersRequest {}

export interface GetPlayersResponse {
  total: number;
  items: Player[];
}

export interface CreatePlayerRequest {
  name: string;
}

export type CreatePlayerResponse = Player;

export interface DeletePlayerRequest {
  id: number;
}

export interface DeletePlayerResponse {}

export interface Player {
  id: number;
  name: string;
}

export const {
  useGetPlayersQuery,
  useDeletePlayerMutation,
  useCreatePlayerMutation,
} = playerApi;
