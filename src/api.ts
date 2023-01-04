import { QueryFunctionContext } from "react-query";

const API_KEY = "39b341f76de3823acb78c9002afb9f62";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IGenres {
  id: number;
  name: string;
}

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  status: string;
  genres: IGenres[];
}

interface IMovieCast {
  id: number;
  profile_path: string;
  name: string;
  gender: string;
  known_for_department: string;
}

interface IMovieCrew {
  id: number;
  profile_path: string;
  name: string;
  gender: string;
  known_for_department: string;
  job: string;
}

interface IReviewDetail {
  avatar_path: string;
  name: string;
  rating: string;
}

interface IMovieReview {
  id: number;
  author_details: IReviewDetail;
  content: string;
  created_at: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviesCreditResult {
  id: number;
  cast: IMovieCast[];
  crew: IMovieCrew[];
}

export interface IGetMoviesReviewResult {
  id: number;
  results: IMovieReview[];
}

export function getMovies({ queryKey }: QueryFunctionContext) {
  let movieType = "now_playing";
  if (queryKey[1] === "popular") movieType = "popular";
  else if (queryKey[1] === "upcoming") movieType = "upcoming";

  return fetch(`${BASE_PATH}/movie/${movieType}?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function getMovie({ queryKey }: QueryFunctionContext) {
  return fetch(`${BASE_PATH}/movie/${queryKey[1]}?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export function getMovieCredit({ queryKey }: QueryFunctionContext) {
  return fetch(
    `${BASE_PATH}/movie/${queryKey[1]}/credits?api_key=${API_KEY}`
  ).then((res) => res.json());
}

export function getMovieReview({ queryKey }: QueryFunctionContext) {
  return fetch(
    `${BASE_PATH}/movie/${queryKey[1]}/reviews?api_key=${API_KEY}`
  ).then((res) => res.json());
}

export function getMovieSimilar({ queryKey }: QueryFunctionContext) {
  return fetch(
    `${BASE_PATH}/movie/${queryKey[1]}/similar?api_key=${API_KEY}`
  ).then((res) => res.json());
}

interface ISeason {
  air_date: string;
  id: number;
  overview: string;
  poster_path: string;
  name: string;
  season_number: number;
}

export interface ITV {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  last_air_date: string;
  vote_average: Float32Array;
  vote_count: number;
  episode_run_time: number[];
  seasons: ISeason[];
}

export interface IGetTVResult {
  page: number;
  results: ITV[];
  total_pages: number;
  total_results: number;
}

export function getTVs({ queryKey }: QueryFunctionContext) {
  let movieType = "on_the_air";
  if (queryKey[1] === "popular") movieType = "popular";
  else if (queryKey[1] === "upcoming") movieType = "airing_today";

  return fetch(`${BASE_PATH}/tv/${movieType}?api_key=${API_KEY}`).then((res) =>
    res.json()
  );
}

export function getTV({ queryKey }: QueryFunctionContext) {
  return fetch(`${BASE_PATH}/tv/${queryKey[1]}?api_key=${API_KEY}`).then(
    (res) => res.json()
  );
}

export interface ISearch {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  title: string;
  overview: string;
  media_type: string;
}

export interface IGetSearchResult {
  page: number;
  results: ISearch[];
  total_pages: number;
  total_results: number;
}

export function getSearch({ queryKey }: QueryFunctionContext) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${queryKey[1]}`
  ).then((res) => res.json());
}

export function instanceOfMovie(data: any): data is IMovie {
  return true;
}
