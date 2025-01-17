import { useState } from "react";
import { MdAdd } from "react-icons/md";
import TaskPage from "./TaskPage";

function TaskBar() {
  const [showTaskPage, setShowTaskPage] = useState<boolean>(false);

  function addTask() {
    console.log("Task added");
    setShowTaskPage(true);
  }

  function hideTaskPage() {
    setShowTaskPage(false);
  }

  return (
    <div className="flex justify-center w-full mb-4">
      <div className="flex w-full">
        <div className="w-1/12"></div>
        <button className="hover:bg-gray-200 flex" onClick={addTask}>
          <MdAdd size={30} />
        </button>
      </div>
      {showTaskPage && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-200 bg-opacity-90">
          <TaskPage hidePage={hideTaskPage} />
        </div>
      )}
    </div>
  );
}

export default TaskBar;