import { Router } from 'express';
import { createPost, getPosts } from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getPosts);
router.post('/', authenticate, createPost);

export default router;
