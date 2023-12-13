import { api } from './api';
import { Player } from './player';
import { StatBlock, StatBlockBrief } from './statBlock';

export const characterApi = api.injectEndpoints({
  endpoints: builder => ({
    getCharactersBrief: builder.query<
      GetCharactersBriefResponse,
      GetCharactersBriefRequest
    >({
      query: request => ({
        url: 'characterBrief',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getCharactersBrief'],
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
      invalidatesTags: ['getCharacters', 'getCharactersBrief'],
    }),
    deleteCharacter: builder.mutation<
      DeleteCharacterResponse,
      DeleteCharacterRequest
    >({
      query: request => ({
        url: `character/${request.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getCharacters', 'getCharactersBrief'],
    }),
  }),
});

export interface GetCharactersBriefRequest {}

export interface GetCharactersBriefResponse {
  total: number;
  items: CharacterBrief[];
}

export interface CreateCharacterRequest {
  playerId?: number;
  statBlockId: number;
}
export type CreateCharacterResponse = CharacterBrief;

export interface DeleteCharacterRequest {
  id: number;
}
export interface DeleteCharacterResponse {}

export interface CharacterBrief {
  id: number;
  player?: Player;
  statBlock: StatBlockBrief;
}

export interface Character {
  id: number;
  player?: Player;
  statBlock: StatBlock;
}

export const {
  useGetCharactersBriefQuery,
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
} = characterApi;
