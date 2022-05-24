import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

import firebaseCon from "../firebaseCon";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";

initializeApp(firebaseCon);

export default function ImagePickerExample({ photoResponseFunc, photoType }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);

      backto(result);
    }
  };
  function OpenCamera() {
    props.navigation.navigate("Camera");
  }
  function backto(photo) {
    //console.log("galeri????", photo);
    const sn = { photo: { photo, photoType } };
    photoResponseFunc({ photo: { photo, photoType } });
    // props.navigation.navigate("Proccessing Area")
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 250, marginBottom: 20 }}
        />
      )}
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Text>If you select a photo please wait for the upload message.</Text>
    </View>
  );
}
