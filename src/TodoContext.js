import React, { useReducer, createContext, useRef, useContext } from "react";

// 1. initialState
const initialTodos = [
  {
    id: 1,
    text: "프로젝트 생성하기",
    done: true,
  },
  {
    id: 2,
    text: "컴포넌트 스타일링하기",
    done: true,
  },
  {
    id: 3,
    text: "Context 만들기",
    done: true,
  },
  {
    id: 4,
    text: "기능 구현하기",
    done: false,
  },
];

/*
  2. reducer
  CREATE
  TOGGLE
  REMOVE
*/
function todoReducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return state.concat(action.todo);
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case "REMOVE":
      return state.filter((todo) => todo.id !== action.id);
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

/*
  3. createContext

  3-1. state, dispatch context를 따로 만들어 준 이유
  컴포넌트 최적화 때문!
  ex) TodoCreate 컴포넌트에서는 dispatch만 필요로 함
  그러나 state와 dispatch를 같이 갖고있는 커스텀 훅을 사용하게 되면
  state가 바뀌었을 때 state를 쓰지 않는 TodoCreate 컴포넌트에서도 리렌더링이 발생
*/

const TodoStateContext = createContext();
const TodoDispatchContext = createContext();
const TodoNextIdContext = createContext();

/*
  4. context.provider 함수
  children에서 context의 state를 꺼내쓰기 위한 provider
  children는 provider가 감싸고 있는 컴포넌트들
  (3. createContext) 과정 때문에 provider도 따로 만들어 주어야 함
*/
export function TodoProvider({ children }) {
  const [state, dispatch] = useReducer(todoReducer, initialTodos);
  const nextId = useRef(5);

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        <TodoNextIdContext.Provider value={nextId}>
          {children}
        </TodoNextIdContext.Provider>
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}

/*
  5. custom hook
    const state = useContext(TodoStateContext);
    TodoStateContext자체를 불러와서 쓸수도 있지만
    커스텀 훅을 불러와서 사용하기 위해 커스텀 훅을 만듦
    TodoState를 쓰고싶을때  const state = useTodoState();로 간단하게 사용 가능

  6. context가 없을 때 에러처리하기
    안해줘도 되지만 실수가 발생하면 바로 에러 캐치 가능
*/

export function useTodoState() {
  // return useContext(TodoStateContext);
  const context = useContext(TodoStateContext);
  if (!context) {
    throw new Error("Cannot find TodoProvider");
  }
  return context;
}

export function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);
  if (!context) {
    throw new Error("Cannot find TodoDispatchProvider");
  }
  return context;
}

export function useTodoNextId() {
  const context = useContext(TodoNextIdContext);
  if (!context) {
    throw new Error("Cannot find TodoNextIdContext");
  }
  return context;
}
