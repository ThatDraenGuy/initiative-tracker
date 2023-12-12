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
  }),
});

export interface GetDamageTypesRequest {}
export interface GetDamageTypesResponse {
  total: number;
  items: DamageType[];
}

export interface DamageType {
  id: number;
  name: string;
}

export const { useGetDamageTypesQuery } = damageTypeApi;
