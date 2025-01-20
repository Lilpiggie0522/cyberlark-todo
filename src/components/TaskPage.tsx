import Task, { Priority } from "../types/types"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store/store"
import { addTask } from "../store/taskSlice"

function TaskPage({ hidePage }: { hidePage: () => void }) {
  const dispatch = useDispatch<AppDispatch>()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const apiUrl = import.meta.env.VITE_API_URL || "something";
    const taskData: Task = {
      detail: formData.get("detail") as string,
      due_date: formData.get("due_date") as string,
      priority: formData.get("priority") as Priority,
      status: false
    }
    const response = await fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(taskData)
    })

    const todo_id = await response.json()
    const data = { ...taskData, todo_id: todo_id }
    // add post request to api
    console.log(data)
    dispatch(addTask(data))
    hidePage()
  }
  return (
    <div className="w-1/4 h-1/2 flex flex-col items-center justify-center rounded-lg">
      <h1 className='text-2xl mb-2'>Add New Task</h1>
      <form className='flex flex-col items-center w-full' onSubmit={handleSubmit}>
        <div className='flex flex-col w-full p-2'>
          <p className="pb-2">Description:</p>
          <textarea name="detail" placeholder='Task description' className='border border-gray-300 p-2 rounded-lg mb-2 min-h-64'></textarea>
          <p className="pb-2">Due:</p>
          <input name="due_date" type='date' placeholder="pick a date" className='border border-gray-300 p-2 rounded-lg mb-2' required />
          <p className="pb-2">Priority:</p>
          <select name="priority" className='border border-gray-300 p-2 rounded-lg mb-2' required>
            <option value='Urgent'>{Priority.URGENT}</option>
            <option value='High'>{Priority.HIGH}</option>
            <option value='Medium'>{Priority.MEDIUM}</option>
            <option value='Low'>{Priority.LOW}</option>
          </select>
        </div>
        <div className="flex w-full gap-x-5 justify-center">
          <button type='submit' className='bg-blue-500 text-white p-2 rounded-lg'>Add Task</button>
          <button type='submit' className='bg-red-500 text-white p-2 rounded-lg' onClick={hidePage}>Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default TaskPage
