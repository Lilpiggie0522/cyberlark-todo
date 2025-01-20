import { FaCheck } from "react-icons/fa";
import TaskRow from "./TaskRow";
import TaskEdit from "./TaskEdit";
import { useEffect, useState } from "react";
import Task from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { setTasks } from "../store/taskSlice";

export default function TaskList() {
  // const tasks = [{ detail: "Finish the project", date: "2023-10-03", priority: Priority.LOW }];
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "something";
    fetch(apiUrl, { method: "GET" })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        dispatch(setTasks(data))
      })
  }, [dispatch])

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);


  function handleEdit(task: Task) {
    setTaskToEdit(task);
    setIsEdit(true);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border font-normal">Due</th>
            <th className="py-2 px-4 border font-normal w-1/12">Priority</th>
            <th className="py-2 px-4 border font-normal">Details</th>
            <th className="py-2 px-4 border font-normal">
              <div className="flex justify-center">
                <FaCheck />
              </div>
            </th>
            <th className="py-2 px-4 border font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((current, index) => (
            <TaskRow key={index} isEdit={() => handleEdit(current)} task={current} />
          ))}
        </tbody>
      </table>
      {isEdit && taskToEdit && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-90">
          <TaskEdit closeEdit={() => setIsEdit(false)} taskToEdit={taskToEdit} />
        </div>
      )}
    </div>
  );
}
