import { View, Text, StyleSheet } from 'react-native';

export default function VacunasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>💉 Vacunas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E6B3E',
  },
});