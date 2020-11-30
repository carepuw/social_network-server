const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const avatarsResolvers = require('./avatars');

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length,
    },
    Query: {
        ...postsResolvers.Query,
        ...avatarsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
    },
    Subscription: {
        ...postsResolvers.Subscription,
    }
}
