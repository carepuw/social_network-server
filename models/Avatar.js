const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    imageUrl: String,
});

module.exports = model('Avatar', postSchema);