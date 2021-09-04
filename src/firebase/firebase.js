import firebase from 'firebase/app'
import "firebase/storage"
import "firebase/firestore"

const app = firebase.initializeApp({
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: process.env.VUE_APP_AUTH_DOMAIN,
    projectId: process.env.VUE_APP_PROJECT_ID,
    storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
    appId: process.env.VUE_APP_APP_ID
})

export const storage = app.storage()
export const firestore = app.firestore()
export const firebaseRef = firebase
export default app