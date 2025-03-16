import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  DollarSign,
  Clock,
} from "lucide-react-native";
import { Service } from "../../data";
import { useServices } from "../../data";

const ServicesScreen = () => {
  // State for editing/creating service
  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useServices();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prices: {
      Small: "",
      Medium: "",
      Large: "",
    },
    duration: "",
    active: true,
  });

  // Open modal for creating new service
  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      prices: {
        Small: "",
        Medium: "",
        Large: "",
      },
      duration: "",
      active: true,
    });
    setModalVisible(true);
  };

  // Open modal for editing service
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      prices: {
        Small: String(service.prices.Small),
        Medium: String(service.prices.Medium),
        Large: String(service.prices.Large),
      },
      duration: String(service.duration),
      active: service.active,
    });
    setModalVisible(true);
  };

  // Handle text input changes
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle price changes
  const handlePriceChange = (size: string, value: string) => {
    setFormData({
      ...formData,
      prices: {
        ...formData.prices,
        [size]: value,
      },
    });
  };

  // Toggle service active status
  const toggleServiceStatus = (id: string) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  };

  // Delete service
  const handleDeleteService = (id: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setServices(services.filter((service) => service.id !== id));
          },
        },
      ]
    );
  };

  // Save service (create or update)
  const handleSaveService = () => {
    // Validate form
    if (!formData.name) {
      Alert.alert("Missing Information", "Please enter a service name");
      return;
    }

    if (
      !formData.prices.Small ||
      !formData.prices.Medium ||
      !formData.prices.Large
    ) {
      Alert.alert(
        "Missing Information",
        "Please enter prices for all pet sizes"
      );
      return;
    }

    if (!formData.duration) {
      Alert.alert("Missing Information", "Please enter a service duration");
      return;
    }

    // Convert string values to numbers
    const processedFormData = {
      ...formData,
      prices: {
        Small: parseFloat(formData.prices.Small),
        Medium: parseFloat(formData.prices.Medium),
        Large: parseFloat(formData.prices.Large),
      },
      duration: parseInt(formData.duration),
    };

    if (editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id
            ? { ...service, ...processedFormData }
            : service
        )
      );
    } else {
      // Create new service
      const newService = {
        id: String(Date.now()), // Simple way to generate unique ID
        ...processedFormData,
      };
      setServices([...services, newService]);
    }

    // Close modal
    setModalVisible(false);
  };

  // Render each service item
  const renderServiceItem = ({ item }: { item: Service }) => (
    <View
      style={{
        backgroundColor: "#F5FBEF",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        opacity: item.active ? 1 : 0.6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "#503D42", fontSize: 18 }}>
            {item.name}
          </Text>
          <Text style={{ color: "#748B75", marginBottom: 8 }}>
            {item.description}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Clock color="#748B75" size={16} />
            <Text style={{ marginLeft: 8, color: "#748B75" }}>
              {item.duration} min
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#503D42" }}>
                Small: ${item.prices.Small}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#503D42" }}>
                Medium: ${item.prices.Medium}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#503D42" }}>
                Large: ${item.prices.Large}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
            onPress={() => handleEditService(item)}
          >
            <Edit2 color="#503D42" size={16} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => handleDeleteService(item.id)}
          >
            <Trash2 color="#FF6B6B" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#748B75" }}>
          {item.active ? "Active" : "Inactive"}
        </Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 8,
            backgroundColor: item.active ? "#503D42" : "#748B75",
          }}
          onPress={() => toggleServiceStatus(item.id)}
        >
          <Text style={{ color: "white" }}>
            {item.active ? "Deactivate" : "Activate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#503D42" }}>
          Services
        </Text>
        <Text style={{ color: "#748B75" }}>
          Manage your grooming services and pricing
        </Text>
      </View>

      {/* Services List */}
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              color: "#748B75",
              fontStyle: "italic",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            No services found. Add your first service to get started.
          </Text>
        }
      />

      {/* Add Service Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 24,
          bottom: 24,
          backgroundColor: "#503D42",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={handleAddService}
      >
        <Plus color="#fff" size={24} />
      </TouchableOpacity>

      {/* Service Edit/Create Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: 16,
              maxHeight: "86%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#503D42" }}
              >
                {editingService ? "Edit Service" : "Add Service"}
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#F5FBEF",
                  borderRadius: 16,
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setModalVisible(false)}
              >
                <X color="#503D42" size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: "100%" }}>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: "#748B75", marginBottom: 4 }}>
                  Service Name
                </Text>
                <TextInput
                  style={{
                    backgroundColor: "#F5FBEF",
                    borderRadius: 8,
                    padding: 12,
                    color: "#503D42",
                  }}
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  placeholder="Enter service name"
                  placeholderTextColor="#A8BCAA"
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: "#748B75", marginBottom: 4 }}>
                  Description
                </Text>
                <TextInput
                  style={{
                    backgroundColor: "#F5FBEF",
                    borderRadius: 8,
                    padding: 12,
                    color: "#503D42",
                    height: 80,
                    textAlignVertical: "top",
                  }}
                  value={formData.description}
                  onChangeText={(text) => handleChange("description", text)}
                  placeholder="Describe the service..."
                  placeholderTextColor="#A8BCAA"
                  multiline
                />
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: "#748B75", marginBottom: 8 }}>
                  Price by Pet Size
                </Text>

                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: "#748B75", marginBottom: 4 }}>
                      Small
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5FBEF",
                        borderRadius: 8,
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <DollarSign color="#748B75" size={16} />
                      <TextInput
                        style={{ flex: 1, color: "#503D42" }}
                        value={formData.prices.Small}
                        onChangeText={(text) =>
                          handlePriceChange("Small", text)
                        }
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#A8BCAA"
                      />
                    </View>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "#748B75", marginBottom: 4 }}>
                      Medium
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#F5FBEF",
                        borderRadius: 8,
                        padding: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <DollarSign color="#748B75" size={16} />
                      <TextInput
                        style={{ flex: 1, color: "#503D42" }}
                        value={formData.prices.Medium}
                        onChangeText={(text) =>
                          handlePriceChange("Medium", text)
                        }
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor="#A8BCAA"
                      />
                    </View>
                  </View>
                </View>

                <View>
                  <Text style={{ color: "#748B75", marginBottom: 4 }}>
                    Large
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#F5FBEF",
                      borderRadius: 8,
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <DollarSign color="#748B75" size={16} />
                    <TextInput
                      style={{ flex: 1, color: "#503D42" }}
                      value={formData.prices.Large}
                      onChangeText={(text) => handlePriceChange("Large", text)}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#A8BCAA"
                    />
                  </View>
                </View>
              </View>

              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: "#748B75", marginBottom: 4 }}>
                  Duration (minutes)
                </Text>
                <View
                  style={{
                    backgroundColor: "#F5FBEF",
                    borderRadius: 8,
                    padding: 12,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Clock color="#748B75" size={16} />
                  <TextInput
                    style={{ flex: 1, marginLeft: 8, color: "#503D42" }}
                    value={formData.duration}
                    onChangeText={(text) => handleChange("duration", text)}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#A8BCAA"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: "#503D42",
                  borderRadius: 8,
                  padding: 16,
                  alignItems: "center",
                  marginTop: 16,
                }}
                onPress={handleSaveService}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  {editingService ? "Update Service" : "Add Service"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ServicesScreen;
