import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Select, Table } from 'antd';
import { auth } from '../firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/functions';

const firebaseConfig = {
    apiKey: "AIzaSyDHuMgq2XKICAsJAjv-XNgahdmND8U1ysY",
    authDomain: "my-first-project-51388.firebaseapp.com",
    projectId: "my-first-project-51388",
    storageBucket: "my-first-project-51388.appspot.com",
    messagingSenderId: "576600472678",
    appId: "1:576600472678:web:d08f567bb8e262f4bc81a7"
};

firebase.initializeApp(firebaseConfig);

const { Option } = Select;

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();


    const getUsers = async (userId) => {
        // Call getAllUsers function from Firebase Functions
        const usersList = firebase.functions().httpsCallable('getAllUsers');
        const result = await usersList(userId);
        console.log(result.data);
        setUsers(result.data); // update state with the returned array of users
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsModalVisible(true);
        console.log("edit", user);
        form.setFieldsValue({
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
        });
    };

    const handleDeleteUser = async (user) => {
        const uid = user.uid;
        const deleteUser = firebase.functions().httpsCallable('deleteUser');
        const result = await deleteUser(uid);
        console.log(result.data);
        window.location.reload();
    };


    const handleSaveUser = async () => {
        try {
            const values = await form.validateFields();
            const updatedUser = {
                ...editingUser,
                firstName: values.first_name,
                lastName: values.last_name,
                role: values.role,
            };
            console.log("up", values);
            console.log("upda", updatedUser);
            // TODO: Update user in Firebase database
            const updateUser = firebase.functions().httpsCallable('updateUser');
            const result = await updateUser(updatedUser);
            console.log(result.data);
            setIsModalVisible(false);
            // window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const handleCancelEdit = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => `${record.first_name} ${record.last_name}`,
        },
        {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
        },
        {
            key: 'role',
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (record) => (
                <div>
                    <button onClick={() => handleEditUser(record)}>Edit</button>
                    <button onClick={() => handleDeleteUser(record)}>Delete</button>
                </div>
            ),
        },
    ];

    const addFakeUser = async () => {
        const fakeUser = firebase.functions().httpsCallable('addFakeUser');
        const result = await fakeUser();
        console.log(result.data);
        window.location.reload();
    };

    const data = users.map((user, index) => ({
        uid: user.uid,
        key: index,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
    }));


    return (
        <div>
            <h1>Admin Panel</h1>
            <Button type="primary" onClick={addFakeUser}>
                Add Fake User
            </Button>
            <Table columns={columns} dataSource={data} />
            <Modal
                title="Edit User"
                open={isModalVisible}
                onCancel={handleCancelEdit}
                onOk={handleSaveUser}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="first_name"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter first name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="last_name"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter last name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select>
                            <Option value="user">User</Option>
                            <Option value="admin">Admin</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminPanel;
