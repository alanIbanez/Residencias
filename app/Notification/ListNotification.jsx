
import { Text, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useNotification } from '../../components/Layout/Notification/ContextNotification';
import { Screen } from '../../components/Layout/Screen';
import { useFocusEffect } from '@react-navigation/core';
import { useCallback } from 'react';

export default function ListNotification() {
  const router = useRouter();
  const { notifications, markAsRead, setPrimaryColor, setDefaultColor } = useNotification();

  const countUnread = notifications.filter((n) => !n.read).length;
  const countRead = notifications.filter((n) => n.read).length;

  // ✅ Función corregida con uso de useCallback para evitar redefinición innecesaria
  const viewNotification = useCallback((item, index) => {
    markAsRead(index);
    router.push({
      pathname: '/Notification/MessageNotification',
      params: {
        message: item.message,
        read: item.read.toString(),
        index: index.toString(),
      },
    });
  }, [markAsRead, router]);

  useFocusEffect(
    useCallback(() => {
      setPrimaryColor(); // Al entrar
      return () => {
        setDefaultColor(); // Al salir
      };
    }, [setPrimaryColor, setDefaultColor])
  );

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => null,
        }}
      />
      <View>
        <Text style={{ fontSize: 24 }}>Notificaciones</Text>
      </View>
      <View>
        <Text>{`Tienes ${countUnread} notificaciones no leídas.`}</Text>
        <Text>{`Tienes ${countRead} notificaciones leídas.`}</Text>
      </View>
      <View>
        <FlatList
          data={notifications.filter(n => n.message && n.message.trim() !== "")}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              style={[
                styles.item,
                { backgroundColor: item.read ? 'white' : '#d0f0c0' },
              ]}
              onPress={() => viewNotification(item, index)} // ✅ Uso correcto
            >
              <Text>{`${index} ${item.message}`}</Text>
              <Text>{item.read ? 'Leído' : 'No leído'}</Text>
            </Pressable>
          )}
        />
      </View>
    </Screen>
  );
}

export const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
});
