import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovie,
  getMovieCredit,
  getMovieReview,
  getMovieSimilar,
  IGetMoviesCreditResult,
  IGetMoviesResult,
  IGetMoviesReviewResult,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import StarRatings from "react-star-ratings";

const MoviePopup = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  opacity: 0;
  overflow-y: scroll;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const PopupLayer = styled.div`
  position: absolute;
  width: 40vw;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const PopupContent = styled(motion.div)`
  margin: 100px auto;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
`;

const MovieCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 1125px;
`;

const MovieInfo = styled.div`
  display: flex;
  position: relative;
  padding: 20px;
  gap: 10px;
  color: ${(props) => props.theme.black.lighter};
`;

const MovieSummaryYear = styled.div`
  color: white;
  width: 50px;
  font-size: 20px;
  font-weight: bold;
`;

const MovieSummary = styled.div`
  padding: 0 4px;
  border: 1px solid white;
  font-size: 15px;
  color: white;
  text-align: center;
`;

const MovieSummaryGenres = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const MovieSummaryGenre = styled.div`
  border: 1px solid white;
  font-size: 15px;
  font-weight: 500;
  color: white;
  text-align: center;
  padding: 0 4px;
`;

const MovieVoteBox = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
`;

const MovieOverview = styled.p`
  padding: 20px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 400;
`;

const MovieCreditBox = styled.div`
  padding: 20px;
`;

const CasterBox = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  overflow-x: auto;
`;

const CreditTitle = styled.div`
  font-size: 25px;
  color: white;
  font-weight: 500;
  flex-shrink: 0;
  margin-bottom: 10px; ;
`;

const Caster = styled.div`
  width: 100px;
  flex: 0 0 auto;
`;

const MovieCasterCover = styled.div`
  height: 120px;
  background-size: cover;
  background-position: center center;
`;

const MovieCasterInfo = styled.div`
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const MovieReviewBox = styled.div`
  padding: 20px;
`;

const ReviewBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 10px;
`;

const Review = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px;
`;

const ReviewerCover = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-size: cover;
  background-position: center center;
`;

const ReviewText = styled.div`
  width: 80%;
  height: 80px;
  font-size: 18px;
  color: white;
  overflow-y: scroll;
  padding-left: 10px;
`;

const MovieSimilarBox = styled.div`
  padding: 20px;
`;

const MovieBox = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
  overflow-x: auto;
`;

const Movie = styled.div`
  width: 100px;
  flex: 0 0 auto;
  cursor: pointer;
`;

const MovieSimilarCover = styled.div`
  height: 120px;
  background-size: cover;
  background-position: center center;
`;

const MovieSimilarTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 15px;
  font-weight: 500;
`;

