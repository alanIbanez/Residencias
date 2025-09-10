
import { Text, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { Screen } from '../../components/Layout/Screen';
export default function MainAbout() {
  return (
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => null,
        }}
      />
      <View>
        <Text style={{ fontSize: 24 }}>About</Text>
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
