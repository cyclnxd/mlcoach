import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {},
  id: 0,
  type: "",
  model: ""
}

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    sum: (state) => {
      state.type 
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer