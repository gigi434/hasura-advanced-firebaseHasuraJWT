import Cookie from 'universal-cookie'
import firebase from 'firebase'
import { unSubMeta } from './useUserChanged'

// クッキーの初期化
const cookie = new Cookie()
/**
 * ログアウト時にユーザーアカウントを匿名に変更するカスタムフック
 * @params none
 * @returns logout 現在ログインしているアカウントの認証解除を行う関数オブジェクト
 */
export const useLogout = () => {
  const logout = async () => {
    //　ドキュメントの監視を停止する関数オブジェクトがある場合、ドキュメントの監視を停止する
    if (unSubMeta) {
      unSubMeta()
    }
    // サインアウトメソッドを実行し、アカウントを匿名に変更する
    await firebase.auth().signOut()
    // クッキーからJWTトークンを削除する
    cookie.remove('token')
  }
  return { logout }
}
