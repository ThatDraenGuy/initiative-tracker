import { api } from './api';

export const statBlockApi = api.injectEndpoints({
  endpoints: builder => ({
    getStatBlocksBrief: builder.query<
      GetStatBlocksBriefResponse,
      GetStatBlocksBriefRequest
    >({
      query: request => ({
        url: 'statBlockBrief',
        method: 'GET',
        params: request,
      }),
    }),
  }),
});

export interface GetStatBlocksBriefRequest {}
export interface GetStatBlocksBriefResponse {
  total: number;
  items: StatBlockBrief[];
}

export interface StatBlockBrief {
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

export const { useGetStatBlocksBriefQuery } = statBlockApi;
