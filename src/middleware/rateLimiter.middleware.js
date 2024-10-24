import rateLimit from 'express-rate-limit';

export const deletePostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many delete requests from this IP, please try again later.',
});
