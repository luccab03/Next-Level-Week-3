import React, { useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import mapMarker from "../images/map-marker.png";
import { Feather } from "@expo/vector-icons";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import api from "../services/api";

interface Orphanage {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
}

export default function OrphanagesMap() {
    const navigation = useNavigation();

    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useFocusEffect(() => {
        api.get("orphanages").then((response) => {
            setOrphanages(response.data);
        });
    });

    function handleNavigateToOrphanageDetails(id: Number) {
        navigation.navigate("OrphanageDetails", { id });
    }

    function handleNavigateToCreateOrphanage() {
        navigation.navigate("SelectMapPosition");
    }

    // function debug(orphanage: Orphanage) {
    //     console.log(orphanage);
    //     console.log("Lat: " + orphanage.latitude
    // }

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                    latitude: -30.0457353,
                    longitude: -51.186211,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                }}
            >
                {orphanages.map((orphanage) => {
                    return (
                        <Marker
                            key={orphanage.id}
                            icon={mapMarker}
                            calloutAnchor={{
                                x: 2.59,
                                y: 0.77,
                            }}
                            coordinate={{
                                latitude: parseFloat(orphanage.latitude),
                                longitude: parseFloat(orphanage.longitude),
                            }}
                        >
                            <Callout
                                tooltip
                                onPress={() => {
                                    handleNavigateToOrphanageDetails(
                                        orphanage.id
                                    );
                                }}
                            >
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>
                                        {orphanage.name}
                                    </Text>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
            <View style={styles.footer}>
                <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

                <RectButton
                    style={styles.createOrphanageButton}
                    onPress={handleNavigateToCreateOrphanage}
                >
                    <Feather name="plus" size={20} color="#fff" />
                </RectButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },

    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 16,
        justifyContent: "center",
    },

    calloutText: {
        color: "#0089a5",
        fontSize: 14,
        fontFamily: "Nunito_700Bold",
    },

    footer: {
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 45,
        backgroundColor: "#FFF",
        borderRadius: 20,
        height: 56,
        paddingLeft: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        elevation: 5,
    },

    footerText: {
        color: "#8fa7b3",
        fontFamily: "Nunito_700Bold",
    },

    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: "#15c3d6",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});