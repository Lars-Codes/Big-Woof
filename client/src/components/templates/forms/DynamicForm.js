import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import CustomTextInput from '../../atoms/CustomTextInput/CustomTextInput';
import FormDropdown from '../../molecules/Form/FormDropdown/FormDropdown';

export default function DynamicForm({
  formConfig,
  initialData = null,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(formConfig.initialFormState);
  const [errors, setErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState({});
  const refs = useRef({});

  // Create refs dynamically for each field
  useEffect(() => {
    formConfig.fields.forEach((field) => {
      if (!refs.current[field.name]) {
        refs.current[field.name] = React.createRef();
      }
    });
  }, [formConfig.fields]);

  // Pre-fill form if editing
  useEffect(() => {
    if (initialData) {
      const populatedForm = { ...formConfig.initialFormState };
      Object.keys(initialData).forEach((key) => {
        if (Object.hasOwn(populatedForm, key)) {
          populatedForm[key] = initialData[key] || '';
        }
      });
      setForm(populatedForm);
    }
  }, [initialData, formConfig.initialFormState]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
      setErrorMessages((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const newErrorMessages = {};
    let isValid = true;

    formConfig.fields.forEach((field) => {
      if (field.required && !form[field.name]?.toString().trim()) {
        newErrors[field.name] = true;
        newErrorMessages[field.name] = `${field.label} is required`;
        isValid = false;
      }

      if (field.validation && form[field.name]) {
        const validationResult = field.validation(form[field.name]);
        if (!validationResult.isValid) {
          newErrors[field.name] = true;
          newErrorMessages[field.name] = validationResult.message;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setErrorMessages(newErrorMessages);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(form);
  };

  const isFormValid = () => {
    return formConfig.fields
      .filter((field) => field.required)
      .every((field) => form[field.name]?.toString().trim() !== '');
  };

  const getNextFieldRef = (currentIndex) => {
    const nextField = formConfig.fields[currentIndex + 1];
    return nextField ? refs.current[nextField.name] : null;
  };

  const renderField = (field, index) => {
    const commonProps = {
      ref: refs.current[field.name],
      value: form[field.name],
      error: errors[field.name],
      errorMessage: errorMessages[field.name],
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'numeric':
        return (
          <CustomTextInput
            key={field.name}
            {...commonProps}
            onChangeText={(text) => handleChange(field.name, text)}
            label={field.label}
            placeholder={field.placeholder}
            required={field.required}
            keyboardType={field.keyboardType}
            autoCapitalize={field.autoCapitalize}
            multiline={field.multiline}
            numberOfLines={field.numberOfLines}
            returnKeyType={
              field.multiline
                ? 'default'
                : index === formConfig.fields.length - 1
                  ? 'done'
                  : 'next'
            }
            onSubmitEditing={() => {
              if (!field.multiline) {
                const nextRef = getNextFieldRef(index);
                if (nextRef) {
                  nextRef.current?.focus();
                } else {
                  Keyboard.dismiss();
                }
              }
            }}
          />
        );

      case 'dropdown':
        return (
          <FormDropdown
            key={field.name}
            {...commonProps}
            label={field.label}
            options={field.options}
            selectedOption={form[field.name]}
            onSelect={(value) => handleChange(field.name, value)}
            onAfterSelect={() => {
              const nextRef = getNextFieldRef(index);
              nextRef?.current?.focus();
            }}
            placeholder={field.placeholder}
            required={field.required}
            showEditButton={field.showEditButton}
            handleAdd={field.handleAdd}
            handleDelete={field.handleDelete}
          />
        );

      default:
        return null;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 bg-white">
        <ScrollView
          className="flex-1 px-4 mt-20"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
        >
          {formConfig.fields.map((field, index) => renderField(field, index))}
        </ScrollView>

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.7}
          className="bg-blue-500 p-4 items-center"
          disabled={!isFormValid() || loading}
          style={{
            opacity: isFormValid() && !loading ? 1 : 0.5,
          }}
        >
          <Text className="font-hn-bold text-white text-2xl mb-4">
            {formConfig.submitButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
