// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArBh0CLTP4LQHNeeTkYZrHgEC8rj0tUuc",
  authDomain: "opetajapaneel.firebaseapp.com",
  projectId: "opetajapaneel",
  storageBucket: "opetajapaneel.appspot.com",
  messagingSenderId: "952874758659",
  appId: "1:952874758659:web:b654c627621fe6aaa6d436",
  measurementId: "G-5CNYTKMZFY"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// kui getApps().length === 0 siis firebase_app väärtus  initializeApp(firebaseConfig), else getApps()[0]

export default firebase_app;