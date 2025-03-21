import { useState, useEffect } from "react";
import { getAllClients, deleteClients } from "../services/clientService";

// Define types based on API response and your existing Client interface
export interface ApiClient {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone_number: string;
  address: string;
  secondary_email: string | null;
  secondary_phone: string | null;
  notes: string | null;
  disable_emails: boolean;
  pets: ApiPet[];
  payment_types: string[];
  last_visit: string | null;
  stats: {
    totalAppointments: number;
    noShows: number;
    lateAppointments: number;
    totalSpent: number;
  };
}

export interface ApiPet {
  id: number;
  name: string;
  breed: string;
  age: number;
  size_tier: string;
  deceased: boolean;
}

export interface ApiResponse {
  clients: ApiClient[];
  total: number;
  page: number;
  total_pages: number;
}

export const useClients = () => {
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch clients
  const fetchClients = async (pageNum: number, size: number) => {
    setLoading(true);
    setError(null);

    try {
      const response: ApiResponse = await getAllClients(pageNum, size);
      setClients(response.clients);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError("Failed to fetch clients");
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchClients(page, pageSize);
  }, [page, pageSize]);

  // Handle page change
  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle next page
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Toggle client selection
  const toggleSelectClient = (clientId: number) => {
    setSelectedClientIds((prev) => {
      if (prev.includes(clientId)) {
        // Remove if already selected
        return prev.filter((id) => id !== clientId);
      } else {
        // Add if not selected
        return [...prev, clientId];
      }
    });
  };

  // Select all clients on current page
  const selectAllClients = () => {
    if (selectedClientIds.length === clients.length) {
      // If all are selected, deselect all
      setSelectedClientIds([]);
    } else {
      // Otherwise, select all
      setSelectedClientIds(clients.map((client) => client.id));
    }
  };

  // Delete selected clients
  const deleteSelectedClients = async () => {
    if (selectedClientIds.length === 0) return;

    setIsDeleting(true);
    try {
      await deleteClients(selectedClientIds);
      // Refresh the client list
      await fetchClients(page, pageSize);
      // Clear selection
      setSelectedClientIds([]);
    } catch (err) {
      setError("Failed to delete clients");
      console.error("Error deleting clients:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    clients,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    selectedClientIds,
    setSelectedClientIds,
    isDeleting,
    goToPage,
    nextPage,
    prevPage,
    toggleSelectClient,
    selectAllClients,
    deleteSelectedClients,
    refreshClients: () => fetchClients(page, pageSize),
  };
};
