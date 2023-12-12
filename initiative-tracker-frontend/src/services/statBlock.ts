import { AbilityScore } from './abilityScore';
import { api } from './api';
import { CreatureType } from './creatureType';
import { DamageTypeModifier } from './damageTypeModifier';
import { Skill } from './skill';

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
      providesTags: ['getStatBlocksBrief'],
    }),
    getStatBlocks: builder.query<GetStatBlocksResponse, GetStatBlocksRequest>({
      query: request => ({
        url: 'statBlock',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getStatBlocks'],
    }),
    createStatBlock: builder.mutation<
      CreateStatBlockResponse,
      CreateStatBlockRequest
    >({
      query: request => ({
        url: 'statBlock',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['getStatBlocks', 'getStatBlocksBrief'],
    }),
  }),
});

export interface GetStatBlocksBriefRequest {}
export interface GetStatBlocksBriefResponse {
  total: number;
  items: StatBlockBrief[];
}

export interface GetStatBlocksRequest {}
export interface GetStatBlocksResponse {
  total: number;
  items: StatBlock[];
}

export interface CreateStatBlockRequest {
  entityName: string;
  hitPoints: number;
  hitDiceType?: number;
  hitDiceCount?: number;
  armorClass: number;
  speed: number;
  level: number;
  creatureType: { id: number };
  abilityScores: { ability: { id: number }; score: number }[];
  proficientSkills: { skill: { id: number } }[];
  damageTypeModifiers: { damageType: { id: number }; modifier: number }[];
}
export type CreateStatBlockResponse = StatBlock;

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

export interface StatBlock extends StatBlockBrief {
  abilityScores: AbilityScore[];
  proficientSkills: Skill[];
  damageTypeModifiers: DamageTypeModifier[];
}

export const {
  useGetStatBlocksBriefQuery,
  useGetStatBlocksQuery,
  useCreateStatBlockMutation,
} = statBlockApi;
