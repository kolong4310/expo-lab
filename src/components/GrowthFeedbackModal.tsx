import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";
import PrimaryButton from "./PrimaryButton";
import TinySprout from "./TinySprout";

interface GrowthFeedbackModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export default function GrowthFeedbackModal({
  visible,
  title,
  message,
  confirmLabel,
  onConfirm,
}: GrowthFeedbackModalProps) {
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardProgress = useRef(new Animated.Value(0)).current;
  const sproutScale = useRef(new Animated.Value(0.7)).current;
  const sparkleProgress = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      overlayOpacity.setValue(0);
      cardProgress.setValue(0);
      sproutScale.setValue(0.7);
      sparkleProgress.setValue(0);
      buttonOpacity.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(cardProgress, {
        toValue: 1,
        speed: 14,
        bounciness: 7,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(110),
        Animated.spring(sproutScale, {
          toValue: 1,
          speed: 16,
          bounciness: 10,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(180),
        Animated.timing(sparkleProgress, {
          toValue: 1,
          duration: 480,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(260),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    buttonOpacity,
    cardProgress,
    overlayOpacity,
    sparkleProgress,
    sproutScale,
    visible,
  ]);

  const cardTranslateY = cardProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 0],
  });
  const sparkleScale = sparkleProgress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0.4, 1, 0.72],
  });
  const sparkleOpacity = sparkleProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 1, 0],
  });
  const cardWidth = Math.min(width - 40, 360);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onConfirm}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            backgroundColor:
              theme.mode === "light"
                ? "rgba(20,32,26,0.30)"
                : "rgba(5,8,12,0.72)",
          },
        ]}
      >
        <Animated.View
          style={[
            styles.card,
            {
              width: cardWidth,
              opacity: cardProgress,
              borderColor: theme.colors.borderStrong,
              backgroundColor: theme.colors.surface,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          <View style={styles.growthStage}>
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkleOne,
                {
                  opacity: sparkleOpacity,
                  backgroundColor: theme.colors.secondary,
                  transform: [{ scale: sparkleScale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkleTwo,
                {
                  opacity: sparkleOpacity,
                  backgroundColor: theme.colors.primary,
                  transform: [{ scale: sparkleScale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.sparkle,
                styles.sparkleThree,
                {
                  opacity: sparkleOpacity,
                  backgroundColor: theme.colors.success,
                  transform: [{ scale: sparkleScale }],
                },
              ]}
            />

            <Animated.View
              style={[
                styles.sprout,
                {
                  transform: [{ scale: sproutScale }],
                },
              ]}
            >
              <TinySprout size={58} />
            </Animated.View>
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: theme.colors.muted }]}>
            {message}
          </Text>

          <Animated.View
            style={[styles.buttonWrap, { opacity: buttonOpacity }]}
          >
            <PrimaryButton
              label={confirmLabel}
              onPress={onConfirm}
              style={styles.button}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: DESIGN.radius.card,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  growthStage: {
    width: 112,
    height: 88,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  sprout: {
    alignItems: "center",
  },
  sparkle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sparkleOne: {
    top: 12,
    left: 26,
  },
  sparkleTwo: {
    top: 20,
    right: 24,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  sparkleThree: {
    top: 38,
    right: 10,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 10,
  },
  buttonWrap: {
    alignSelf: "stretch",
    marginTop: 22,
  },
  button: {
    minHeight: 52,
  },
});
