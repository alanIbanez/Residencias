
import { FlatList } from "react-native";
import { AnimatedCard } from "../../components/Layout/AnimatedCard";
import { Screen } from "../../components/Layout/Screen";
import { CardSalida } from "./CardSalida";

export default function ListaSalida() {
  const salidas = [
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

  return (
    <Screen>
      <FlatList
          data={salidas}
          keyExtractor={(salida) => salida.Id.toString()}
          renderItem={({ item, index }) => (
            <AnimatedCard index={index}>
              <CardSalida salida={item} />
            </AnimatedCard>
          )}
        />
    </Screen>
  );
}
