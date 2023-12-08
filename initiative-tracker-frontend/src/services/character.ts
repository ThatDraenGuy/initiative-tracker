import { api } from './api';
import { Player } from './player';

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

export interface CreateCharacterRequest {}
export interface CreateCharacterResponse {}

export interface Character {
  id: number;
  player?: Player;
  statBlock: StatBlock;
}

export interface StatBlock {
  id: number;
  entityName: string;
  hitPoints: number;
  hitDiceType?: number;
  hitDiceCount?: number;
  armorClass: number;
  speed: number;
  level: number;
  creatureType: CreatureType;
}

export interface CreatureType {
  id: number;
  name: string;
}

export const { useGetCharactersQuery, useCreateCharacterMutation } =
  characterApi;
