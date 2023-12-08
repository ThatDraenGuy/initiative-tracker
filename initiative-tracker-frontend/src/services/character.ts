import { api } from './api';

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
  }),
});

export interface GetCharactersRequest {}

export interface GetCharactersResponse {
  total: number;
  items: Character[];
}

export interface Character {
  id: number;
  player?: Player;
  statBlock: StatBlock;
}

export interface Player {
  id: number;
  name: string;
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

export const { useGetCharactersQuery } = characterApi;
