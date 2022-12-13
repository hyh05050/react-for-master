import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";

interface IDragging {
  isDragging: boolean;
}

const Card = styled.div<IDragging>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 15px 30px;
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
  margin: 10px;
`;

interface IDraggableCardProps {
  todo: ITodo;
  index: number;
  board: string;
}

const Wastebasket = styled.button`
  font-size: 15px;
  border: 0;
  padding: 5px;
  margin-left: auto;
`;

function DraggableCard({ board, todo, index }: IDraggableCardProps) {
  const [todos, setTodos] = useRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    setTodos((allBoards) => {
      const newTodo = todos[board].filter((el) => {
        if (el.id !== todo.id) return true;
        else return false;
      });

      const newTodos = {
        ...allBoards,
        [board]: newTodo,
      };

      localStorage.setItem("todos", JSON.stringify(newTodos));

      return newTodos;
    });
  };
  return (
    //Draggable key,draggableId Value가 서로 같아야함
    <Draggable draggableId={todo.id + ""} key={todo.id} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.draggableProps}
          {...magic.dragHandleProps}
        >
          <span {...magic.dragHandleProps}>👍</span>
          {todo.text}
          <Wastebasket onClick={onClick}>🗑️</Wastebasket>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
