import TaskBar from "./components/TaskBar";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="min-h-screen flex flex-col py-5 items-center">
      <div className="w-2/3">
        <TaskBar />
        <TaskList />
      </div>
    </div>
  );
}

export default App;
