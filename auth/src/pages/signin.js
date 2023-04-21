import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    onAuthStateChanged(auth, (user) => {
        console.log(user);
        if (user) {
            window.location.href = '/';
            // Pop up a message to the user that they are already logged in
            alert('You are already logged in.');
        }
    });
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // If the user is not found or the password is wrong, display an error message
                if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
                    alert('Wrong credentials.');
                } else {
                    alert(errorMessage);
                }
            });


    }

    return (
        <>
            <main >
                <section>
                    <div>
                        <p> FocusApp </p>

                        <form>
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Email address"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <button
                                    onClick={onLogin}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Login