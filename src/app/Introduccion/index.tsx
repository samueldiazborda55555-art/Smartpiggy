import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
  ListRenderItemInfo,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

type Slide = {
  key: string;
  title?: string;
  showLogo?: boolean;
  showAuth?: boolean;
  image?: any;
};

const SLIDES: Slide[] = [
  { key: "splash", showLogo: true },
  { key: "welcome", title: "Bienvenido Al\nGestor De\nFinanzas!" },
  { key: "cta", title: "¿Estás Listo Para\nTomar El Control\nDe Tus Finanzas?" },
  { key: "auth", showLogo: true, showAuth: true },
];

function PiggyIcon({ size = 140 }: { size?: number }) {
  // Placeholder illustration — swap for your real ilustración/SVG cuando la tengas.
  return (
    <View
      style={[
        styles.piggyWrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Ionicons name="paw" size={size * 0.55} color="#2f6f76" />
    </View>
  );
}

export default function OnboardingPreview() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const goTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      goTo(index + 1);
    }
    // Sin navegación: en la última pantalla no hace nada.
  };

  const renderItem = ({ item }: ListRenderItemInfo<Slide>) => {
    return (
      <View style={[styles.slide, { width }]}>
        {item.showLogo && (
          <View style={styles.logoBlock}>
            <PiggyIcon size={130} />
            <Text style={styles.logoText}>
              smartp<Text style={styles.logoAccent}>i</Text>ggy
            </Text>
          </View>
        )}

        {item.title && (
          <>
            <Text style={styles.title}>{item.title}</Text>
            <PiggyIcon size={150} />
          </>
        )}

        {item.showAuth && (
          <View style={styles.authBlock}>
            {/* Botones solo visuales, sin acción/navegación */}
            <TouchableOpacity style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonPrimaryText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
              <Text style={styles.buttonSecondaryText}>REGISTRARSE</Text>
            </TouchableOpacity>

            <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      />

      {/* Puntos de paginación */}
      {index < SLIDES.length - 1 && (
        <View style={styles.dotsContainer}>
          {SLIDES.slice(0, SLIDES.length - 1).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>
      )}

      {/* Botón siguiente / saltar, solo mueve el carrusel */}
      {index < SLIDES.length - 1 && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => goTo(SLIDES.length - 1)}>
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logoBlock: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    marginTop: 18,
    fontSize: 30,
    fontWeight: "700",
    color: "#1f2d3d",
  },
  logoAccent: {
    color: "#2f6f76",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1f2d3d",
    marginBottom: 40,
    lineHeight: 32,
  },
  piggyWrap: {
    backgroundColor: "#eef3f5",
    alignItems: "center",
    justifyContent: "center",
  },
  authBlock: {
    width: "100%",
    marginTop: 36,
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: "center",
    marginBottom: 14,
  },
  buttonPrimary: {
    backgroundColor: "#4caf7d",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: "#1f3a5f",
  },
  buttonSecondaryText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  forgotText: {
    marginTop: 4,
    color: "#5c6b7a",
    fontSize: 13,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d8dfe3",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#2f6f76",
    width: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  skipText: {
    color: "#8a97a3",
    fontSize: 15,
  },
  nextButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2f6f76",
    alignItems: "center",
    justifyContent: "center",
  },
});