import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TshirtState {
  selectedType: string
  tshirtColor: string
  selectedView: 'front' | 'back'
}

const initialState: TshirtState = {
  selectedType: 'crew-neck',
  tshirtColor: '#FFFFFF',
  selectedView: 'front',
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
  },
})

export const { setSelectedType, setTshirtColor, setSelectedView } = tshirtSlice.actions

export default tshirtSlice.reducer
