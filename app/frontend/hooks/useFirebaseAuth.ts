import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import firebase from '../firebaseConfig'

/**
 * ユーザーの名前、EメールをFirebaseに送信するためのカスタムフック
 * @params none
 * @returns email ユーザーのEメールアドレス
 * @returns password ユーザーのパスワード
 */
export const useFirebaseAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // ログインしているかしていないかのフック
  const [isLogin, setIsLogin] = useState(true)

  /**
   * ユーザーがEmailを入力した際に値を反映するイベントハンドラー
   */
  const emailChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }, [])

  /**
   * ユーザーがpasswordを入力した際に値を反映するイベントハンドラー
   */
  const passwordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])
  // Emailとpasswordの値を初期化する関数オブジェクト
  const resetInput = useCallback(() => {
    setEmail('')
    setPassword('')
  }, [])
  //　trueであるとログインをするか、falseであるとユーザー新規登録を行うかのフラグ
  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin)
  }, [isLogin])

  /**
   * Submitボタンを押した際にサインインもしくはサインアップを行う関数オブジェクト
   * @params e Submitボタンに入力されたイベントオブジェクト
   * @returns none
   */
  const authUser = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // ログインをする場合、Firebaseのログインメソッドを実行する
      if (isLogin) {
        try {
          await firebase.auth().signInWithEmailAndPassword(email, password)
        } catch (err: any) {
          alert(err.message)
        }
        // ログイン実行後、emailとpasswordの値を初期化する
        resetInput()
        // ユーザー新規登録を行う場合、Firebaseのサインアップメソッドを実行する
      } else {
        try {
          await firebase.auth().createUserWithEmailAndPassword(email, password)
        } catch (err: any) {
          alert(err.message)
        }
        // ログイン実行後、emailとpasswordの値を初期化する
        resetInput()
      }
    },
    [email, password, isLogin]
  )
  return {
    email,
    password,
    emailChange,
    passwordChange,
    resetInput,
    isLogin,
    toggleMode,
    authUser,
  }
}
