import { ApiClient, ApiResponse } from "../hooks/useClients";

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
    const paymentOptions = ["Credit Card", "Cash", "Venmo"];
    const numPaymentTypes = Math.floor(Math.random() * 2) + 1; // 1-2 payment types
    const paymentTypes: string[] = [];
    for (let k = 0; k < numPaymentTypes; k++) {
      const randomIndex = Math.floor(Math.random() * paymentOptions.length);
      const paymentType = paymentOptions[randomIndex];
      if (!paymentTypes.includes(paymentType)) {
        paymentTypes.push(paymentType);
      }
    }

    const streetNumber = 1000 + i;
    const streets = ["Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine Rd"];
    const cities = [
      "Springfield",
      "Riverdale",
      "Oakwood",
      "Mapleville",
      "Cedarburg",
    ];
    const states = ["CA", "NY", "TX", "FL", "IL"];
    const randomStreet = streets[Math.floor(Math.random() * streets.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const zipCode = Math.floor(Math.random() * 90000) + 10000;

    const isFavorite = i % 7 === 0; // Every 7th client is a favorite

    clients.push({
      id: i,
      fname: `First${i}`,
      lname: `Last${i}`,
      email: `client${i}@example.com`,
      phone_number: `(555) ${String(100 + i).padStart(3, "0")}-${String(
        1000 + i
      ).substring(1)}`,
      street_address: `${streetNumber} ${randomStreet}`,
      city: randomCity,
      state: randomState,
      zip: zipCode.toString(),
      secondary_phone:
        i % 4 === 0
          ? `(555) ${String(200 + i).padStart(3, "0")}-${String(
              2000 + i
            ).substring(1)}`
          : null,
      notes: i % 5 === 0 ? `Important notes for client ${i}` : null,
      favorite: isFavorite ? 1 : 0,
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

const allSampleClients = generateSampleClients();

export const getPaginatedClients = (
  page: number,
  pageSize: number,
  searchbarChars: string = ""
): ApiResponse => {
  let filteredClients = [...allSampleClients];

  if (searchbarChars && searchbarChars.length > 0) {
    const searchLower = searchbarChars.toLowerCase();
    filteredClients = filteredClients.filter(
      (client) =>
        client.fname.toLowerCase().includes(searchLower) ||
        client.lname.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.phone_number.includes(searchLower)
    );
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  return {
    success: 1,
    data: {
      clients: paginatedClients,
      total: filteredClients.length,
      page: page,
      total_pages: Math.ceil(filteredClients.length / pageSize),
    },
  };
};

export const mockDeleteClients = (
  clientIds: number[]
): { success: number; message: string } => {
  return {
    success: 1,
    message: `Successfully deleted ${clientIds.length} clients`,
  };
};

export const mockCreateClient = (clientData: {
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
}): { success: number; message: string; data: { client_id: number } } => {
  const newId = allSampleClients.length + 1;

  return {
    success: 1,
    message: "Client created successfully",
    data: {
      client_id: newId,
    },
  };
};

export const mockGetFavoriteClients = (): {
  success: number;
  data: { clients: ApiClient[] };
} => {
  const favoriteClients = allSampleClients.filter(
    (client) => client.favorite === 1
  );

  return {
    success: 1,
    data: {
      clients: favoriteClients,
    },
  };
};

export const mockGetClientMetadata = (
  clientId: number
): { success: number; data: ApiClient | null } => {
  const client = allSampleClients.find((c) => c.id === clientId);

  if (!client) {
    return {
      success: 0,
      data: null,
    };
  }

  return {
    success: 1,
    data: client,
  };
};

export const mockGetCostAndTimeStatsMetadata = (
  clientId: number
): { success: number; data: any } => {
  const client = allSampleClients.find((c) => c.id === clientId);

  if (!client) {
    return {
      success: 0,
      data: null,
    };
  }

  const currentYear = new Date().getFullYear();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthlyStats = months.map((month) => ({
    month,
    year: currentYear,
    revenue: Math.floor(Math.random() * 300) + 50,
    time_spent: Math.floor(Math.random() * 10) + 1,
  }));

  return {
    success: 1,
    data: {
      total_revenue: client.stats.totalSpent,
      total_time: Math.floor(Math.random() * 50) + 10,
      monthly_stats: monthlyStats,
    },
  };
};

export const mockGetClientDocumentsMetadata = (
  clientId: number
): { success: number; data: any } => {
  const client = allSampleClients.find((c) => c.id === clientId);

  if (!client) {
    return {
      success: 0,
      data: null,
    };
  }

  const docCount = Math.floor(Math.random() * 6);
  const documents = [];

  const docTypes = [
    "Invoice",
    "Contract",
    "Pet Record",
    "Vaccination",
    "Receipt",
  ];

  for (let i = 0; i < docCount; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 365));

    documents.push({
      id: `doc-${clientId}-${i}`,
      name: `${docTypes[i % docTypes.length]} ${i + 1}`,
      type: docTypes[i % docTypes.length],
      date_created: date.toISOString().split("T")[0],
      url: `https://example.com/documents/${clientId}/${i}`,
    });
  }

  return {
    success: 1,
    data: {
      documents,
    },
  };
};

export const mockGetAppointmentMetadata = (
  clientId: number
): { success: number; data: any } => {
  const client = allSampleClients.find((c) => c.id === clientId);

  if (!client) {
    return {
      success: 0,
      data: null,
    };
  }

  const apptCount = Math.floor(Math.random() * 11);
  const appointments = [];

  const statuses = ["Completed", "Scheduled", "Cancelled", "No-Show"];
  const services = ["Grooming", "Bath", "Nail Trim", "Haircut", "Full Service"];

  for (let i = 0; i < apptCount; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60) + 30);

    const status =
      i < apptCount * 0.7
        ? "Completed"
        : statuses[Math.floor(Math.random() * statuses.length)];

    appointments.push({
      id: `appt-${clientId}-${i}`,
      date: date.toISOString().split("T")[0],
      time: `${Math.floor(Math.random() * 8) + 9}:00 ${
        Math.random() > 0.5 ? "AM" : "PM"
      }`,
      status,
      pet_id: client.pets[Math.floor(Math.random() * client.pets.length)].id,
      pet_name:
        client.pets[Math.floor(Math.random() * client.pets.length)].name,
      service: services[Math.floor(Math.random() * services.length)],
      cost: Math.floor(Math.random() * 100) + 30,
      notes: Math.random() > 0.7 ? `Appointment notes ${i}` : null,
    });
  }

  return {
    success: 1,
    data: {
      appointments,
    },
  };
};

export const mockEditClientContact = (data: {
  client_id: string;
  primary_phone?: string;
  secondary_phone?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
}): { success: number; message: string } => {
  return {
    success: 1,
    message: "Client contact information updated successfully",
  };
};

export const mockEditClientBasicData = (data: {
  client_id: string;
  fname?: string;
  lname?: string;
  notes?: string;
}): { success: number; message: string } => {
  return {
    success: 1,
    message: "Client basic information updated successfully",
  };
};

export const mockUpdateClientIsFavorite = (
  clientId: number,
  favorite: boolean | number
): { success: number; message: string } => {
  return {
    success: 1,
    message: "Client favorite status updated successfully",
  };
};
