import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import { Plus, Search, ChevronRight, X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../styles/theme";
import Card from "../ui/Card";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import { clients, Client } from "@/data";
import ScreenHeader from "../ui/ScreenHeader";
import AddButton from "../ui/AddButton";

// Define the type for the navigation prop
type ClientsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Clients"
>;

const ClientsScreen: React.FC = () => {
  const navigation = useNavigation<ClientsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Filter clients based on search query
  const filteredClients = searchQuery
    ? clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.pets.some((pet) =>
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : clients;

  const renderClientItem = (client: Client) => (
    <Card key={client.id} style={styles.clientCard}>
      <TouchableOpacity
        style={styles.clientCardContent}
        onPress={() => {
          navigation.navigate("ClientDetails", { id: client.id });
        }}
      >
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientPhone}>{client.phone}</Text>
          <Text style={styles.clientDetails}>
            {client.pets.length} {client.pets.length === 1 ? "pet" : "pets"} •
            Last visit: {client.lastVisit}
          </Text>
        </View>
        <ChevronRight color={COLORS.primary} size={24} />
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header with search */}
      <ScreenHeader>
        {isSearchActive ? (
          <View style={styles.searchActive}>
            <View style={styles.searchInputContainer}>
              <Search color={COLORS.secondary} size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search clients or pets..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                placeholderTextColor={COLORS.secondary}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X color={COLORS.secondary} size={20} />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsSearchActive(false);
                setSearchQuery("");
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.headerDefault}>
            <Text style={styles.headerTitle}>Clients</Text>
            <TouchableOpacity onPress={() => setIsSearchActive(true)}>
              <Search color={COLORS.primary} size={24} />
            </TouchableOpacity>
          </View>
        )}
      </ScreenHeader>

      {/* Client List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredClients.length > 0 ? (
          <View style={styles.clientsContainer}
          >{filteredClients.map(renderClientItem)}</View>
        ) : (
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No matching clients found."
              : "No clients yet. Add your first client!"}
          </Text>
        )}
      </ScrollView>

      {/* Add Client Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate("AddClient");
        }}
      >
        <Plus color={COLORS.white} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerDefault: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  searchActive: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
  },
  cancelButton: {
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  cancelText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },
  scrollContainer: {
    padding: SPACING.md,
  },
  clientsContainer: {
    marginBottom: SPACING.xxl + 34,
  },
  clientCard: {
    backgroundColor: COLORS.background,
    marginBottom: SPACING.sm,
    padding: 0, // Reset Card padding since we have our own
  },
  clientCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    fontSize: FONTS.sizes.lg,
    marginBottom: SPACING.xs,
  },
  clientPhone: {
    color: COLORS.secondary,
    marginBottom: SPACING.xs,
  },
  clientDetails: {
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  emptyText: {
    color: COLORS.secondary,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: SPACING.md,
  },
  fab: {
    position: "absolute",
    right: SPACING.lg,
    bottom: SPACING.lg,
    backgroundColor: COLORS.primary,
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
  },
});

export default ClientsScreen;
