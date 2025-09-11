import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Layout/Screen';
import { GradientContainer } from '../../components/GradientContainer';
import { setCurrentUser, listUsers } from '../../services/salidasStorage';

export default function RoleSelect() {
  const router = useRouter();

  const selectRole = async (rol) => {
    try {
      const users = await listUsers();
      const selectedUser = users.find(user => user.rol === rol);
      
      if (selectedUser) {
        await setCurrentUser(selectedUser);
        router.replace('/(tabs)/salida');
      } else {
        Alert.alert('Error', 'Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error selecting role:', error);
      Alert.alert('Error', 'No se pudo seleccionar el rol');
    }
  };

  return (
    <GradientContainer>
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ 
            fontSize: 28, 
            fontWeight: 'bold', 
            color: 'white', 
            textAlign: 'center',
            marginBottom: 40
          }}>
            Selecciona tu rol
          </Text>
          
          <View style={{ width: '100%', maxWidth: 300 }}>
            <Pressable
              onPress={() => selectRole('residente')}
              style={({ pressed }) => ({
                backgroundColor: pressed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                alignItems: 'center',
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }]
              })}
            >
              <Text style={{ 
                fontSize: 20, 
                fontWeight: '600', 
                color: '#16a34a' 
              }}>
                Residente
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: '#374151',
                marginTop: 4,
                textAlign: 'center'
              }}>
                Puedo solicitar salidas
              </Text>
            </Pressable>

            <Pressable
              onPress={() => selectRole('tutor')}
              style={({ pressed }) => ({
                backgroundColor: pressed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.9)',
                padding: 20,
                borderRadius: 12,
                alignItems: 'center',
                transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }]
              })}
            >
              <Text style={{ 
                fontSize: 20, 
                fontWeight: '600', 
                color: '#16a34a' 
              }}>
                Tutor
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: '#374151',
                marginTop: 4,
                textAlign: 'center'
              }}>
                Puedo autorizar o rechazar salidas
              </Text>
            </Pressable>
          </View>
        </View>
      </Screen>
    </GradientContainer>
  );
}