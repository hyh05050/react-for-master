import styled from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { boardState, toDoState } from "./atoms";
import Board from "./Components/Board";
import { useEffect } from "react";

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  position: fixed;
`;

const Wastebasket = styled.div`
  width: 150px;
  height: 150px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
`;

function App() {
  const [boards, setBoards] = useRecoilState(boardState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const preTodos = JSON.parse(localStorage.getItem("todos") as string);
  const preBoards = JSON.parse(localStorage.getItem("boards") as string);
  useEffect(() => {
    if (preBoards) {
      setBoards(preBoards);
      console.log("Init Boards Data");
    }
    if (preTodos) {
      setToDos({
        ...preTodos,
      });
      console.log("Init Todos Data");
    }
  }, []);

  const onDragEnd = ({ destination, source }: DropResult) => {
    let isSameDrop = false;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) isSameDrop = true;
    if (isSameDrop && destination.index === source.index) return;
    console.log(source, destination);
    if (source.droppableId === "boards") {
      if (destination.droppableId === "wastebasket") return;
      setBoards((prev) => {
        const boards = [...prev];
        const board = boards.splice(source.index, 1)[0];
        boards.splice(destination.index, 0, board);
        localStorage.setItem("boards", JSON.stringify(boards));
        return boards;
      });
    } else {
      setToDos((prev) => {
        const startPoint = [...prev[source.droppableId]];
        const dragItem = startPoint.splice(source.index, 1)[0];
        console.log(dragItem);
        startPoint.splice(source.index, 1);
        const endPoint = isSameDrop
          ? startPoint
          : [...prev[destination.droppableId]];
        endPoint.splice(destination.index, 0, dragItem);
        const newTodos = {
          ...prev,
          [source.droppableId]: startPoint,
        };
        if (!isSameDrop) newTodos[destination.droppableId] = endPoint;
        localStorage.setItem("todos", JSON.stringify(newTodos));
        return newTodos;
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="boards">
        {(provided) => (
          <Wrapper>
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {boards.map((board, index) => (
                <Board
                  board={board}
                  toDos={toDos[board]}
                  key={board}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Boards>
            {provided.placeholder}
          </Wrapper>
        )}
      </Droppable>
      <Droppable droppableId="wastebasket">
        {(provided) => (
          <Wastebasket ref={provided.innerRef} {...provided.droppableProps}>
            🗑️
            {provided.placeholder}
          </Wastebasket>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
