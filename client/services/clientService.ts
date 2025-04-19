import axios from "axios";
import {
  getPaginatedClients,
  mockDeleteClients,
  mockCreateClient,
  mockGetFavoriteClients,
  mockGetClientMetadata,
  mockGetCostAndTimeStatsMetadata,
  mockGetClientDocumentsMetadata,
  mockGetAppointmentMetadata,
  mockEditClientContact,
  mockEditClientBasicData,
  mockUpdateClientIsFavorite,
} from "../utils/fallbackData";
import { ApiResponse } from "../hooks/useClients";
import { API_URL } from "@env";

// Flag to use fallback data for development (toggle this as needed)
const USE_FALLBACK_DATA = false;

export const getAllClients = async (
  page: number,
  pageSize: number,
  searchbarChars: string = ""
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    // Simulate network delay for better testing
    await new Promise((resolve) => setTimeout(resolve, 500));
    return getPaginatedClients(page, pageSize, searchbarChars);
  }

  console.log(
    "API_URL",
    API_URL + "/getAllClients",
    page,
    pageSize,
    searchbarChars
  );
  try {
    const response = await axios.get(`${API_URL}/getAllClients`, {
      params: { page, page_size: pageSize, searchbar_chars: searchbarChars },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

export const createClient = async (clientData: {
  fname: string;
  lname: string;
  phone_number: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  secondary_phone?: string;
  notes?: string;
  favorite?: number;
}): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockCreateClient(clientData);
  }

  try {
    const formData = new FormData();

    Object.entries(clientData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await axios.post(`${API_URL}/createClient`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

export const deleteClients = async (
  clientIds: number[]
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockDeleteClients(clientIds);
  }

  try {
    const response = await axios.delete(`${API_URL}/deleteClient`, {
      data: { clientid_arr: clientIds },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting clients:", error);
    throw error;
  }
};

export const getFavoriteClients = async (): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockGetFavoriteClients();
  }

  try {
    const response = await axios.get(`${API_URL}/getFavoriteClients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite clients:", error);
    throw error;
  }
};

export const getClientMetadata = async (
  clientId: number
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockGetClientMetadata(clientId);
  }

  try {
    const response = await axios.get(`${API_URL}/getClientMetadata`, {
      params: { client_id: clientId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching client metadata:", error);
    throw error;
  }
};

export const getCostAndTimeStatsMetadata = async (
  clientId: number
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockGetCostAndTimeStatsMetadata(clientId);
  }

  try {
    const response = await axios.get(`${API_URL}/getCostAndTimeStatsMetadata`, {
      params: { client_id: clientId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cost and time stats metadata:", error);
    throw error;
  }
};

export const getClientDocumentsMetadata = async (
  clientId: number
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockGetClientDocumentsMetadata(clientId);
  }

  try {
    const response = await axios.get(`${API_URL}/getClientDocumentsMetadata`, {
      params: { client_id: clientId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching client documents metadata:", error);
    throw error;
  }
};

export const getAppointmentMetadata = async (
  clientId: number
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockGetAppointmentMetadata(clientId);
  }

  try {
    const response = await axios.get(`${API_URL}/getAppointmentMetadata`, {
      params: { client_id: clientId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment metadata:", error);
    throw error;
  }
};

export const editClientContact = async (data: {
  client_id: string;
  primary_phone?: string;
  secondary_phone?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
}): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockEditClientContact(data);
  }

  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await axios.patch(
      `${API_URL}/editClientContact`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating client contact:", error);
    throw error;
  }
};

export const editClientBasicData = async (data: {
  client_id: string;
  fname?: string;
  lname?: string;
  notes?: string;
}): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockEditClientBasicData(data);
  }

  try {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await axios.patch(
      `${API_URL}/editClientBasicData`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating client basic data:", error);
    throw error;
  }
};

export const updateClientIsFavorite = async (
  clientId: number,
  favorite: boolean | number
): Promise<ApiResponse> => {
  if (USE_FALLBACK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUpdateClientIsFavorite(clientId, favorite);
  }

  try {
    const formData = new FormData();
    formData.append("client_id", clientId.toString());
    formData.append(
      "favorite",
      typeof favorite === "boolean"
        ? favorite
          ? "1"
          : "0"
        : favorite.toString()
    );

    const response = await axios.patch(
      `${API_URL}/updateClientIsFavorite`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating client favorite status:", error);
    throw error;
  }
};
