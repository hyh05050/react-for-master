import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath, useWindowDimensions } from "../utils";
import { getMovies, IGetMoviesResult } from "./../api";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ArrowIosBackOutline } from "@styled-icons/evaicons-outline/ArrowIosBackOutline";
import { ArrowIosForwardOutline } from "@styled-icons/evaicons-outline/ArrowIosForwardOutline";
import MovieDetail from "./../Components/MovieDetail";
import InfoIcon from "@mui/icons-material/Info";

const Wrapper = styled.div`
  background-color: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled(motion.div)<{ bgimage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(#383737, rgba(0, 0, 0, 0)),
    url(${(props) => props.bgimage});
  background-size: cover;
  background-position: center center;
`;

const Title = styled(motion.h2)`
  font-size: 60px;
  margin-bottom: 20px;
`;

const Overview = styled(motion.p)`
  opacity: 1;
  font-size: 25px;
  width: 30%;
  margin-bottom: 20px;
`;

const DetailButton = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(70, 70, 70, 0.8);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0);
  width: 150px;
  padding: 10px;
  font-size: 20px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: rgba(70, 70, 70, 0.5);
  }
  &:active {
    border: 2px solid white;
    background-color: rgba(70, 70, 70, 1);
  }
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  padding: 0 50px;
  margin-bottom: 70px;
`;

const SliderTitle = styled.div`
  font-size: 32px;
  margin-bottom: 10px;
`;

const SliderSideBox = styled.div<{ direction: string }>`
  display: flex;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  top: 0px;
  width: 100px;
  height: 200px;
  z-index: 99;
  cursor: pointer;
  opacity: 0;

  ${(props) => {
    if (props.direction === "right") {
      return {
        right: 0,
      };
    } else {
      return {
        left: 0,
      };
    }
  }}
