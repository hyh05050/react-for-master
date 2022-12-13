import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface ITodoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<ITodoState>({
  key: "toDo",
  default: {
    to_do: [],
    doing: [],
    done: [],
  },
});

export const boardState = atom({
  key: "board",
  default: ["to_do", "doing", "done"],
});
