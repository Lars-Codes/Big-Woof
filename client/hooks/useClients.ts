import { useState, useEffect } from "react";
import { getAllClients, deleteClients } from "../services/clientService";

export interface ApiPet {
  id: number;
  name: string;
  breed: string;
  age: number;
  size_tier: string;
  deceased: boolean;
}

export interface ApiClient {
  id: number;
  fname: string;
  lname: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  secondary_phone: string | null;
  notes: string | null;
  favorite: number;
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

export interface ApiResponse {
  success: number;
  message?: string;
  data?: any; // This allows for different data structures
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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchClients = async (
    pageNum: number,
    size: number,
    search: string = "",
    isPageChange = false
  ) => {
    if (isPageChange) {
      setIsPageChanging(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await getAllClients(pageNum, size, search);

      if (response.success === 1 && response.data) {
        setClients(response.data.clients);
        setTotalPages(response.data.total_pages);
      } else {
        throw new Error(response.message || "Failed to fetch clients");
      }
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

  useEffect(() => {
    fetchClients(page, pageSize, searchTerm, true);
  }, [page, pageSize, searchTerm]);

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

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const toggleSelectClient = (clientIds: number[] | number) => {
    const idsToToggle = Array.isArray(clientIds) ? clientIds : [clientIds];

    if (idsToToggle.length === 1) {
      const singleId = idsToToggle[0];
      setSelectedClientIds((prev) => {
        if (prev.includes(singleId)) {
          return prev.filter((id) => id !== singleId);
        } else {
          return [...prev, singleId];
        }
      });
    } else {
      setSelectedClientIds(idsToToggle);
    }
  };

  const selectAllClients = () => {
    const currentPageClientIds = clients.map((client) => client.id);

    const allCurrentPageSelected = currentPageClientIds.every((id) =>
      selectedClientIds.includes(id)
    );

    if (allCurrentPageSelected) {
      setSelectedClientIds(
        selectedClientIds.filter((id) => !currentPageClientIds.includes(id))
      );
    } else {
      const updatedSelection = [
        ...new Set([...selectedClientIds, ...currentPageClientIds]),
      ];
      setSelectedClientIds(updatedSelection);
    }
  };

  const deleteSelectedClients = async () => {
    if (selectedClientIds.length === 0) return;

    setIsDeleting(true);
    try {
      const response = await deleteClients(selectedClientIds);

      if (response.success === 1) {
        await fetchClients(page, pageSize, searchTerm);
        setSelectedClientIds([]);
      } else {
        throw new Error(response.message || "Failed to delete clients");
      }
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
    searchTerm,
    goToPage,
    nextPage,
    prevPage,
    handleSearch,
    toggleSelectClient,
    selectAllClients,
    deleteSelectedClients,
    refreshClients: () => fetchClients(page, pageSize, searchTerm),
  };
};
