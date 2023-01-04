import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import { makeImagePath, useWindowDimensions } from "../utils";
import { getTVs, IGetTVResult } from "./../api";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { ArrowIosBackOutline } from "@styled-icons/evaicons-outline/ArrowIosBackOutline";
import { ArrowIosForwardOutline } from "@styled-icons/evaicons-outline/ArrowIosForwardOutline";
import TVDetail from "../Components/TVDetail";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgimage: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)),
    url(${(props) => props.bgimage});
  background-size: cover;
  background-position: center center;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
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

function Tv() {
  const navigate = useNavigate();
  const bigTVMatch = useMatch("/tv/:tvId");
  const rowVariants = useWindowDimensions();
  const { data, isLoading } = useQuery<IGetTVResult>(
    ["TV", "nowPlaying"],
    getTVs,
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    }
  );

  const { data: popular, isLoading: popularLoading } = useQuery<IGetTVResult>(
    ["TV", "popular"],
    getTVs,
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    }
  );

  const { data: upcoming, isLoading: upcomingLoading } = useQuery<IGetTVResult>(
    ["TV", "upcoming"],
    getTVs,
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    }
  );

  const [nowIndex, setNowIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [upcomingIndex, setupcomingIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const onArrowClick = (direction: string, type: string) => {
    const tvs = type === "now" ? data : type === "now" ? popular : upcoming;
    const setIndex =
      type === "now"
        ? setNowIndex
        : type === "popular"
        ? setPopularIndex
        : setupcomingIndex;

    if (tvs) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = tvs.results.length - 1;
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
  const onBoxClicked = (tvId: string) => {
    navigate(`/tv/${tvId}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            bgimage={makeImagePath(
              data?.results[0].poster_path ||
                data?.results[0].backdrop_path ||
                ""
            )}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <SliderTitle>현재 상영중인 프로그램</SliderTitle>
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
                    .map((tv) => (
                      <Box
                        layoutId={`now-${tv.id}`}
                        key={`now-${tv.id}`}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        bgimage={makeImagePath(
                          tv.backdrop_path || tv.poster_path,
                          "w500"
                        )}
                        onClick={() => onBoxClicked("now-" + tv.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>{" "}
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </RowBox>
          </Slider>

          {popularLoading ? null : (
            <Slider>
              <SliderTitle>인기있는 프로그램</SliderTitle>
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
                      .map((tv) => (
                        <Box
                          layoutId={`popular-${tv.id}`}
                          key={`popular-${tv.id}`}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          bgimage={makeImagePath(
                            tv.backdrop_path || tv.poster_path,
                            "w500"
                          )}
                          onClick={() => onBoxClicked("popular-" + tv.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>{" "}
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
              <SliderTitle>오늘 상영하는 프로그램</SliderTitle>
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
                      .map((tv) => (
                        <Box
                          layoutId={`upcoming-${tv.id}`}
                          key={`upcoming-${tv.id}`}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          bgimage={makeImagePath(
                            tv.backdrop_path || tv.poster_path,
                            "w500"
                          )}
                          onClick={() => onBoxClicked("upcoming-" + tv.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{tv.name}</h4>{" "}
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </RowBox>
            </Slider>
          )}

          <AnimatePresence>
            {bigTVMatch ? (
              <TVDetail
                tvId={bigTVMatch.params.tvId ? bigTVMatch.params.tvId : "0"}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
