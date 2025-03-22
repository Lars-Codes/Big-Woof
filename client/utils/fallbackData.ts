import { ApiClient, ApiResponse } from "../hooks/useClients";

// Generate a collection of sample clients for development/fallback
const generateSampleClients = (count: number = 25): ApiClient[] => {
  const clients: ApiClient[] = [];

  for (let i = 1; i <= count; i++) {
    const petCount = Math.floor(Math.random() * 3) + 1; // 1-3 pets per client
    const pets = [];

    for (let j = 1; j <= petCount; j++) {
      pets.push({
        id: i * 100 + j,
        name: `Pet ${j}`,
        breed: [
          "Labrador",
          "Poodle",
          "German Shepherd",
          "Golden Retriever",
          "Chihuahua",
        ][Math.floor(Math.random() * 5)],
        age: Math.floor(Math.random() * 10) + 1,
        size_tier: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
        deceased: false,
      });
    }

    // Properly create an array of payment types
    const paymentOptions = ["Credit Card", "Cash", "Venmo"];
    // Randomly select 1 or 2 payment methods
    const numPaymentTypes = Math.floor(Math.random() * 2) + 1;
    const paymentTypes: string[] = [];

    for (let k = 0; k < numPaymentTypes; k++) {
      const randomIndex = Math.floor(Math.random() * paymentOptions.length);
      const paymentType = paymentOptions[randomIndex];

      // Avoid duplicates
      if (!paymentTypes.includes(paymentType)) {
        paymentTypes.push(paymentType);
      }
    }

    clients.push({
      id: i,
      fname: `First${i}`,
      lname: `Last${i}`,
      email: `client${i}@example.com`,
      phone_number: `(555) ${String(100 + i).padStart(3, "0")}-${String(
        1000 + i
      ).substr(1)}`,
      address: `${1000 + i} Main St, City, State 12345`,
      secondary_email: null,
      secondary_phone: null,
      notes: i % 5 === 0 ? `Important notes for client ${i}` : null,
      disable_emails: false,
      pets,
      payment_types: paymentTypes,
      last_visit:
        i % 3 === 0
          ? `${
              new Date().getMonth() + 1
            }/${new Date().getDate()}/${new Date().getFullYear()}`
          : null,
      stats: {
        totalAppointments: Math.floor(Math.random() * 20),
        noShows: Math.floor(Math.random() * 3),
        lateAppointments: Math.floor(Math.random() * 5),
        totalSpent: Math.floor(Math.random() * 1000) + 200,
      },
    });
  }

  return clients;
};

// Get paginated clients from sample data
export const getPaginatedClients = (
  page: number,
  pageSize: number
): ApiResponse => {
  const allClients = generateSampleClients();
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedClients = allClients.slice(startIndex, endIndex);

  return {
    clients: paginatedClients,
    total: allClients.length,
    page: page,
    total_pages: Math.ceil(allClients.length / pageSize),
  };
};

// Mock deleting clients
export const mockDeleteClients = (
  clientIds: number[]
): { success: boolean; message: string } => {
  return {
    success: true,
    message: `Successfully deleted ${clientIds.length} clients`,
  };
};
