import { findAllNotices } from '../repo/noticeRepository.js';

export const getAllNotices = async () => {
  const notices = await findAllNotices();
  
  // Example business logic/formatting step:
  return notices.map((notice) => ({
    id: notice._id,
    title: notice.title,
    content: notice.content,
    author: notice.author,
    createdAt: notice.createdAt,
  }));
};