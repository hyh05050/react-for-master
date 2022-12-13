import styled from "styled-components";
import {
  DragDropContext,
  DragStart,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { boardState, dropState, toDoState } from "./atoms";
import Board from "./Components/Board";
import { useEffect } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

const Boards = styled.div`
  display: grid;
  width: 50%;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(250px, 1fr);
  place-content: center;
  gap: 20px;
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
  const [drop, setDrop] = useRecoilState(dropState);
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

  const onDragStart = ({ draggableId, source }: DragStart) => {
    if (source.droppableId === "boards")
      setDrop({ boardDropFg: false, todoDropFg: true });
    else setDrop({ boardDropFg: true, todoDropFg: false });
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    let isSameDrop = false;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) isSameDrop = true;
    if (isSameDrop && destination.index === source.index) return;
    // console.log(source, destination);
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
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Wrapper>
        <Droppable
          droppableId="boards"
          isDropDisabled={drop.boardDropFg}
          direction="horizontal"
        >
          {(provided) => (
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
          )}
        </Droppable>
      </Wrapper>
      <Droppable droppableId="wastebasket">
        {(provided) => (
          <Wastebasket ref={provided.innerRef} {...provided.droppableProps}>
            <span style={{ position: "fixed" }}>🗑️</span>
            {provided.placeholder}
          </Wastebasket>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
