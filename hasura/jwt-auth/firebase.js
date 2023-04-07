// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5SjUe_GK0LxkzCy4x40AXZl-jmHdmtSk",
  authDomain: "hasura-course-427ba.firebaseapp.com",
  projectId: "hasura-course-427ba",
  storageBucket: "hasura-course-427ba.appspot.com",
  messagingSenderId: "571103000868",
  appId: "1:571103000868:web:d742bb974d217b046bdbb1",
  measurementId: "G-TX7SD620KD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);