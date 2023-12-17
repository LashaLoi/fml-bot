type State = {
  registrationStarted?: boolean;
  state?: string | null;
  full_name?: string;
  days?: string;
  city?: string;
  church?: string;
  pastor?: string;
  ministry?: string;
  expect?: string;
  transport?: string;
  age?: string;
  children?: string;
  phone?: string;
  q?: string;
  alergy?: string;
  email?: string;
};

export const state = new Map<number, State>();
export const getState = (key: number) => state.get(key);
export const setState = (key: number, value: State) => {
  const prevState = state.get(key);

  state.set(key, { ...prevState, ...value });
};
export const deleteState = (key: number) => state.delete(key);
