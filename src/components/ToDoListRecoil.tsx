import { useRecoilState, useRecoilValue } from "recoil";
import { Categories, categoryState, toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import { toDoSelector } from "./../atoms";
import ToDo from "./ToDo";

function ToDoList() {
  //const [todo, doing, done] = useRecoilValue(toDoSelector);
  const list = useRecoilValue(toDoSelector);
  const [category, setCategory] = useRecoilState(categoryState);
  const onInput = (event: React.FormEvent<HTMLSelectElement>) => {
    setCategory(event.currentTarget.value as any);
  };

  return (
    <div>
      <h1>To Do List - Recoil</h1>
      <hr />
      <select onInput={onInput} value={category}>
        <option value={Categories.TO_DO}>To Do</option>
        <option value={Categories.DOING}>Doing</option>
        <option value={Categories.DONE}>Done</option>
      </select>
      <CreateToDo />
      {list.map((todo) => (
        <ToDo key={todo.id} {...todo} />
      ))}
    </div>
  );
}

export default ToDoList;
