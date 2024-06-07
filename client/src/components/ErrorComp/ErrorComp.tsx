import React from 'react';
import css from './ErrorComp.module.css'

type ErrorCompProps = {
  text: string,
}

const ErrorComp: React.FC<ErrorCompProps> = ({ text }) => {


  return (
    <div className={css.errMessage}>
      {text}
    </div>
  );
};

export default ErrorComp;