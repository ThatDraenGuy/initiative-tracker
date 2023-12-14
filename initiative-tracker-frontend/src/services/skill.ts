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
    createSkill: builder.mutation<CreateSkillResponse, CreateSkillRequest>({
      query: request => ({
        url: `skill`,
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getSkills'],
    }),
    deleteSkill: builder.mutation<DeleteSkillResponse, DeleteSkillRequest>({
      query: request => ({
        url: `skill/${request.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['getSkills'],
    }),
  }),
});

export interface GetSkillsRequest {}

export interface GetSkillsResponse {
  total: number;
  items: Skill[];
}

export interface CreateSkillRequest {
  name: string;
  abilityId: number;
}

export type CreateSkillResponse = Skill;

export interface DeleteSkillRequest {
  id: number;
}

export interface DeleteSkillResponse {
  id: number;
}

export interface Skill {
  id: number;
  name: string;
  ability: Ability;
}

export const {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useDeleteSkillMutation,
} = skillApi;
