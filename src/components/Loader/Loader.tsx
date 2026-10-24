import css from './Loader.module.css';

function Loader() {
  return (
    <div>
      <p className={css.text}>Loading movies, please wait...</p>
    </div>
  );
}

export default Loader;
