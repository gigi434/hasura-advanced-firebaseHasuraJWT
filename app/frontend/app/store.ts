import { configureStore } from '@reduxjs/toolkit'
import uiReducer from '../slices/uiSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
  },
})

// グローバルステートで定義されている変数の値の型を作成する
// 例）{ name: 'john' } => { name: string }
export type RootState = ReturnType<typeof store.getState>
