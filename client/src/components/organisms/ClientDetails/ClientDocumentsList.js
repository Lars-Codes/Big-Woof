import { FileText, Download, Eye } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectClientDocuments } from '../../../state/clientDetails/clientDetailsSlice';

export default function ClientDocumentsList() {
  const clientDocuments = useSelector(selectClientDocuments);

  if (!clientDocuments?.documents || clientDocuments.documents.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mb-20">
        <FileText size={48} color="#D1D5DB" />
        <Text className="text-lg font-hn-medium mt-4 text-center">
          No Documents
        </Text>
        <Text className="text-sm font-hn-regular text-gray-800 mt-2 text-center">
          Upload documents to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {clientDocuments?.documents.map((document, index) => (
        <View
          key={document.id}
          className={`bg-white rounded-lg p-4 ${
            index === 0 ? 'mt-4' : 'mt-2'
          } ${index === clientDocuments.length - 1 ? 'mb-4' : 'mb-2'}`}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-2">
                <FileText size={16} color="#4A90E2" />
                <Text className="text-lg font-hn-medium ml-2 flex-1">
                  {document.document_name}
                </Text>
              </View>

              <Text className="text-sm font-hn-regular mb-1">
                Type: {document.document_type}
              </Text>

              {document.description && (
                <Text className="text-sm font-hn-regular mb-1">
                  {document.description}
                </Text>
              )}

              <Text className="text-xs font-hn-regular">
                File: {document.initial_filename}
              </Text>

              {document.pet_id !== -1 && (
                <Text className="text-xs font-hn-regular text-blue-600 mt-1">
                  Pet-specific document
                </Text>
              )}
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className="p-2 mr-2"
                onPress={() => {}}
                activeOpacity={0.7}
              >
                <Eye size={20} color="#4A90E2" />
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2"
                onPress={() => {}}
                activeOpacity={0.7}
              >
                <Download size={20} color="#4A90E2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
