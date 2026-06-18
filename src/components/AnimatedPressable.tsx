import React, { ReactNode, useRef } from "react";
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from "react-native";

const AnimatedBasePressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<
  PressableProps,
  "children" | "style"
> {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
}

export default function AnimatedPressable({
  children,
  disabled,
  onPressIn,
  onPressOut,
  pressedScale = 0.98,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      speed: 24,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn: NonNullable<PressableProps["onPressIn"]> = (event) => {
    if (!disabled) {
      animateTo(pressedScale);
    }
    onPressIn?.(event);
  };

  const handlePressOut: NonNullable<PressableProps["onPressOut"]> = (event) => {
    animateTo(1);
    onPressOut?.(event);
  };

  return (
    <AnimatedBasePressable
      {...props}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, { transform: [{ scale }] }, disabled && { opacity: 0.4 }]}
    >
      {children}
    </AnimatedBasePressable>
  );
}
