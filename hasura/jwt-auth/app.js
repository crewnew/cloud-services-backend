// Replace with your Firebase Config object
var firebaseConfig = {
    apiKey: "AIzaSyA5SjUe_GK0LxkzCy4x40AXZl-jmHdmtSk",
    authDomain: "hasura-course-427ba.firebaseapp.com",
    projectId: "hasura-course-427ba",
    storageBucket: "hasura-course-427ba.appspot.com",
    messagingSenderId: "571103000868",
    appId: "1:571103000868:web:d742bb974d217b046bdbb1"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  
  async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      console.log("User registered:", userCredential);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }
  
  async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      console.log("User logged in, JWT token:", token);
      // Now you can use the JWT token to authenticate with Hasura
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  }
  