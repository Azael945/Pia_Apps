import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import * as Linking from 'expo-linking';

const { width } = Dimensions.get('window');
const API_KEY = 'd24734cbe0f34cd58ddbb40a20cf7f22';

export default function HomeScreen() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [indiceActual, setIndiceActual] = useState(0);
  const flatListRef = useRef(null);
  const indiceRef = useRef(0);

  useEffect(() => {
    fetchNoticias();
  }, []);

  useEffect(() => {
    if (noticias.length === 0) return;
    const intervalo = setInterval(() => {
      const siguiente = indiceRef.current === noticias.length - 1 ? 0 : indiceRef.current + 1;
      indiceRef.current = siguiente;
      setIndiceActual(siguiente);
      flatListRef.current?.scrollToOffset({
        offset: siguiente * (width - 40 + 40),
        animated: true,
      });
    }, 4000);
    return () => clearInterval(intervalo);
  }, [noticias]);

  const fetchNoticias = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=vacunas&language=es&pageSize=6&apiKey=${API_KEY}`
      );
      const articulos = response.data.articles;
      setNoticias(articulos);

      Toast.show({
        type: 'error',
        text1: '⚠️ Alerta Sanitaria',
        text2: 'Se detectó una posible alerta de brote en tu región.',
        position: 'top',
        visibilityTime: 6000,
      });

      // Detectar posible brote en los titulares
      /*const palabrasClave = ['brote', 'alerta', 'emergencia', 'epidemia', 'pandemia', 'riesgo', 'peligro'];
      const hayBrote = articulos.some(n =>
        palabrasClave.some(palabra =>
          n.title?.toLowerCase().includes(palabra) ||
          n.description?.toLowerCase().includes(palabra)
        )
      );

      if (hayBrote) {
        Toast.show({
          type: 'error',
          text1: 'Alerta Sanitaria',
          text2: 'Se detectó una posible alerta de brote en tu región.',
          position: 'top',
          visibilityTime: 6000,
        });
      }*/

    } catch (error) {
      console.error('Error al cargar noticias:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    indiceRef.current = index;
    setIndiceActual(index);
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E6B3E" />
        <Text style={styles.loadingText}>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.container}>

        {/* Header verde como Register */}
        <View style={styles.headerSection}>
          <Text style={styles.tituloSub}>LO MÁS RECIENTE</Text>
          <Text style={styles.titulo}>Noticias de Vacunas</Text>
        </View>

        {/* Carrusel */}
        <FlatList
          ref={flatListRef}
          data={noticias}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => Linking.openURL(item.url)}
            >
              {item.urlToImage ? (
                <Image source={{ uri: item.urlToImage }} style={styles.imagen} />
              ) : (
                <View style={styles.imagenPlaceholder}>
                  <Text style={styles.placeholderText}>📰</Text>
                </View>
              )}
              <View style={styles.cardContent}>
                <Text style={styles.fuente}>{item.source.name}</Text>
                <Text style={styles.cardTitulo} numberOfLines={3}>{item.title}</Text>
                <Text style={styles.cardDescripcion} numberOfLines={2}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Indicadores */}
        <View style={styles.indicadores}>
          {noticias.map((_, index) => (
            <View
              key={index}
              style={[styles.punto, index === indiceActual && styles.puntoActivo]}
            />
          ))}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#2E6B3E',
    fontSize: 14,
  },
  headerSection: {
    backgroundColor: '#2E6B3E',
    paddingTop: 5,
    paddingBottom: 6,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  tituloSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    width: width - 40,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    
  },
  imagen: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  imagenPlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  cardContent: {
    padding: 16,
  },
  fuente: {
    fontSize: 12,
    color: '#2E6B3E',
    fontWeight: '600',
    marginBottom: 6,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  cardDescripcion: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  punto: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },
  puntoActivo: {
    backgroundColor: '#2E6B3E',
    width: 16,
  },
});