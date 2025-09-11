
import { FlatList, View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { useRouter } from "expo-router";
import { AnimatedCard } from "../../components/Layout/AnimatedCard";
import { Screen } from "../../components/Layout/Screen";
import { GradientContainer } from "../../components/GradientContainer";
import { StatusBadge } from "../../components/Salida/StatusBadge";
import { getCurrentUser, listSalidas } from "../../services/salidasStorage";

export default function ListaSalida() {
  const router = useRouter();
  const [salidas, setSalidas] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        const userSalidas = await listSalidas(user.id);
        setSalidas(userSalidas);
      }
    } catch (error) {
      console.error('Error loading salidas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(loadData);

  const handleCardPress = (salida) => {
    // Only tutors can tap cards to view details
    if (currentUser?.rol === 'tutor') {
      router.push(`/Salida/${salida.id}`);
    }
    // Residents cannot open details (cards disabled)
  };

  const handleCreateNew = () => {
    if (currentUser?.rol === 'residente') {
      router.push('/Salida/FormSalida');
    }
  };

  const renderSalidaCard = ({ item, index }) => {
    const isClickable = currentUser?.rol === 'tutor';
    
    return (
      <AnimatedCard index={index}>
        <Pressable
          onPress={() => handleCardPress(item)}
          disabled={!isClickable}
          style={({ pressed }) => ({
            backgroundColor: isClickable 
              ? (pressed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)')
              : 'rgba(255,255,255,0.7)',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            opacity: isClickable ? (pressed ? 0.8 : 1) : 0.8
          })}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '600', 
                color: '#1f2937',
                marginBottom: 8
              }}>
                {item.lugar}
              </Text>
              {item.tipo && (
                <Text style={{ 
                  fontSize: 14, 
                  color: '#6b7280',
                  marginBottom: 4
                }}>
                  {item.tipo}
                </Text>
              )}
            </View>
            <StatusBadge estado={item.estado} size="small" />
          </View>
        </Pressable>
      </AnimatedCard>
    );
  };

  if (loading) {
    return (
      <GradientContainer>
        <Screen>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16 }}>Cargando...</Text>
          </View>
        </Screen>
      </GradientContainer>
    );
  }

  return (
    <GradientContainer>
      <Screen>
        <View style={{ flex: 1 }}>
          {/* Header section */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: 'bold', 
              color: 'white',
              marginBottom: 8
            }}>
              {currentUser?.rol === 'residente' ? 'Mis Salidas' : 'Salidas del Residente'}
            </Text>
            
            {currentUser?.rol === 'residente' && (
              <Pressable
                onPress={handleCreateNew}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignSelf: 'flex-start'
                })}
              >
                <Text style={{ 
                  color: '#16a34a', 
                  fontWeight: '600',
                  fontSize: 16
                }}>
                  + Nueva Salida
                </Text>
              </Pressable>
            )}
          </View>

          {/* List */}
          {salidas.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ 
                color: 'white', 
                fontSize: 16,
                textAlign: 'center',
                opacity: 0.8
              }}>
                {currentUser?.rol === 'residente' 
                  ? 'No tienes salidas registradas.\n¡Crea tu primera salida!'
                  : 'No hay salidas del residente.'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={salidas}
              keyExtractor={(salida) => salida.id}
              renderItem={renderSalidaCard}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Screen>
    </GradientContainer>
  );
}
