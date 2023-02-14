

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
        if(el.dateCreate == action.payload.dateCreate)
        { el.isDo = !el.isDo; }
    });
    },
    delTask: (state,action) => {
      state.value = state.value.filter(function( obj ) {
        return obj.dateCreate !== action.payload.dateCreate;
    });
    },
    editableTask: (state,action) => {
      let ind=0;
      state.value.map((value,index)=>{
        if(value.dateCreate == action.payload.dateCreate) ind=index;
      })
      state.value.splice(ind,1,action.payload.new)
    },
  },
});

export const { addTask , editIsDo, delTask, editableTask} = taskSlice.actions;



export const selectTask = state => state.task.value;

export default taskSlice.reducer;