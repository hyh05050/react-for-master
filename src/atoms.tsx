import { atom, selector } from "recoil";

export const minuteState = atom({
  key: "minutes",
  default: 0,
});

export const hourSelector = selector<number>({
  key: "hours",
  get: ({ get }) => {
    return get(minuteState) / 60;
  },
  set: ({ set }, value) => {
    set(minuteState, Number(value) * 60);
  },
});
