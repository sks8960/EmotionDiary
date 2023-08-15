import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useReducer, useRef } from 'react';
import './App.css';
import Home from './Pages/Home';
import New from './Pages/New';
import Edit from './Pages/Edit';
import Diary from './Pages/Diary';
//COMPONENTS

const reducer = (state, action)=>{
  let newState = [];
  switch(action.type){
    case 'INIT':{
      return action.data;
    }
    case 'CREATE':{
      const newItem = {
        ...action.data
      };
      newState = [newItem, ...state];
      break;
    }
    case 'REMOVE':{
      newState = state.filter((it)=>it.id !== action.targetId);
      break;
    }
    case 'EDIT':{
      newState = state.map((it)=>it.id === action.data.id ? {...action.data} : it);
      break;
    }
    default:
      return state;
  }
  return newState;
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const dataId = useRef(0);

  // CREATE

  const onCreate = (data, content, emotion) =>{
    dispatch({
      type:"CREATE", 
      data: {
        id:dataId.current,
        date : new Date(data).getTime(),
        content,
        emotion,
      }
   });
   dataId.current += 1;
  };

  const onRemove = (targetId) =>{
    dispatch({type:"REMOVE", targetId});
  }

  const onEdit = (targetId, date, content, emotion) =>{
    dispatch({
      type:"EDIT",
      data: {
        id : targetId,
        date : new Date(date).getTime(),
        content,
        emotion,
      }
  });
}

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider 
        value={{
          onCreate, onEdit, onRemove,
        }
      }>
      <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path = "/" element = {<Home />}/>
        <Route path = "/new" element = {<New />}/>
        <Route path = "/edit" element = {<Edit />}/>
        <Route path = "/diary/:id" element = {<Diary />}/>
      </Routes>
    </div>
    </BrowserRouter>
      </DiaryDispatchContext.Provider>
    
    </DiaryStateContext.Provider>
  );
}

export default App;
