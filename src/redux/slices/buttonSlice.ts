import { createSlice } from '@reduxjs/toolkit';

interface ButtonState {
  catchPokemon: boolean;
  viewTeam: boolean;
  settings: boolean;
}

const initialState: ButtonState = {
  catchPokemon: false,
  viewTeam: false,
  settings: false,
};

const buttonSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {
    toggleCatchPokemon: (state) => {
      state.catchPokemon = !state.catchPokemon;
    },
    toggleViewTeam: (state) => {
      state.viewTeam = !state.viewTeam;
    },
    toggleSettings: (state) => {
      state.settings = !state.settings;
    },
  },
});

export const { toggleCatchPokemon, toggleViewTeam, toggleSettings } =
  buttonSlice.actions;
export default buttonSlice.reducer;
