import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Task from "../types/types"

interface TaskState {
  tasks: Array<Task>
}

const initialState: TaskState = {
  tasks: [],
}

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload)
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.todo_id != action.payload)
    },
    setTasks: (state, action: PayloadAction<Array<Task>>) => {
      state.tasks = action.payload
    },
    finishTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.map((task) => {
        return {
          ...task,
          status: task.todo_id === action.payload ? !task.status : task.status,
        }
      })
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      state.tasks = state.tasks.map((task) =>
        task.todo_id === action.payload.todo_id ? action.payload : task
      )
    },
  },
})

export const { addTask, removeTask, setTasks, finishTask, updateTask } =
  taskSlice.actions
export default taskSlice.reducer