function MovieDetail({ movieId }: { movieId: string }) {
  const movieKey = movieId.split("-")[1];
  const navigate = useNavigate();
  const onOverlayClick = () => {
    navigate("/");
  };
  const { data, isLoading } = useQuery<IMovie>(["movie", movieKey], getMovie, {
    staleTime: 60 * 1000,
  });

  const { data: cast, isLoading: castLoading } =
    useQuery<IGetMoviesCreditResult>(["credit", movieKey], getMovieCredit, {
      staleTime: 60 * 1000,
    });

  const { data: reviews, isLoading: reviewLoading } =
    useQuery<IGetMoviesReviewResult>(["review", movieKey], getMovieReview, {
      staleTime: 60 * 1000,
    });

  const { data: similar, isLoading: similarLoading } =
    useQuery<IGetMoviesResult>(["similar", movieKey], getMovieSimilar, {
      staleTime: 60 * 1000,
    });

  const onMovieClick = (movieId: string) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <MoviePopup animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Overlay onClick={onOverlayClick} />
      <PopupLayer>
        <PopupContent layoutId={movieId}>
          {isLoading ? null : (
            <>
              <MovieCover
                style={{
                  backgroundImage: `url(${makeImagePath(data!.poster_path)})`,
                }}
              />
              <MovieInfo>
                <MovieSummaryYear>
                  {data?.release_date.substring(0, 4)}
                </MovieSummaryYear>
                <MovieSummary>
                  {data?.status === "Released" ? "상영중" : "종료"}
                </MovieSummary>
                <MovieSummary>{data?.runtime}분</MovieSummary>
                <MovieSummaryGenres>
                  {data?.genres.map((genre) => (
                    <MovieSummaryGenre>{genre.name}</MovieSummaryGenre>
                  ))}
                </MovieSummaryGenres>
              </MovieInfo>
              <MovieVoteBox>
                <StarRatings
                  rating={data!.vote_average / 2}
                  starRatedColor="#780000"
                  starEmptyColor="#ededed"
                  numberOfStars={5}
                  name="rating"
                  starDimension="30px"
                  starSpacing="3px"
                />
              </MovieVoteBox>
              <MovieOverview>{data!.overview}</MovieOverview>

              {castLoading ? null : (
                <>
                  <MovieCreditBox>
                    <CreditTitle>출연 배우</CreditTitle>
                    <CasterBox>
                      {cast!.cast.map((caster, index) => (
                        <Caster key={index}>
                          <MovieCasterCover
                            style={
                              caster.profile_path
                                ? {
                                    backgroundImage: `url(${makeImagePath(
                                      caster.profile_path
                                    )})`,
                                  }
                                : {
                                    backgroundColor: "white",
                                  }
                            }
                          />
                          <MovieCasterInfo>{caster.name}</MovieCasterInfo>
                        </Caster>
                      ))}
                    </CasterBox>
                  </MovieCreditBox>

                  <MovieCreditBox>
                    <CreditTitle>출연 스텝</CreditTitle>
                    <CasterBox>
                      {cast!.crew.map((crewer, index) => (
                        <Caster key={index}>
                          <MovieCasterCover
                            style={
                              crewer.profile_path
                                ? {
                                    backgroundImage: `url(${makeImagePath(
                                      crewer.profile_path
                                    )})`,
                                  }
                                : {
                                    backgroundColor: "white",
                                  }
                            }
                          />
                          <MovieCasterInfo>{crewer.name}</MovieCasterInfo>
                          <MovieCasterInfo style={{ fontWeight: "400" }}>
                            {crewer.job}
                          </MovieCasterInfo>
                        </Caster>
                      ))}
                    </CasterBox>
                  </MovieCreditBox>
                </>
              )}

              {reviewLoading ? null : (
                <>
                  <hr />
                  <MovieReviewBox>
                    <CreditTitle>영화 리뷰</CreditTitle>
                    <ReviewBox>
                      {reviews?.results.slice(0, 4).map((review, index) => (
                        <Review key={index}>
                          <ReviewerCover
                            style={
                              review.author_details.avatar_path
                                ? review.author_details.avatar_path.includes(
                                    "http"
                                  )
                                  ? {
                                      backgroundImage: `url(${review.author_details.avatar_path.slice(
                                        1
                                      )})`,
                                    }
                                  : {
                                      backgroundImage: `url(${makeImagePath(
                                        review.author_details.avatar_path.slice(
                                          1
                                        )
                                      )})`,
                                    }
                                : {
                                    backgroundColor: "white",
                                  }
                            }
                          />
                          <ReviewText>{review.content}</ReviewText>
                        </Review>
                      ))}
                    </ReviewBox>
                  </MovieReviewBox>
                </>
              )}

              {similarLoading ? null : (
                <>
                  <hr />
                  <MovieSimilarBox>
                    <CreditTitle>비슷한 영화 추천</CreditTitle>
                    <MovieBox>
                      <AnimatePresence>
                        {similar?.results.map((movie) => (
                          <Movie
                            key={`similar-${movie.id}`}
                            onClick={() => onMovieClick("similar-" + movie.id)}
                          >
                            <MovieSimilarCover
                              style={{
                                backgroundImage: `url(${makeImagePath(
                                  movie.poster_path || movie.backdrop_path
                                )})`,
                              }}
                            />
                            <MovieSimilarTitle>{movie.title}</MovieSimilarTitle>
                          </Movie>
                        ))}
                      </AnimatePresence>
                    </MovieBox>
                  </MovieSimilarBox>
                </>
              )}
            </>
          )}
        </PopupContent>
      </PopupLayer>
    </MoviePopup>
  );
}

export default MovieDetail;
