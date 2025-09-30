const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  commenter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
  published: { type: Boolean, default: false },
  comments: [commentSchema],
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.index({ title: 1 });

postSchema.pre('save', function(next){
  console.log(`Saving post: ${this.title}`);
  next();
});

module.exports = mongoose.model('Post', postSchema);