import { KanbanBoard } from '../components/Kanban/KanbanBoard';
import { useTheme } from '../contexts/ThemeContext';

export function YourPage() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleTaskMove = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskEdit = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <KanbanBoard
      tasks={tasks}
      onTaskMove={handleTaskMove}
      onTaskEdit={handleTaskEdit}
      onTaskDelete={handleTaskDelete}
      theme={theme}
    />
  );
}