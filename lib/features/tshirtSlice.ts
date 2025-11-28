import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TshirtState {
  selectedType: string
  tshirtColor: string
  selectedView: 'front' | 'back'
  selectedSize: string
  selectedFabric: string
}

const initialState: TshirtState = {
  selectedType: 'crew-neck',
  tshirtColor: '#FFFFFF',
  selectedView: 'front',
  selectedSize: 'M',
  selectedFabric: 'pima-cotton',
}

export const tshirtSlice = createSlice({
  name: 'designer',
  initialState,
  reducers: {
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload
    },
    setTshirtColor: (state, action: PayloadAction<string>) => {
      state.tshirtColor = action.payload
    },
    setSelectedView: (state, action: PayloadAction<'front' | 'back'>) => {
      state.selectedView = action.payload
    },
    setSelectedSize: (state, action: PayloadAction<string>) => {
      state.selectedSize = action.payload
    },
    setSelectedFabric: (state, action: PayloadAction<string>) => {
      state.selectedFabric = action.payload
    },
  },
})

export const {
  setSelectedType,
  setTshirtColor,
  setSelectedView,
  setSelectedSize,
  setSelectedFabric,
} = tshirtSlice.actions

export default tshirtSlice.reducer
