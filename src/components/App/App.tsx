import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import styles from './App.module.css';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

function App() {
  const [query, setQuery] = useState<string>('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['articles', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages ?? 0;

  const handleSubmit = (value: string) => {
    setPage(1);
    setQuery(value);
  };

  const handleChange = (movie: Movie) => {
    setCurrentMovie(movie);
  };

  const closeModal = () => {
    setCurrentMovie(null);
  };

  return (
    <div className={styles.app}>
      <Toaster />

      <SearchBar onSubmit={handleSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={handleChange} />
      )}
      {currentMovie && <MovieModal movie={currentMovie} onClose={closeModal} />}
    </div>
  );
}

export default App;
