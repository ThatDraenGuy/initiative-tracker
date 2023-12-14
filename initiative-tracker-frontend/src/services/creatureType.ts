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
    createCreatureType: builder.mutation<
      CreateCreatureTypeResponse,
      CreateCreatureTypeRequest
    >({
      query: request => ({
        url: `creatureType`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getCreatureTypes'],
    }),
    deleteCreatureType: builder.mutation<
      DeleteCreatureTypeResponse,
      DeleteCreatureTypeRequest
    >({
      query: request => ({
        url: `creatureType/${request.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getCreatureTypes'],
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

export interface CreateCreatureTypeRequest {
  name: string;
}

export type CreateCreatureTypeResponse = CreatureType;

export interface DeleteCreatureTypeRequest {
  id: number;
}

export interface DeleteCreatureTypeResponse {}

export const {
  useGetCreatureTypesQuery,
  useCreateCreatureTypeMutation,
  useDeleteCreatureTypeMutation,
} = creatureTypeApi;
