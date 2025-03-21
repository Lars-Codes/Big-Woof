import { useState, useEffect } from "react";
import { getClientDetails } from "../services/clientService";
import { ClientDetails, PetDetails } from "../types/client";
import { ApiClient } from "./useClients";

export const useClientDetails = (clientId: string) => {
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiClient: ApiClient = await getClientDetails(clientId);

      // Transform API client to ClientDetails format
      const clientDetails: ClientDetails = {
        id: apiClient.id.toString(),
        firstName: apiClient.fname,
        lastName: apiClient.lname,
        fullName: `${apiClient.fname} ${apiClient.lname}`,
        email: apiClient.email || "",
        phone: apiClient.phone_number || "",
        address: apiClient.address || "",
        notes: apiClient.notes || "",
        disableEmails: apiClient.disable_emails || false,
        secondaryEmail: apiClient.secondary_email,
        secondaryPhone: apiClient.secondary_phone,
        paymentTypes: apiClient.payment_types || [],
        lastVisit: apiClient.last_visit,
        stats: apiClient.stats || {
          totalAppointments: 0,
          noShows: 0,
          lateAppointments: 0,
          totalSpent: 0,
        },
        pets: apiClient.pets.map((pet) => ({
          id: pet.id.toString(),
          name: pet.name,
          breed: pet.breed,
          age: pet.age,
          sizeTier: pet.size_tier,
          deceased: pet.deceased,
          lastVisit: "", // Would need to fetch from appointments
          vaccinated: false, // Would need to fetch from pet records
          notes: "",
          services: {}, // Would need to fetch from service history
        })),
      };

      setClient(clientDetails);
    } catch (err) {
      console.error("Error fetching client details:", err);
      setError("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  return {
    client,
    loading,
    error,
    refreshClient: fetchClientDetails,
  };
};
