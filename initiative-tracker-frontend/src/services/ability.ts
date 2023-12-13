import {api} from './api';

const abilityApi = api.injectEndpoints({
    endpoints: builder => ({
        getAbilities: builder.query<GetAbilitiesResponse, GetAbilitiesRequest>({
            query: request => ({
                url: 'ability',
                method: 'GET',
                params: request,
            }),
            providesTags: ['getAbilities'],
        }),
        createAbility: builder.mutation<CreateAbilityResponse, CreateAbilityRequest>({
            query: request => ({
                url: `ability`,
                method: 'POST',
                body: request,
            }),
            invalidatesTags: ['getAbilities'],
        }),
        deleteAbility: builder.mutation<DeleteAbilityResponse, DeleteAbilityRequest>({
            query: request => ({
                url: `ability/${request.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['getAbilities'],
        }),
    }),
});

export interface Ability {
    id: number;
    name: string;
}

export interface GetAbilitiesRequest {
}

export interface GetAbilitiesResponse {
    total: number;
    items: Ability[];
}

export interface CreateAbilityRequest {
    name: string;
}

export type CreateAbilityResponse = Ability;

export interface DeleteAbilityRequest {
    id: number;
}

export interface DeleteAbilityResponse {
}


export const {useGetAbilitiesQuery, useCreateAbilityMutation, useDeleteAbilityMutation} = abilityApi;
