import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, {Marker} from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-react-native-classnames'
import { selectDestination, selectOrigin, setTraverTimeInformation } from "../slices/navSlice"
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useRef } from 'react';

const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination)
    const mapRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
      if (!origin || !destination) return;

      // Zoom & fit to markers
      mapRef.current.fitToSuppliesMarkers(['origin', 'destination'], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    }, [origin, destination]);

    useEffect(() => {
      if (!origin || !destination) return;

        const getTravelTime = async () => {
          fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?
            units=imperial&origins=${origin.description}&destination=$
            {destination.description}&key=${GOOGLE_MAPS_APIKEY}`
          ).then((res) => res.json())
          .then(data => {
            dispatch(setTraverTimeInformation(data.rows[0].elements[0]));
          })
        };

        getTravelTime();

    }, [origin, destination, GOOGLE_MAPS_APIKEY]);

  return (
    <MapView
       ref={mapRef}
       style={tw`flex-1`}
       mapType="mutedStandard"
       initialRegion={{
         latitude: origin.location.lat,
         longitude: origin.location.lng,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
      {origin && destination && (
        <MapViewDirections
        origin={origin.description}
        destination={destination.description}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={3}
        strokeColor="black"
        />
      )}

       {origin?.location && (
        <Marker
            coordinate={{
              latitude: origin.location.lat,
              longitude: origin.location.lng,
            }}
            title="Origin"
            description={origin.description}
            identifier="origin"
        />
       )}
       {destination?.location && (
        <Marker
            coordinate={{
              latitude: destination.location.lat,
              longitude: destination.location.lng,
            }}
            title="Destination"
            description={destination.description}
            identifier="destination"
        />
       )}
      </MapView>
  );
};

export default Map

const styles = StyleSheet.create({})