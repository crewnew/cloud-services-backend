const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { request } = require('graphql-request');

admin.initializeApp();

const HASURA_GRAPHQL_ENDPOINT = 'https://cloud-services.hasura.app/v1/graphql';
const HASURA_ADMIN_SECRET = 'wIwO9JgznnaqmN4rAoc9fTUvJifxj8iOuh8Uec5anaclbtupTIfrGG7z7gQoZEJ1';

const insertUserQuery = `
  mutation insertUser($uid: String!, $email: String!, $first_name: String, $photo_url: String, $mobile_number: String, $role: String!, $created_at: timestamptz!) {
    insert_users_one(object: {uid: $uid, email: $email, first_name: $first_name, photo_url: $photo_url, mobile_number: $mobile_number, role: $role, created_at: $created_at}) {
      id
    }
  }
`;

exports.processSignUp = functions.auth.user().onCreate(async (user) => {
    // Set custom claims with the "customer" role
    await admin.auth().setCustomUserClaims(user.uid, {
        'https://hasura.io/jwt/claims': {
            'x-hasura-default-role': 'customer',
            'x-hasura-allowed-roles': ['customer']
        }
    });

    // Insert user information into the Hasura users table
    const userData = {
        uid: user.uid,
        email: user.email,
        first_name: user.displayName,
        photo_url: user.photoURL,
        mobile_number: user.phoneNumber,
        role: 'customer',
        created_at: new Date().toISOString()
    };

    await request(HASURA_GRAPHQL_ENDPOINT, insertUserQuery, userData, {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET
    });
});
