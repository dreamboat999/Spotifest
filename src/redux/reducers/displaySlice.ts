import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface DisplayState {
  siteInitialized: boolean;
  isDbOnline: boolean;
  loaderOn: boolean;
  showPlaylistModal: boolean;
}

const initialState: DisplayState = {
  siteInitialized: false,
  isDbOnline: true,
  loaderOn: false,
  showPlaylistModal: true,
};

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setSiteInitialized: (state) => {
      state.siteInitialized = true;
    },
    setDbIsOnline: (state) => {
      state.isDbOnline = true;
    },
    setDbIsOffline: (state) => {
      state.isDbOnline = false;
    },
    turnOnLoader: (state) => {
      state.loaderOn = true;
    },
    turnOffLoader: (state) => {
      state.loaderOn = false;
    },
    setShowPlaylistModal: (state, action: PayloadAction<boolean>) => {
      state.showPlaylistModal = action.payload;
    },
  },
});

export const {
  setSiteInitialized,
  setDbIsOnline,
  setDbIsOffline,
  turnOnLoader,
  turnOffLoader,
  setShowPlaylistModal,
} = displaySlice.actions;

export const selectSiteInitialized = (state: RootState) =>
  state.display.siteInitialized;
export const selectIsDbOnline = (state: RootState) => state.display.isDbOnline;
export const selectLoaderOn = (state: RootState) => state.display.loaderOn;
export const selectShowPlaylistModal = (state: RootState) =>
  state.display.showPlaylistModal;

export default displaySlice.reducer;
