import React from 'react';
import {
  Svg, G, Path, Circle,
} from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { color } from '../assets/stdafx';

const elementSpace = 12;

export function CardItem(props) {
  const card = props.card;
  return (
    <View
      style={[
        styles.container,
        props.gray
          ? { backgroundColor: '#707070' }
          : { backgroundColor: color.blue },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.visa}>
          <Svg
            id="visa"
            xmlns="http://www.w3.org/2000/svg"
            width="26.947"
            height="8.433"
            viewBox="0 0 26.947 8.433"
          >
            <G
              id="Group_10006"
              data-name="Group 10006"
              transform="translate(2.518)"
            >
              <G id="Group_10005" data-name="Group 10005">
                <Path
                  id="Path_8973"
                  data-name="Path 8973"
                  d="M35.759,100.23l-1.352,8.416h2.162l1.352-8.416Zm6.52,3.428c-.755-.373-1.219-.625-1.219-1.006.009-.347.392-.7,1.245-.7a3.762,3.762,0,0,1,1.61.312l.2.088.294-1.761a5.456,5.456,0,0,0-1.94-.347c-2.135,0-3.638,1.11-3.647,2.7-.018,1.171,1.076,1.821,1.895,2.211.836.4,1.121.659,1.121,1.015-.009.546-.676.8-1.3.8a4.4,4.4,0,0,1-2.029-.434l-.285-.13-.3,1.83a6.751,6.751,0,0,0,2.411.435c2.269,0,3.745-1.093,3.763-2.785C44.1,104.95,43.526,104.239,42.279,103.658Zm7.669-3.4H48.276a1.071,1.071,0,0,0-1.13.677l-3.211,7.713H46.2l.625-1.67h2.538l.324,1.677h2Zm-2.491,5.035c.044,0,.871-2.726.871-2.726l.659,2.726ZM32.6,100.23l-2.118,5.718-.231-1.128a6.283,6.283,0,0,0-2.99-3.417l1.939,7.235h2.287l3.4-8.407H32.6Z"
                  transform="translate(-27.262 -100.23)"
                  fill="#2394bc"
                />
              </G>
            </G>
            <Path
              id="Path_8974"
              data-name="Path 8974"
              d="M4.795,101.332a1.412,1.412,0,0,0-1.406-1.084H.035L0,100.4a8.233,8.233,0,0,1,5.525,4.5Z"
              transform="translate(0 -100.246)"
              fill="#efc75e"
            />
          </Svg>
        </View>
        {[1, 2, 3].map((val) => (
          <Svg
            key={val}
            style={styles.dot}
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="5"
            viewBox="0 0 32 5"
          >
            <G
              id="Group_10003"
              data-name="Group 10003"
              transform="translate(-0.5 0)"
            >
              <Circle
                id="Ellipse_138"
                data-name="Ellipse 138"
                cx="2.5"
                cy="2.5"
                r="2.5"
                transform="translate(0.5 0)"
                fill="#fff"
              />
              <Circle
                id="Ellipse_139"
                data-name="Ellipse 139"
                cx="2.5"
                cy="2.5"
                r="2.5"
                transform="translate(9.5 0)"
                fill="#fff"
              />
              <Circle
                id="Ellipse_140"
                data-name="Ellipse 140"
                cx="2.5"
                cy="2.5"
                r="2.5"
                transform="translate(18.5 0)"
                fill="#fff"
              />
              <Circle
                id="Ellipse_141"
                data-name="Ellipse 141"
                cx="2.5"
                cy="2.5"
                r="2.5"
                transform="translate(27.5 0)"
                fill="#fff"
              />
            </G>
          </Svg>
        ))}
        <Text style={styles.number}>{card.values ? card.values.cvc : '000'}</Text>
      </View>
      {props.gray ? (
        <Svg
          id="Group_38266"
          data-name="Group 38266"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <Circle
            id="Ellipse_1256"
            data-name="Ellipse 1256"
            cx="10"
            cy="10"
            r="10"
            transform="translate(0)"
            fill="#898989"
          />
          <G
            id="tick_7_"
            data-name="tick (7)"
            transform="translate(5.062 6.149)"
          >
            <G id="Group_37185" data-name="Group 37185">
              <Path
                id="Path_29193"
                data-name="Path 29193"
                d="M8.269,27.855l-5.326,6.2L.709,31.968,0,32.727l3.025,2.829,6.032-7.025Z"
                transform="translate(0 -27.855)"
                fill="#cacaca"
              />
            </G>
          </G>
        </Svg>
      ) : (
        <Svg
          id="Group_38266"
          data-name="Group 38266"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <Circle
            id="Ellipse_1256"
            data-name="Ellipse 1256"
            cx="10"
            cy="10"
            r="10"
            transform="translate(0)"
            fill="#fff"
          />
          <G
            id="tick_7_"
            data-name="tick (7)"
            transform="translate(5.062 6.149)"
          >
            <G id="Group_37185" data-name="Group 37185">
              <Path
                id="Path_29193"
                data-name="Path 29193"
                d="M8.269,27.855l-5.326,6.2L.709,31.968,0,32.727l3.025,2.829,6.032-7.025Z"
                transform="translate(0 -27.855)"
                fill="#c63878"
              />
            </G>
          </G>
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: elementSpace,
    borderRadius: 7,
    marginTop: 8,
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visa: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  dot: {
    marginLeft: elementSpace,
  },
  number: {
    color: 'white',
    fontSize: 12,
    marginLeft: elementSpace,
  },
});
