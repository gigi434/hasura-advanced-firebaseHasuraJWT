// firebaseのコンフィグファイル
import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

// firebaseの初期化
// firebaseが既に初期化されている場合は既存のappを使用する
!firebase.apps.length
  ? firebase.initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREABASE_APIKEY,
      authDomain: process.env.NEXT_PUBLIC_FIREABASE_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREABASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREABASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREABASE_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREABASE_APP_ID,
    })
  : firebase.app()

export default firebase
