import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
//import { Button } from "react-native-web";

import firebaseCon from "../firebaseCon";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

initializeApp(firebaseCon);

export default function MyCamera({ photoResponseFunc, photoType }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const ref2 = useRef(null);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  _takePhoto = async () => {
    const photo = await ref2.current.takePictureAsync();
    photoResponseFunc({ photo: { photo, photoType } });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View
      style={{
        flex: 1,

        paddingLeft: 0,
        paddingRight: 0,
        marginTop: -10,
        paddingBottom: 0,
      }}
    >
      <View style={{ flex: 0.8, flexDirection: "row" }}>
        <Camera style={{ flex: 1 }} type={type} ref={ref2} flashMode={flash}>
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
                alignItems: "center",
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                {" "}
                Flip{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>

      <View style={styles.screen}>
        <TouchableOpacity
          onPress={_takePhoto}
          style={styles.roundButton1}
        ></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  roundButton1: {
    width: 85,
    height: 85,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "grey",
    marginTop: 20,
  },
});
