import { api } from './api';
import { Player } from './player';
import { StatBlockBrief } from './statBlock';

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
    deleteCharacter: builder.mutation<
      DeleteCharacterResponse,
      DeleteCharacterRequest
    >({
      query: request => ({
        url: `character/${request.id}`,
        method: 'DELETE',
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

export interface DeleteCharacterRequest {
  id: number;
}
export interface DeleteCharacterResponse {}

export interface Character {
  id: number;
  player?: Player;
  statBlock: StatBlockBrief;
}

export const {
  useGetCharactersQuery,
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
} = characterApi;
