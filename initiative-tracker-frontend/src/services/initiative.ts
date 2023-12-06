import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_URL = 'https://localhost:8080/api'

export const initiativeApi = createApi({
    reducerPath: 'initiativeApi',
    baseQuery: fetchBaseQuery({ baseUrl:  API_URL }),
    endpoints: (_builder) => ({
        //TODO
    })
})