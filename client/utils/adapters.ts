import { ApiClient, ApiPet } from "../hooks/useClients";
import { Client, Pet } from "../data"; // Your existing dummy data interfaces

// Function to convert API client data to your app's client interface
export const adaptApiClientToAppClient = (apiClient: ApiClient): Client => {
  return {
    id: apiClient.id.toString(),
    name: `${apiClient.fname} ${apiClient.lname}`,
    email: apiClient.email || "",
    phone: apiClient.phone_number || "",
    address: apiClient.address || "",
    paymentMethod: apiClient.payment_types?.[0] || "None",
    notes: apiClient.notes || "",
    stats: apiClient.stats || {
      totalAppointments: 0,
      noShows: 0,
      lateAppointments: 0,
      totalSpent: 0,
    },
    pets: apiClient.pets.map(adaptApiPetToAppPet),
    lastVisit: apiClient.last_visit || undefined,
  };
};

// Function to convert API pet data to your app's pet interface
export const adaptApiPetToAppPet = (apiPet: ApiPet): Pet => {
  return {
    id: apiPet.id.toString(),
    name: apiPet.name,
    breed: apiPet.breed,
    age: apiPet.age,
    size: apiPet.size_tier,
    lastVisit: "", // This would need to come from appointment data
    vaccinated: false, // This would need to come from additional data
    notes: "",
    services: {}, // This would need to come from additional data
  };
};

// Function for the reverse conversion if needed (for creating/updating)
export const adaptAppClientToApiClient = (
  appClient: Client
): Partial<ApiClient> => {
  const [fname, ...lastNameParts] = appClient.name.split(" ");
  const lname = lastNameParts.join(" ");

  return {
    id: parseInt(appClient.id),
    fname,
    lname,
    email: appClient.email,
    phone_number: appClient.phone,
    address: appClient.address,
    notes: appClient.notes,
    pets: appClient.pets.map(adaptAppPetToApiPet) as ApiPet[],
  };
};

export const adaptAppPetToApiPet = (appPet: Pet): Partial<ApiPet> => {
  return {
    id: parseInt(appPet.id),
    name: appPet.name,
    breed: appPet.breed,
    age: appPet.age,
    size_tier: appPet.size,
    deceased: false,
  };
};
