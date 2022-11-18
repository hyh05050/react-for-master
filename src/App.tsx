import React, { useState } from "react";
import styled from "styled-components";

function App() {
  const [value, setValue] = useState("");
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setValue(value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("hello", value);
  };

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {};

  const Container = styled.div`
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
  `;

  const Button = styled.button`
    color: ${(props) => props.theme.textColor};
    background-color: ${(props) => props.theme.btnColor};
  `;

  return (
    <Container>
      {/* <Circle bgColor="teal" borderColor="red" />
      <Circle bgColor="tomato" text="props text" /> */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="username"
          value={value}
          onChange={onChange}
        />
        <Button onClick={onClick}>Login</Button>
      </form>
    </Container>
  );
}

export default App;
