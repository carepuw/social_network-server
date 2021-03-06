const { AuthenticationError } = require('apollo-server')

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error('Post not found');
            }
        }
    },

    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);
            
            if (body.trim() === '') {
                throw new Error('Post body must not be empty');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                imageUrl: user.imageUrl,
                createdAt: new Date().toISOString(),
            })

            const post = await newPost.save();

            context.pubsub.publish('NEW_POST', {
                newPost: post,
            })

            return post;
        },

        async deletePost(_,{ postId },context) {
            const user = checkAuth(context);

            try{
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                } 
            } catch(err) {
                throw new Error(err);
            }
        },

        async likePost (_, { postId }, context) {
            const { username, imageUrl } = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    //already liked
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    //like
                    post.likes.push({
                        username,
                        imageUrl,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },

        createComment: async (_, { postId, body }, context) => {
            const { username, imageUrl } = checkAuth(context);
      
            if (body.trim() === '') {
              throw new UserInputError('Empty comment',{
                errors: {
                  body: 'Comment body must not empty'
                }
              });
            } 
      
            const post = await Post.findById(postId);
      
            if (post) {
              post.comments.unshift({
                body,
                username,
                imageUrl,
                createdAt: new Date().toISOString(),
              });
              await post.save();
              return post;
            } else {
              throw new UserInputError('Post not found');
            }
        },
    
        async deleteComment(_, {postId, commentId}, context) {
        const { username } = checkAuth(context);
        
        const post = await Post.findById(postId);
    
        if (post) {
            const commentIndex = post.comments.findIndex(c => c.id === commentId);
            
            if (post.comments[commentIndex].username === username) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            return post;
            } else {
            throw new AuthenticationError('Action not allowed');
            }
        } else {
            throw new UserInputError('Post not found');
        }
        }
    },

    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}