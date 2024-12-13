import { buildSchema } from 'graphql';

export const rootSchema = buildSchema(`
    type User {
        login: String
        role: String
    }

    input UserInput {
        login: String!
        password: String!
    }

    type Query {
        updateToken: Boolean
        logOut: Boolean
        checkToken: Boolean
    }

    type Mutation {
        createUser(input: UserInput!): Boolean
        getUser(input: UserInput!): User
    }
`);
