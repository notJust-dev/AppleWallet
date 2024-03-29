import Animated, { useDerivedValue } from 'react-native-reanimated';

const Card = ({ card, index, scrollY }) => {
  const translateY = useDerivedValue(() => -scrollY.value);

  return (
    <Animated.Image
      source={card}
      style={{
        width: '100%',
        height: undefined,
        aspectRatio: 7 / 4,
        marginVertical: 5,

        transform: [
          {
            translateY: translateY,
          },
        ],
      }}
    />
  );
};

export default Card;
