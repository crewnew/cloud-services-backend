import React from 'react';
import { Form, Input, Button } from 'antd';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions'

const insertUserFunction = httpsCallable(getFunctions(), 'insertUser')

const Signup = () => {
    const [form] = Form.useForm();

    const onSubmit = (values) => {
        // Create the user in Firebase Auth
        createUserWithEmailAndPassword(auth, values.email, values.password)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;

                // Call a Cloud Function to update the user's first_name and last_name
                // const insertUser = insertUserFunction;
                // const result = await insertUser({
                //     uid: user.uid,
                //     email: values.email,
                //     first_name: values.first_name,
                //     last_name: values.last_name,
                // });
                // window.location.href = '/';
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use') {
                    alert('A user with the same email is already registered.');
                } else {
                    console.log(errorCode, errorMessage);
                }
            });
    };

    return (
        <main>
            <section>
                <div>
                    <div>
                        <h1>FocusApp</h1>
                        <Form form={form} onFinish={onSubmit}>
                            <Form.Item
                                label="Email address"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your email address',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Please enter a valid email address',
                                    },
                                ]}
                            >
                                <Input placeholder="Email address" />
                            </Form.Item>
                            <Form.Item
                                label="First name"
                                name="first_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your first name',
                                    },
                                ]}
                            >
                                <Input placeholder="First name" />
                            </Form.Item>
                            <Form.Item
                                label="Last name"
                                name="last_name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your last name',
                                    },
                                ]}
                            >
                                <Input placeholder="Last name" />
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Sign up
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Signup;
