// require('dotenv').config(); fuck require

var firebaseConfig = {
    apiKey: "AIzaSyBfmsalWg8UIRmKa_YxTGUpnYyoGR-t4kI",
    authDomain: "hasura-minimal-implementation.firebaseapp.com",
    projectId: "hasura-minimal-implementation",
    storageBucket: "hasura-minimal-implementation.appspot.com",
    messagingSenderId: "928141011357",
    appId: "1:928141011357:web:e477765f83ccd626de6774",
    measurementId: "G-K8CNKY88S2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Register and login

const auth = firebase.auth();
async function register() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	try {
		const userCredential = await auth.createUserWithEmailAndPassword(email, password);
		console.log("User created successfully", userCredential);
	} catch (error) {
		console.log("Error while creating user", error);
	}
}

async function login() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	try {
		const userCredential = await auth.signInWithEmailAndPassword(email, password);
		const jwttoken = await userCredential.user.getIdToken();
		console.log("User logged in successfully", jwttoken);
	} catch (error) {
		console.log("Error while logging in user", error);
	}
}