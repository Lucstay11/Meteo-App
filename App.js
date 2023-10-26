import { StyleSheet, Text, View,Image,Alert,ScrollView,ActivityIndicator,Platform } from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {useState,useEffect} from "react";
import * as Location from "expo-location"
import { cityPrevision } from './api/api';
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { StatusBar } from 'expo-status-bar';

const WHEATHER_BACKGROUND = {
  "Rain": "#2F4F4F",
  "Clouds": "#708090",
  "Snows":"grey",
  "Clear": "steelblue",
  "soir": "#2F4F4F",
  "nuit": "black"
};

export default function App() {
   const [loading,setLoading] = useState(true)
   const [Weather,setWeather] = useState(null)
   const [Prevision,setPrevision] = useState([])
   const [backColor,setbackColor] = useState("#696969")

   useEffect(()=>{
    const getLocation = async () =>{
      const { status } = await Location.requestForegroundPermissionsAsync()
       if(status !== "granted"){
        Alert.alert("Sans localisation vous n'aurez accès à la meteo proche!")
       }
       const userLocation = await Location.getCurrentPositionAsync()
       getWeather(userLocation)
    }
      getLocation()

      const getWeather = async(location)=>{
        const data = await cityPrevision(location.coords.latitude,location.coords.longitude)
        setWeather(data)
        setLoading(false)

        let temps = data.list[0].weather[0].main

        setbackColor(WHEATHER_BACKGROUND[temps])
        if(hours>18 && hours<23){setbackColor(WHEATHER_BACKGROUND["soir"])}
        if(hours>23 || hours<6){setbackColor("black")}

        const tab = [];
        const prevision = data.list.map(f=>{
            const date = new Date(f.dt * 1000)
            var day = format(date,"EEEE",{locale: fr})
             if(!tab.includes(day)){
               tab.push(day)
              }else{day=""}
            tab.push(format(date,"EEEE",{locale: fr}))
            return ({
              date: date,
              hour: date.getHours(),
              day: day,
              temp: Math.round(f.main.temp),
              icon: f.weather[0].icon,
            })
        })
         setPrevision(prevision)
      }

   },[])

    

   if(loading){
     return <View className="flex-1 justify-center bg-blue-100">
      <ActivityIndicator size="large" color="royalblue"/>
     </View>
   }
  return (
    <LinearGradient colors={[backColor,'white',backColor]} className="flex-1">
      <View style={styles.container}>
      <Text className="text-center" style={{"fontSize":36,"fontWeight":500,"color":"#545658"}}>{Weather?.city?.name}</Text>
      <Text className="text-center" style={{"fontSize":24,"fontWeight":300,"color":"#545658"}}>Aujourd'hui</Text>
      <Image source={{uri:`https://openweathermap.org/img/wn/${Weather.list[0].weather[0].icon}@4x.png`}} style={styles.imgmeteocity}></Image>
      <Text style={{"fontSize":80,"fontWeight":"bold","color":"#545658"}}>{Math.round(Weather.list[0].main.temp)}°C</Text>
      <Text className="text-center" style={{"fontSize":24,"fontWeight":"bold","color":"#545658"}}>{Weather.list[0].weather[0].description}</Text>
      <View className="flex-row justify-center align-center space-x-10 mt-10">
                <Text style={{"fontWeight":300,"color":"#545658"}}><Image source={require('./assets/pression.png')} style={{"height":20,"width":20}}></Image> {Weather.list[0].main.pressure} hPA</Text>
                <Text style={{"fontWeight":300,"color":"#545658"}}><Image source={require('./assets/goûte.png')} style={{"height":20,"width":20}}></Image> {Weather.list[0].main.humidity}%</Text>
                <Text style={{"fontWeight":300,"color":"#545658"}}><Image source={require('./assets/vent.png')} style={{"height":20,"width":20}}></Image> {Math.round(Weather.list[0].wind.speed * 3.6)} km/h</Text>
          </View>
      </View>
          

         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
           {Prevision.map((f,index)=>(
             <View key={index}>
              <View><Text className="text-white text-center">{f.day.toUpperCase()}</Text></View>
             <View key={index} style={styles.boxprevision}>
              <Text className="text-white">{f.hour}h</Text>
              <Image source={{uri:`https://openweathermap.org/img/wn/${f.icon}@4x.png`}} style={{"height":50,"width":50}}></Image>
              <Text className="text-white">{f.temp}°C</Text>
             </View>
             </View>
           ))}
         </ScrollView>
    </LinearGradient> 
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height:"65%",
    paddingTop: Platform.OS==="android" ? StatusBar.currentHeight:0
  },
  imgmeteocity:{
   width:150,
   height: 150,
   marginVertical: 20
  },
  boxprevision:{
    backgroundColor:"rgba(255, 255,255, 0.4)",
    height:140,
    width:100,
    paddingVertical:6,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:20,
    marginRight:10,
  }
});
