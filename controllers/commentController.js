
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const Notification = require('../models/notification');


// Social login and comment creation
exports.createComment = async (req, res) => {
  try {
    const { post, content, provider, providerId, name, email } = req.body;
    let user;
    if (provider && providerId) {
      user = await User.findOne({ provider, providerId });
      if (!user) {
        user = new User({ name, email, provider, providerId });
        await user.save();
      }
    } else {
      // fallback to local user (must provide user id)
      if (!req.body.user) {
        return res.status(400).json({ error: 'User info required' });
      }
      user = await User.findById(req.body.user);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    const comment = new Comment({ post, user: user._id, content });
    await comment.save();

    // Add user to post subscribers if not already
    const postDoc = await Post.findById(post);
    if (postDoc) {
      if (!postDoc.subscribers.includes(user._id)) {
        postDoc.subscribers.push(user._id);
        await postDoc.save();
      }
      // Notify all subscribers except the commenter
      const notifyUsers = postDoc.subscribers.filter(
        subId => subId.toString() !== user._id.toString()
      );
      for (const subId of notifyUsers) {
        await Notification.create({
          user: subId,
          message: `${user.name || user.email} commented on a post you subscribed to.`
        });
      }
    }
    // Notify the commenter
    await Notification.create({
      user: user._id,
      message: 'You commented on a post.'
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId }).populate('user', 'username');
    res.json(comments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
