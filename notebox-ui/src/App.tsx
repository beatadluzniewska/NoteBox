import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskLists from "./components/TaskListsScreen";
import CreateUpdateTaskListScreen from "./components/CreateUpdateTaskListScreen";
import TaskListScreen from "./components/TasksScreen";
import CreateUpdateTaskScreen from "./components/CreateUpdateTaskScreen";
import AppLogo from "./components/AppLogo"; // Import Layout

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskLists />} />
        <Route path="/new-task-list" element={
            <AppLogo>
              <CreateUpdateTaskListScreen />
            </AppLogo>} />
        <Route
          path="/edit-task-list/:listId"
          element={<AppLogo><CreateUpdateTaskListScreen /></AppLogo>}
        />
        <Route path="/task-lists/:listId" element={<AppLogo><TaskListScreen /></AppLogo>} />
        <Route
          path="/task-lists/:listId/new-task"
          element={<AppLogo><CreateUpdateTaskScreen /></AppLogo>}
        />
        <Route
          path="/task-lists/:listId/edit-task/:taskId"
          element={<AppLogo><CreateUpdateTaskScreen /></AppLogo>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
