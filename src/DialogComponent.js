import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function DialogComponent(props){

 /*Закрытие диалогового окна без удаления задачи */
 const dontDelTask = () => { props.openDialogFunc(false);  };

 return(
    <Dialog
                open={props.open}
                onClose={dontDelTask}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Вы действительно хотите удалить задачу?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={dontDelTask}>Нет</Button>
                  <Button onClick={props.deleteTaskFunc} autoFocus>Да</Button>
                </DialogActions>
    </Dialog>
 )
}