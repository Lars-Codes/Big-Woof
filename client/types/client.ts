// Interface for client details screen
export interface ClientDetails {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  disableEmails: boolean;
  secondaryEmail: string | null;
  secondaryPhone: string | null;
  paymentTypes: string[];
  lastVisit: string | null;
  stats: {
    totalAppointments: number;
    noShows: number;
    lateAppointments: number;
    totalSpent: number;
  };
  pets: PetDetails[];
}

export interface PetDetails {
  id: string;
  name: string;
  breed: string;
  age: number;
  sizeTier: string;
  deceased: boolean;
  lastVisit?: string;
  vaccinated?: boolean;
  notes?: string;
  services?: Record<string, ServiceHistory>;
}

export interface ServiceHistory {
  price: number;
  lastDone: string;
  recommendedFrequency: string;
  timeNeeded: number;
}
