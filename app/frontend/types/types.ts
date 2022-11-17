// newテーブルスキーマ
export interface News {
  id: string
  content: string
  created_at: string
}

// news編集用テーブルスキーマ
export interface EditNews {
  id: string
  content: string
}

// taskテーブルスキーマ
export interface Task {
  id: string
  title: string
  created_at: string
  user_id: string
}

// task編集用テーブルスキーマ
export interface EditTask {
  id: string
  title: string
}
