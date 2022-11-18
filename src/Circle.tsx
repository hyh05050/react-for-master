import { useState } from "react";
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
  const [counter, setCounter] = useState<number | string>(0); //you can 2 type but default type is number
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
