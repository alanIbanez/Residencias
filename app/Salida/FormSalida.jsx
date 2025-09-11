import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Screen } from '../../components/Layout/Screen';
import { GradientContainer } from '../../components/GradientContainer';
import { createSalida } from '../../services/salidasStorage';

export default function FormSalida() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    tipo: '',
    fechaSalida: '',
    fechaLlegada: '',
    horaSalida: '',
    horaLlegada: '',
    lugar: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Basic validation - check if required fields are filled
      if (!formData.lugar.trim()) {
        Alert.alert('Error', 'El lugar es requerido');
        return;
      }
      if (!formData.tipo.trim()) {
        Alert.alert('Error', 'El tipo de salida es requerido');
        return;
      }

      setLoading(true);
      
      await createSalida(formData);
      
      Alert.alert(
        'Éxito', 
        'Salida creada exitosamente', 
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error creating salida:', error);
      Alert.alert('Error', 'No se pudo crear la salida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientContainer>
      <Screen>
        <Stack.Screen
          options={{
            headerTitle: 'Nueva salida',
            headerLeft: () => {},
            headerRight: () => {},
          }}
        />
        
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.title}>Solicitar Nueva Salida</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Lugar *</Text>
              <TextInput
                style={styles.input}
                value={formData.lugar}
                onChangeText={(value) => handleInputChange('lugar', value)}
                placeholder="Ej: Centro de la ciudad"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tipo de salida *</Text>
              <TextInput
                style={styles.input}
                value={formData.tipo}
                onChangeText={(value) => handleInputChange('tipo', value)}
                placeholder="Ej: Fin de semana, Diaria"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Fecha de salida</Text>
              <TextInput
                style={styles.input}
                value={formData.fechaSalida}
                onChangeText={(value) => handleInputChange('fechaSalida', value)}
                placeholder="Ej: 2025-09-05"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Hora de salida</Text>
              <TextInput
                style={styles.input}
                value={formData.horaSalida}
                onChangeText={(value) => handleInputChange('horaSalida', value)}
                placeholder="Ej: 14:30"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Fecha de llegada</Text>
              <TextInput
                style={styles.input}
                value={formData.fechaLlegada}
                onChangeText={(value) => handleInputChange('fechaLlegada', value)}
                placeholder="Ej: 2025-09-05"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Hora de llegada</Text>
              <TextInput
                style={styles.input}
                value={formData.horaLlegada}
                onChangeText={(value) => handleInputChange('horaLlegada', value)}
                placeholder="Ej: 18:00"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                onPress={() => router.back()}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                style={[styles.button, styles.submitButton, loading && styles.disabledButton]}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Creando...' : 'Crear Salida'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Screen>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  submitButtonText: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});