`;
const ArrowBackIcon = styled(ArrowIosBackOutline)``;
const ArrowForwardIcon = styled(ArrowIosForwardOutline)``;

const RowBox = styled.div`
  position: relative;
  height: 200px;
  &:hover {
    ${SliderSideBox} {
      opacity: 1;
    }
  }
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgimage: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgimage});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Top10Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  color: white;
  font-weight: 500;
  background-color: #790000;

  div:nth-child(1) {
    font-size: 10px;
  }

  div:nth-child(2) {
    font-size: 20px;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: transparent;
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: white;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const rowVariants = useWindowDimensions();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies,
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    }
  );

  const { data: popular, isLoading: popularLoading } =
    useQuery<IGetMoviesResult>(["movies", "popular"], getMovies, {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    });

  const { data: upcoming, isLoading: upcomingLoading } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], getMovies, {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    });

  const [nowIndex, setNowIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [upcomingIndex, setupcomingIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const onArrowClick = (direction: string, type: string) => {
    const movies = type === "now" ? data : type === "now" ? popular : upcoming;
    const setIndex =
      type === "now"
        ? setNowIndex
        : type === "popular"
        ? setPopularIndex
        : setupcomingIndex;

    if (movies) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = movies.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      if (direction === "left") {
        setBack(false);
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setBack(true);
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: string) => {
    navigate(`/movies/${movieId}`);
  };

  if (bigMovieMatch) {
    document.body.style.overflowY = "hidden";
  } else {
    document.body.style.overflowY = "scroll";
  }

  return (
    <Wrapper>
      {isLoading || popularLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <AnimatePresence>
            <Banner
              bgimage={makeImagePath(
                data?.results[0].backdrop_path ||
                  data?.results[0].poster_path ||
                  ""
              )}
            >
              <Title>{data?.results[0].title}</Title>
              <Overview>{data?.results[0].overview}</Overview>
              <DetailButton
                onClick={() => onBoxClicked("now-" + data?.results[0].id)}
              >
                <InfoIcon />
                <p>상세 정보</p>
              </DetailButton>
            </Banner>
          </AnimatePresence>
          <Slider>
            <SliderTitle>현재 상영중인 영화</SliderTitle>
            <RowBox>
              <SliderSideBox
                direction="left"
                onClick={() => {
                  onArrowClick("left", "now");
                }}
              >
                <ArrowBackIcon />
              </SliderSideBox>
              <SliderSideBox
                direction="right"
                onClick={() => {
                  onArrowClick("right", "now");
                }}
              >
                <ArrowForwardIcon />
              </SliderSideBox>
              <AnimatePresence
                initial={false}
                onExitComplete={toggleLeaving}
                custom={{ back }}
              >
                <Row
                  key={nowIndex}
                  custom={{ back }}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    type: "tween",
                    duration: 1,
                  }}
                >
                  {data?.results
                    .slice(1)
                    .slice(offset * nowIndex, offset * nowIndex + offset)
                    .map((movie) => {
                      const top10YN = popular?.results
                        .slice(0, 10)
                        .some((el) => el.id === movie.id);
                      return (
                        <Box
                          layoutId={`now-${movie.id}`}
                          key={`now-${movie.id}`}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          bgimage={makeImagePath(
                            movie.backdrop_path || movie.poster_path,
                            "w500"
                          )}
                          onClick={() => onBoxClicked("now-" + movie.id)}
                        >
                          {top10YN ? (
                            <Top10Box>
                              <div>TOP</div>
                              <div>10</div>
                            </Top10Box>
                          ) : null}
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>{" "}
                          </Info>
                        </Box>
                      );
                    })}
                </Row>
              </AnimatePresence>
            </RowBox>
          </Slider>

          {popularLoading ? null : (
            <Slider>
              <SliderTitle>인기있는 영화</SliderTitle>
              <RowBox>
                <SliderSideBox
                  direction="left"
                  onClick={() => {
                    onArrowClick("left", "popular");
                  }}
                >
                  <ArrowBackIcon />
                </SliderSideBox>
                <SliderSideBox
                  direction="right"
                  onClick={() => {
                    onArrowClick("right", "popular");
                  }}
                >
                  <ArrowForwardIcon />
                </SliderSideBox>
                <AnimatePresence
                  initial={false}
                  onExitComplete={toggleLeaving}
                  custom={{ back }}
                >
                  <Row
                    key={popularIndex}
                    custom={{ back }}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      type: "tween",
                      duration: 1,
                    }}
                  >
                    {popular?.results
                      .slice(
                        offset * popularIndex,
                        offset * popularIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={`popular-${movie.id}`}
                          key={`popular-${movie.id}`}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          bgimage={makeImagePath(
                            movie.backdrop_path || movie.poster_path,
                            "w500"
                          )}
                          onClick={() => onBoxClicked("popular-" + movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>{" "}
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </RowBox>
            </Slider>
          )}

          {upcomingLoading ? null : (
            <Slider>
              <SliderTitle>곧 개봉하는 영화</SliderTitle>
              <RowBox>
                <SliderSideBox
                  direction="left"
                  onClick={() => {
                    onArrowClick("left", "upcoming");
                  }}
                >
                  <ArrowBackIcon />
                </SliderSideBox>
                <SliderSideBox
                  direction="right"
                  onClick={() => {
                    onArrowClick("right", "upcoming");
                  }}
                >
                  <ArrowForwardIcon />
                </SliderSideBox>
                <AnimatePresence
                  initial={false}
                  onExitComplete={toggleLeaving}
                  custom={{ back }}
                >
                  <Row
                    key={upcomingIndex}
                    custom={{ back }}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{
                      type: "tween",
                      duration: 1,
                    }}
                  >
                    {upcoming?.results
                      .slice(
                        offset * upcomingIndex,
                        offset * upcomingIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={`upcoming-${movie.id}`}
                          key={`upcoming-${movie.id}`}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          bgimage={makeImagePath(
                            movie.backdrop_path || movie.poster_path,
                            "w500"
                          )}
                          onClick={() => onBoxClicked("upcoming-" + movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>{" "}
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </RowBox>
            </Slider>
          )}

          <AnimatePresence>
            {bigMovieMatch ? (
              <MovieDetail
                movieId={
                  bigMovieMatch.params.movieId
                    ? bigMovieMatch.params.movieId
                    : "0"
                }
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
