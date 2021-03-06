
const express = require('express');
const router = express.Router();

const PostModel = require('../models/post.js');
const UserModel = require('../models/user.js');
const CommentModel = require('../models/comment.js');

router.get('/', function(req, res) {
	res.redirect('/api/feed')
});

router.get('/:id', async function(req,res) {
	const post = await PostModel.findById(req.params.id);
	if (post) { res.json({post}) }
	else { res.sendStatus(404) }
});

router.get('/:id/comments/:limit', async function(req, res) {
	const post = await PostModel.findById(req.params.id);
	if (!post) { res.sendStatus(404); return }
	const comments =  [];
	if (post.comments.length) {
		for (let i = 0; i < +req.params.limit; i++) {
			const comment = await CommentModel.findById(post.comments[i]);
			if (!comment) break;
			comments.push(comment)
		}
	}
	res.json({ comments })
});

// ADD A COMMENT
router.post('/:id/comments', async function(req, res) {
	const post = await PostModel.findById(req.params.id);
	if (!post) { res.sendStatus(404); return }
	const { text } = req.body;
	const comment = new CommentModel ({
		user: req.currentUserId,
		text,
	});
	const c = await comment.save();
	if (!c) { res.sendStatus(500); return }
	post.comments.push(comment._id)
	const p = await post.save();
	if (!p) { res.sendStatus(500); return }
	res.sendStatus(201);
})

// CREATE NEW POST
router.post('/', function(req, res) {
	const { title, text } = req.body;
	const post = {
		title,
		text,
		user: req.currentUserId,
		date: new Date(),
	};
	new PostModel(post).save(err => {
		if (err) { res.sendStatus(400) }
		else { res.sendStatus(201) }
	});
});

// UPDATE POST
router.put('/:id', async function(req, res) {
	const post = await PostModel.findById(req.params.id);
	if (!post) { res.sendStatus(404); return }

	const { title, text } = req.body;
	post.title = title || post.title;
	post.text = text || post.text;
	post.save(err => {
		if (err) { res.sendStatus(500) }
		else { res.sendStatus(201) }
	});
});

// DELETE POST
router.delete('/:id', async function(req, res) {
	const post = await PostModel.findById(req.params.id);
	if (!post) { res.sendStatus(404); return }
	
	const d = await PostModel.deleteOne({ _id: post._id})
	if (d) { res.sendStatus(202) }
	else { res.sendStatus(400) }
});
module.exports = router;
