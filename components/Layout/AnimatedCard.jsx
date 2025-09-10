

import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function AnimatedCard({ children, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(20)).current; // empieza 20px abajo

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        delay: index * 250,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        delay: index * 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        delay: index * 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, translateY, index]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          { scale },
          { translateY },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
