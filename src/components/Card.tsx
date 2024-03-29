import { useState } from 'react';
import Animated, {
  Easing,
  clamp,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { View, useWindowDimensions, StyleSheet } from 'react-native';

const Card = ({ card, index, scrollY, activeCardIndex }) => {
  const [cardHeight, setCardHeight] = useState(0);
  const translateY = useSharedValue(0);

  const { height: screenHeight } = useWindowDimensions();

  useAnimatedReaction(
    () => scrollY.value,
    (current) => {
      translateY.value = clamp(-current, -index * cardHeight, 0);
    }
  );

  useAnimatedReaction(
    () => activeCardIndex.value,
    (current, pervious) => {
      if (current === pervious) {
        return;
      }
      if (activeCardIndex.value === null) {
        // No card selected, move to list view
        translateY.value = withTiming(
          clamp(-scrollY.value, -index * cardHeight, 0)
        );
      } else if (activeCardIndex.value === index) {
        // This card becomes active
        translateY.value = withTiming(-index * cardHeight, {
          easing: Easing.out(Easing.quad),
          duration: 500,
        });
      } else {
        // Another card is active, move to the bottom
        translateY.value = withTiming(
          -index * cardHeight * 0.9 + screenHeight * 0.7,
          {
            easing: Easing.out(Easing.quad),
            duration: 500,
          }
        );
      }
    }
  );

  const tap = Gesture.Tap().onEnd(() => {
    if (activeCardIndex.value === null) {
      activeCardIndex.value = index;
    } else {
      activeCardIndex.value = null;
    }
  });

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.container}>
        <Animated.Image
          source={card}
          onLayout={(event) =>
            setCardHeight(event.nativeEvent.layout.height + 10)
          }
          style={[styles.image, { transform: [{ translateY }] }]}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#B387DF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 7 / 4,
    marginVertical: 5,
  },
});

export default Card;
