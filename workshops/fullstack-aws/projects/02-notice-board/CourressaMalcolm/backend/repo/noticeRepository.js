import Notice from '../models/Notice.js';

export const findAllNotices = async () => {
  // Sorts by newest first
  return await Notice.find().sort({ createdAt: -1 });
};