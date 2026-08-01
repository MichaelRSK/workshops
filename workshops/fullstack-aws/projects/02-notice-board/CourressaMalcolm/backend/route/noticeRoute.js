import { Router } from 'express';
import { handleGetAllNotices } from '../controller/noticeController.js';

const router = Router();

// GET /notice
router.get('/notices', handleGetAllNotices);

export default router;