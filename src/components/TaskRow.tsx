// import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import Task, { Urgency_Color } from "../types/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { removeTask, finishTask } from "../store/taskSlice";

export default function TaskRow({ isEdit, task }: { isEdit: () => void, task: Task }) {
  // const [isDone, setIsDone] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  async function taskDone(task: Task) {
    dispatch(finishTask(task.todo_id!));
    const apiUrl = `${import.meta.env.VITE_API_URL}/updateStatus`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify({
        todo_id: task.todo_id!,
        status: task.status
      })
    })
    const data = await response.json()
    console.log("Task done");
    console.log(data)
  }

  async function handleDelete(todo_id: string) {
    dispatch(removeTask(todo_id))
    const apiUrl = import.meta.env.VITE_API_URL || "something";
    console.log(`todo id to delete is ${todo_id}`)
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo_id: todo_id })
    })
    const data = await response.json()
    console.log(data)
  }

  return (
    <tr>
      <td className="py-2 px-4 text-center">{task.due_date}</td>
      <td className={`py-2 px-4 text-center ${Urgency_Color[task.priority]}`}></td>
      <td className={`py-2 px-4 text-center ${task.status === true ? 'line-through' : ''}`}>{task.detail}</td>
      <td className="py-2">
        <div className="flex justify-center items-center">
          <input type="checkbox" onChange={() => taskDone(task)} checked={task.status} />
        </div>
      </td>
      <td className="py-2 px-4 border-b">
        <div className="flex justify-center gap-3">
          <button onClick={isEdit}>
            <MdOutlineEdit size={20} />
          </button>
          <button>
            <MdOutlineDelete size={20} onClick={() => handleDelete(task.todo_id!)} />
          </button>
        </div>
      </td>
    </tr>
  );
}