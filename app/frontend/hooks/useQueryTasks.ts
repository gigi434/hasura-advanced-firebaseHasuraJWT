/* タスクのデータ参照用カスタムフック */
import { GraphQLClient } from 'graphql-request'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import Cookie from 'universal-cookie'
import { GET_TASKS } from '../queries/queries'
import { Task } from '../types/types'

// クッキーを利用するための初期化
const cookie = new Cookie()
// Hasuraのエンドポイント
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT || ''
// GraphQLClientの初期化
let graphqlClient: GraphQLClient

// フェッチ後の返り値を型定義する
interface TasksRes {
  tasks: Task[]
}

const fetchTasks = async () => {
  const { tasks: data } = await graphqlClient.request<TasksRes>(GET_TASKS)
  return data
}

export const useQueryTasks = () => {
  useEffect(() => {
    graphqlClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
    // ログ切り替えやログアウトした場合に新しいGraphQLクライアントを生成し直し、JWTトークンをクッキーに保存し直す
  }, [cookie.get('token')])
  return useQuery<Task[], Error>({
    queryKey: 'tasks',
    queryFn: fetchTasks,
    staleTime: 0,
  })
}
