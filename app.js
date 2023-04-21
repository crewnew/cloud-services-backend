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

function deletableElements() {
	const deletableElements = document.getElementsByTagName("p");
	while(deletableElements.length > 0){
		deletableElements[0].parentNode.removeChild(deletableElements[0]);
	}
}

async function register() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	try {
		const userCredential = await auth.createUserWithEmailAndPassword(email, password);
		
		deletableElements();

		const successElement = document.createElement("p");
		const successText = document.createTextNode("User created successfully");
		successElement.classList.add("success");
		successElement.appendChild(successText);
		const element = document.getElementById("login")
		element.appendChild(successElement);
		console.log("User created successfully", userCredential);
	} catch (error) {
		deletableElements();

		const errorElement = document.createElement("p");
		const errorText = document.createTextNode(error);
		errorElement.classList.add("error");
		errorElement.appendChild(errorText);
		const element = document.getElementById("login")
		element.appendChild(errorElement);
	}
}

async function login() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;
	try {
		const userCredential = await auth.signInWithEmailAndPassword(email, password);
		const jwttoken = await userCredential.user.getIdToken();
		deletableElements();

		const successElement = document.createElement("p");
		const successText = document.createTextNode("User logged in successfully");
		successElement.classList.add("success");
		successElement.appendChild(successText);
		const element = document.getElementById("login")
		element.appendChild(successElement);
		console.log("User logged in successfully", jwttoken);
	} catch (error) {
		deletableElements();

		const errorElement = document.createElement("p");
		const errorText = document.createTextNode(error);
		errorElement.classList.add("error");
		errorElement.appendChild(errorText);
		const element = document.getElementById("login")
		element.appendChild(errorElement);
		console.log("Error while logging in user", error);
	}
}