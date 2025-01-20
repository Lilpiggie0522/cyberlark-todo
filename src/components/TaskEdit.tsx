import React from "react";
import Task, { Priority } from "../types/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { updateTask } from "../store/taskSlice";

export default function TaskEdit({ closeEdit, taskToEdit }: { closeEdit: () => void, taskToEdit: Task }) {
  const dispatch = useDispatch<AppDispatch>()
  async function handleEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget);
    const taskData = {
      todo_id: taskToEdit.todo_id!,
      detail: formData.get("detail") as string,
      due_date: formData.get("due_date") as string,
      priority: formData.get("priority") as Priority,
      status: taskToEdit.status
    }
    console.log(taskData)
    const apiUrl = `${import.meta.env.VITE_API_URL}/updateDetails`;
    const response = await fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify(taskData)
    })
    const data: Task = await response.json()
    console.log(data)
    dispatch(updateTask(taskData))
    closeEdit()
  }
  return (
    <div className="w-1/4 h-1/2 flex flex-col items-center justify-center rounded-lg">
      <h1 className='text-2xl mb-2'>Edit Task</h1>
      <form className='flex flex-col items-center w-full' onSubmit={handleEdit}>
        <div className='flex flex-col w-full p-2'>
          <p className="pb-2">Description:</p>
          <textarea name="detail" placeholder='Task description' className='border border-gray-300 p-2 rounded-lg mb-2 min-h-64' defaultValue={taskToEdit.detail}></textarea>
          <p className="pb-2">Due:</p>
          <input name="due_date" type='date' placeholder="pick a date" className='border border-gray-300 p-2 rounded-lg mb-2' required defaultValue={taskToEdit.due_date} />
          <p className="pb-2">Priority:</p>
          <select name="priority" className='border border-gray-300 p-2 rounded-lg mb-2' required defaultValue={taskToEdit.priority}>
            <option value='Urgent'>Urgent</option>
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>
        </div>
        <div className="flex w-full gap-x-5 justify-center">
          <button className='bg-blue-500 text-white p-2 rounded-lg'>Save</button>
          <button type="button" className='bg-red-500 text-white p-2 rounded-lg' onClick={closeEdit}>Cancel</button>
        </div>
      </form>
    </div>
  )
}