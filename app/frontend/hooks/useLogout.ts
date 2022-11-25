import { useQueryClient } from 'react-query'
import { useDispatch } from 'react-redux'
import Cookie from 'universal-cookie'
import firebase from '../firebaseConfig'
import { resetEditedTask, resetEditedNews } from '../slices/uiSlice'
import { unSubMeta } from './useUserChanged'

// クッキーの初期化
const cookie = new Cookie()
/**
 * ログアウト時にユーザーアカウントを匿名に変更するカスタムフック
 * @params none
 * @returns logout 現在ログインしているアカウントの認証解除を行う関数オブジェクト
 */
export const useLogout = () => {
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const logout = async () => {
    // ドキュメントの監視を停止する関数オブジェクトがある場合、ドキュメントの監視を停止する
    if (unSubMeta) {
      unSubMeta()
    }
    // グローバルステートを削除する
    dispatch(resetEditedTask)
    dispatch(resetEditedNews)
    // サインアウトメソッドを実行し、アカウントを匿名に変更する
    await firebase.auth().signOut()
    // react-queryのキャッシュを削除する
    queryClient.removeQueries('tasks')
    queryClient.removeQueries('news')
    // クッキーからJWTトークンを削除する
    cookie.remove('token')
  }
  return { logout }
}
