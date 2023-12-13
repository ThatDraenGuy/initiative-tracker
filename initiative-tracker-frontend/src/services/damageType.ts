import { api } from './api';

const damageTypeApi = api.injectEndpoints({
  endpoints: builder => ({
    getDamageTypes: builder.query<
      GetDamageTypesResponse,
      GetDamageTypesRequest
    >({
      query: request => ({
        url: 'damageType',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getDamageTypes'],
    }),
    createDamageType: builder.mutation<CreateDamageTypeResponse, CreateDamageTypeRequest>({
      query: request => ({
        url: `damageType`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getDamageTypes'],
    }),
    deleteDamageType: builder.mutation<DeleteDamageTypeResponse, DeleteDamageTypeRequest>({
      query: request => ({
        url: `damageType/${request.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getDamageTypes'],
    }),

  }),
});

export interface GetDamageTypesRequest {}
export interface GetDamageTypesResponse {
  total: number;
  items: DamageType[];
}

export interface CreateDamageTypeRequest {
  name: string;
}

export type CreateDamageTypeResponse = DamageType;

export interface DeleteDamageTypeRequest {
  id: number;
}

export interface DeleteDamageTypeResponse {}

export interface DamageType {
  id: number;
  name: string;
}

export const { useGetDamageTypesQuery, useCreateDamageTypeMutation, useDeleteDamageTypeMutation } = damageTypeApi;
