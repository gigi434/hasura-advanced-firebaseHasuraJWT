// ユーザーが新規登録やログイン、ログアウトなど行った際のFirebaseへのユーザー情報更新を行うカスタムフック
import { useEffect } from 'react'
import firebase from 'firebase'
import { useRouter } from 'next/dist/client/router'
import Cookie from 'universal-cookie'

/**
 * ユーザーのアカウント情報変更を監視するFirebaseのサブスクリプションを停止する関数オブジェクト
 * @params none
 * @returns none
 */
export let unSubMeta: () => void

/**
 * ユーザーのアカウント情報変更を検知してJWTトークンをクッキーに保存するカスタムフック
 * @params none
 * @returns unSubUser ログイン状態の監視を停止する関数オブジェクト
 */
export const useUserChanged = () => {
  // クッキーを利用できるように初期化を実行する
  const cookie = new Cookie()
  // ページ内を移動するために初期化を実行する
  const router = useRouter()
  //　FirebaseのFunctionで定義したJWTClaimsにトークンが定義されているか確認するための文字列を定義する
  const HASURA_TOKEN_KEY = 'https://hasura.io/jwt/claims'

  useEffect(() => {
    /**
     * ログイン状態を監視するサブスクリプションを停止する関数オブジェクトを定義する
     * @params user ログイン状態に変更があるユーザー
     * @returns unSubUser ログイン状態を監視するサブスクリプションを停止する関数オブジェクト
     */
    const unSubUser = firebase.auth().onAuthStateChanged(async (user) => {
      // もしユーザー情報の更新があればJWTトークンの更新を行う
      if (user) {
        // JWTをFirebaseに返を返し、有効期限に関係なくJWTトークンを更新する。その後、JWTを定義する
        const token = await user.getIdToken(true)
        // JWTトークンを取得する
        const idTokenResult = await user.getIdTokenResult()
        // JWTトークンにHasuraへのカスタムクレームが含まれているか判定する
        const hasuraClaims = idTokenResult.claims[HASURA_TOKEN_KEY]
        // もしJWTトークンにHasuraのカスタムクレームがあればクッキーにJWTトークンを保存する
        if (hasuraClaims) {
          // クッキーにJWTトークンを保存する
          cookie.set('token', token, { path: '/' })
          // タスクページに遷移する
          router.push('/tasks')
          // もしJWTトークンにHasuraのカスタムクレームがまだ保存されていなければ、FirebaseのonSnapShotメソッドによるユーザー情報変更検知を待つ
        } else {
          // ユーザー情報の更新があったユーザーのドキュメントを定義する
          const userRef = firebase
            .firestore()
            .collection('user_meta')
            .doc(user.uid)
          //　ドキュメントの監視を行い、更新がある場合JWTトークンをクッキーに保存し、タスクページに遷移する
          unSubMeta = userRef.onSnapshot(async () => {
            const tokenSnap = await user.getIdToken(true)
            const idTokenResultSnap = await user.getIdTokenResult()
            const hasuraClaimsSnap = idTokenResultSnap.claims[HASURA_TOKEN_KEY]
            if (hasuraClaimsSnap) {
              cookie.set('token', tokenSnap, { path: '/' })
              router.push('/tasks')
            }
          })
        }
      }
    })
    return () => {
      // コンポーネントがアンマウントされる前にクリーンアップ関数が実行されることによりメモリリークや不要な動作を防止する
      // ここでのクリーンアップ関数はサブスクリプションを停止するための監視を解除する
      unSubUser()
    }
  }, [])
  return {}
}
