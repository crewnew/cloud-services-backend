import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import app from './firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { message, Form, Input, Button } from 'antd';

function LoginPage() {
  const [user, setUser] = useState(null);
  const [shownAlreadyLoggedInMsg, setShownAlreadyLoggedInMsg] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    try {
      router.push('/');
      await app.auth().signInWithEmailAndPassword(values.email, values.password);
      // User is now logged in
    } catch (error) {
      message.error('Invalid email or password.');
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && !shownAlreadyLoggedInMsg) {
        router.push('/');
        setShownAlreadyLoggedInMsg(true);
        message.warning('You are already logged in.');
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div>
      <h1>Login</h1>
      <Form form={form} onFinish={handleLogin}>
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: 'The input is not a valid email address.',
            },
            {
              required: true,
              message: 'Please input your email address.',
            },
          ]}
        >
          <Input style={{ width: 300 }} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password.',
            },
          ]}
        >
          <Input.Password style={{ width: 300 }} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
        <Form.Item>
          <p>Don't have an account? <Button type="link" onClick={() => router.push('/register')}>Register</Button></p>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;
