import React, { useEffect, useState } from 'react';
import { ToDo } from '../ToDoList/ToDoList';
import deleteIcon from '../../assets/delete.svg';
import editIcon from "../../assets/editIcon.svg";
import completeIcon from '../../assets/complete.svg';
import treeDotsIcon from '../../assets/threeDots.svg';
import css from './ToDoItem.module.css'

type ToDoItemProps = {
  todo: ToDo,
  name: string,
  password: string,
  getUsersData: () => Promise<void>,
}

const ToDoItem: React.FC<ToDoItemProps> = ({ todo, name, password, getUsersData }) => {
  const [inpValue, setInpValue] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isComplShown, setIsComplShown] = useState(false);
  const [isEditShown, setIsEditShown] = useState(false);
  const [isDeleteShown, setDeleteShown] = useState(false);
  const [isDotsOpen, setIsDotsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const deleteToDo = () => {
    const url = `http://localhost:5050/todo/${name}/${password}/${todo.text}/${todo.completion}`;
    fetch(url, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete the todo item');
        }
        return response.text();
      })
      .then(text => {
        getUsersData();
        if (text) {
          const data = JSON.parse(text);
          console.log('Delete successful', data);
        } else {
          console.log('Delete successful, no content returned');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const completeToDo = () => {
    const url = `http://localhost:5050/todo/${name}/${password}/${todo.text}/${!todo.completion}`;
    fetch(url, {
      method: 'PATCH'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update the todo item');
        }
        return response.text();
      })
      .then(text => {
        getUsersData();
        if (text) {
          const data = JSON.parse(text);
          console.log(data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const setNewText = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (inpValue !== todo.text && inpValue !== '') {
      const url = `http://localhost:5050/todo/update/${name}/${password}/${todo.text}/${inpValue}/${todo.completion}`;
      fetch(url, {
        method: 'PATCH'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update the todo item');
          }
          return response.text();
        })
        .then(text => {
          setIsEditing(false);
          getUsersData();
          if (text) {
            const data = JSON.parse(text);
            console.log(data);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }

  useEffect(() => {
    setInpValue(todo.text);
    setIsEditing(false);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [todo.text])

  const changeInput = (
    <form className={css.changeForm} onSubmit={setNewText}>
      <input
        type="text"
        value={inpValue}
        id={css.editInput}
        onChange={(e) => setInpValue(e.target.value)}
      />
      <input
        type="submit"
        value='Change'
        id={css.submBtn}
      />
    </form>
  )


  const actionsBar = (
    <div className={css.actions}>
      <div className={todo.completion ? `${css.bgComplete} ${css.completedCheck}` : css.bgComplete}>
        <img
          className={css.completeImg}
          onClick={completeToDo}
          onMouseEnter={() => setIsComplShown(true)}
          onMouseLeave={() => setIsComplShown(false)}
          src={completeIcon}
          alt="complete"
        />
      </div>
      {isComplShown && (
        <div style={{ top: 35, left: -27 }} className={css.notification}>
          {todo.completion ? 'Mark as uncompleted' : 'Mark as completed'}
        </div>
      )}
      <img
        className={css.completeImg}
        onClick={() => setIsEditing(prev => !prev)}
        onMouseEnter={() => setIsEditShown(true)}
        onMouseLeave={() => setIsEditShown(false)}
        src={editIcon}
        alt="edit"
      />
      {isEditShown && (
        <div style={{ top: 35, left: 40 }} className={css.notification}>
          Edit
        </div>
      )}
      <img
        className={css.delImg}
        onClick={deleteToDo}
        onMouseEnter={() => setDeleteShown(true)}
        onMouseLeave={() => setDeleteShown(false)}
        src={deleteIcon}
        alt="delete"
      />
      {isDeleteShown && (
        <div style={{ top: 35, left: 70 }} className={css.notification}>
          Delete
        </div>
      )}
    </div>
  )


  const dotActions = (
    <div className={css.dotActions}>
      <img
        className={css.dotsImg}
        onClick={() => setIsDotsOpen(p => !p)}
        src={treeDotsIcon}
        alt="dots"
      />
      {isDotsOpen ? (
        <div onMouseLeave={() => setIsDotsOpen(false)} className={css.dotsList}>
          {actionsBar}
        </div>
      ) : null}
    </div>
  )

  return (
    <div className={css.itemWrap}>
      {isEditing ? (
        changeInput
      ) : (
        <span className={todo.completion ? `${css.completed} ${css.text}` : css.text}>
          {todo.text}
        </span>
      )}
      {windowWidth > 750 ? actionsBar : dotActions}
    </div>
  );
};

export default ToDoItem;