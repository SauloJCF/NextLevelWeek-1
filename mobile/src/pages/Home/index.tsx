import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput } from 'react-native';
import { RectButton} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';

const Home = () => {
    interface IBGEUFResponse{
      sigla: string;
    }

    interface IBGECityResponse{
        nome: string;
    }

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
      axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
          const ufInitials = response.data.map(uf => uf.sigla);
          setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
      //carregar as cidades sempre q a uf mudar
      if(selectedUf === ''){
          return;
      }
      axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
          const cityNames = response.data.map(city => city.nome);
          setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(newUf: string){
    const uf = newUf;

    setSelectedUf(uf);
}

function handleSelectCity(newCity: string){
    const city = newCity;

    setSelectedCity(city);
}

    function handleNavigateToPoints(){
        let uf = selectedUf;
        let city = selectedCity;
        navigation.navigate('Points', {uf, city});
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ImageBackground 
              source={require('../../assets/home-background.png')} 
              style={styles.container}
              imageStyle={{ width: 274, height: 368 }}
          >
              <View style={styles.main}>
                  <Image source={require('../../assets/logo.png')} />
                  <View>
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                  </View>
              </View>

              <View style={styles.footer}>
                  <RNPickerSelect
                    placeholder={{label: 'Selecione um estado...', value: null}}
                    onValueChange={(value) => handleSelectUf(value)}
                    items={
                      ufs.map(uf => ({key: uf, label: uf, value: uf}))
                    }
                  />
                  <RNPickerSelect
                    placeholder={{label: "Selecione uma cidade...", value: ''}}
                    onValueChange={(value) => handleSelectCity(value)}
                    items={

                      cities.map(city => ({key: city, label: city, value: city}))
                    }
                    
                  />

                  <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                      <View style={styles.buttonIcon}>
                          <Text>
                              <Icon name="arrow-right" color="#FFF" size={24}/>
                          </Text>
                      </View>
                      <Text style={styles.buttonText}>
                          Entrar
                      </Text>                  
                  </RectButton>
              </View>
          </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;