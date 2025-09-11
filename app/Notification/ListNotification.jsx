
import { Text, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/core';
import { useCallback, useState } from 'react';
import { Screen } from '../../components/Layout/Screen';
import { useNotification } from '../../components/Layout/Notification/ContextNotification';
import { getCurrentUser } from '../../services/salidasStorage';
import { listNotifications, markNotificationRead } from '../../services/notificationsStorage';

export default function ListNotification() {
  const router = useRouter();
  const { setPrimaryColor, setDefaultColor } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const userNotifications = await listNotifications(user.id);
        setNotifications(userNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const countUnread = notifications.filter((n) => !n.read).length;
  const countRead = notifications.filter((n) => n.read).length;

  const viewNotification = useCallback(async (item) => {
    try {
      // Mark as read in persistent storage
      await markNotificationRead(item.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === item.id ? { ...n, read: true } : n)
      );

      // Navigate based on notification content
      if (item.salidaId) {
        // Navigate to salida detail
        router.push(`/Salida/${item.salidaId}`);
      } else {
        // Navigate to generic message screen
        router.push({
          pathname: '/Notification/MessageNotification',
          params: {
            message: item.message,
            read: 'true',
            id: item.id,
          },
        });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
      setPrimaryColor(); // Al entrar
      return () => {
        setDefaultColor(); // Al salir
      };
    }, [loadNotifications, setPrimaryColor, setDefaultColor])
  );

  if (loading) {
    return (
      <Screen>
        <Stack.Screen
          options={{
            headerLeft: () => null,
          }}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 16 }}>Cargando notificaciones...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => null,
        }}
      />
      <View>
        <Text style={{ fontSize: 24 }}>Notificaciones</Text>
        {currentUser && (
          <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 10 }}>
            Usuario: {currentUser.nombre}
          </Text>
        )}
      </View>
      <View>
        <Text>{`Tienes ${countUnread} notificaciones no leídas.`}</Text>
        <Text>{`Tienes ${countRead} notificaciones leídas.`}</Text>
      </View>
      <View>
        {notifications.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ fontSize: 16, color: '#6b7280', textAlign: 'center' }}>
              No tienes notificaciones
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications.filter(n => n.message && n.message.trim() !== "")}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.item,
                  { backgroundColor: item.read ? 'white' : '#d0f0c0' },
                ]}
                onPress={() => viewNotification(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: item.read ? 'normal' : '600' }}>
                    {item.message}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                    {new Date(item.createdAt).toLocaleDateString()} - {item.read ? 'Leído' : 'No leído'}
                  </Text>
                  {item.estado && (
                    <Text style={{ fontSize: 12, color: '#374151', marginTop: 2 }}>
                      Estado: {item.estado}
                    </Text>
                  )}
                </View>
                {item.salidaId && (
                  <View style={{ 
                    backgroundColor: '#3b82f6', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 4,
                    alignSelf: 'flex-start'
                  }}>
                    <Text style={{ color: 'white', fontSize: 10 }}>Salida</Text>
                  </View>
                )}
              </Pressable>
            )}
          />
        )}
      </View>
    </Screen>
  );
}

export const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
});
