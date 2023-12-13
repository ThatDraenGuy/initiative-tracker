import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { message } from '../App';

const API_URL = 'http://127.0.0.1:8080/api/';

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
});
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    message.error(result.error.data);
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: [
    'getAbilities',
    'getBattles',
    'getBattlesBrief',
    'getCharacters',
    'getCharactersBrief',
    'getPlayers',
    'getStatBlocks',
    'getStatBlocksBrief',
    'getSkills',
    'getDamageTypes',
    'getCreatureTypes',
  ],
  endpoints: () => ({}),
});
