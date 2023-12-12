import { api } from './api';

const abilityApi = api.injectEndpoints({
  endpoints: builder => ({
    getAbilities: builder.query<GetAbilitiesResponse, GetAbilitiesRequest>({
      query: request => ({
        url: 'ability',
        method: 'GET',
        params: request,
      }),
    }),
  }),
});

export interface GetAbilitiesRequest {}
export interface GetAbilitiesResponse {
  total: number;
  items: Ability[];
}

export interface Ability {
  id: number;
  name: string;
}

export const { useGetAbilitiesQuery } = abilityApi;
