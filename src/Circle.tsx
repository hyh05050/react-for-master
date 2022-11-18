import styled from "styled-components";

interface CircleProps {
  bgColor: string;
  borderColor?: string; // not required
  text?: string;
}

const Container = styled.div<CircleProps>`
  width: 200px;
  height: 200px;
  background-color: ${(props) => props.bgColor};
  border-radius: 100px;
  border: 1px solid ${(props) => props.borderColor};
`;

function Circle({ bgColor, borderColor, text = "default text" }: CircleProps) {
  return (
    <Container
      bgColor={bgColor}
      borderColor={borderColor ?? "black"} //undefined => black
    >
      {text}
    </Container>
  );
}

export default Circle;
