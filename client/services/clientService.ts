import axios from "axios";
import { getPaginatedClients, mockDeleteClients } from "../utils/fallbackData";
import { ApiResponse } from "../hooks/useClients";
import { API_URL } from "@env";

// Flag to use fallback data for development (toggle this as needed)
const USE_FALLBACK_DATA = true;

export const getAllClients = async (
  page: number,
  pageSize: number
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    // Simulate network delay for better testing
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getPaginatedClients(page, pageSize);
  }

  try {
    const response = await axios.get(`${API_URL}/getAllClients`, {
      params: { page, page_size: pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const deleteClients = async (clientIdArray: number[]): Promise<any> => {
  if (USE_FALLBACK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockDeleteClients(clientIdArray);
  }

  try {
    const response = await axios.delete(`${API_URL}/deleteClients`, {
      data: { client_ids: clientIdArray },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting clients:", error);
    throw error;
  }
};

export const getClientDetails = async (clientId: string): Promise<any> => {
  if (USE_FALLBACK_DATA) {
    // Get all clients and find the requested one
    const allClientsResponse = await getAllClients(1, 50);
    const client = allClientsResponse.clients.find(
      (c) => c.id.toString() === clientId
    );

    if (!client) {
      throw new Error("Client not found");
    }

    return client;
  }

  try {
    const response = await axios.get(`${API_URL}/getClientDetails/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching client details:", error);
    throw error;
  }
};
