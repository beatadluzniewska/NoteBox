import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DateInput,
  Input,
  Progress,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { ArrowLeft, Edit, Minus, Plus, Search, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../AppProvider";
import Task from "../domain/Task";
import { TaskStatus } from "../domain/TaskStatus";
import { parseDate } from "@internationalized/date";
import { differenceInCalendarDays } from "date-fns";

const TaskListScreen: React.FC = () => {
  const { state, api } = useAppContext();
  const { listId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [filterByPriority, setFilterByPriority] = useState("all");
  const navigate = useNavigate();

  const taskList = state.taskLists.find((tl) => listId === tl.id);

  useEffect(() => {
    const loadInitialData = async () => {
      if (!listId) return;
      setIsLoading(true);
      try {
        if (!taskList) await api.getTaskList(listId);
        try {
          await api.fetchTasks(listId);
        } catch {}
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [listId]);

  const tasks = state.tasks[listId] || [];

  const processedTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((task) => (filterByPriority === "all" ? true : task.priority === filterByPriority))
    .sort((a, b) => {
      // Sort by status: open first
      if (a.status === TaskStatus.CLOSED && b.status !== TaskStatus.CLOSED) return 1;
      if (a.status !== TaskStatus.CLOSED && b.status === TaskStatus.CLOSED) return -1;

      // Additional sort
      if (sortBy === "date") {
        return new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime();
      }
      if (sortBy === "priority") {
        const order = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a.priority] - order[b.priority];
      }
      return 0;
    });

  const tableRows = () => {
    return processedTasks.map((task) => (
      <TableRow key={task.id} className="border-t">
        <TableCell className="px-4 py-2">
          <Checkbox
            isSelected={TaskStatus.CLOSED === task.status}
            onValueChange={() => toggleStatus(task)}
          />
        </TableCell>
        <TableCell className="px-4 py-2">{task.title}</TableCell>
        <TableCell className="px-4 py-2">
          <span
            className={`font-medium px-2 py-1 rounded-full text-xs ${
              task.priority === "HIGH"
                ? "bg-rose-200 text-rose-700"
                : task.priority === "MEDIUM"
                ? "bg-orange-200 text-orange-700"
                : "bg-green-200 text-green-700"
            }`}
          >
            {task.priority}
          </span>
        </TableCell>
        <TableCell className="px-4 py-2">
          {task.dueDate && (() => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const daysLeft = differenceInCalendarDays(dueDate, today);
            const isDone = task.status === TaskStatus.CLOSED;

            let badgeStyle = "bg-gray-100 text-gray-800";
            if (!isDone && (daysLeft <= 7 || daysLeft < 0)) {
              badgeStyle = "bg-pink-100 text-pink-600";
            }

            return (
              <span className={`px-2 py-1 rounded-md text-sm font-regular ${badgeStyle}`}>
                {dueDate.toLocaleDateString()}
              </span>
            );
          })()}
        </TableCell>
        <TableCell className="px-4 py-2">
          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => navigate(`/task-lists/${listId}/edit-task/${task.id}`)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => api.deleteTask(listId, task.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  const toggleStatus = (task: Task) => {
    if (listId) {
      const updated = { ...task, status: task.status === TaskStatus.CLOSED ? TaskStatus.OPEN : TaskStatus.CLOSED };
      api.updateTask(listId, task.id, updated).then(() => api.fetchTasks(listId));
    }
  };

  const completionPercentage = React.useMemo(() => {
    const completed = tasks.filter((t) => t.status === TaskStatus.CLOSED).length;
    return tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
  }, [tasks]);

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4 max-w-4xl min-w-[714px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button onClick={() => navigate("/")} className="bg-neutral-400 text-white">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold mx-4">{taskList?.title || "Unknown Task List"}</h1>
        <Button onClick={() => navigate(`/edit-task-list/${listId}`)} className="bg-blue-500 text-white">
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-sm text-gray-600 mb-1">{Math.round(completionPercentage)}% completed</p>
      <Progress
        value={completionPercentage}
        className="mb-4"
        classNames={{ base: "bg-neutral-300 rounded-full", indicator: "bg-emerald-600" }}
      />

      <Input
        isClearable
        value={searchTerm}
        onValueChange={setSearchTerm}
        startContent={<Search size={16} />}
        placeholder="Search tasks..."
        className="mb-4"
      />

      <div className="flex gap-4 mb-4">
        <Select
          label="Sort by"
          selectedKeys={[sortBy]}
          onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
        >
          <SelectItem key="none">None</SelectItem>
          <SelectItem key="date">Due Date</SelectItem>
          <SelectItem key="priority">Priority</SelectItem>
        </Select>

        <Select
          label="Filter by Priority"
          selectedKeys={[filterByPriority]}
          onSelectionChange={(keys) => setFilterByPriority(Array.from(keys)[0] as string)}
        >
          <SelectItem key="all">All</SelectItem>
          <SelectItem key="HIGH">High</SelectItem>
          <SelectItem key="MEDIUM">Medium</SelectItem>
          <SelectItem key="LOW">Low</SelectItem>
        </Select>
      </div>

      <Button
        onClick={() => navigate(`/task-lists/${listId}/new-task`)}
        className="mb-4 w-full bg-blue-600 text-white hover:bg-blue-600"
      >
        <Plus className="h-4 w-4" /> Add Task
      </Button>

      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full" aria-label="Tasks list">
          <TableHeader>
            <TableColumn>Completed</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Priority</TableColumn>
            <TableColumn>Due Date</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody>{tableRows()}</TableBody>
        </Table>
      </div>

      <Spacer y={4} />
      <div className="flex justify-end">
        <Button onClick={() => deleteTaskList()} className="bg-rose-700 text-white hover:bg-rose-600">
          <Minus size={20} /> Delete task list
        </Button>
      </div>
    </div>
  );
};

export default TaskListScreen;
