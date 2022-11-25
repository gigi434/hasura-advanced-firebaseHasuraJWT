import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Hydrate } from 'react-query/hydration'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import { useUserChanged } from '../hooks/useUserChanged'

export default function App({ Component, pageProps }: AppProps) {
  useUserChanged()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // `false` ならば、失敗したクエリはデフォルトで再試行されない。
            retry: false,
            // `true` に設定すると、データが古くなった場合に再接続時にクエリを再取得する。
            refetchOnWindowFocus: false,
          },
        },
      })
  )
  return (
    <QueryClientProvider client={queryClient}>
      {/* SSG（ビルド時）やISRにおいて、キャッシュとしてindex.jsonのpagePropsオブジェクトのプロパティに格納されるため、stateに渡す */}
      <Hydrate state={pageProps.dehydratedState}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Hydrate>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
