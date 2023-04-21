// Import necessary libraries
import { GraphQLClient, gql } from 'graphql-request';
import { SubscriptionClient } from 'subscriptions-transport-ws';
// Set up GraphQL client. Add your Hasura admin secret and a correct Hasura endpoint URLs
const HASURA_ADMIN_SECRET = 'wIwO9JgznnaqmN4rAoc9fTUvJifxj8iOuh8Uec5anaclbtupTIfrGG7z7gQoZEJ1';
const HASURA_ENDPOINT = 'https://cloud-services.hasura.app/v1/graphql';
const HASURA_WS_ENDPOINT = 'wss://cloud-services.hasura.app/v1/graphql';
const client = new GraphQLClient(HASURA_ENDPOINT, {
    headers: {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
    },
});

const subscriptionClient = new SubscriptionClient(HASURA_WS_ENDPOINT, {
    reconnect: true,
    connectionParams: {
        headers: {
            'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
        },
    },
});

// DOM elements
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// GraphQL queries and mutations
const MESSAGES_SUBSCRIPTION = gql `
    subscription {
        messages(order_by: { created_at: desc }) {
            id
            content
            user {
                first_name
            }
        }
    }
`;

const SEND_MESSAGE_MUTATION = gql `
    mutation SendMessage($userId: Int!, $content: String!) {
        insert_messages_one(object: { user_id: $userId, content: $content }) {
            id
        }
    }
`;

// Subscribe to messages
const messagesSubscription = subscriptionClient.request({
    query: MESSAGES_SUBSCRIPTION,
});

messagesSubscription.subscribe({
    next(result) {
        const messages = result.data.messages;
        messagesDiv.innerHTML = messages
            .map(message => `<div>
                <strong>${message.user.first_name}:</strong> ${message.content}
            </div>`)
            .join('');
    },
    error(err) {
        console.error('Subscription error:', err);
    },
});

// Send a new message
messageForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    const content = messageInput.value.trim();
    if (!content) return;
    messageInput.value = '';

    // Replace 'your_user_id' with the actual user ID from your authentication system
    const userId = '471ed118-c0e6-4e81-9c97-5dfa94bd500b';
    try {
        await client.request(SEND_MESSAGE_MUTATION, { userId, content });
    } catch (err) {
        console.error('Sending message error:', err);
    }
});