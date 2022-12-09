import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { categoryState, IToDo, toDoState } from "../atoms";

interface IFormData {
  toDo: string;
}

function CreateToDo() {
  const setList = useSetRecoilState(toDoState);
  const category = useRecoilValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<IFormData>();
  const onValid = ({ toDo }: IFormData) => {
    console.log("add to do", toDo);
    setValue("toDo", "");
    setList((prev) => [{ id: Date.now(), text: toDo, category }, ...prev]);
  };
  return (
    <form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("toDo", {
          required: "ToDoList is required",
        })}
        placeholder="To Do List"
      />
      <button>Add</button>
    </form>
  );
}

export default CreateToDo;
