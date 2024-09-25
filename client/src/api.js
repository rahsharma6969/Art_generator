import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Like a post
export const likePost = (postId, userId) => {
    return axios.post(`${API_URL}/like/${postId}`, { userId });
};

// Comment on a post
export const commentOnPost = (postId, userId, commentText) => {
    return axios.post(`${API_URL}/comment/${postId}`, { userId, commentText });
};
