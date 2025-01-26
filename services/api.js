import axios from 'axios';

const API_URL = 'https://metaphorspace.com/wp-json/wp/v2/posts';

export const fetchStories = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&per_page=${perPage}&_embed`);
    console.log(response.data); // Log the response to inspect the structure
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
};