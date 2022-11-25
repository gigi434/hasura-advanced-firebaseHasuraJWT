import { request } from 'graphql-request'
import { useQuery } from 'react-query'
import { GET_NEWS } from '../queries/queries'
import { News } from '../types/types'

interface NewsRes {
  news: News[]
}

export const fetchNews = async () => {
  const { news: data } = await request<NewsRes>(
    // undefined型はstring型に割り当てられないエラーが出るため、undefined型とstring型のユニオン型にした
    process.env.NEXT_PUBLIC_HASURA_ENDPOINT || '',
    GET_NEWS
  )
  return data
}

export const useQueryNews = () => {
  return useQuery<News[], Error>({
    // サーバーからフェッチしたデータをキャッシュに格納し、データを参照する
    queryKey: 'news',
    queryFn: fetchNews,
    staleTime: Infinity,
  })
}
