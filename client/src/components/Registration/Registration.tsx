import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ErrorComp from '../ErrorComp/ErrorComp';
import css from './Registration.module.css'

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('')
  const [userPassword, setUserPassword] = useState<string>('')
  const [nameWarn, setNameWarn] = useState(false)
  const [passWarn, setPassWarn] = useState(false)
  const [errorText, setErrorText] = useState('');

  function setName(e: { target: { value: React.SetStateAction<string>; }; }) {
    setNameWarn(false);
    setUserName(e.target.value);
  }

  function setPass(e: { target: { value: React.SetStateAction<string>; }; }) {
    setPassWarn(false);
    setUserPassword(e.target.value);
  }

  async function registration(e: { preventDefault: () => void; }) {
    e.preventDefault();

    if (userName === '') {
      setNameWarn(true);
      return
    }
    if (userPassword === '') {
      setPassWarn(true);
      return
    }

    const newUser = {
      name: userName,
      password: userPassword,
    }

    const res = await fetch(`http://localhost:5050/todo/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(newUser)
    })

    if (res.ok) {
      localStorage.setItem('toDoUser', JSON.stringify(
        {
          name: userName,
          password: userPassword,
        }
      ));
      navigate(`/todo/${userName}`);
    } else {
      const errorMessage = await res.json();
      setErrorText(errorMessage.message);
    }
  }

  useEffect(() => {
    const userFromStorage = localStorage.getItem('toDoUser');
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      navigate(`/todo/${user.name}`);
    }
  }, [navigate, userName])

  return (
    <div className={css.wrap}>
      <span>Welcome to the <b>ToDo App</b></span>
      <span>Please create a user</span>
      <p>Already have an account? <Link to={'/auth'}>Sign in</Link></p>
      {errorText !== '' && <ErrorComp text={errorText} />}
      <form id={css.regForm} onSubmit={registration}>
        <input
          className={css.inp}
          name='name'
          placeholder='Name'
          style={nameWarn ? { borderColor: 'red' } : {}}
          type="text"
          value={userName}
          autoComplete='false'
          onChange={setName}
        />
        <input
          className={css.inp}
          placeholder='Password'
          name='Password'
          style={passWarn ? { borderColor: 'red' } : {}}
          type="text"
          value={userPassword}
          autoComplete='false'
          onChange={setPass}
        />
        <input id={css.submit} type="submit" value="Create user" />
      </form>
    </div>
  );
};

export default Registration;