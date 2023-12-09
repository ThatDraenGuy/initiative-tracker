import { api } from './api';
import { Player } from './player';
import { StatBlock } from './statBlock';

export const characterApi = api.injectEndpoints({
  endpoints: builder => ({
    getCharacters: builder.query<GetCharactersResponse, GetCharactersRequest>({
      query: request => ({
        url: 'character',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getCharacters'],
    }),
    createCharacter: builder.mutation<
      CreateCharacterResponse,
      CreateCharacterRequest
    >({
      query: request => ({
        url: 'character',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getCharacters'],
    }),
  }),
});

export interface GetCharactersRequest {}

export interface GetCharactersResponse {
  total: number;
  items: Character[];
}

export interface CreateCharacterRequest {
  playerId?: number;
  statBlockId: number;
}
export type CreateCharacterResponse = Character;

export interface Character {
  id: number;
  player?: Player;
  statBlock: StatBlock;
}

export const { useGetCharactersQuery, useCreateCharacterMutation } =
  characterApi;
