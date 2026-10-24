import css from './ErrorMessage.module.css';

function ErrorMessage() {
  return (
    <div>
      <p className={css.text}>There was an error, please try again...</p>
    </div>
  );
}

export default ErrorMessage;
