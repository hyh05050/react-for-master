import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { dropState, ITodo, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  padding: 10px 0px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  width: 300px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#3f8df28b"
      : props.isDraggingFromThis
      ? "#6b6b6b"
      : "transparent"};
  flex-grow: 1;
  padding: 20px;
  transition: background-color 0.3s ease-in-out;
`;

interface IBoardProps {
  toDos: ITodo[];
  board: string;
  index: number;
}

interface IForm {
  toDo: string;
}

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

const TaskInput = styled.input`
  padding: 15px;
  border: 0;
  &:focus {
    outline-style: solid;
    outline-width: 3px;
    outline-color: ${(props) => props.theme.bgColor};
  }
`;

function Board({ board, toDos, index }: IBoardProps) {
  const drop = useRecoilValue(dropState);
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newTodo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      const newTodos = {
        ...allBoards,
        [board]: [...allBoards[board], newTodo],
      };

      localStorage.setItem("todos", JSON.stringify(newTodos));

      return newTodos;
    });

    setValue("toDo", "");
  };

  return (
    <Draggable draggableId={board} key={board} index={index}>
      {(provided) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Title>{board}</Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <TaskInput
              placeholder="Add Task"
              type="text"
              title=""
              autoComplete="off"
              {...register("toDo", { required: true })}
            />
          </Form>
          <Droppable droppableId={board} isDropDisabled={drop.todoDropFg}>
            {(provided, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {toDos.map((todo, index) => (
                  <DraggableCard
                    board={board}
                    todo={todo}
                    key={todo.id}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default Board;
