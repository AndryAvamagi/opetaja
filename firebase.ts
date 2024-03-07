// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const auth = getAuth(app);
