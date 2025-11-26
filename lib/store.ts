import { configureStore } from '@reduxjs/toolkit'

import tshirtReducer from './features/tshirtSlice'

export const store = configureStore({
  reducer: {
    tshirt: tshirtReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
