import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { initiativeApi } from './services/initiative'

export const store = configureStore({
  reducer: {
    [initiativeApi.reducerPath]: initiativeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(initiativeApi.middleware),
})

setupListeners(store.dispatch)