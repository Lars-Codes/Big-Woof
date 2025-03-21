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

// New function to update client details
export const updateClient = async (
  clientId: string,
  clientData: any
): Promise<any> => {
  if (USE_FALLBACK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For development, just return a success response
    return {
      success: true,
      message: "Client updated successfully",
      client: {
        ...clientData,
        id: clientId,
      },
    };
  }

  try {
    const response = await axios.put(
      `${API_URL}/updateClient/${clientId}`,
      clientData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Function to add a new client
export const addClient = async (clientData: any): Promise<any> => {
  if (USE_FALLBACK_DATA) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For development, return a success response with a new ID
    return {
      success: true,
      message: "Client added successfully",
      client: {
        ...clientData,
        id: Math.floor(Math.random() * 10000) + 1000,
      },
    };
  }

  try {
    const response = await axios.post(`${API_URL}/addClient`, clientData);
    return response.data;
  } catch (error) {
    console.error("Error adding client:", error);
    throw error;
  }
};
