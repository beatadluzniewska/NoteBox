import { Button, Card, CardBody, Progress, Input } from "@nextui-org/react";
import { List, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import Logo from "../assets/note-box.svg";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (state.taskLists == null) {
      api.fetchTaskLists();
    }
  }, [state]);

  const handleCreateTaskList = () => {
    navigate("/new-task-list");
  };

  const handleSelectTaskList = (taskListId: string | undefined) => {
    navigate(`/task-lists/${taskListId}`);
  };

  // Filtruj listy według wyszukiwanej frazy
  const filteredTaskLists = state.taskLists.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 max-w-sm w-full">
      <div className="flex flex-col items-center mt-8 mb-4">
        <div className="flex items-center mb-2">
          <img src={Logo} alt="Work Journal Logo" className="w-16 h-16 mr-2" />
          <h1 className="text-3xl font-bold text-black">NoteBox</h1>
        </div>
        <h2 className="text-xl font-medium text-center">My tasks for today</h2>
      </div>

      {/* Input do wyszukiwania */}
      <Input
        placeholder="Search lists..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        startContent={<Search size={16} />}
        className="mb-4"
        aria-label="Search task lists"
      />

      <Button
        onPress={handleCreateTaskList}
        color="primary"
        startContent={<Plus size={20} />}
        className="w-full mb-4"
        aria-label="Create New Task List"
      >
        Create New NoteBox
      </Button>

      {filteredTaskLists.map((list) => (
        <Card
          key={list.id}
          isPressable
          onPress={() => handleSelectTaskList(list.id)}
          className="mb-4 w-full"
          role="button"
          aria-label={`Select task list: ${list.title}`}
        >
          <CardBody>
            <div className="flex items-center">
              <List size={20} className="mr-2 opacity-[40%]" />
              <h2 className="text-lg font-semibold">{list.title}</h2>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {list.count} {list.count === 1 ? "task" : "tasks"}
            </p>
            <Progress
              value={list.progress ? list.progress * 100 : 0}
              className="mt-2"
              color="primary"
              aria-label={`Progress for ${list.title}: ${list.progress}%`}
              classNames={{
                base: "bg-neutral-300 rounded-full",
                indicator: "bg-emerald-600",
              }}
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default TaskListScreen;
