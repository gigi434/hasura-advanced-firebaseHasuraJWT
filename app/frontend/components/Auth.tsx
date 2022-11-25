import {
  ChevronDoubleRightIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/solid'
import Link from 'next/link'
import firebase from '../firebaseConfig'
import { useFirebaseAuth } from '../hooks/useFirebaseAuth'

const Auth = () => {
  // Firebaseから現在のユーザー情報を取得する
  const user = firebase.auth().currentUser
  const {
    email,
    password,
    emailChange,
    passwordChange,
    isLogin,
    toggleMode,
    authUser,
  } = useFirebaseAuth()
  return (
    <>
      <form
        onSubmit={authUser}
        className="mt-8 flex flex-col justify-center items-center"
      >
        {/* Eメールの入力欄 */}
        <label>Email:</label>
        <input
          type="email"
          className="my-3 px-3 py-1 border border-gray-300"
          placeholder="email"
          value={email}
          onChange={emailChange}
        />
        {/* パスワードの入力欄 */}
        <label>Password:</label>
        <input
          type="password"
          className="my-3 px-3 py-1 border border-gray-300"
          value={password}
          placeholder="password"
          onChange={passwordChange}
        />
        {/* Submitボタン */}
        <button
          disabled={!email || !password}
          type="submit"
          className="disabled:opacity-40 mt-5 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded focus:outline-none"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <SwitchVerticalIcon
        className="my-5 h-5 w-5 text-blue-500 cursor-pointer"
        onClick={toggleMode}
      />
      {/* ログインしてるならtasksページへのリンクを表示する */}
      {user && (
        <Link href="/tasks" passHref>
          <div className="flex items-center cursor-pointer my-3">
            <ChevronDoubleRightIcon className="h-5 w-5 mx-1 text-blue-500" />
            <span>to tasks page</span>
          </div>
        </Link>
      )}
    </>
  )
}

export default Auth
