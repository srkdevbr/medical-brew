import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Default set of anesthetic medications. Each entry includes a name, unit and
// formula string. The formula is stored as a string for consistency with
// user‑defined medications. When executed it receives the following
// arguments: peso (weight in kg), altura (height in cm) and sexo (string).
export const DEFAULT_MEDICATIONS = [
  {
    name: 'Propofol',
    unit: 'mg',
    formulaString: 'peso => peso * 2.5',
  },
  {
    name: 'Midazolam',
    unit: 'mg',
    formulaString: 'peso => peso * 0.1',
  },
  {
    name: 'Fentanil',
    unit: 'mcg',
    formulaString: 'peso => peso * 1.5',
  },
  {
    name: 'Etomidato',
    unit: 'mg',
    formulaString: 'peso => peso * 0.3',
  },
  {
    name: 'Cetamina',
    unit: 'mg',
    formulaString: 'peso => peso * 1',
  },
];

const STORAGE_KEY = 'customMeds';

export default function HomeScreen() {
  const [medications, setMedications] = useState(DEFAULT_MEDICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const colors = {
    background: colorScheme === 'dark' ? '#0a0a0a' : '#ffffff',
    card: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
    text: colorScheme === 'dark' ? '#ffffff' : '#222222',
    button: colorScheme === 'dark' ? '#2196f3' : '#007AFF',
    separator: colorScheme === 'dark' ? '#2a2a2a' : '#e0e0e0',
  };

  // Load custom medications from AsyncStorage and merge with defaults. This is
  // called whenever the screen gains focus so newly added entries are
  // reflected immediately.
  const loadMedications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Combine defaults and custom entries; custom entries appear after
        // defaults to maintain a predictable ordering.
        setMedications([...DEFAULT_MEDICATIONS, ...parsed]);
      } else {
        setMedications(DEFAULT_MEDICATIONS);
      }
    } catch (error) {
      // In case of error reading from storage, fallback to defaults.
      console.error('Erro ao carregar medicamentos:', error);
      setMedications(DEFAULT_MEDICATIONS);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [])
  );

  // Pull to refresh handler to manually reload medications.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMedications().finally(() => setRefreshing(false));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {medications.map((med, index) => (
          <TouchableOpacity
            key={`${med.name}-${index}`}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.separator }]}
            onPress={() => navigation.navigate('MedForm', { med })}
          >
            <Text style={[styles.cardTitle, { color: colors.text }]}>{med.name}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.text }]}>
              Unidade: {med.unit}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.button }]}
          onPress={() => navigation.navigate('AddMedication')}
        >
          <Text style={styles.addButtonText}>Adicionar novo anestésico</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContainer: {
    paddingBottom: 32,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  addButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});