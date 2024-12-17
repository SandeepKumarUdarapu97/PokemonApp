import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';

interface PokemonDetails {
  name: string;
  height: number;
  weight: number;
  abilities: Array<{ ability: { name: string } }>;
  sprites: { front_default: string };
}

const DetailsScreen: React.FC = ({ route }) => {
  const { url } = route.params; // URL passed from HomeScreen
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching Pokémon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [url]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Pokémon details...</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.container}>
        <Text>Failed to load Pokémon details. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
      <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
      <Text style={styles.detail}>Height: {pokemon.height}</Text>
      <Text style={styles.detail}>Weight: {pokemon.weight}</Text>
      <Text style={styles.detail}>Abilities:</Text>
      {pokemon.abilities.map((abilityObj, index) => (
        <Text key={index} style={styles.ability}>
          - {abilityObj.ability.name}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    marginBottom: 8,
  },
  ability: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default DetailsScreen;
