import { Categories, IToDo, toDoState } from "./../atoms";
import { useSetRecoilState } from "recoil";
function ToDo({ id, text, category }: IToDo) {
  const setList = useSetRecoilState(toDoState);
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;

    setList((prev) => {
      const targetIndex = prev.findIndex((toDo) => toDo.id === id);
      const newList = [...prev];
      const newTodo = { id, text, category: name as Categories };
      newList[targetIndex] = newTodo;
      return newList;
    });
  };
  return (
    <li>
      <span>{text}</span>
      {Object.keys(Categories)
        .filter((ctgry) => ctgry !== category)
        .map((ctgry, index) => (
          <button key={index} name={ctgry} onClick={onClick}>
            {ctgry}
          </button>
        ))}
    </li>
  );
}

export default ToDo;
