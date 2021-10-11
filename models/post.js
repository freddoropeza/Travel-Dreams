const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    img: String,
    body: String,
    author: { type: Schema.Types.ObjectId, ref: 'User'},
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);