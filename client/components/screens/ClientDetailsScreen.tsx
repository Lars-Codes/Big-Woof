import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../styles/theme';
import { Phone, Mail, MapPin, Edit, ChevronRight, ArrowLeft, Trash2 } from 'lucide-react-native';
import Card from '../ui/Card';
import ScreenHeader from '../ui/ScreenHeader';
import { useClientDetails } from '../../hooks/useClientDetails';
import { deleteClients } from '../../services/clientService';
import { PetDetails } from '../../types/client';

type ClientDetailsRouteProp = RouteProp<RootStackParamList, 'ClientDetails'>;
type ClientDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'ClientDetails'>;

const ClientDetailsScreen: React.FC = () => {
  const route = useRoute<ClientDetailsRouteProp>();
  const navigation = useNavigation<ClientDetailsNavigationProp>();
  const { id } = route.params;
  const { client, loading, error, refreshClient } = useClientDetails(id);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to handle client deletion
  const handleDeleteClient = () => {
    Alert.alert(
      "Delete Client",
      `Are you sure you want to delete ${client?.fullName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            if (!client) return;
            
            setIsDeleting(true);
            try {
              await deleteClients([parseInt(client.id)]);
              navigation.goBack();
            } catch (err) {
              Alert.alert("Error", "Failed to delete client");
              setIsDeleting(false);
            }
          } 
        }
      ]
    );
  };

  // Render a pet card
  const renderPetCard = (pet: PetDetails) => (
    <Card key={pet.id} style={styles.petCard}>
      <TouchableOpacity
        style={styles.petCardContent}
        onPress={() => navigation.navigate('PetDetails', { 
          clientId: id, 
          petId: pet.id 
        })}
      >
        <View style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petDetails}>
            {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.sizeTier}
          </Text>
          {pet.deceased && (
            <View style={styles.deceasedBadge}>
              <Text style={styles.deceasedText}>Deceased</Text>
            </View>
          )}
        </View>
        <ChevronRight color={COLORS.primary} size={24} />
      </TouchableOpacity>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading client details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshClient}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Client not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{client.fullName}</Text>
          <View style={styles.headerRightContainer}>
            <TouchableOpacity 
              style={styles.editButton}
              // onPress={() => navigation.navigate('EditClient', { id })}
            >
              <Edit color={COLORS.primary} size={20} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteClient}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color={COLORS.error} />
              ) : (
                <Trash2 color={COLORS.error} size={20} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScreenHeader>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contact Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Phone color={COLORS.secondary} size={20} />
            <Text style={styles.contactText}>{client.phone || 'No phone number'}</Text>
          </View>
          
          {client.secondaryPhone && (
            <View style={styles.contactItem}>
              <Phone color={COLORS.secondary} size={20} />
              <Text style={styles.contactText}>{client.secondaryPhone} (Secondary)</Text>
            </View>
          )}
          
          <View style={styles.contactItem}>
            <Mail color={COLORS.secondary} size={20} />
            <Text style={styles.contactText}>{client.email || 'No email address'}</Text>
          </View>
          
          {client.secondaryEmail && (
            <View style={styles.contactItem}>
              <Mail color={COLORS.secondary} size={20} />
              <Text style={styles.contactText}>{client.secondaryEmail} (Secondary)</Text>
            </View>
          )}
          
          {client.address && (
            <View style={styles.contactItem}>
              <MapPin color={COLORS.secondary} size={20} />
              <Text style={styles.contactText}>{client.address}</Text>
            </View>
          )}
        </Card>
        
        {/* Payment Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {client.paymentTypes && client.paymentTypes.length > 0 ? (
            client.paymentTypes.map((method: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
              <Text key={index} style={styles.paymentMethod}>{method}</Text>
            ))
          ) : (
            <Text style={styles.emptyText}>No payment methods on file</Text>
          )}
        </Card>
        
        {/* Client Stats */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Client Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{client.stats.totalAppointments}</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{client.stats.noShows}</Text>
              <Text style={styles.statLabel}>No Shows</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{client.stats.lateAppointments}</Text>
              <Text style={styles.statLabel}>Late</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${client.stats.totalSpent}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>
        </Card>
        
        {/* Notes */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          {client.notes ? (
            <Text style={styles.notes}>{client.notes}</Text>
          ) : (
            <Text style={styles.emptyText}>No notes</Text>
          )}
        </Card>
        
        {/* Pets Section */}
        <View style={styles.petsSection}>
          <View style={styles.petsSectionHeader}>
            <Text style={styles.sectionTitle}>Pets</Text>
            <TouchableOpacity 
              style={styles.addPetButton}
              onPress={() => navigation.navigate('AddPet', { clientId: id })}
            >
              <Text style={styles.addPetButtonText}>Add Pet</Text>
            </TouchableOpacity>
          </View>
          
          {client.pets && client.pets.length > 0 ? (
            <View style={styles.petsList}>
              {client.pets.map((pet: any) => renderPetCard(pet))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No pets added yet</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  contactText: {
    marginLeft: SPACING.sm,
    color: COLORS.secondary,
    fontSize: FONTS.sizes.md,
  },
  paymentMethod: {
    color: COLORS.secondary,
    fontSize: FONTS.sizes.md,
    marginBottom: SPACING.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '22%',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.secondary,
  },
  notes: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
    lineHeight: 22,
  },
  petsSection: {
    marginBottom: SPACING.md,
  },
  petsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addPetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  addPetButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
  },
  petsList: {
    marginTop: SPACING.sm,
  },
  petCard: {
    marginBottom: SPACING.sm,
    padding: 0,
  },
  petCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold as any,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  petDetails: {
    fontSize: FONTS.sizes.md,
    color: COLORS.secondary,
  },
  deceasedBadge: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xs,
    alignSelf: 'flex-start',
  },
  deceasedText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium as any,
  },
  emptyText: {
    color: COLORS.secondary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.medium as any,
  },
});

export default ClientDetailsScreen;