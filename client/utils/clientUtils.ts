import { ClientFormData } from "@/components/screens/Clients/ClientForm";

// Format phone number (e.g., for display)
export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Format the number
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
      6,
      10
    )}`;
  }
};

// Parse address from string format to component parts
export const parseAddress = (fullAddress: string) => {
  const addressParts = {
    address: "",
    aptSuite: "",
    city: "",
    state: "",
    zipCode: "",
  };

  if (!fullAddress) return addressParts;

  // Look for apartment/suite
  const aptMatch = fullAddress.match(/Apt\/Suite\s+([^,]+)/i);
  if (aptMatch) {
    addressParts.aptSuite = aptMatch[1];
  }

  // Look for state and zip
  const stateZipMatch = fullAddress.match(/([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/);
  if (stateZipMatch) {
    addressParts.state = stateZipMatch[1];
    addressParts.zipCode = stateZipMatch[2];
  }

  // Look for city
  const commaSegments = fullAddress.split(",").map((s) => s.trim());

  if (commaSegments.length >= 2) {
    // First segment is likely street address
    addressParts.address = commaSegments[0]
      .replace(/Apt\/Suite\s+([^,]+)/i, "")
      .trim();

    // Second segment is likely city, unless it contains the state/zip
    if (
      commaSegments[1] &&
      !stateZipMatch?.input?.includes(commaSegments[1])
    ) {
      addressParts.city = commaSegments[1];
    }
  } else {
    // If there's no comma, just use the whole thing as the street address
    addressParts.address = fullAddress;
  }

  return addressParts;
};

// Build a full address string from components
export const buildFullAddress = (data: ClientFormData) => {
  const addressComponents = [
    data.address,
    data.aptSuite && `Apt/Suite ${data.aptSuite}`,
    data.city,
    data.state && data.zipCode
      ? `${data.state} ${data.zipCode}`
      : data.state || data.zipCode,
  ].filter(Boolean);

  return addressComponents.length > 0 ? addressComponents.join(", ") : null;
};

// Transform client form data for API submission
export const transformClientDataForAPI = (data: ClientFormData) => {
  return {
    fname: data.firstName,
    lname: data.lastName,
    email: data.email || null,
    phone_number: data.phone.replace(/\D/g, "") || null,
    address: buildFullAddress(data),
    secondary_email: data.secondaryEmail || null,
    secondary_phone: data.secondaryPhone.replace(/\D/g, "") || null,
    notes: data.notes || null,
    disable_emails: !data.enableReminders,
    payment_types: [data.paymentMethod],
  };
};

// US States array for dropdown
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];