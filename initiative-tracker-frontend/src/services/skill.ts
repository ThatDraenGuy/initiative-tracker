import { Ability } from './ability';
import { api } from './api';

const skillApi = api.injectEndpoints({
  endpoints: builder => ({
    getSkills: builder.query<GetSkillsResponse, GetSkillsRequest>({
      query: request => ({
        url: 'skill',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getSkills'],
    }),
  }),
});

export interface GetSkillsRequest {}
export interface GetSkillsResponse {
  total: number;
  items: Skill[];
}

export interface Skill {
  id: number;
  name: string;
  ability: Ability;
}

export const { useGetSkillsQuery } = skillApi;
