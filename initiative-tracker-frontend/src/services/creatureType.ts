import { api } from './api';

const creatureTypeApi = api.injectEndpoints({
  endpoints: builder => ({
    getCreatureTypes: builder.query<
      GetCreatureTypeResponse,
      GetCreatureTypeRequest
    >({
      query: request => ({
        url: 'creatureType',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getCreatureTypes'],
    }),
  }),
});

export interface GetCreatureTypeRequest {}
export interface GetCreatureTypeResponse {
  total: number;
  items: CreatureType[];
}

export interface CreatureType {
  id: number;
  name: string;
}

export const { useGetCreatureTypesQuery } = creatureTypeApi;
