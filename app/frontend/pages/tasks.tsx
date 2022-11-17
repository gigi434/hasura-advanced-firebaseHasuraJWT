import { ChevronDoubleLeftIcon, LogoutIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layouts'
import firebase from '../firebaseConfig'
import { useLogout } from '../hooks/useLogout'

const Tasks = () => {
  // 認証をトリガーにページ遷移させるために初期化する
  const router = useRouter()
  // ログアウトするために定義する
  const { logout } = useLogout()
  // 現在ログインしているユーザー情報を定義する
  const user = firebase.auth().currentUser

  return (
    <Layout title="tasks">
      {/* 現在ログインしているアカウント情報のEメールを表示する */}
      <p className="my-3">{user?.email}</p>
      {/* ログアウトボタンを表示する */}
      <LogoutIcon
        className="h-5 w-5 my-3 text-blue-500 cursor-pointer"
        onClick={() => {
          // ログアウトボタンを押された場合にログアウト関数を実行し、トップページへ遷移する
          logout()
          router.push('/')
        }}
      />
      {/* クリックするとトップページへ遷移する要素を表示する */}
      <Link href="/">
        <div className="mt-20 flex items-center cursor-pointer">
          <ChevronDoubleLeftIcon className="h-5 w-5 mx-1 text-blue-500" />
          <span>Back to main page</span>
        </div>
      </Link>
    </Layout>
  )
}

export default Tasks
