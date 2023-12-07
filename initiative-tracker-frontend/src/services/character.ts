import { api } from './api';

export const characterApi = api.injectEndpoints({
  endpoints: builder => ({
    getCharacters: builder.query<GetCharactersResponse, GetCharactersRequest>({
      query: request => ({
        url: 'battle',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getBattles'],
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
  playerName?: string;
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

export const { useGetCharactersQuery } = characterApi;
