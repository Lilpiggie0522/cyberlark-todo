import { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import Task, { Urgency_Color } from "../types/types";

export default function TaskRow({ isEdit, task }: { isEdit: () => void, task: Task }) {
  const [isDone, setIsDone] = useState<boolean>(false);

  function taskDone() {
    setIsDone(!isDone);
    console.log("Task done");
  }

  return (
    <tr className="bg-yellow-200">
      <td className="py-2 px-4 border-b text-center">{task.due_date}</td>
      <td className={`py-2 px-4 border-b text-center ${Urgency_Color[task.priority]}`}></td>
      <td className={`py-2 px-4 border-b text-center bg-purple-300 ${isDone ? 'line-through' : ''}`}>{task.detail}</td>
      <td className="py-2 bg-red-300">
        <div className="flex justify-center items-center">
          <input type="checkbox" onChange={taskDone} />
        </div>
      </td>
      <td className="py-2 px-4 border-b">
        <div className="flex justify-center gap-3">
          <button onClick={isEdit}>
            <MdOutlineEdit size={20} />
          </button>
          <button>
            <MdOutlineDelete size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}