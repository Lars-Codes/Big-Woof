import { CalendarDays } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientAppointments } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientAppointmentsList() {
  const appointments = useSelector(selectClientAppointments);

  if (!appointments) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500 font-hn-medium">
          Loading appointments...
        </Text>
      </View>
    );
  }

  const {
    appointment_stats,
    upcoming_non_recurring_appointments,
    recurring_appointments,
    past_appointments_preview,
    saved_appointment_config,
  } = appointments;

  const hasAnyAppointments =
    upcoming_non_recurring_appointments.length > 0 ||
    recurring_appointments.length > 0 ||
    past_appointments_preview.length > 0 ||
    saved_appointment_config.length > 0;

  if (!hasAnyAppointments) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <CalendarDays size={48} color="#D1D5DB" />
        <Text className="text-lg font-hn-medium mt-4 text-center">
          No Appointments
        </Text>
        <Text className="text-sm font-hn-regular text-gray-800 mt-2 text-center">
          Create appointments to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Appointment Stats */}
      <View className="bg-white rounded-lg p-4 mt-4 mb-2">
        <Text className="text-2xl font-hn-bold text-gray-800 mb-3">
          Appointment Statistics
        </Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-base font-hn-medium text-gray-600">Late:</Text>
          <Text className="text-base font-hn-regular text-gray-800">
            {appointment_stats.num_late}
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-base font-hn-medium text-gray-600">
            No Shows:
          </Text>
          <Text className="text-base font-hn-regular text-gray-800">
            {appointment_stats.num_no_shows}
          </Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-base font-hn-medium text-gray-600">
            Cancelled:
          </Text>
          <Text className="text-base font-hn-regular text-gray-800">
            {appointment_stats.num_cancelled}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-base font-hn-medium text-gray-600">
            Late Cancellations:
          </Text>
          <Text className="text-base font-hn-regular text-gray-800">
            {appointment_stats.num_cancelled_late}
          </Text>
        </View>
      </View>

      {/* Upcoming Appointments */}
      {upcoming_non_recurring_appointments.length > 0 && (
        <>
          <Text className="text-xl font-hn-bold text-gray-800 mt-3 mb-2 px-2">
            Upcoming Appointments
          </Text>
          {upcoming_non_recurring_appointments.map((appointment, index) => (
            <View
              key={appointment.id}
              className={`bg-white rounded-lg p-4 ${
                index === upcoming_non_recurring_appointments.length - 1
                  ? 'mb-2'
                  : 'mb-2'
              }`}
            >
              <Text className="text-lg font-hn-bold text-gray-800 mb-1">
                {appointment.date}
              </Text>
              <Text className="text-base font-hn-regular text-gray-600">
                {appointment.start_time} - {appointment.end_time}
              </Text>
            </View>
          ))}
        </>
      )}

      {/* Recurring Appointments */}
      {recurring_appointments.length > 0 && (
        <>
          <Text className="text-xl font-hn-bold text-gray-800 mt-3 mb-2 px-2">
            Recurring Appointments
          </Text>
          {recurring_appointments.map((appointment, index) => (
            <View
              key={appointment.id}
              className={`bg-white rounded-lg p-4 ${
                index === recurring_appointments.length - 1 ? 'mb-2' : 'mb-2'
              }`}
            >
              <Text className="text-lg font-hn-bold text-gray-800 mb-1">
                Recurring Schedule
              </Text>
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                Start: {appointment.start_recur_date}
              </Text>
              {appointment.end_recur_date && (
                <Text className="text-base font-hn-regular text-gray-600 mb-1">
                  End: {appointment.end_recur_date}
                </Text>
              )}
              <Text className="text-base font-hn-regular text-gray-600">
                Time: {appointment.start_time} - {appointment.end_time}
              </Text>
            </View>
          ))}
        </>
      )}

      {/* Past Appointments Preview */}
      {past_appointments_preview.length > 0 && (
        <>
          <Text className="text-xl font-hn-bold text-gray-800 mt-3 mb-2 px-2">
            Recent Past Appointments
          </Text>
          {past_appointments_preview.map((appointment, index) => (
            <View
              key={appointment.id}
              className={`bg-white rounded-lg p-4 ${
                index === past_appointments_preview.length - 1 ? 'mb-2' : 'mb-2'
              }`}
            >
              <Text className="text-lg font-hn-bold text-gray-800 mb-1">
                {appointment.date}
              </Text>
              <Text className="text-base font-hn-regular text-gray-600 mb-1">
                {appointment.start_time} - {appointment.end_time}
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-sm font-hn-medium text-gray-500">
                  Status: {appointment.appointment_status || 'N/A'}
                </Text>
                <Text className="text-sm font-hn-medium text-gray-500">
                  Payment: {appointment.payment_status || 'N/A'}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Saved Appointment Configs */}
      {saved_appointment_config.length > 0 && (
        <>
          <Text className="text-xl font-hn-bold text-gray-800 mt-3 mb-2 px-2">
            Saved Appointment Templates
          </Text>
          {saved_appointment_config.map((config, index) => (
            <View
              key={config.id}
              className={`bg-white rounded-lg p-4 ${
                index === saved_appointment_config.length - 1 ? 'mb-4' : 'mb-2'
              }`}
            >
              <Text className="text-lg font-hn-bold text-gray-800">
                {config.saved_appointment_name}
              </Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}
