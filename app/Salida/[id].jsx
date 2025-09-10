
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { Screen } from "../../components/Layout/Screen";

export default function DetalleSalida() {
   const salidasLocal = [
    {
      Id: 1,
      LugarSalida: "Parque Nacional Tunari",
      MotivoSalida: "Excursión",
      FechaSalida: "2025-09-05",
      EstadoSalida: "Confirmada",
      TipoSalida: "Fin de semana"
    },
    {
      Id: 2,
      LugarSalida: "Centro de la ciudad",
      MotivoSalida: "Trámite",
      FechaSalida: "2025-09-03",
      EstadoSalida: "Pendiente",
      TipoSalida: "Diaria"
    },
    {
      Id: 3,
      LugarSalida: "Centro de la ciudad",
      MotivoSalida: "Juegos deportivos",
      FechaSalida: "2025-09-03",
      EstadoSalida: "Rechazada",
      TipoSalida: "Fin de semana"
    }
  ];

  const { id } = useLocalSearchParams();
  const [idInfo, setIdInfo] = useState(0);
  const [salidaInfo, setSalidaInfo] = useState(null);

  useEffect(() => {
    if (id) {
      setIdInfo(id);
      setSalidaInfo(salidasLocal.find((salida) => parseInt(id) === salida.Id))
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIdInfo(0);
        setSalidaInfo(null);
      };
    }, [])
  );


  return (
    // <View>
    //   <Text>Detalle de la salida con ID: {id}</Text>
    //   <Text>Detalle de la salida con ID: {idInfo}</Text>
    //   {salidaInfo ? (
    //     <Text>Detalle de salida: {salidaInfo.LugarSalida}</Text>
    //   ) : (
    //     <Text>No se encontró la salida</Text>
    //   )}
    // </View>
    <Screen>
      <Stack.Screen
        options={{
          headerLeft: () => {},
          headerTitle: "Detalle de salida",
          headerRight: () => {},
        }}
      />
      <View>
        {!salidaInfo ? (
          <ActivityIndicator color={"#fff"} size={"large"} />
        ) : (
          <ScrollView>
            <View className="justify-center items-center text-center">
              <Image
                className="mb-4 rounded"
                source={{ uri: "https://www.metacritic.com/a/img/resize/d2a1f94b634e73c11a1d66c0015d6b68b462930b/catalog/provider/7/2/7-1740205852.jpg?auto=webp&fit=cover&height=300&width=200" }}
                style={{ width: 214, height: 294 }}
              />
              <Text className="text-white text-center font-bold text-xl">
                {salidaInfo.LugarSalida}
              </Text>
              <Text className="text-white/70 mt-4 text-left mb-8 text-base">
                {salidaInfo.MotivoSalida}
              </Text>
              <Text className="text-white/70 mt-4 text-left mb-8 text-base">
                {salidaInfo.FechaSalida}
              </Text>
              <Text className="text-white/70 mt-4 text-left mb-8 text-base">
                {salidaInfo.EstadoSalida}
              </Text>
              <Text className="text-white/70 mt-4 text-left mb-8 text-base">
                {salidaInfo.TipoSalida}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}
