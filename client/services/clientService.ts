import axios from 'axios';
import { API_URL } from '@env';

export const getAllClients = async (page: number, pageSize: number) => {
  try {
    const response = await axios.get(`${API_URL}/getAllClients`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const deleteClients = async (clientIdArray: number[]) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteClients`, {
      data: { client_ids: clientIdArray },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting clients:', error);
    throw error;
  }
};