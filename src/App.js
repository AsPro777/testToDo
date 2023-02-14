
import React, { useState, useRef,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  editIsDo, delTask} from './app/taskSlice';
import { selectTask  } from './app/taskSlice';
import './App.css';
import NewTask from './NewTask';
import { store } from './app/store';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import DialogComponent from './DialogComponent';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {

  let task=useSelector(selectTask);//массив заданий из хранилища
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [open, setOpen] = useState(false);//откр/закр окно диалога
  const [hasMoreTask , setHasMoreTask] = useState(true);//есть ли еще стр для подгрузки при пагиниции
  const [countPage , setCountPage] = useState(1);//номер подгруженной стр
  const [selectParamSort , setSelectParamSort] = useState('');//параметр для сотрировки

  const delIdRef = useRef(0);//номер задания для удаления
  const countOfTask = useRef(task.length);//всего заданий
  const isSorted = useRef(0);//была ли сортировка
  const sortMas = useRef([]);

  const [taskMas , setTaskMas] = useState([]);//массив заданий, отображаемый в данный момент на экране с учетом пагинации. (сперва это 6 заданий потом при прокрутке он состоит из 12 заданий и тд) 
  const [taskSortMas , setTaskSortMas] = useState([]);//массив заданий, отображаемый в данный момент на экране с учетом пагинации ПОСЛЕ сортировки. 

  useEffect(()=>{nextTaskMas(countPage,task,setTaskMas) },[]);

  /*добавить в массив заданий, отображаемых на экране следующие 15 элементов. n- количество отображенных страниц */
  const nextTaskMas = (n,array,func) => {
    let arr=array.slice(0, 6*n);
      func(arr);
    
  }


  /*действия выполняемые когда прокрутим до 6-го элемента */
  const fetchMoreTask = () => {
    if ((taskMas.length >= countOfTask.current) || (taskSortMas.length >= countOfTask.current)) {
      setHasMoreTask(false);
      return;
    }

    setCountPage(countPage+1);
    (isSorted.current == 0) ? nextTaskMas(countPage+1,task,setTaskMas) : nextTaskMas(countPage+1,sortMas.current,setTaskSortMas);
  };

  /*переход на стр Новая задача по клику */
  const goToNewTask = () => {
    navigate("/newTask/new")
  }

  /*вывод списка всех заданий */
  const AllTask = (props) => {
    const arr=[];

    if(props.allTask) {
      props.allTask.map((str,id) => { 
          arr.push(<AllTaskItem key={id} 
                                 id={id} 
                               text={str.text} 
                             header={str.header}
                             dateStart={str.fromDate}
                             dateEnd={str.endDate}
                             isDo={str.isDo}/>)
      })
    }
    
    return arr;
  }

  /*Открыть диалоговое окно */
  const openDialog = (event) => {
     delIdRef.current=event.currentTarget.id;  setOpen(true);  };


  /*изменение флага Выполнена/Не выполнена задача */
  const changeIsDo = (event) => {
    const id=event.currentTarget.id; 
    dispatch(editIsDo({'dateCreate': getDateCreate(id)}));
    task=store.getState().task.value;
    
    if(isSorted.current == 0) {
      nextTaskMas(countPage,task,setTaskMas);
    }
    else {
      let newList =[];
      let idTask=0;
     task.map((val,ind)=>{if(val.dateCreate == getDateCreate(id)) idTask=ind})
     newList= sortMas.current.map((val,ind)=> {
        if(val.dateCreate == getDateCreate(id)) 
        {return task[idTask]}
        return val;
      }
      )
      sortMas.current=newList;
      nextTaskMas(countPage,newList,setTaskSortMas)
    }
  }

  /*вернет дату создания задания на котором было слбытие Клик */
  const getDateCreate = (id) => {
    if(isSorted.current == 0) {
      return task[id].dateCreate; 
    }
    else {
      return sortMas.current[id].dateCreate;
    }
  }
  /*Клик по кнопке "Удалить" - выводим диалоговое окно. Далее удаляем или нет в зависимости от выбора пользователя */
  const deleteTask = (event) => {
    dispatch(delTask({'dateCreate': getDateCreate(delIdRef.current)}));
    task=store.getState().task.value;
    nextTaskMas(1,task,setTaskMas);

    setCountPage(1);
    isSorted.current=0;
    setCountPage(1);
    setHasMoreTask(true);
    setSelectParamSort('');
    setOpen(false);
//    dontDelTask();
  }

  /*Клик по кнопке "Редактировать" - переход на новую страницу и редактирование в ней задания */
  const editTask = (event) => {
    const id=event.currentTarget.id;
    
    navigate("/newTask/"+getDateCreate(id));
  }

  /*отдельное задание */
  const AllTaskItem = (props) => {
    let dateStart_ = formatDate(props.dateStart) ;
    let dateEnd_ = formatDate(props.dateEnd);
    let a=1;

    return(
      <div className='itemTask'>
        <div className='textTaskDiv'>
          <div className='headTask'>{props.header}</div>
          <div className='textTask'>{props.text}</div>
          <div className='divDate'>
            <span>Начало: {dateStart_}</span>
            <span>Окончание: {dateEnd_}</span>
          </div>
        </div>
        <div className='buttonsTaskDiv'>
          <label>
            <input type='checkbox' checked={props.isDo} onChange={changeIsDo} id={props.id}/>
            Выполнено
          </label>
            <Button id={props.id} className='delEditButton' onClick={openDialog}>Удалить</Button>
            <DialogComponent open={open} openDialogFunc={setOpen} deleteTaskFunc={deleteTask}/>
            <button className='delEditButton' onClick={editTask} id={props.id}>РЕДАКТИРОВАТЬ</button>

        </div>

      </div>);
  }

  /*вывод даты в нужном формате */
  const formatDate = (dat) => {

    const datDate = new Date(dat);
    let monthNames= [ "янв", "фев", "март", "апр", "май", "июнь","июль", "авг", "сент", "окт", "нояб", "декаб"];
    let mon=monthNames[datDate.getMonth()];
    let newDate = `${datDate.getDate()} ${mon} ${datDate.getFullYear()}г`;
    
    return newDate;
  }

  /*сортировка*/
  const sort_by_key = (array, key) =>
  {
    array.sort(function(a, b)
    {
      const x = (typeof a[key] === 'string') ? a[key] : new Date(a[key]);
      const y = (typeof b[key] === 'string') ? b[key] : new Date(b[key]);
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    sortMas.current=array;
    setCountPage(1);
    isSorted.current=1;
    (isSorted.current == 0) ? nextTaskMas(1,task,setTaskMas) : nextTaskMas(1,sortMas.current,setTaskSortMas);
    setHasMoreTask(true);
    setTaskMas([]);
  }

  /*при выборе пункта выпадающего списка делать сортировку */
  const taskChangeSort = (event) => {
    const id=event.target.value;
    setSelectParamSort(id);
    isSorted.current=1;

    switch(id) {
      case '1' : { sort_by_key(task.slice(),'header'); break;  }
      case '2' : { sort_by_key(task.slice(),'fromDate');  break;  }
      case '3' : { sort_by_key(task.slice(),'endDate'); break;  }
      case '4' : { sortIsDoOrNot(true); break;  }
      case '5' : { sortIsDoOrNot(false); break;  }
      default: { break; }
    }
    
  }

    /*фильтрация задач на вып/не вып */
    const sortIsDoOrNot = (param) => {
      sortMas.current = task.slice().filter(x => x.isDo == param);
      
      isSorted.current=1;
      setCountPage(1);
      nextTaskMas(1,sortMas.current,setTaskSortMas)

      setHasMoreTask(true);
      setTaskMas([]);
    }

  /*компонент выпадающий список для сортировки */
  const SortDropDown = () => {
    return(
      <select value={selectParamSort} onChange={taskChangeSort}>
        <option value='' disabled>Параметры сортировки</option>
        <option value='1'>По названию</option>
        <option value='2'>По дате начала</option>
        <option value='3'>По дате окончания</option>
        <option value='4'>Только выполненые</option>
        <option value='5'>Только не выполненые</option>
      </select>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
       <div className='mainDiv'>
           <div className='headerDiv'>
             <button className='goToButton' onClick={goToNewTask}>Создать новую задачу</button>
             <SortDropDown/>
           </div>
           <div className='arrayOfTask'>
           { 
            ((task!==null) && (task!==undefined) && (JSON.stringify(task)!=='{}') && (JSON.stringify(task)!=='[]')) ? 
            <InfiniteScroll
                  dataLength={(isSorted.current == 0) ? taskMas.length : taskSortMas.length}
                  next={fetchMoreTask}
                  hasMore={hasMoreTask}
                  endMessage={
                              <p style={{ textAlign: "center" }}>
                                 <b>Конец списка</b>
                              </p>
                  } >
                <AllTask allTask={(isSorted.current == 0) ? taskMas : taskSortMas}/>  
            </InfiniteScroll>
              :
              <div className='emptyTasks'>Список задач пуст</div>
           }
           </div>
       </div>
      </header>
    </div>
  )
}

export default App;