import { Router } from 'express';
import { handleGetAllNotices } from '../controller/noticeController.js';

const router = Router();

// GET /notice
router.get('/notice', handleGetAllNotices);

export default router;