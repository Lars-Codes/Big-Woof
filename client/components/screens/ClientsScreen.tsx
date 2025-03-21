import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Plus,
  Search,
  ChevronRight,
  X,
  Trash2,
  Check,
  ChevronLeft,
  ChevronDown,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../styles/theme";
import Card from "../ui/Card";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import ScreenHeader from "../ui/ScreenHeader";
import AddButton from "../ui/AddButton";
import { useClients, ApiClient } from "../../hooks/useClients";

// Define the type for the navigation prop
type ClientsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Clients"
>;

const ClientsScreen: React.FC = () => {
  const navigation = useNavigation<ClientsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const {
    clients,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    selectedClientIds,
    setSelectedClientIds,
    isDeleting,
    nextPage,
    prevPage,
    toggleSelectClient,
    selectAllClients,
    deleteSelectedClients,
    refreshClients,
  } = useClients();

  // Filter clients based on search query
  const filteredClients = searchQuery
    ? clients.filter(
        (client) =>
          `${client.fname} ${client.lname}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          client.pets.some((pet) =>
            pet.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : clients;

  const handleDeleteSelected = () => {
    if (selectedClientIds.length === 0) {
      Alert.alert("No clients selected", "Please select clients to delete.");
      return;
    }

    Alert.alert(
      "Delete Clients",
      `Are you sure you want to delete ${selectedClientIds.length} client(s)?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteSelectedClients,
        },
      ]
    );
  };

  const renderClientItem = (client: ApiClient) => (
    <Card key={client.id} style={styles.clientCard}>
      <TouchableOpacity
        style={styles.clientCardContent}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelectClient(client.id);
          } else {
            navigation.navigate("ClientDetails", { id: client.id.toString() });
          }
        }}
        onLongPress={() => {
          if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleSelectClient(client.id);
          }
        }}
      >
        {isSelectionMode && (
          <View
            style={[
              styles.checkboxContainer,
              selectedClientIds.includes(client.id) && styles.checkboxSelected,
            ]}
          >
            {selectedClientIds.includes(client.id) && (
              <Check color={COLORS.white} size={16} />
            )}
          </View>
        )}
        <View style={styles.clientInfo}>
          <Text
            style={styles.clientName}
          >{`${client.fname} ${client.lname}`}</Text>
          <Text style={styles.clientPhone}>{client.phone_number}</Text>
          <Text style={styles.clientDetails}>
            {client.pets.length} {client.pets.length === 1 ? "pet" : "pets"} •
            {client.last_visit
              ? ` Last visit: ${client.last_visit}`
              : " No visits yet"}
          </Text>
        </View>
        {!isSelectionMode && <ChevronRight color={COLORS.primary} size={24} />}
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
        ) : isSelectionMode ? (
          <View style={styles.selectionHeader}>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedClientIds([]);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.selectionText}>
              {selectedClientIds.length} selected
            </Text>
            <View style={styles.selectionActions}>
              <TouchableOpacity
                style={styles.selectionButton}
                onPress={selectAllClients}
              >
                <Text style={styles.actionText}>
                  {selectedClientIds.length === clients.length
                    ? "Deselect All"
                    : "Select All"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.deleteButton,
                  selectedClientIds.length === 0 && styles.deleteButtonDisabled,
                ]}
                onPress={handleDeleteSelected}
                disabled={selectedClientIds.length === 0 || isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Trash2 color={COLORS.white} size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.headerDefault}>
            <Text style={styles.headerTitle}>Clients</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsSelectionMode(true)}
              >
                <Check color={COLORS.primary} size={24} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setIsSearchActive(true)}
              >
                <Search color={COLORS.primary} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScreenHeader>

      {/* Loading/Error States */}
      {loading && !clients.length ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading clients...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshClients}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Client List */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {filteredClients.length > 0 ? (
              <View style={styles.clientsContainer}>
                {filteredClients.map(renderClientItem)}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No matching clients found."
                  : "No clients yet. Add your first client!"}
              </Text>
            )}
          </ScrollView>

          {/* Pagination */}
          {totalPages > 1 && !isSearchActive && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  page === 1 && styles.paginationButtonDisabled,
                ]}
                onPress={prevPage}
                disabled={page === 1}
              >
                <ChevronLeft
                  color={page === 1 ? COLORS.secondary : COLORS.primary}
                  size={24}
                />
              </TouchableOpacity>
              <Text style={styles.paginationText}>
                Page {page} of {totalPages}
              </Text>
              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  page === totalPages && styles.paginationButtonDisabled,
                ]}
                onPress={nextPage}
                disabled={page === totalPages}
              >
                <ChevronRight
                  color={
                    page === totalPages ? COLORS.secondary : COLORS.primary
                  }
                  size={24}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Add Button (hide when in selection mode) */}
      {!isSelectionMode && (
        <AddButton navigation={navigation} location="AddClient" />
      )}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: SPACING.md,
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.secondary,
    fontSize: FONTS.sizes.md,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  paginationButton: {
    padding: SPACING.sm,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
    marginHorizontal: SPACING.md,
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  selectionText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
    fontSize: FONTS.sizes.md,
  },
  selectionActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectionButton: {
    marginLeft: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  actionText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: SPACING.md,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
});

export default ClientsScreen;
