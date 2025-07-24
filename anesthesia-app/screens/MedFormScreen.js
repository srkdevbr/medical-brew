import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { DEFAULT_MEDICATIONS } from './HomeScreen';

// This screen presents a form to collect patient information and compute the
// recommended dose for a selected anesthetic. It accepts a `med` object via
// route params that contains a `name`, `unit` and `formulaString`.
export default function MedFormScreen({ route }) {
  const { med } = route.params;
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [sexo, setSexo] = useState('Masculino');
  const [dose, setDose] = useState(null);
  const [error, setError] = useState(null);
  const colorScheme = useColorScheme();

  const colors = {
    background: colorScheme === 'dark' ? '#0a0a0a' : '#ffffff',
    text: colorScheme === 'dark' ? '#ffffff' : '#222222',
    inputBackground: colorScheme === 'dark' ? '#1f1f1f' : '#f2f2f2',
    border: colorScheme === 'dark' ? '#333333' : '#cccccc',
    button: colorScheme === 'dark' ? '#2196f3' : '#007AFF',
    buttonText: '#ffffff',
    highlight: colorScheme === 'dark' ? '#4caf50' : '#4caf50',
  };

  // Convert user input into a float while handling commas and empty strings.
  const parseNumber = (value) => {
    if (!value) return NaN;
    // Replace comma with dot for decimal separation (common in Brazil).
    const normalized = value.replace(/,/g, '.');
    return parseFloat(normalized);
  };

  const calculateDose = () => {
    setError(null);
    setDose(null);
    const pesoNum = parseNumber(peso);
    const alturaNum = parseNumber(altura);
    if (isNaN(pesoNum) || pesoNum <= 0) {
      setError('Peso inválido. Insira um número positivo.');
      return;
    }
    if (altura && (isNaN(alturaNum) || alturaNum <= 0)) {
      setError('Altura inválida. Insira um número positivo.');
      return;
    }
    if (!sexo) {
      setError('Selecione o sexo.');
      return;
    }
    try {
      // Evaluate the formula string to obtain a function. The formula should be
      // an arrow function that accepts at least the weight as its first
      // parameter. Additional arguments (altura, sexo) are provided to
      // support custom formulas that depend on these values.
      // eslint-disable-next-line no-eval
      const fn = eval(med.formulaString);
      if (typeof fn !== 'function') {
        throw new Error('A fórmula fornecida não é uma função.');
      }
      const result = fn(pesoNum, alturaNum, sexo);
      if (isNaN(result)) {
        throw new Error('O resultado da fórmula não é um número.');
      }
      setDose(result);
    } catch (err) {
      console.error(err);
      setError('Erro ao calcular a dose. Verifique a fórmula.');
    }
  };

  const copyToClipboard = async () => {
    if (dose === null || dose === undefined) return;
    const text = `${dose.toFixed(2)} ${med.unit}`;
    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado', 'Dose copiada para a área de transferência');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Peso (kg)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          placeholder="Ex.: 70"
          placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#888888'}
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Altura (cm)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, borderColor: colors.border, color: colors.text }]}
          placeholder="Opcional"
          placeholderTextColor={colorScheme === 'dark' ? '#888888' : '#888888'}
          keyboardType="numeric"
          value={altura}
          onChangeText={setAltura}
        />
      </View>
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Sexo</Text>
        <View style={styles.sexContainer}>
          {['Masculino', 'Feminino'].map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sexButton, {
                backgroundColor: sexo === option ? colors.button : colors.inputBackground,
                borderColor: colors.border,
              }]}
              onPress={() => setSexo(option)}
            >
              <Text style={{ color: sexo === option ? colors.buttonText : colors.text }}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: '#f44336' }]}>{error}</Text>
      )}
      <TouchableOpacity
        style={[styles.calculateButton, { backgroundColor: colors.button }]}
        onPress={calculateDose}
      >
        <Text style={[styles.calculateButtonText, { color: colors.buttonText }]}>Calcular dose</Text>
      </TouchableOpacity>
      {dose != null && (
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: colors.highlight }]}>Dose recomendada</Text>
          <Text style={[styles.doseText, { color: colors.text }]}>
            {dose.toFixed(2)} {med.unit}
          </Text>
          <TouchableOpacity
            style={[styles.copyButton, { backgroundColor: colors.button }]}
            onPress={copyToClipboard}
          >
            <Text style={[styles.copyButtonText, { color: colors.buttonText }]}>Copiar</Text>
          </TouchableOpacity>
        </View>
      )}
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
    height: 44,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sexButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  errorText: {
    marginVertical: 8,
    fontSize: 14,
  },
  calculateButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  calculateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  doseText: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  copyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});