import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Switch,
  TouchableOpacity,
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
import { getHeight, getWidth, normalize } from '../utils';

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
        <TouchableOpacity style={{
            marginBottom: getHeight(1),
            paddingVertical: getHeight(0.5),
            backgroundColor: '#ca705d',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: getWidth(1)
        }}
        onPress={() => navigation.navigate('Details', {url: item.url})}>
            <Text style={{
                color: 'white',
                textAlign: 'center',
                fontWeight:'600',
                fontSize: normalize(16)
            }}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );
  };

  const toggleCatchPokeonSwitch = () => {
    dispatch(toggleCatchPokemon());
  };
  const toggleViewTeamSwitch = () => {
    dispatch(toggleViewTeam());
  };
  const toggleViewSettingsSwitch = () => {
    dispatch(toggleSettings());
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
        <View style={{alignItems: 'center'}}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={buttons.catchPokemon ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleCatchPokeonSwitch}
            value={buttons.catchPokemon}
          />
          <Text style={styles.buttonState}>
            Catch Pokémon: {buttons.catchPokemon ? 'On' : 'Off'}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={buttons.viewTeam ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleViewTeamSwitch}
            value={buttons.viewTeam}
          />
          <Text style={styles.buttonState}>
            View Team: {buttons.viewTeam ? 'On' : 'Off'}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={buttons.settings ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleViewSettingsSwitch}
            value={buttons.settings}
          />
          <Text style={styles.buttonState}>
            Settings: {buttons.settings ? 'On' : 'Off'}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={()=> handleSignOut()} >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

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
    paddingHorizontal: getHeight(2),
    paddingTop: getHeight(2)
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: getHeight(2),
  },
  profileImage: {
    width: getWidth(20),
    height: getWidth(20),
    borderRadius: getWidth(15),
    marginBottom: getHeight(1),
  },
  text: {
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBottom: getHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonState: {
    fontSize: normalize(12),
    marginVertical: getHeight(0.25),
    fontWeight:'400'
  },
  pokemonListContainer: {
    flex: 1,
    marginVertical: getHeight(2),
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: getHeight(1),
    borderRadius: getWidth(1),
    backgroundColor:'#c6a49d',
    alignItems:'center',
    justifyContent:'center',
    padding:getHeight(1)
  },
  logoutText: {fontSize: normalize(14),color:'white',fontWeight:'400'}
});

export default HomeScreen;
