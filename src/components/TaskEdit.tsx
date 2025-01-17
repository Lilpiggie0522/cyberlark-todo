import Task from "../types/types";

export default function TaskEdit({ closeEdit, taskToEdit }: { closeEdit: () => void, taskToEdit: Task }) {
  return (
    <div className="w-1/4 h-1/2 flex flex-col items-center justify-center rounded-lg">
      <h1 className='text-2xl mb-2'>Edit Task</h1>
      <form className='flex flex-col items-center w-full'>
        <div className='flex flex-col w-full p-2'>
          <p className="pb-2">Description:</p>
          <textarea placeholder='Task description' className='border border-gray-300 p-2 rounded-lg mb-2 min-h-64' defaultValue={taskToEdit.detail}></textarea>
          <p className="pb-2">Due:</p>
          <input type='date' placeholder="pick a date" className='border border-gray-300 p-2 rounded-lg mb-2' required />
          <p className="pb-2">Priority:</p>
          <select className='border border-gray-300 p-2 rounded-lg mb-2' required>
            <option value='High'>Urgent</option>
            <option value='High'>High</option>
            <option value='Medium'>Medium</option>
            <option value='Low'>Low</option>
          </select>
        </div>
        <div className="flex w-full gap-x-5 justify-center">
          <button type='submit' className='bg-blue-500 text-white p-2 rounded-lg'>Save</button>
          <button type='submit' className='bg-red-500 text-white p-2 rounded-lg' onClick={closeEdit}>Cancel</button>
        </div>
      </form>
    </div>
  )
}