
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { 
  ActivityIndicator, 
  ScrollView, 
  Text, 
  View, 
  Pressable, 
  TextInput, 
  Alert, 
  StyleSheet 
} from 'react-native';
import { Screen } from '../../components/Layout/Screen';
import { GradientContainer } from '../../components/GradientContainer';
import { StatusBadge } from '../../components/Salida/StatusBadge';
import { getSalida, updateSalida, getCurrentUser, ESTADOS } from '../../services/salidasStorage';

export default function DetalleSalida() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [salida, setSalida] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenRequested, setTokenRequested] = useState(false);
  const [token, setToken] = useState('');
  const [processing, setProcessing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [salidaData, userData] = await Promise.all([
        getSalida(id),
        getCurrentUser()
      ]);
      
      setSalida(salidaData);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Error loading salida detail:', error);
      Alert.alert('Error', 'No se pudo cargar la información de la salida');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setTokenRequested(false);
        setToken('');
        setProcessing(false);
      };
    }, [])
  );

  const handleRequestToken = () => {
    setTokenRequested(true);
  };

  const handleAction = async (action) => {
    try {
      if (!token.trim()) {
        Alert.alert('Error', 'Debe ingresar un token');
        return;
      }

      setProcessing(true);

      const newEstado = action === 'autorizar' ? ESTADOS.ACEPTADO : ESTADOS.RECHAZADO;
      await updateSalida(id, { estado: newEstado });
      
      const actionText = action === 'autorizar' ? 'autorizada' : 'rechazada';
      Alert.alert(
        'Éxito',
        `Salida ${actionText} exitosamente`,
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error(`Error ${action} salida:`, error);
      Alert.alert('Error', `No se pudo ${action} la salida`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <GradientContainer>
        <Screen>
          <Stack.Screen
            options={{
              headerTitle: 'Detalle de salida',
              headerLeft: () => {},
              headerRight: () => {},
            }}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color="white" size="large" />
            <Text style={{ color: 'white', marginTop: 16 }}>Cargando...</Text>
          </View>
        </Screen>
      </GradientContainer>
    );
  }

  if (!salida) {
    return (
      <GradientContainer>
        <Screen>
          <Stack.Screen
            options={{
              headerTitle: 'Detalle de salida',
              headerLeft: () => {},
              headerRight: () => {},
            }}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 18 }}>Salida no encontrada</Text>
          </View>
        </Screen>
      </GradientContainer>
    );
  }

  const canModify = currentUser?.rol === 'tutor' && salida.estado === ESTADOS.SOLICITUD;
  const isReadOnly = currentUser?.rol === 'residente';

  return (
    <GradientContainer>
      <Screen>
        <Stack.Screen
          options={{
            headerTitle: 'Detalle de salida',
            headerLeft: () => {},
            headerRight: () => {},
          }}
        />
        
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* Header with status */}
            <View style={styles.header}>
              <Text style={styles.title}>{salida.lugar}</Text>
              <StatusBadge estado={salida.estado} size="large" />
            </View>

            {/* Details */}
            <View style={styles.detailsContainer}>
              {salida.tipo && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tipo:</Text>
                  <Text style={styles.detailValue}>{salida.tipo}</Text>
                </View>
              )}

              {salida.fechaSalida && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha de salida:</Text>
                  <Text style={styles.detailValue}>{salida.fechaSalida}</Text>
                </View>
              )}

              {salida.horaSalida && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hora de salida:</Text>
                  <Text style={styles.detailValue}>{salida.horaSalida}</Text>
                </View>
              )}

              {salida.fechaLlegada && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha de llegada:</Text>
                  <Text style={styles.detailValue}>{salida.fechaLlegada}</Text>
                </View>
              )}

              {salida.horaLlegada && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Hora de llegada:</Text>
                  <Text style={styles.detailValue}>{salida.horaLlegada}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Creada:</Text>
                <Text style={styles.detailValue}>
                  {new Date(salida.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* Token workflow for tutors */}
            {canModify && (
              <View style={styles.actionContainer}>
                <Text style={styles.actionTitle}>Autorización</Text>
                
                {!tokenRequested ? (
                  <Pressable
                    onPress={handleRequestToken}
                    style={styles.requestTokenButton}
                  >
                    <Text style={styles.requestTokenButtonText}>Solicitar Token</Text>
                  </Pressable>
                ) : (
                  <View>
                    <View style={styles.tokenInputContainer}>
                      <Text style={styles.tokenLabel}>Token de autorización:</Text>
                      <TextInput
                        style={styles.tokenInput}
                        value={token}
                        onChangeText={setToken}
                        placeholder="Ingrese el token"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                      />
                    </View>

                    <View style={styles.actionButtons}>
                      <Pressable
                        onPress={() => handleAction('rechazar')}
                        disabled={processing || !token.trim()}
                        style={[
                          styles.actionButton,
                          styles.rejectButton,
                          (processing || !token.trim()) && styles.disabledButton
                        ]}
                      >
                        <Text style={styles.rejectButtonText}>
                          {processing ? 'Procesando...' : 'Rechazar'}
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleAction('autorizar')}
                        disabled={processing || !token.trim()}
                        style={[
                          styles.actionButton,
                          styles.approveButton,
                          (processing || !token.trim()) && styles.disabledButton
                        ]}
                      >
                        <Text style={styles.approveButtonText}>
                          {processing ? 'Procesando...' : 'Autorizar'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            )}

            {isReadOnly && (
              <View style={styles.readOnlyMessage}>
                <Text style={styles.readOnlyText}>
                  Vista de solo lectura - No puedes modificar esta salida
                </Text>
              </View>
            )}
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  actionContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  requestTokenButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestTokenButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tokenInputContainer: {
    marginBottom: 20,
  },
  tokenLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tokenInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  rejectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#10b981',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  readOnlyMessage: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  readOnlyText: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
