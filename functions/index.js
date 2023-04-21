const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {request} = require("graphql-request");
admin.initializeApp();
// Add your API endpoint and admin secret here
const HASURA_GRAPHQL_ENDPOINT = "https://assuring-penguin-56.hasura.app/v1/graphql";
// eslint-disable-next-line max-len
const HASURA_ADMIN_SECRET = "C8GRGU0qmPbccqfjZYdYOk9M1zAzAWRjqXN08tvtSWs8bMiyNt9SgSkT4VVjNxJW";
const insertUserQuery = `
 mutation insertUser($uid: String!, $email: String!, $first_name: String,
$role: String!, $created_at: timestamptz!) {
 insert_users_one(object: {uid: $uid, email: $email, first_name:
$first_name, role: $role, created_at: $created_at}) {
 id
 }
 }
`;
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  // Set custom claims with the "client" role
  await admin.auth().setCustomUserClaims(user.uid, {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "customer",
      "x-hasura-allowed-roles": ["customer"],
    },
  });
  // Insert user information into the Hasura users table
  const userData = {
    uid: user.uid,
    email: user.email,
    first_name: user.displayName,
    role: "customer",
    created_at: new Date().toISOString(),
  };
  await request(HASURA_GRAPHQL_ENDPOINT, insertUserQuery, userData, {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  });
});
