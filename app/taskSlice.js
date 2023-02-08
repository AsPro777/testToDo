

import { createSlice } from '@reduxjs/toolkit';

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    value: [],
  },
  reducers: {
    addTask: (state,action)=>{  
         state.value.push(action.payload) 
        }
    ,
    editIsDo: (state,action)=>{
      state.value.map((el,id) => {
        if(id == action.payload.id) {
            el.isDo = !el.isDo;
        }
    });
    },
    delTask: (state,action) => {
      state.value.splice(action.payload.id,1)
    },
    editableTask: (state,action) => {
      state.value.splice(action.payload.id,1,action.payload.new)
    },
  },
});

export const { addTask , editIsDo, delTask, editableTask} = taskSlice.actions;



export const selectTask = state => state.task.value;

export default taskSlice.reducer;