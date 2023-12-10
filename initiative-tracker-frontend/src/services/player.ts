import { api } from './api';
import {DeleteBattleRequest, DeleteBattleResponse, StartBattleRequest, StartBattleResponse} from "./battle";

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
    deletePlayer: builder.mutation<
        DeletePlayerResponse,
        DeletePlayerRequest
    >({
      query: request => ({
        url: 'player/' + request.id + '/end',
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

export interface GetPlayersRequest {}
export interface GetPlayersResponse {
  total: number;
  items: Player[];
}

export interface CreatePlayerRequest {
  name: string
}

export type CreatePlayerResponse = Player

export interface DeletePlayerRequest {
  id: number
}

export interface DeletePlayerResponse {}

export interface Player {
  id: number;
  name: string;
}

export const { useGetPlayersQuery } = playerApi;
