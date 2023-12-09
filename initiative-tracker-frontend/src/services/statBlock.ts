import { api } from './api';

export const statBlockApi = api.injectEndpoints({
  endpoints: builder => ({
    getStatBlocks: builder.query<GetStatBlocksResponse, GetStatBlocksRequest>({
      query: request => ({
        url: 'statBlock',
        method: 'GET',
        params: request,
      }),
    }),
  }),
});

export interface GetStatBlocksRequest {}
export interface GetStatBlocksResponse {
  total: number;
  items: StatBlock[];
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

export const { useGetStatBlocksQuery } = statBlockApi;
