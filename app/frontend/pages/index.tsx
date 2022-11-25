import { GetStaticProps } from 'next'
// キャッシュにあるデータを取得する関数オブジェクト
// hydrateとは潤す・水和という意味があり、キャッシュをデータで潤す=>イベントリスナ等のjavascriptがアタッチされたデータを取得する意味合いである
// 詳しい解説
// SSRにおいてサーバサイドでReactが生成したDOMを、renderToString()などで「文字列化」するのが脱水化(Dehydrate)で、
// それをうけとったブラウザがHTMLとしてパースして復活させたDOMの最後の段階でイベントを受けとれる生きたDOMとして再開させることをhydrateと呼びます。
import { QueryClient, useQueryClient } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import Auth from '../components/Auth'
import Layout from '../components/Layouts'
import { fetchNews } from '../hooks/useQueryNews'
import { News } from '../types/types'

export default function Home() {
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<News[]>('news')
  return (
    <Layout title="Home">
      {/* ニュース一覧を表示する */}
      <p className="mb-5 text-blue-500 text-xl">News list by SSG</p>
      {data?.map((news) => (
        <p key={news.id} className="font-bold">
          {news.content}
        </p>
      ))}
      <Auth />
    </Layout>
  )
}

/**
 * Home関数コンポーネントで表示するニュースを変数として渡す関数オブジェクト
 */
export const getStaticProps: GetStaticProps = async () => {
  // react-queryを使用するためのqueryClientインスタンスを定義する
  const queryClient = new QueryClient()
  // SSG（ビルド）やISRにおいて、GraphQLサーバーからニュースデータをフェッチし、キャッシュに保存する
  await queryClient.prefetchQuery('news', fetchNews)
  return {
    props: {
      // dehydrateはのちにhydrateで利用できるようになるデータを作り、キャッシュに格納される。
      // ReactアプリでDOMを構築する際にhydrateを使用することでキャッシュに格納されたデータを利用することができる
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 3,
  }
}
