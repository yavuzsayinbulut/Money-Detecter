import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import MyCamera from "./MyCamera";
import Gallery from "./Gallery";


import axios from "axios"



import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { async } from "@firebase/util";

const news = ({ item }) => <Card news={item} />;
const keys = (item) => item.u_id.toString();

const Stack = createNativeStackNavigator();

const FirstScreen = (props) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [resultF, setresultF] = useState('')

  const [selectedPhotoType, setSelectedPhotoType] = useState(null);
  const [uploadPhotos, setUploadPhotos] = useState({});
  const [uploadId, setUploadId] = useState(null);

  uploadId;
  function OpenCamera(val) {
    // props.navigation.navigate("Camera", val);
    setShowCamera(!showCamera);
    setSelectedPhotoType(val);
  }
  function OpenGallery(val) {
    setShowGallery(!showGallery);
    setSelectedPhotoType(val);
  }

  function PhotoResponse(val) {
    console.log("_________", val.photo);
    setUploadPhotos({
      ...uploadPhotos,
      [val.photo.photoType]: val.photo.photo,
    });
    setShowCamera(!showCamera);
    setSelectedPhotoType(null);
  }

  function GalleryResponse(val) {
    console.log("_________", val.photo);
    setUploadPhotos({
      ...uploadPhotos,
      [val.photo.photoType]: val.photo.photo,
    });
    setShowGallery(!showGallery);
    setSelectedPhotoType(null);
  }

  uploadPhoto = async () => {
    const uploadIdCreater = Math.random().toString(16).slice(-4);
    setUploadId(uploadIdCreater);
    Object.keys(uploadPhotos).map(async (photoType) => {
      const photo = uploadPhotos[photoType];
      const storage = getStorage(); //the storage itself
      // const ref_con = ref(storage, 'image.jpg'); //how the image will be addressed inside the storage
      const ref_con = ref(
        storage,
        "images/" + uploadIdCreater + "/" + photoType
      ); //how the image will be addressed inside the storage

      //convert image to array of bytes
      const img = await fetch(photo.uri);
      const bytes = await img.blob();
      await uploadBytes(ref_con, bytes); //upload images

      console.log("UID: " + uploadIdCreater)

     fetchmyData()
    }
   


    );
  

    const fetchmyData = async () => {
      const article = { "UID": uploadIdCreater };
      const response = await axios.post('http://192.168.2.195:5000/predict', article)

      console.log(response.data)

      setresultF(response.data)
    }

    


    //api isteği axios uid gönder uploadId gönder response bekle
  };

  return (
    <>
      {showCamera || showGallery ? (
        showCamera ? (
          <MyCamera
            photoResponseFunc={PhotoResponse}
            photoType={selectedPhotoType}
          />
        ) : (
          <Gallery
            photoResponseFunc={GalleryResponse}
            photoType={selectedPhotoType}
          />
        )
      ) : (
        <>
          <View style={{ flex: 1 }}>
            <View style={styles.container}>
              <View style={styles.innercontainer}>
                <Text style={styles.title}>Ön Yüzü Çekiniz</Text>

              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                  title="Open Camera"
                  onPress={() => OpenCamera("on_foto")}
                ></Button>
                <Button
                  onPress={() => OpenGallery("on_foto")}
                  title="Open Gallery"
                ></Button>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.innercontainer}>
                <Text style={styles.title}>Arka Yüzü Çekiniz</Text>

              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                  title="Open Camera"
                  onPress={() => OpenCamera("arka_foto")}
                ></Button>
                <Button
                  onPress={() => OpenGallery("arka_foto")}
                  title="Open Gallery"
                ></Button>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.innercontainer}>
                <Text style={styles.title}>Yıldızı Çekiniz</Text>

              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                  title="Open Camera"
                  onPress={() => OpenCamera("yildiz_foto")}
                ></Button>
                <Button
                  onPress={() => OpenGallery("yildiz_foto")}
                  title="Open Gallery"
                ></Button>
              </View>
            </View>
            <View style={styles.container}>
              <View style={styles.innercontainer}>
                <Text style={styles.title}>Kareyi Çekiniz</Text>

              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Button
                  title="Open Camera"
                  onPress={() => OpenCamera("kare_foto")}
                ></Button>
                <Button
                  onPress={() => OpenGallery("kare_foto")}
                  title="Open Gallery"
                ></Button>
              </View>
            </View>
            <Button onPress={uploadPhoto} title="Upload"></Button>
         
          </View>
        </>
      )}
    </>
  );
};

export default FirstScreen;

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flexDirection: "row" },
  title: { fontWeight: "bold", fontSize: 18 },
  description: { fontSize: 14 },
  innercontainer: { padding: 25, flex: 1 },
  author: { marginTop: 5, textAlign: "right", fontStyle: "italic" },
  image: {
    height: Dimensions.get("window").height / 4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 50,
  },
});
