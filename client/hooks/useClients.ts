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
  const [isPageChanging, setIsPageChanging] = useState(false);

  // Fetch clients
  const fetchClients = async (
    pageNum: number,
    size: number,
    isPageChange = false
  ) => {
    // If this is a page change, we'll use the isPageChanging state
    // Otherwise, use the main loading state
    if (isPageChange) {
      setIsPageChanging(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response: ApiResponse = await getAllClients(pageNum, size);
      setClients(response.clients);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError("Failed to fetch clients");
      console.error("Error fetching clients:", err);
    } finally {
      if (isPageChange) {
        setIsPageChanging(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Load initial data
  useEffect(() => {
    // When page changes, fetch with the page change flag
    fetchClients(page, pageSize, true);
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

  // Toggle client selection - enhanced to handle array of IDs
  const toggleSelectClient = (clientIds: number[] | number) => {
    // If single ID passed, convert to array
    const idsToToggle = Array.isArray(clientIds) ? clientIds : [clientIds];

    if (idsToToggle.length === 1) {
      // Simple toggle for a single ID
      const singleId = idsToToggle[0];
      setSelectedClientIds((prev) => {
        if (prev.includes(singleId)) {
          // Remove if already selected
          return prev.filter((id) => id !== singleId);
        } else {
          // Add if not selected
          return [...prev, singleId];
        }
      });
    } else {
      // Direct set for multiple IDs (used for select all or bulk operations)
      setSelectedClientIds(idsToToggle);
    }
  };

  // Select all clients on current page
  const selectAllClients = () => {
    // Get IDs of all clients currently visible on this page
    const currentPageClientIds = clients.map((client) => client.id);
    
    // Check if all clients on this page are already selected
    const allCurrentPageSelected = currentPageClientIds.every(
      (id) => selectedClientIds.includes(id)
    );
    
    if (allCurrentPageSelected) {
      // If all clients on this page are selected, deselect only them
      // while preserving selections from other pages
      setSelectedClientIds(
        selectedClientIds.filter((id) => !currentPageClientIds.includes(id))
      );
    } else {
      // Otherwise, add all clients from this page to the existing selection
      // using Set to avoid duplicates
      const updatedSelection = [
        ...new Set([...selectedClientIds, ...currentPageClientIds]),
      ];
      setSelectedClientIds(updatedSelection);
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
    isDeleting,
    isPageChanging,
    goToPage,
    nextPage,
    prevPage,
    toggleSelectClient,
    selectAllClients,
    deleteSelectedClients,
    refreshClients: () => fetchClients(page, pageSize),
  };
};
