import { getAllNotices } from '../service/noticeService.js';

export const handleGetAllNotices = async (req, res) => {
  try {
    const notices = await getAllNotices();
    return res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notices',
      error: error.message,
    });
  }
};