import styled, { keyframes } from "styled-components";

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: ${(props) => props.theme.backgroundColor};
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  margin: 50px 0;
`;

const Box = styled.div`
  background-color: ${(props) => props.bgColor};
  width: 100px;
  height: 100px;
`;

const Circle = styled(Box)`
  border-radius: 50px;
`;

const Btn = styled.button`
  color: white;
  background-color: tomato;
  border: 0;
  border-radius: 15px;
`;

const Input = styled.input.attrs({ required: true, minLength: 10 })`
  background-color: tomato;
`;

const rotateAnimation = keyframes`
0% {
transform:rotate(0deg);
border-radius:0px;
}
50% {
transform:rotate(360deg);
border-radius:100px;
}
100% {
transform:rotate(0deg);
border-radius:0px;
}
`;

const Emoji = styled.span`
  font-size: 30px;
`;

const Box2 = styled.div`
  width: 200px;
  height: 200px;
  background-color: tomato;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${rotateAnimation} 2s linear infinite;
  ${Emoji} {
    &:hover {
      font-size: 50px;
    }
    &:active {
      opacity: 0;
    }
  }
`;

function App() {
  return (
    <Wrapper>
      <Container>
        <Box bgColor="teal"></Box>
        <Circle bgColor="tomato" />
        <Btn>Log In</Btn>
        <Btn as="a" href="/">
          Log Out
        </Btn>
        <Input />
      </Container>

      <Container>
        <Box2>
          <Emoji>:)</Emoji>
        </Box2>
      </Container>

      <Container>
        <Title>Hello</Title>
      </Container>
    </Wrapper>
  );
}

export default App;
