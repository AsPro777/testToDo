
import React, { useState, useRef,useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  editIsDo, delTask} from './app/taskSlice';
import { selectTask  } from './app/taskSlice';
import './App.css';
import NewTask from './NewTask';
import { store } from './app/store';
import {useNavigate} from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {

  let task=useSelector(selectTask);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [open, setOpen] = useState(false);
  const [hasMoreTask , setHasMoreTask] = useState(true);
  const [countPage , setCountPage] = useState(1);
  const [selectParamSort , setSelectParamSort] = useState('');

  const delIdRef = useRef(0);
  const countOfTask = useRef(task.length);
  const isSorted = useRef(0);

  const [taskMas , setTaskMas] = useState([]);

  useEffect(()=>{ nextTaskMas(countPage,task) },[]);

  /*добавить в массив заданий, отображаемых на экране следующие 15 элементов. n- количество отображенных страниц */
  function nextTaskMas(n,array){
    let arr=array.slice(0, 15*n);
    setTaskMas(arr);
  }

  /*действия выполняемые когда прокрутим до 15-го элемента */
  function fetchMoreTask () {
    if (taskMas.length >= countOfTask.current) {
      setHasMoreTask(false);
      return;
    }

    setCountPage(countPage+1);
    (isSorted.current == 0) ? nextTaskMas(countPage+1,task) : nextTaskMas(countPage+1,taskMas);
    //nextTaskMas(countPage+1,task)
  };

  /*переход на стр Новая задача по клику */
  function goToNewTask() {
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


  /*Закрытие диалогового окна без удаления задачи */
  const dontDelTask = () => { setOpen(false);  };

  /*изменение флага Выполнена/Не выполнена задача */
  function changeIsDo(event) {
    const id=event.currentTarget.id;
    dispatch(editIsDo({'id': id}));

    task=store.getState().task.value;

    nextTaskMas(countPage,task); 
  }

  /*Клик по кнопке "Удалить" - выводим диалоговое окно. Далее удаляем или нет в зависимости от выбора пользователя */
  function deleteTask(event){
    //const id=event.currentTarget.id;
    dispatch(delTask({'id': delIdRef.current}));
    task=store.getState().task.value;

    nextTaskMas(countPage,task); 
    dontDelTask();
  }

  /*Клик по кнопке "Редактировать" - переход на новую страницу и редактирование в ней задания */
  function editTask(event){
    const id=event.currentTarget.id;
    navigate("/newTask/"+id);
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
              <Dialog
                open={open}
                onClose={dontDelTask}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Вы действительно хотите удалить задачу?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={dontDelTask}>Нет</Button>
                  <Button onClick={deleteTask} autoFocus>Да</Button>
                </DialogActions>
              </Dialog>

            <button className='delEditButton' onClick={editTask} id={props.id}>РЕДАКТИРОВАТЬ</button>

        </div>

      </div>);
  }

  /*вывод даты в нужном формате */
  function formatDate(dat){

    const datDate = new Date(dat);
    let monthNames= [ "янв", "фев", "март", "апр", "май", "июнь","июль", "авг", "сент", "окт", "нояб", "декаб"];
    let mon=monthNames[datDate.getMonth()];
    let newDate = `${datDate.getDate()} ${mon} ${datDate.getFullYear()}г`;
    
    return newDate;
  }

  /*сотрировка по названию */
  function sortHeader(){
    let mas=task.slice();
    mas.sort(function (a, b) { 
      if (a.header > b.header) {
        return 1;
      }
      if (a.header < b.header) {
        return -1;
      }
      return 0;
    })
    
    setCountPage(1);
    nextTaskMas(1,mas);
  }

  /*сортировка по дате начала */
  function sortDateStart(){
    let mas=task.slice();;
    mas.sort(function (a, b) { 
      if (new Date(a.fromDate) > new Date(b.fromDate)) {
        return 1;
      }
      if (new Date(a.fromDate) < new Date(b.fromDate)) {
        return -1;
      }
      return 0;
    })

    setCountPage(1);
    nextTaskMas(1,mas);
  }

  /*сортировка по дате окончания */
  function sortDateEnd(){
    let mas=task.slice();;
    mas.sort(function (a, b) { 
      if (new Date(a.endDate) > new Date(b.endDate)) {
        return 1;
      }
      if (new Date(a.endDate) < new Date(b.endDate)) {
        return -1;
      }
      return 0;
    })
    
    setCountPage(1);
    nextTaskMas(1,mas);
  }

  /*при выборе пункта выпадающего списка делать сортировку */
  function taskChangeSort(event){
    const id=event.target.value;
    setSelectParamSort(id);
    isSorted.current=1;

    switch(id) {
      case '1' : { sortHeader(); break;  }
      case '2' : { sortDateStart(); break;  }
      case '3' : { sortDateEnd(); break;  }
      default: { break; }
    }
    
  }

  /*компонент выпадающий список для сортировки */
  const SortDropDown = () => {
    return(
      <select value={selectParamSort} onChange={taskChangeSort}>
        <option value='' disabled>Параметры сортировки</option>
        <option value='1'>По названию</option>
        <option value='2'>По дате начала</option>
        <option value='3'>По дате окончания</option>
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
                  dataLength={taskMas.length}
                  next={fetchMoreTask}
                  hasMore={hasMoreTask}
                  endMessage={
                              <p style={{ textAlign: "center" }}>
                                 <b>Конец списка</b>
                              </p>
                  } >
                <AllTask allTask={taskMas}/>  
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