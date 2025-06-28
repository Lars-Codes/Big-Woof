import { validateEmail } from '../../../../utils/helpers/emailUtil';
import { validatePhoneNumber } from '../../../../utils/helpers/phoneNumberUtil';

export const vetFormConfig = {
  submitButtonText: 'Save Vet',
  initialFormState: {
    fname: '',
    lname: '',
    primary_phone: '',
    secondary_phone: '',
    email: '',
    street_address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
  },
  fields: [
    {
      name: 'fname',
      type: 'text',
      label: 'First Name',
      placeholder: 'Enter first name',
      required: true,
    },
    {
      name: 'lname',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Enter last name',
      required: true,
    },
    {
      name: 'primary_phone',
      type: 'phone',
      label: 'Primary Phone',
      placeholder: '(555) 123-4567',
      required: true,
      keyboardType: 'phone-pad',
      validation: (value) => ({
        isValid: validatePhoneNumber(value),
        message: 'Please enter a valid phone number',
      }),
    },
    {
      name: 'secondary_phone',
      type: 'phone',
      label: 'Secondary Phone',
      placeholder: '(555) 987-6543',
      keyboardType: 'phone-pad',
      validation: (value) => ({
        isValid: !value || validatePhoneNumber(value),
        message: 'Please enter a valid phone number',
      }),
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'vet@example.com',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
      validation: (value) => ({
        isValid: !value || validateEmail(value),
        message: 'Please enter a valid email address',
      }),
    },
    {
      name: 'street_address',
      type: 'text',
      label: 'Street Address',
      placeholder: '123 Main Street',
    },
    {
      name: 'city',
      type: 'text',
      label: 'City',
      placeholder: 'Enter city',
    },
    {
      name: 'state',
      type: 'text',
      label: 'State',
      placeholder: 'Enter state',
    },
    {
      name: 'zip',
      type: 'text',
      label: 'ZIP Code',
      placeholder: '12345',
      keyboardType: 'numeric',
    },
    {
      name: 'notes',
      type: 'text',
      label: 'Notes',
      placeholder: 'Enter any notes about the vet',
    },
  ],
};
