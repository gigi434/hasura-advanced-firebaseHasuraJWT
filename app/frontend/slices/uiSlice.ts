// 編集中のNewsとTaskを管理できる登録ユーザーをグローバルステートで管理する
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EditNews, EditTask } from '../types/types'
import { RootState } from '../app/store'

// reduxのグローバルステートで管理する変数名を定義する
export interface uiState {
  editedTask: EditTask
  editedNews: EditNews
}

// uiStateの初期化
const initialState: uiState = {
  editedTask: {
    id: '',
    title: '',
  },
  editedNews: {
    id: '',
    content: '',
  },
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 編集中のタスクを更新する
    setEditedTask: (state, action: PayloadAction<EditTask>) => {
      state.editedTask = action.payload
    },
    // タスクの編集をキャンセルし、更新前に戻す
    resetEditedTask: (state) => {
      state.editedTask = initialState.editedTask
    },
    // 編集中のニュースを更新する
    setEditedNews: (state, action: PayloadAction<EditNews>) => {
      state.editedNews = action.payload
    },
    // ニュースの更新をキャンセルし、更新前に戻す
    resetEditedNews: (state) => {
      state.editedNews = initialState.editedNews
    },
  },
})

export const {
  setEditedTask,
  resetEditedTask,
  setEditedNews,
  resetEditedNews,
} = uiSlice.actions

// コンポーネントからグローバルステートを参照できる関数オブジェクトを定義する
// 例） selectTask(task: editedTask) => { id: ..., content: ...}
export const selectTask = (state: RootState) => state.ui.editedTask
export const selectNews = (state: RootState) => state.ui.editedNews

export default uiSlice.reducer
