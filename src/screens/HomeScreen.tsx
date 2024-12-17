import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  toggleCatchPokemon,
  toggleViewTeam,
  toggleSettings,
} from '../redux/slices/buttonSlice';
import {RootState} from '../redux/store';
import {signOut} from '../services/authServices';
import {useNavigation} from '@react-navigation/native';
import {useInfiniteQuery} from '@tanstack/react-query';
import queryString from 'query-string';

interface PokemonResponse {
  next: string | null;
  results: Array<{name: string; url: string}>;
}

const fetchPokemon = async ({pageParam = 0}): Promise<PokemonResponse> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pageParam}`,
  );
  return response.json();
};

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const buttons = useSelector((state: RootState) => state.buttons);
  const user = useSelector((state: RootState) => state.auth.user);

  const {data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery({
      queryKey: ['pokemon'],
      queryFn: fetchPokemon,
      getNextPageParam: lastPage => {
        if (lastPage.next) {
          const parsed = queryString.parseUrl(lastPage.next);
          return parsed.query.offset;
        }
        return undefined;
      },
    });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign-Out Failed:', error);
    }
  };

  const renderItem = ({item}: {item: {name: string; url: string}}) => {
    console.log(item);
    
    return (
      <Button
        title={item.name}
        onPress={() => navigation.navigate('Details', {url: item.url})}
      />
    );
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.userInfo}>
          <Image
            source={{uri: user.photoURL || undefined}}
            style={styles.profileImage}
          />
          <Text style={styles.text}>Welcome, {user.displayName}!</Text>
        </View>
      )}
      <View style={styles.buttonsContainer}>
        <Text style={styles.buttonState}>
          Catch Pokémon: {buttons.catchPokemon ? 'On' : 'Off'}
        </Text>
        <Button
          title="Toggle Catch Pokémon"
          onPress={() => dispatch(toggleCatchPokemon())}
        />

        <Text style={styles.buttonState}>
          View Team: {buttons.viewTeam ? 'On' : 'Off'}
        </Text>
        <Button
          title="Toggle View Team"
          onPress={() => dispatch(toggleViewTeam())}
        />

        <Text style={styles.buttonState}>
          Settings: {buttons.settings ? 'On' : 'Off'}
        </Text>
        <Button
          title="Toggle Settings"
          onPress={() => dispatch(toggleSettings())}
        />
      </View>
      <View style={styles.logoutButton}>
        <Button title="Log Out" onPress={handleSignOut} />
      </View>

      {/* Pokémon List */}
      <View style={styles.pokemonListContainer}>
        <Text style={styles.sectionTitle}>Pokémon List</Text>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data?.pages.flatMap(page => page.results)}
            keyExtractor={item => item.name}
            renderItem={renderItem}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? <ActivityIndicator size="small" /> : null
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBottom: 16,
  },
  buttonState: {
    fontSize: 16,
    marginVertical: 4,
  },
  pokemonListContainer: {
    flex: 1,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
