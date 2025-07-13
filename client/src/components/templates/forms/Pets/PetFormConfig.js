export const PetFormConfig = {
  submitButtonText: 'Save Pet',
  initialFormState: {
    name: '',
    client_id: '',
    gender: '',
    age: '',
    fixed: '',
    breed_id: '',
    weight: '',
    size_tier_id: '',
    hair_length_id: '',
    coat_type_id: '',
    notes: '',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      placeholder: "Enter pet's name",
      required: true,
    },
    {
      name: 'client_id',
      type: 'dropdown',
      label: 'Owner',
      placeholder: 'Select Owner',
      required: true,
      options: [], // Will be populated dynamically
    },
    {
      name: 'gender',
      type: 'dropdown',
      label: 'Gender',
      placeholder: 'Select Gender',
      options: [
        { label: 'Male', value: 1 },
        { label: 'Female', value: 2 },
        { label: 'Other', value: 3 },
      ],
    },
    {
      name: 'age',
      type: 'numeric',
      label: 'Age (Years)',
      placeholder: "Enter pet's age (in years)",
      keyboardType: 'numeric',
    },
    {
      name: 'fixed',
      type: 'dropdown',
      label: 'Fixed',
      placeholder: 'Is the pet fixed?',
      options: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 2 },
      ],
    },
    {
      name: 'breed_id',
      type: 'dropdown',
      label: 'Breed',
      placeholder: 'Select Breed',
      options: [], // Will be populated dynamically
      showEditButton: true,
    },
    {
      name: 'weight',
      type: 'numeric',
      label: 'Weight (lbs)',
      placeholder: "Enter pet's weight (in lbs)",
      keyboardType: 'numeric',
    },
    {
      name: 'size_tier_id',
      type: 'dropdown',
      label: 'Size Tier',
      placeholder: 'Select Size Tier',
      options: [], // Will be populated dynamically
      showEditButton: true,
    },
    {
      name: 'hair_length_id',
      type: 'dropdown',
      label: 'Hair Length',
      placeholder: 'Select Hair Length',
      options: [], // Will be populated dynamically
      showEditButton: true,
    },
    {
      name: 'coat_type_id',
      type: 'dropdown',
      label: 'Coat Type',
      placeholder: 'Select Coat Type',
      options: [], // Will be populated dynamically
      showEditButton: true,
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Notes',
      placeholder: 'Enter any notes about the pet',
      multiline: true,
      numberOfLines: 4, // Starting height
    },
  ],
};
