import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { Button, Typography, Table } from 'antd';
import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDHuMgq2XKICAsJAjv-XNgahdmND8U1ysY",
    authDomain: "my-first-project-51388.firebaseapp.com",
    projectId: "my-first-project-51388",
    storageBucket: "my-first-project-51388.appspot.com",
    messagingSenderId: "576600472678",
    appId: "1:576600472678:web:d08f567bb8e262f4bc81a7"
};

firebase.initializeApp(firebaseConfig);

const { Title } = Typography;
const App = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [invoices, setInvoices] = useState([]);



    const handleGetUserRole = async (uid) => {
        try {
            const getUserRole = firebase.functions().httpsCallable('getUserRole');
            const result = await getUserRole({ uid });
            setUserRole(result.data);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSignIn = async () => {
        try {
            // Redirect to login page
            window.location.href = '/signin';
        } catch (error) {
            setError(error.message);
        }
    };

    const handleMakeMeAdmin = async () => {
        console.log('Make me admin');
        try {
            const uid = user.uid;
            const makeMeAdmin = firebase.functions().httpsCallable('makeMeAdmin');
            const result = await makeMeAdmin({ uid });
            // Refresh the page to get the updated user role
            window.location.reload();
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };
    const getInvoices = async () => {
        const user = firebase.auth().currentUser;
        if (!user) {
            throw new Error('User is not authenticated');
        }
        const accessToken = await user.getIdToken();
        console.log(accessToken);

        try {
            const getInvoices = firebase.functions().httpsCallable('getInvoices');
            const result = await getInvoices({ accessToken });
            setInvoices(result.data.invoices);
        } catch (error) {
            console.log(error);
            setError(error.message);
        }
    };



    const redirectToAdmin = () => {
        window.location.href = '/admin';
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                handleGetUserRole(user.uid);
                getInvoices();
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <Title level={2}>Welcome, {user.email}! Your role: {userRole}</Title>
                    <Button onClick={handleSignOut}>Sign out</Button>
                    {userRole === "admin" && <Button onClick={redirectToAdmin}>Admin Panel</Button>}
                    {userRole !== "admin" && <Button onClick={handleMakeMeAdmin}>Make me admin</Button>}
                    <Table dataSource={invoices}>
                        <Table.Column title="Date" dataIndex="date" key="date" />
                        <Table.Column title="Company ID" dataIndex="company_id" key="company_id" />
                        <Table.Column title="User ID" dataIndex="user_id" key="user_id" />
                        <Table.Column title="Amount" dataIndex="amount" key="amount" />
                        <Table.Column title="Status" dataIndex="status" key="status" />
                        <Table.Column title="Created At" dataIndex="created_at" key="created_at" />
                        <Table.Column title="Updated At" dataIndex="updated_at" key="updated_at" />
                    </Table>
                </div>
            ) : (
                <div>
                    <Title level={2}>You are not signed in.</Title>
                    <Button onClick={handleSignIn}>Sign in</Button>
                </div>
            )}
        </div>
    );
};

export default App;
