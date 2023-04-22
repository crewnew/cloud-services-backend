const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { request } = require('graphql-request');
const faker = require('faker');

admin.initializeApp();

const HASURA_GRAPHQL_ENDPOINT = 'https://national-vulture-91.hasura.app/v1/graphql';
const HASURA_ADMIN_SECRET = 'VuPrGyLPVuNTSmmd2fyPDoeV2V0kmttElE0ANIGtmstIvd28xYgSPR6DKgafWS4J';

exports.processSignUp = functions.auth.user().onCreate(async (user) => {
    const insertUserQuery = `
    mutation insertUser($uid: String!, $email: String!, $role: String!, $created_at: timestamptz!) {
        insert_users_one(object: {uid: $uid, email: $email, role: $role, created_at: $created_at}) {
          id
        }
      }
      
`;
    // Set custom claims with the "client" role
    await admin.auth().setCustomUserClaims(user.uid, {
        'https://hasura.io/jwt/claims': {
            'x-hasura-default-role': 'client',
            'x-hasura-allowed-roles': ['client']
        }
    });
    // Insert user information into the Hasura users table
    const userData = {
        uid: user.uid,
        email: user.email,
        role: 'client',
        created_at: new Date().toISOString()
    };
    await request(HASURA_GRAPHQL_ENDPOINT, insertUserQuery, userData, {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    });
});

exports.getAllUsers = functions.https.onCall(async () => {
    //Check if user have permission to access this function
    // Get all users from the Hasura users table
    const getUsersQuery = `
        query getUsers {
            users {
                id
                uid
                email
                display_name
                role
            }
        }
    `;

    const users = await request(HASURA_GRAPHQL_ENDPOINT, getUsersQuery, null, {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    }).then((data) => {
        return data.users;
    }).catch((error) => {
        console.log(error);
    });

    return users; // return the array of users
});

exports.deleteUser = functions.https.onCall(async (data) => {

    // Verify that the user exists in Firebase Authentication
    const id = data;

    // Delete user from the Hasura users table
    const deleteUserQuery = `
        mutation deleteUser($id: Int!) {
            delete_users_by_pk(id: $id) {
                id
            }
        }
    `;
    await request(HASURA_GRAPHQL_ENDPOINT, deleteUserQuery, { id: id }, {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    }).then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    });

    return { message: "User deleted successfully" };
});

// Get user role from the Hasura users table
exports.getUserRole = functions.https.onCall(async (data) => {
    const getUserRoleQuery = `
        query getUserRole($uid: String!) {
            users_by_pk(id: $id) {
                role
            }
        }
    `;

    const userRole = await request(HASURA_GRAPHQL_ENDPOINT, getUserRoleQuery, { id: data.id }, {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    }).then((data) => {
        return data.users_by_pk.role;
    }).catch((error) => {
        console.log(error);
    });

    return userRole;
});

exports.updateUser = functions.https.onCall(async (data) => {

    const email = data.email;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const role = data.role;

    // Display name = first name + last name
    const displayName = firstName + ' ' + lastName;

    const userRecord = await admin.auth().getUserByEmail(email);

    try {
        await admin.auth().updateUser(userRecord.uid, {
            displayName: displayName,
        });
    } catch (error) {
        console.log('Failed to update Firebase user', error);
        return { success: false, error: 'Failed to update Firebase user' };
    }

    const updateUserQuery = `
            mutation updateUser($email: String!, $firstName: String, $lastName: String, $role: String) {
                update_users(where: {email: {_eq: $email}}, _set: {first_name: $firstName, last_name: $lastName, role: $role}) {
                    returning {
                        uid
                        email
                        first_name
                        last_name
                        role
                    }
                }
            }
        `;

    const updatedUser = await request(HASURA_GRAPHQL_ENDPOINT, updateUserQuery, { email: email, firstName: firstName, lastName: lastName, role: role }, {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    }).then((data) => {
        return data.update_users.returning[0];
    }).catch((error) => {
        console.log('Failed to update Hasura user', error);
        return { success: false, error: 'Failed to update Hasura user' };
    });

    return updatedUser;
});


// Firebase Cloud Function to generate and add fake user data
exports.addFakeUser = functions.https.onCall(async () => {
    // Generate fake user data
    const email = faker.internet.email();
    const password = faker.internet.password();
    const displayName = 'fake user';
    const role = 'client';

    // Create user in Firebase Authentication table
    const userRecord = await admin.auth().createUser({
        email: email,
        password: password,
        displayName: displayName,
    });

    // Add user to Hasura table
    const addUserQuery = `
      mutation addUser($uid: String!, $email: String!, $display_name: String, $role: String) {
        insert_users(objects: {uid: $uid, email: $email, display_name: $display_name, role: $role}) {
          affected_rows
        }
      }
    `;

    const variables = {
        uid: userRecord.uid,
        email: email,
        displayName: displayName,
        role: role,
    };

    await request(
        HASURA_GRAPHQL_ENDPOINT,
        addUserQuery,
        variables,
        { "x-hasura-admin-secret": HASURA_ADMIN_SECRET }
    ).then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    });
});

// Get invoices
exports.getInvoices = functions.https.onCall(async (data) => {
    const token = data.accessToken;

    // Delete 'token' string from token
    const accessToken = token.replace("token", "")

    console.log("token", accessToken);
    console.log("data", data);

    const getInvoicesQuery = `
    query GetInvoices {
      invoices {
        date
        company_id
        user_id
        amount
        status
        created_at
        updated_at
      }
    }
  `;

    try {
        // Query Hasura with JWT token
        const response = await request(HASURA_GRAPHQL_ENDPOINT, getInvoicesQuery, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
            },
        });

        return { invoices: response.invoices };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to fetch invoices' };
    }
});
