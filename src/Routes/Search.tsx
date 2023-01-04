import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearchResult } from "../api";
import SearchDetail from "../Components/SearchDetail";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
  padding: 60px;
  margin-top: 100px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 15px;
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || "";

  const navigate = useNavigate();
  const bigSearchMatch = useMatch("/search/:searchId");

  const { data, isLoading } = useQuery<IGetSearchResult>(
    ["search", keyword],
    getSearch,
    {
      staleTime: 60 * 1000,
      keepPreviousData: true,
    }
  );

  const onBoxClicked = (searchId: string) => {
    navigate(`/search/${searchId}?keyword=${keyword}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <AnimatePresence>
            <Row>
              {data?.results.map((search) => (
                <Box
                  layoutId={`${search.media_type}-${search.id}`}
                  key={`${search.media_type}-${search.id}`}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  bgimage={makeImagePath(
                    search.backdrop_path || search.poster_path,
                    "w500"
                  )}
                  onClick={() =>
                    onBoxClicked(search.media_type + "-" + search.id)
                  }
                >
                  <Info variants={infoVariants}>
                    <h4>{search.title || search.name}</h4>
                  </Info>
                </Box>
              ))}
            </Row>
          </AnimatePresence>

          <AnimatePresence>
            {bigSearchMatch ? (
              <SearchDetail
                searchId={
                  bigSearchMatch.params.searchId
                    ? bigSearchMatch.params.searchId
                    : "0"
                }
                keyword={keyword}
              />
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
