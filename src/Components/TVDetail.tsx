import { motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getTV, ITV } from "../api";
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

function TVDetail({ tvId }: { tvId: string }) {
  const tvKey = tvId.split("-")[1];
  const navigate = useNavigate();
  const onOverlayClick = () => navigate("/tv");
  const { data, isLoading } = useQuery<ITV>(["TV", tvKey], getTV, {
    staleTime: 60 * 1000,
  });
  const { scrollY } = useScroll();
  return (
    <>
      <Overlay
        onClick={onOverlayClick}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <BigMovie layoutId={tvId} style={{ top: scrollY.get() + 100 }}>
        {isLoading ? null : (
          <>
            <BigCover
              style={{
                backgroundImage: `url(${makeImagePath(data!.poster_path)})`,
              }}
            />
            <BigTitle>{data!.name}</BigTitle>
            <BigInfo>
              <BigInfoBox>첫방일:{data!.first_air_date}</BigInfoBox>
              <BigInfoBox>막방일:{data!.last_air_date}</BigInfoBox>
              <BigInfoBox>런타임:{data!.episode_run_time}</BigInfoBox>
              <BigInfoBox>평점:{data!.vote_average}</BigInfoBox>
            </BigInfo>
            <BigOverview>{data!.overview}</BigOverview>
          </>
        )}
      </BigMovie>
    </>
  );
}

export default TVDetail;
