
import React, { useState, useEffect,useRef } from 'react';
import {useNavigate} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {  addTask,editableTask, sortTask} from './app/taskSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { useParams } from "react-router-dom";
import { selectTask } from './app/taskSlice';
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru);

/*страница добавления новой задачи */
function NewTask(props) {

  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [startTaskDate, setStartTaskDate] = useState();
  const [endTaskDate, setEndTaskDate] = useState();
  const [isDo , setIsDo] = useState(false);
  const task = useSelector(selectTask);
  const [idEditedTask , setIdEditTask] = useState(null);

  let paramFromApp = useParams();/*номер задачи для редактирования */ 
  

  useEffect(()=>{
    if (paramFromApp.param == 'new') {
      setStartTaskDate(new Date());
      setEndTaskDate(new Date());
      setIdEditTask(0);
    }
    else {
      let id = 0;
      task.map((value,index)=> {
         if(value.dateCreate == paramFromApp.param) id=index })
      setIdEditTask(id);
      setStartTaskDate(new Date(task[id].fromDate)) ;
      setEndTaskDate(new Date(task[id].endDate))
    }
  },[])

   /*Переход на страницу Список задач по клику */
  const goToApp = () => {
    navigate(-1)
  }

  /*возвращает объект задачи для дальнейшего добавления или изменения */
  const sendObj = (param) => {
    let textHead=document.getElementById('taskHeader').value;
    let textBody=document.getElementById('taskText').value;

    const objTask = {
      'dateCreate':  (new Date()).toISOString(),
      'header': textHead,
      'text': textBody,
      'fromDate': startTaskDate.toISOString(),
      'endDate':  endTaskDate.toISOString(),
      'isDo': (param == 'new') ? false : task[Number(param)].isDo
    }

    return objTask;
  }
  
  /*добавление новой задачи */
  const addNewTask = () => {
     let objNewTask=sendObj(paramFromApp.param);
     dispatch(addTask(objNewTask));
     alert('Задача добавлена');
     goToApp();
    }

    /*редактирование задачи */
    const editExistTask = () => {
     let objEditTask=sendObj(idEditedTask); 
     const objEditTaskFull = {
      'new':objEditTask,
      'dateCreate': paramFromApp.param
    }
     dispatch(editableTask(objEditTaskFull));
     alert('Задача изменена');
     goToApp();
    }

    return (
      <div className="App">
      <header className="App-header">
       {
       (idEditedTask == null) ? <></>: 
       
       <div className='mainDiv'>
        <button className='goToButton marginNewTask' onClick={goToApp}>Назад к списку задач</button>
        <textarea id='taskHeader' className='TitleTaskTextarea marginNewTask' placeholder='Название задачи'>{(paramFromApp.param == 'new') ? '' : task[idEditedTask].header}</textarea>
        <textarea id='taskText' className='TextTaskTextarea marginNewTask' placeholder='Текст Задачи'>{(paramFromApp.param == 'new') ? '' : task[idEditedTask].text}</textarea>
        <div className='dateDiv addNewTask'>
          <div className='taskDate'>
            <span>Начало задачи</span>
            <DatePicker selected={startTaskDate } 
                        onChange={ (date) => setStartTaskDate(date)}
                        locale="ru"
                        dateFormat="d MMM yyyy" />  
          </div>
          <div className='taskDate'>
            <span>Окончание задачи</span>
            <DatePicker selected={ endTaskDate } 
                        onChange={(date) => setEndTaskDate(date)}
                        locale="ru"
                        dateFormat="d MMM yyyy" />
          </div>
        </div>
        <button className='addNewTask' onClick={(paramFromApp.param == 'new') ? addNewTask : editExistTask}>Добавить/Изменить задачу</button>
      </div>
      }
      </header>
    </div>
    )
  }
  
  export default NewTask;