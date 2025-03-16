import { useState } from "react";

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  size: string;
  lastVisit: string;
  image?: string;
  vaccinated: boolean;
  notes: string;
  services: {
    [key: string]: {
      price: number;
      lastDone: string;
      recommendedFrequency: string;
      timeNeeded: number;
    };
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  notes: string;
  stats: {
    totalAppointments: number;
    noShows: number;
    lateAppointments: number;
    totalSpent: number;
  };
  pets: Pet[];
  lastVisit?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  prices: {
    Small: number;
    Medium: number;
    Large: number;
  };
  duration: number;
  active: boolean;
}

// Mock data for clients
// Mock data for clients
export const clients: Client[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "555-1234",
    address: "123 Elm Street",
    paymentMethod: "Credit Card",
    notes: "Prefers morning appointments",
    stats: {
      totalAppointments: 5,
      noShows: 0,
      lateAppointments: 1,
      totalSpent: 250,
    },
    pets: [
      {
        id: "1",
        name: "Rex",
        breed: "German Shepherd",
        age: 5,
        size: "Large",
        lastVisit: "2025-02-20",
        image: "rex.jpg",
        vaccinated: true,
        notes: "Friendly but nervous around other dogs",
        services: {
          grooming: {
            price: 50,
            lastDone: "2025-02-20",
            recommendedFrequency: "Monthly",
            timeNeeded: 90,
          },
          nailTrim: {
            price: 15,
            lastDone: "2025-02-20",
            recommendedFrequency: "Monthly",
            timeNeeded: 15,
          },
        },
      },
    ],
    lastVisit: "2025-02-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-5678",
    address: "456 Oak Avenue",
    paymentMethod: "PayPal",
    notes: "Prefers evening appointments",
    stats: {
      totalAppointments: 3,
      noShows: 1,
      lateAppointments: 0,
      totalSpent: 150,
    },
    pets: [
      {
        id: "2",
        name: "Bella",
        breed: "Labrador Retriever",
        age: 3,
        size: "Medium",
        lastVisit: "2025-03-01",
        image: "bella.jpg",
        vaccinated: true,
        notes: "Loves treats",
        services: {
          grooming: {
            price: 40,
            lastDone: "2025-03-01",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          nailTrim: {
            price: 10,
            lastDone: "2025-03-01",
            recommendedFrequency: "Monthly",
            timeNeeded: 10,
          },
        },
      },
    ],
    lastVisit: "2025-03-01",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "555-6789",
    address: "789 Pine Road",
    paymentMethod: "Venmo",
    notes: "Prefers weekend appointments",
    stats: {
      totalAppointments: 8,
      noShows: 0,
      lateAppointments: 2,
      totalSpent: 400,
    },
    pets: [
      {
        id: "3",
        name: "Max",
        breed: "Golden Retriever",
        age: 4,
        size: "Large",
        lastVisit: "2025-02-28",
        image: "max.jpg",
        vaccinated: true,
        notes: "Very social and loves playing fetch",
        services: {
          grooming: {
            price: 45,
            lastDone: "2025-02-28",
            recommendedFrequency: "Monthly",
            timeNeeded: 75,
          },
          nailTrim: {
            price: 12,
            lastDone: "2025-02-28",
            recommendedFrequency: "Monthly",
            timeNeeded: 15,
          },
          teethCleaning: {
            price: 30,
            lastDone: "2025-01-15",
            recommendedFrequency: "Every 6 months",
            timeNeeded: 45,
          },
        },
      },
    ],
    lastVisit: "2025-02-28",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-9876",
    address: "654 Birch Lane",
    paymentMethod: "Cash",
    notes: "Has multiple pets",
    stats: {
      totalAppointments: 10,
      noShows: 1,
      lateAppointments: 1,
      totalSpent: 600,
    },
    pets: [
      {
        id: "4",
        name: "Charlie",
        breed: "Beagle",
        age: 2,
        size: "Small",
        lastVisit: "2025-03-05",
        image: "charlie.jpg",
        vaccinated: true,
        notes: "Curious and loves to sniff everything",
        services: {
          grooming: {
            price: 35,
            lastDone: "2025-03-05",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          earCleaning: {
            price: 20,
            lastDone: "2025-03-05",
            recommendedFrequency: "Every 2 months",
            timeNeeded: 20,
          },
        },
      },
      {
        id: "5",
        name: "Milo",
        breed: "Pomeranian",
        age: 1,
        size: "Small",
        lastVisit: "2025-03-02",
        image: "milo.jpg",
        vaccinated: true,
        notes: "Energetic and loves to run",
        services: {
          grooming: {
            price: 40,
            lastDone: "2025-03-02",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          nailTrim: {
            price: 10,
            lastDone: "2025-03-02",
            recommendedFrequency: "Monthly",
            timeNeeded: 10,
          },
        },
      },
    ],
    lastVisit: "2025-03-05",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-9876",
    address: "654 Birch Lane",
    paymentMethod: "Cash",
    notes: "Has multiple pets",
    stats: {
      totalAppointments: 10,
      noShows: 1,
      lateAppointments: 1,
      totalSpent: 600,
    },
    pets: [
      {
        id: "6",
        name: "Charlie",
        breed: "Beagle",
        age: 2,
        size: "Small",
        lastVisit: "2025-03-05",
        image: "charlie.jpg",
        vaccinated: true,
        notes: "Curious and loves to sniff everything",
        services: {
          grooming: {
            price: 35,
            lastDone: "2025-03-05",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          earCleaning: {
            price: 20,
            lastDone: "2025-03-05",
            recommendedFrequency: "Every 2 months",
            timeNeeded: 20,
          },
        },
      },
      {
        id: "7",
        name: "Milo",
        breed: "Pomeranian",
        age: 1,
        size: "Small",
        lastVisit: "2025-03-02",
        image: "milo.jpg",
        vaccinated: true,
        notes: "Energetic and loves to run",
        services: {
          grooming: {
            price: 40,
            lastDone: "2025-03-02",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          nailTrim: {
            price: 10,
            lastDone: "2025-03-02",
            recommendedFrequency: "Monthly",
            timeNeeded: 10,
          },
        },
      },
    ],
    lastVisit: "2025-03-05",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "555-9876",
    address: "654 Birch Lane",
    paymentMethod: "Cash",
    notes: "Has multiple pets",
    stats: {
      totalAppointments: 10,
      noShows: 1,
      lateAppointments: 1,
      totalSpent: 600,
    },
    pets: [
      {
        id: "8",
        name: "Charlie",
        breed: "Beagle",
        age: 2,
        size: "Small",
        lastVisit: "2025-03-05",
        image: "charlie.jpg",
        vaccinated: true,
        notes: "Curious and loves to sniff everything",
        services: {
          grooming: {
            price: 35,
            lastDone: "2025-03-05",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          earCleaning: {
            price: 20,
            lastDone: "2025-03-05",
            recommendedFrequency: "Every 2 months",
            timeNeeded: 20,
          },
        },
      },
      {
        id: "9",
        name: "Milo",
        breed: "Pomeranian",
        age: 1,
        size: "Small",
        lastVisit: "2025-03-02",
        image: "milo.jpg",
        vaccinated: true,
        notes: "Energetic and loves to run",
        services: {
          grooming: {
            price: 40,
            lastDone: "2025-03-02",
            recommendedFrequency: "Monthly",
            timeNeeded: 60,
          },
          nailTrim: {
            price: 10,
            lastDone: "2025-03-02",
            recommendedFrequency: "Monthly",
            timeNeeded: 10,
          },
        },
      },
    ],
    lastVisit: "2025-03-05",
  },
];

export const useServices = () => {
  const [services, setServices] = useState([
    {
      id: "1",
      name: "Full Groom",
      description:
        "Complete grooming service including bath, haircut, nail trim, ear cleaning, and more.",
      prices: {
        Small: 65,
        Medium: 75,
        Large: 85,
      },
      duration: 90,
      active: true,
    },
    {
      id: "2",
      name: "Bath & Brush",
      description:
        "Basic bath with shampoo and conditioner, blow dry, and brushing.",
      prices: {
        Small: 35,
        Medium: 45,
        Large: 55,
      },
      duration: 60,
      active: true,
    },
    {
      id: "3",
      name: "Nail Trim",
      description: "Trim and file nails.",
      prices: {
        Small: 15,
        Medium: 15,
        Large: 15,
      },
      duration: 15,
      active: true,
    },
    {
      id: "4",
      name: "Teeth Brushing",
      description: "Brush teeth with pet-safe toothpaste.",
      prices: {
        Small: 10,
        Medium: 10,
        Large: 10,
      },
      duration: 10,
      active: true,
    },
  ]);

  return [services, setServices] as const;
};

export const appointments = [
    {
      id: "1",
      date: "2025-03-16",
      clientName: "Sarah Johnson",
      petName: "Max",
      time: "10:00 AM",
      service: "Full Groom",
      duration: 90,
      status: "confirmed",
    },
    {
      id: "2",
      date: "2025-03-16",
      clientName: "Mike Peters",
      petName: "Bella",
      time: "2:30 PM",
      service: "Bath & Brush",
      duration: 60,
      status: "confirmed",
    },
    {
      id: "3",
      date: "2025-03-17",
      clientName: "Emily Wong",
      petName: "Charlie",
      time: "11:15 AM",
      service: "Nail Trim",
      duration: 30,
      status: "pending",
    },
    {
      id: "4",
      date: "2025-03-19",
      clientName: "David Martinez",
      petName: "Luna",
      time: "9:00 AM",
      service: "Full Groom",
      duration: 120,
      status: "confirmed",
    },
  ];
