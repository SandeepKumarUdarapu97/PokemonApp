import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface PokemonState {
  data: Array<{ name: string; url: string }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  data: [],
  isLoading: false,
  error: null,
};

// Fetch Pokémon Data
export const fetchPokemon = createAsyncThunk(
  'pokemon/fetchPokemon',
  async (offset: number, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      return rejectWithValue('Failed to fetch Pokémon');
    }
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPokemon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = [...state.data, ...action.payload];
      })
      .addCase(fetchPokemon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default pokemonSlice.reducer;
