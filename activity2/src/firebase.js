import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDqDxkgEOm9Oh5IJeyXmQHuziG9ZXqBAzw',
  authDomain: 'ccs4500.firebaseapp.com',
  projectId: 'ccs4500',
  storageBucket: 'ccs4500.firebasestorage.app',
  messagingSenderId: '37518100156',
  appId: '1:37518100156:web:39ba1583d8622a0dacf2b9',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
