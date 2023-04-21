// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: "AIzaSyDHuMgq2XKICAsJAjv-XNgahdmND8U1ysY",
    authDomain: "my-first-project-51388.firebaseapp.com",
    projectId: "my-first-project-51388",
    storageBucket: "my-first-project-51388.appspot.com",
    messagingSenderId: "576600472678",
    appId: "1:576600472678:web:d08f567bb8e262f4bc81a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;