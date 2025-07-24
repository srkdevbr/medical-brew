import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import MedFormScreen from './screens/MedFormScreen';
import AddMedicationScreen from './screens/AddMedicationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Use the device color scheme to decide between light/dark themes. This also
  // allows the app to respect the system-wide dark mode preference.
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Calculadora de Anestésicos' }}
        />
        <Stack.Screen
          name="MedForm"
          component={MedFormScreen}
          options={({ route }) => ({ title: route.params?.med?.name || 'Cálculo' })}
        />
        <Stack.Screen
          name="AddMedication"
          component={AddMedicationScreen}
          options={{ title: 'Adicionar Anestésico' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}