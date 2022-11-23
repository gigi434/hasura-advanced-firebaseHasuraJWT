/* タスクのデータ更新用カスタムフック */
import { useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import { GraphQLClient } from 'graphql-request'
import Cookie from 'universal-cookie'
import {
  CREATE_TASK,
  DELETE_TASK,
  UPDATE_TASK,
  CREATE_NEWS,
  DELETE_NEWS,
  UPDATE_NEWS,
} from '../queries/queries'
import { Task, EditTask, News, EditNews } from '../types/types'
import { useDispatch } from 'react-redux'
import { resetEditedTask, resetEditedNews } from '../slices/uiSlice'

// クッキーを利用するための初期化
const cookie = new Cookie()
// Hasuraのエンドポイントを定義する
const endpoint = process.env.NEXT_PUBLIC_HASURA_ENDPOINT || ''
// GraphQLClientを利用するための初期化
let graphQLClient: GraphQLClient

export const useAppMutate = () => {
  // reduxのdispatch関数オブジェクトを利用するためにdispatch関数オブジェクトを定義する
  const dispatch = useDispatch()
  // 既存のクッキーに保存されているキャッシュ情報を更新する場合は手動で定義する必要があるため、クッキー自体を利用するために初期化する
  const queryClient = useQueryClient()

  useEffect(() => {
    graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${cookie.get('token')}`,
      },
    })
    // ユーザーアカウント情報に変更があるたびにGraphQLクライアントインスタンスを生成し直し、クッキーにJWTトークンを保存し直す
  }, [cookie.get('token')])

  /**
   * @detail タスクの更新時に使用するカスタムフック
   * @param title string タスクの名前
   */
  const createTaskMutation = useMutation(
    (title: string) => graphQLClient.request(CREATE_TASK, { title: title }),
    {
      onSuccess: (res) => {
        // 更新前のタスクを定義する
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // もし更新前のタスクがあれば、更新前タスクと作成するタスクを新しい配列オブジェクトとして定義する
        if (previousTodos) {
          queryClient.setQueryData('tasks', [
            ...previousTodos,
            res.insert_tasks_one,
          ])
        }
        // 作成するタスクを空のオブジェクトにすることで、表示を空欄にする
        dispatch(resetEditedTask())
      },
    }
  )

  const updateTaskMutation = useMutation(
    (task: EditTask) => graphQLClient.request(UPDATE_TASK, task),
    {
      // resはuseMutationの第一引数で設定したmutationFnの返り値のこと
      // variablesはuseMutationの第一引数で設定されるmutateFn関数の引数のこと　この場合task: EditTaskである
      onSuccess: (res, variables) => {
        // 更新前に設定されていたタスクを定義する
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        // もし更新前に設定されていたタスクがあれば、更新前のタスクと更新後のタスクのid同士を比較し、等価であるなら内容を更新する
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map((task) =>
              task.id === variables.id ? res.updata_tasks_by_pk : task
            )
          )
        }
        dispatch(resetEditedTask())
      },
    }
  )

  const deleteTaskMutation = useMutation(
    (id: string) => graphQLClient.request(DELETE_TASK, { id: id }),
    {
      onSuccess: (res, variables) => {
        // 更新前に設定されていたタスクを定義する
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id === variables)
          )
        }
      },
    }
  )
  const createNewsMutation = useMutation(
    (content: string) =>
      graphQLClient.request(CREATE_NEWS, { content: content }),
    {
      onSuccess: (res) => {
        const previousNews = queryClient.getQueryData<News[]>('news')
        console.log(previousNews)
        if (previousNews) {
          queryClient.setQueryData('news', [
            ...previousNews,
            res.insert_news_one,
            console.log(res.insert_news_one),
          ])
        }
        dispatch(resetEditedNews())
      },
    }
  )
  const updateNewsMutation = useMutation(
    (news: EditNews) => graphQLClient.request(UPDATE_NEWS, news),
    {
      onSuccess: (res, variables) => {
        // 更新前に設定されていたタスクを定義する
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData<News[]>(
            'news',
            previousNews.map((news) =>
              news.id === variables.id ? res.update_news_by_pk : news
            )
          )
        }
        dispatch(resetEditedNews())
      },
    }
  )
  const deleteNewsMutation = useMutation(
    (id: string) => graphQLClient.request(DELETE_NEWS, { id: id }),
    {
      onSuccess: (res, variables) => {
        const previousNews = queryClient.getQueryData<News[]>('news')
        if (previousNews) {
          queryClient.setQueryData<News[]>(
            'news',
            previousNews.filter((news) => news.id !== variables)
          )
        }
        dispatch(resetEditedNews())
      },
    }
  )
  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    createNewsMutation,
    updateNewsMutation,
    deleteNewsMutation,
  }
}
