import React, { useEffect, useState } from "react";
import { Button, Input, Textarea, Spacer, Card, Chip } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useAppContext } from "../AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { TaskPriority } from "../domain/TaskPriority";
import { DatePicker } from "@nextui-org/date-picker";
import { TaskStatus } from "../domain/TaskStatus";
import { parseDate } from "@internationalized/date";

const CreateUpdateTaskScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId, taskId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId || !taskId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("Loading initial data...");
        
        // First ensure we have the task list
        if (!state.taskLists.find(tl => tl.id === listId)) {
          await api.getTaskList(listId);
        }

        // Load the individual task
        const taskResponse = await api.getTask(listId, taskId);
        console.log("Task loaded:", taskResponse);
        
        // Check state after loading
        console.log("Current state after load:", state);
        
        // Get task from state
        const task = state.tasks[listId]?.find(t => t.id === taskId);
        console.log("Found task in state:", task);

        if (task) {
          console.log("Setting form values with task:", task);
          setTitle(task.title);
          setDescription(task.description || "");
          setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
          setPriority(task.priority || TaskPriority.MEDIUM);
          setStatus(task.status);
        }

        setIsUpdate(true);
      } catch (error) {
        console.error("Error loading task:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [listId, taskId]);

  // Watch for task updates in state
  useEffect(() => {
    if (listId && taskId && state.tasks[listId]) {
      const task = state.tasks[listId].find(t => t.id === taskId);
      console.log("State updated, current task:", task);
      
      if (task) {
        console.log("Updating form with task from state update:", task);
        setTitle(task.title);
        setDescription(task.description || "");
        setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
        setPriority(task.priority || TaskPriority.MEDIUM);
        setStatus(task.status);
      }
    }
  }, [listId, taskId, state.tasks]);

  const createUpdateTask = async () => {
    try {
      if (!listId) return;

      if (isUpdate && taskId) {
        await api.updateTask(listId, taskId, {
          id: taskId,
          title,
          description,
          dueDate,
          priority,
          status,
        });
      } else {
        await api.createTask(listId, {
          title,
          description,
          dueDate,
          priority,
          status: undefined,
        });
      }

      navigate(`/task-lists/${listId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setDueDate(date || undefined);
  };

  const formatDateForPicker = (date: Date | undefined) => {
    if (!date) return undefined;
    // Use toLocaleDateString to get yyyy-MM-dd in local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          className="bg-neutral-400 text-white hover:bg-primary"
          aria-label="Go back"
          onClick={() => navigate(`/task-lists/${listId}`)}
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">
          {isUpdate ? "Update Task" : "Create Task"}
        </h1>
      </div>
      {error && <Card className="mb-4 p-4 text-red-500">{error}</Card>}
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />
        <Spacer y={1} />
        <Textarea
          label="Description"
          placeholder="Enter task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />
        <Spacer y={1} />
        <DatePicker
  label="Due date (optional)"
  defaultValue={
    dueDate
      ? parseDate(formatDateForPicker(dueDate)!)
      : parseDate(new Date().toISOString().split("T")[0]) // <- dzisiaj
  }
  onChange={(newDate) =>
    handleDateChange(newDate ? new Date(newDate.toString()) : null)
  }
/>

        <Spacer y={4} />
        <div className="flex justify-between mx-auto gap-2">
          {Object.values(TaskPriority).map((p) => (
            <Chip
            key={p}
            onClick={() => setPriority(p)}
            className={`cursor-pointer font-semibold px-3 py-1 rounded-md 
              ${priority === p ? 
                (p === TaskPriority.HIGH ? "bg-rose-200 ring-1 ring-rose-700 text-rose-700" : 
                 p === TaskPriority.MEDIUM ? "bg-orange-200 ring-1 ring-orange-700 text-orange-700" : 
                 "bg-green-200 ring-1 ring-green-600 text-green-700")
                : 
                (p === TaskPriority.HIGH ? "bg-rose-200 text-rose-700" : 
                 p === TaskPriority.MEDIUM ? "bg-orange-200 text-orange-700" : 
                 "bg-green-200 text-green-700")
              }
            `}
          >
            {p} Priority
          </Chip>
          ))}
        </div>
        <Spacer y={4} />
        <Button 
          type="submit" 
          color="primary" 
          onClick={createUpdateTask}
          fullWidth
        >
          {isUpdate ? "Update Task" : "Create Task"}
        </Button>
      </form>
    </div>
  );
};

export default CreateUpdateTaskScreen;