
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {  addTask,editableTask, sortTask} from './app/taskSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { useParams } from "react-router-dom";
import { selectTask } from './app/taskSlice';

/*страница добавления новой задачи */
function NewTask(props) {

  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [startTaskDate, setStartTaskDate] = useState();
  const [endTaskDate, setEndTaskDate] = useState();
  const [isDo , setIsDo] = useState(false);
  const task = useSelector(selectTask);

  let paramFromApp = useParams();/*номер задачи для редактирования */ 

  useEffect(()=>{
    (paramFromApp.param == 'new') ? setStartTaskDate(new Date()) : setStartTaskDate(new Date(task[Number(paramFromApp.param)].fromDate)) ;
    (paramFromApp.param == 'new') ? setEndTaskDate(new Date()) : setEndTaskDate(new Date(task[Number(paramFromApp.param)].endDate)) ;
  },[])

   /*Переход на страницу Список задач по клику */
  function goToApp(){
    navigate(-1)
  }

  /*возвращает объект задачи для дальнейшего добавления или изменения */
  function sendObj(param){
    let textHead=document.getElementById('taskHeader').value;
    let textBody=document.getElementById('taskText').value;

    const objTask = {
      'header':textHead,
      'text': textBody,
      'fromDate': startTaskDate.toISOString(),
      'endDate':  endTaskDate.toISOString(),
      'isDo': (param == 'new') ? false : task[Number(param)].isDo
    }

    return objTask;
  }
  
  /*добавление новой задачи */
  function addNewTask() {
     let objNewTask=sendObj(paramFromApp.param);
     dispatch(addTask(objNewTask));
     alert('Задача добавлена');
     goToApp();
    }

    /*редактирование задачи */
    function editExistTask() {
     let objEditTask=sendObj(paramFromApp.param); 
     const objEditTaskFull = {
      'new':objEditTask,
      'id': Number(paramFromApp.param)
    }
     dispatch(editableTask(objEditTaskFull));
     alert('Задача изменена');
     goToApp();
    }

    return (
      <div className="App">
      <header className="App-header">
       <div className='mainDiv'>
        <button className='goToButton marginNewTask' onClick={goToApp}>Назад к списку задач</button>
        <textarea id='taskHeader' className='TitleTaskTextarea marginNewTask' placeholder='Название задачи'>{(paramFromApp.param == 'new') ? '' : task[Number(paramFromApp.param)].header}</textarea>
        <textarea id='taskText' className='TextTaskTextarea marginNewTask' placeholder='Текст Задачи'>{(paramFromApp.param == 'new') ? '' : task[Number(paramFromApp.param)].text}</textarea>
        <div className='dateDiv addNewTask'>
          <div className='taskDate'>
            <span>Начало задачи</span>
            <DatePicker selected={startTaskDate } onChange={
              (date) => setStartTaskDate(date)} />  
          </div>
          <div className='taskDate'>
            <span>Окончание задачи</span>
            <DatePicker selected={ endTaskDate } onChange={(date) => setEndTaskDate(date)} />
          </div>
        </div>
        <button className='addNewTask' onClick={(paramFromApp.param == 'new') ? addNewTask : editExistTask}>Добавить/Изменить задачу</button>
       </div>
      </header>
    </div>
    )
  }
  
  export default NewTask;