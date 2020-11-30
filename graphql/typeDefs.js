const { gql } = require('apollo-server');

module.exports = gql`
    type Avatar {
        imageUrl: String!
        id: ID!
    }
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        imageUrl: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
        imageUrl: String!
    }
    type Like {
        id: ID!
        createdAt: String!
        username: String!
        imageUrl: String!
    }
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        imageUrl: String!
    }
    input RegsterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
        imageUrl: String!
    }
    type Query {
        getPosts: [Post]
        getAvatars: [Avatar]
        getPost(postId: ID!): Post
    }
    type Mutation {
        register(registerInput: RegsterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: String!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }
    type Subscription {
        newPost: Post!
    }
`