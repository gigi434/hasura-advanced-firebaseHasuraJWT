import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useUserChanged } from '../hooks/useUserChanged'
import { Provider } from 'react-redux'
import { store } from '../app/store'

export default function App({ Component, pageProps }: AppProps) {
  const {} = useUserChanged()
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
