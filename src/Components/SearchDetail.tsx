import { motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovie, getTV, IMovie, ITV } from "../api";
import { makeImagePath } from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 1125px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  text-align: center;
  font-size: 36px;
  position: relative;
  padding: 20px;
  font-weight: bold;
`;

const BigInfo = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
`;

const BigInfoBox = styled.div`
  font-size: 25px;
  font-weight: 500;
`;

const BigOverview = styled.p`
  padding: 20px;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 400;
`;

function SearchDetail({
  searchId,
  keyword,
}: {
  searchId: string;
  keyword: string;
}) {
  const searchType = searchId.split("-")[0];
  const searchKey = searchId.split("-")[1];
  const navigate = useNavigate();
  const onOverlayClick = () => navigate(`/search?keyword=${keyword}`);
  const { data: tv, isLoading: tvLoading } = useQuery<ITV>(
    ["searchTV", searchKey],
    getTV,
    {
      staleTime: 60 * 1000,
      enabled: searchType === "tv",
    }
  );

  const { data: movie, isLoading: movieLoading } = useQuery<IMovie>(
    ["searchMovie", searchKey],
    getMovie,
    {
      staleTime: 60 * 1000,
      enabled: searchType === "movie",
    }
  );
  const { scrollY } = useScroll();
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <BigMovie layoutId={searchId} style={{ top: scrollY.get() + 100 }}>
        {searchType === "tv" && !tvLoading ? (
          <>
            <BigCover
              style={{
                backgroundImage: `url(${makeImagePath(
                  tv!.poster_path || movie!.backdrop_path
                )})`,
              }}
            />
            <BigTitle>{tv!.name}</BigTitle>
            <BigInfo>
              <BigInfoBox>첫방일:{tv!.first_air_date}</BigInfoBox>
              <BigInfoBox>막방일:{tv!.last_air_date}</BigInfoBox>
              <BigInfoBox>런타임:{tv!.episode_run_time}</BigInfoBox>
              <BigInfoBox>평점:{tv!.vote_average}</BigInfoBox>
            </BigInfo>
            <BigOverview>{tv!.overview}</BigOverview>
          </>
        ) : null}

        {searchType === "movie" && !movieLoading ? (
          <>
            <BigCover
              style={{
                backgroundImage: `url(${makeImagePath(
                  movie!.poster_path || movie!.backdrop_path
                )})`,
              }}
            />
            <BigTitle>{movie!.title}</BigTitle>
            <BigInfo>
              <BigInfoBox>개봉일:{movie!.release_date}</BigInfoBox>
              <BigInfoBox>런타임:{movie!.runtime}분</BigInfoBox>
              <BigInfoBox>평점:{movie!.vote_average}</BigInfoBox>
              <BigInfoBox>투표수:{movie!.vote_count}</BigInfoBox>
            </BigInfo>
            <BigOverview>{movie!.overview}</BigOverview>
          </>
        ) : null}
      </BigMovie>
    </>
  );
}

export default SearchDetail;
