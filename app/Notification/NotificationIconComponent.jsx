

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NotificationIcon } from '../../components/Layout/Icons';
import { useNotification } from '../../components/Layout/Notification/ContextNotification';

export default function NotificationIconComponent () {
  const router = useRouter();

  const {
    countNotification,
    restartCountNotification,
    iconColor,
  } = useNotification();

  const handlePress = () => {
    router.push('/Notification/ListNotification');
  };

  return (
    <Pressable onPress={handlePress} style={styles.iconContainer}>
      <NotificationIcon color={iconColor} />
      {countNotification > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{countNotification}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
