import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Firebase Admin SDKを引数なしで初期化する
// 引数なしだとprocess.env.FIREBASE_CONFIG固有の環境変数が適用される
admin.initializeApp()

// 新規ユーザー作成時ユーザー認証のパケットにJWTトークンを埋め込み、Hasuraエンドポイントの認証で使用するJWTを作成する関数オブジェクトを定義する
// カスタムクレームとはユーザー情報データだけでなくアクセス制御に必要なデータを付与する機能のこと
export const setCustomClaims = functions.auth.user().onCreate(async (user) => {
  // 新規登録ユーザーに与える管理者権限とユーザーIDが定義された定数を定義する
  const customClaims = {
    'https://hasura.io/jwt/claims': {
      // クライアントからのユーザー権限指定がない場合、デフォルトで設定されるロールのこと。
      'x-hasura-default-role': 'staff',
      // Hasuraに存在するロール一覧のこと。今回はstaffしか使用しないためstaffだけである。
      'x-hasura-allowed-roles': ['staff'],
      // 新規登録ユーザーアカウント情報のこと。
      // これにより、tasksテーブルのColumn presetsで設定したuser_id列に対して
      // 自動的にFirebaseのユーザーIDが入力される
      'x-hasura-user-id': user.uid,
    },
  }
  // 新規登録ユーザーにリソースにアクセスするための管理者権限トークンを付与する
  try {
    await admin.auth().setCustomUserClaims(user.uid, customClaims)
    // カスタムクレームをユーザー情報に付与したことをイベントにしてアプリケーション側でハンドルするための通知を設定する
    // 具体的には、firestoreにユーザーのメタ情報を書き込み、ReactのonSnapShot機能を用いて更新がある場合フェッチする。
    // これにより、Firebaseでの認証とアプリケーションとの同期を可能にする
    await admin.firestore().collection('user_meta').doc(user.uid).create({
      // Firestoreのタイムスタンプを書き込む
      refreshTime: admin.firestore.FieldValue.serverTimestamp(),
    })
  } catch (err) {
    console.log(err)
  }
})
