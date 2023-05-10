import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import insertUser from '../fetch/index.js';
import app from './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { message } from 'antd';
import { onAuthStateChanged } from "firebase/auth";

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [shownAlreadyLoggedInMsg, setShownAlreadyLoggedInMsg] = useState(false);
    const [name, setName] = useState('');
    const [user, setUser] = useState(null);
    const router = useRouter();
    const auth = getAuth(app);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/');
            // Get firebase uid
            const uid = auth.currentUser.uid;
            // Insert user into database
            await insertUser(name, email, uid);
            // User is now registered and logged in
        } catch (error) {
            // If password is too weak
            if (error.code === 'auth/weak-password') {
                message.error('Password should be at least 6 characters.');
            }
            // If email is invalid
            else if (error.code === 'auth/invalid-email') {
                message.error('Invalid email.');
            }
            // If email is already in use
            else if (error.code === 'auth/email-already-in-use') {
                message.error('Email already in use.');
            }
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user && !shownAlreadyLoggedInMsg) {
                setShownAlreadyLoggedInMsg(true);
                router.push('/');
                message.warning('You are already logged in.');
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default RegisterPage;
