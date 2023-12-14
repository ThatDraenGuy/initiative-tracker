import { api } from './api';
import { Character } from './character';
import { CurrentStats } from './currentStats';

const initiativeEntryApi = api.injectEndpoints({
  endpoints: builder => ({
    getInitiativeEntries: builder.query<
      GetInitiativeEntriesResponse,
      GetInitiativeEntriesRequest
    >({
      query: request => ({
        url: 'initiativeEntry',
        method: 'GET',
        params: request,
      }),
      providesTags: ['getCurrentStats'],
    }),
  }),
});

export interface GetInitiativeEntriesRequest {
  battleId: number;
}
export interface GetInitiativeEntriesResponse {
  total: number;
  items: InitiativeEntry[];
}

export interface InitiativeEntry {
  character: Character;
  currentStats: CurrentStats;
  roll: number;
}

export const { useGetInitiativeEntriesQuery } = initiativeEntryApi;
