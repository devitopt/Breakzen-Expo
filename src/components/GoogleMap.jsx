import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView from 'react-native-maps';

export default function GoogleMap({ navigation, route }) {
    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    useEffect(() => {
        setLocation(route.params);
    }, [route.params]);
    return (
        <View style={styles.container}>
            <MapView
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={styles.map} >
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    map: {
        width: '100%',
        height: '100%',
    }
});
