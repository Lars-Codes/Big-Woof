import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import {
  Plus,
  Search,
  ChevronRight,
  X,
  Trash2,
  Check,
  ChevronLeft,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from "../../../styles/theme";
import Card from "../../ui/Card";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import ScreenHeader from "../../ui/ScreenHeader";
import AddButton from "../../ui/AddButton";
import { useClients, ApiClient } from "../../../hooks/useClients";
import { searchClients } from "@/services/clientService";

// Define the type for the navigation prop
type ClientsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Clients"
>;

const ClientsScreen: React.FC = () => {
  const navigation = useNavigation<ClientsScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [filteredClients, setFilteredClients] = useState<ApiClient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    clients,
    loading,
    error,
    page,
    pageSize,
    totalPages,
    selectedClientIds,
    isDeleting,
    isPageChanging,
    nextPage,
    prevPage,
    goToPage,
    toggleSelectClient,
    selectAllClients,
    deleteSelectedClients,
    refreshClients,
  } = useClients();

  // Debounce search query
  useEffect(() => {
    // Clear the previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250); // 500ms delay

    // Clean up function to clear timeout when component unmounts
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch clients based on debounced search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (
        isSearchActive &&
        debouncedSearchQuery &&
        debouncedSearchQuery.length > 2
      ) {
        setIsSearching(true);
        try {
          const searchResults = await searchClients(debouncedSearchQuery);
          setFilteredClients(searchResults);
        } catch (err) {
          console.error("Error searching clients:", err);
        } finally {
          setIsSearching(false);
        }
      } else if (!debouncedSearchQuery) {
        setFilteredClients(clients);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, isSearchActive, clients]);

  // Default to showing current page clients when not searching
  useEffect(() => {
    if (!isSearchActive) {
      setFilteredClients(clients);
    }
  }, [clients, isSearchActive]);

  useEffect(() => {
    // When isPageChanging changes from true to false (loading completes)
    if (!isPageChanging && scrollViewRef.current) {
      // Small timeout to ensure the content is rendered
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }
  }, [isPageChanging]);

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const handleSearchCancel = () => {
    setIsSearchActive(false);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

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
          onPress: async () => {
            await deleteSelectedClients();
            setIsSelectionMode(false);
          },
        },
      ]
    );
  };

  // Handle select all for current visible clients
  const handleSelectAll = () => {
    // If in search mode, only select visible filtered clients
    if (isSearchActive && filteredClients.length > 0) {
      const visibleIds = filteredClients.map((client) => client.id);

      // Check if all visible clients are already selected
      const allSelected = visibleIds.every((id) =>
        selectedClientIds.includes(id)
      );

      if (allSelected) {
        // Deselect only the visible clients
        const newSelection = selectedClientIds.filter(
          (id) => !visibleIds.includes(id)
        );
        toggleSelectClient(newSelection);
      } else {
        // Select all visible clients (keeping any previously selected but not visible)
        const newSelection = [
          ...new Set([...selectedClientIds, ...visibleIds]),
        ];
        toggleSelectClient(newSelection);
      }
    } else {
      // Normal select all for current page
      selectAllClients();
    }
  };

  const renderClientItem = (client: ApiClient) => (
    <Card key={client.id} style={styles.clientCard}>
      <TouchableOpacity
        style={styles.clientCardContent}
        onPress={() => {
          if (isSelectionMode) {
            toggleSelectClient([client.id]);
          } else {
            navigation.navigate("ClientDetails", { id: client.id.toString() });
          }
        }}
        onLongPress={() => {
          if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleSelectClient([client.id]);
          }
        }}
      >
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
        {!isSelectionMode && <ChevronRight color={COLORS.primary} size={24} />}
      </TouchableOpacity>
    </Card>
  );

  const renderPagination = () => {
    if (totalPages <= 1 || isSearchActive) return null;

    return (
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
            color={page === totalPages ? COLORS.secondary : COLORS.primary}
            size={24}
          />
        </TouchableOpacity>
      </View>
    );
  };

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
                onChangeText={handleSearchInputChange}
                autoFocus
                placeholderTextColor={COLORS.secondary}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch}>
                  <X color={COLORS.secondary} size={20} />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleSearchCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : isSelectionMode ? (
          <View style={styles.selectionHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsSelectionMode(false);
                toggleSelectClient([]);
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {selectedClientIds.length} selected
              </Text>
            </View>
            <View style={styles.selectionActions}>
              <TouchableOpacity
                style={styles.selectAllButton}
                onPress={handleSelectAll}
              >
                <Text style={styles.selectAllText}>
                  {filteredClients.every((client) =>
                    selectedClientIds.includes(client.id)
                  )
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
                onPress={() => setIsSearchActive(true)}
              >
                <Search color={COLORS.primary} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScreenHeader>

      {isPageChanging && (
        <View style={styles.pageLoadingOverlay}>
          <View style={styles.pageLoadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.pageLoadingText}>Loading page {page}...</Text>
          </View>
        </View>
      )}

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
          {/* Search indicator */}
          {isSearching && (
            <View style={styles.pageLoadingOverlay}>
              <View style={styles.pageLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.pageLoadingText}>Searching...</Text>
              </View>
            </View>
          )}

          {/* Client List */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={
              totalPages > 1
                ? styles.scrollContainerWithPagination
                : styles.scrollContainer
            }
          >
            {filteredClients.length > 0 ? (
              <View style={styles.clientsContainer}>
                {filteredClients.map(renderClientItem)}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                {debouncedSearchQuery
                  ? "No matching clients found."
                  : "No clients yet. Add your first client!"}
              </Text>
            )}

            {/* Pagination is now inside the ScrollView */}
            {renderPagination()}
          </ScrollView>
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
    padding: SPACING.xs,
  },
  searchActive: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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
    paddingBottom: SPACING.xxl + 34, // Add extra padding for the Add button
  },
  scrollContainerWithPagination: {
    padding: SPACING.md,
  },
  clientsContainer: {
    marginBottom: SPACING.md, // Reduced margin to make room for pagination
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
  pageLoadingOverlay: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  pageLoadingContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pageLoadingText: {
    marginTop: SPACING.md,
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.medium as any,
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
    marginVertical: SPACING.sm,
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
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xs,
  },
  selectionInfo: {
    flexGrow: 1,
    alignItems: "center",
  },
  selectionText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold as any,
    fontSize: FONTS.sizes.md,
  },
  selectionActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectAllButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  selectAllText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium as any,
    fontSize: FONTS.sizes.sm,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
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
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
  },
  searchingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xs,
    backgroundColor: COLORS.background,
  },
  searchingText: {
    marginLeft: SPACING.sm,
    color: COLORS.secondary,
    fontSize: FONTS.sizes.sm,
  },
});

export default ClientsScreen;
