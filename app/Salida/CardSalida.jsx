
import { Link } from "expo-router";
import { styled } from "nativewind";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const StyledPressable = styled(Pressable);

export function CardSalida({ salida }) {
  return (
    <Link href={`/Salida/${salida.Id}`} asChild>
      <StyledPressable className="active:opacity-70 border border-black active:border-white/50 mb-2 bg-gray-500/10 rounded-xl p-4">
        <View className="flex-row gap-4" key={salida.Id}>
          <Image source={{ uri: "https://www.metacritic.com/a/img/resize/d2a1f94b634e73c11a1d66c0015d6b68b462930b/catalog/provider/7/2/7-1740205852.jpg?auto=webp&fit=cover&height=300&width=200" }} 
            style={styles.image} />
          <View className="flex-shrink">
            <Text className="mb-1" style={styles.title}>
              {salida.LugarSalida}
            </Text>
            <Text className="mb-1" style={styles.title}>
              {salida.MotivoSalida}
            </Text>
            <Text className="mb-1" style={styles.title}>
              {salida.FechaSalida}
            </Text>
            <Text className="mb-1" style={styles.title}>
              {salida.EstadoSalida}
            </Text>
            <Text className="mb-1" style={styles.title}>
              {salida.TipoSalida}
            </Text>
          </View>
        </View>
      </StyledPressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 42,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#eee",
  },
});
