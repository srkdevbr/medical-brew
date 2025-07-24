import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = 'customMeds';

// This screen allows users to add a new anesthetic medication. The new
// medication is persisted to AsyncStorage and will appear on the home
// screen when the user returns.
export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('mg');
  const [formula, setFormula] = useState('');
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const colors = {
    background: colorScheme === 'dark' ? '#0a0a0a' : '#ffffff',
    text: colorScheme === 'dark' ? '#ffffff' : '#222222',
    inputBackground: colorScheme === 'dark' ? '#1f1f1f' : '#f2f2f2',
    border: colorScheme === 'dark' ? '#333333' : '#cccccc',
    button: colorScheme === 'dark' ? '#2196f3' : '#007AFF',
    buttonText: '#ffffff',
  };

  const saveMedication = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Insira o nome do anestésico.');
      return;
    }
    if (!formula.trim()) {
      setError('Insira a fórmula de cálculo.');
      return;
    }
    const normalizedUnit = unit.trim().toLowerCase();
    if (normalizedUnit !== 'mg' && normalizedUnit !== 'mcg') {
      setError('A unidade deve ser "mg" ou "mcg".');
      return;
    }
    // Validate the formula string by attempting to evaluate it into a function.
    try {
      // eslint-disable-next-line no-eval
      const fn = eval(formula);
      if (typeof fn !== 'function') {
        throw new Error('A fórmula fornecida não é uma função.');
      }
      // Test call the function with dummy values to ensure it returns a number.
      const result = fn(70, 170, 'Masculino');
      if (isNaN(result)) {
        throw new Error('A fórmula não retorna um número válido.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao validar a fórmula. Certifique‑se de que é uma função válida.');
      return;
    }
    // Construct new medication object.
    const newMed = {
      name: name.trim(),
      unit: normalizedUnit,
      formulaString: formula.trim(),
    };
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.push(newMed);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      // Navigate back to the home screen. The home screen will reload
      // medications on focus.
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao salvar o medicamento.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Nome do remédio</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex.: Novo Anestésico"
          placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#888888'}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Unidade (mg ou mcg)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          placeholder="mg ou mcg"
          placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#888888'}
          value={unit}
          onChangeText={setUnit}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Fórmula de cálculo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text, height: 80, textAlignVertical: 'top' }]}
          placeholder="Ex.: peso => peso * 1.5"
          placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#888888'}
          value={formula}
          onChangeText={setFormula}
          multiline
        />
      </View>
      {error && <Text style={[styles.errorText, { color: '#f44336' }]}>{error}</Text>}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.button }]}
        onPress={saveMedication}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: {
    marginVertical: 8,
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});