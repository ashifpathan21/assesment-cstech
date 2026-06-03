import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { Task } from "../types";
import { User, Phone, FileText, ClipboardList } from "lucide-react";
import { Separator } from "./ui/separator";

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  agentName: string;
}

const TaskDialog = ({ isOpen, onClose, tasks, agentName }: TaskDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ClipboardList className="w-6 h-6 text-primary" />
            Assignments for {agentName}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Detailed list of leads and notes assigned to this agent.
          </p>
        </DialogHeader>
        <Separator className="my-4" />
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                key={task._id}
                className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-semibold text-lg leading-none">
                          {task.firstName}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{task.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">
                    Assigned
                  </div>
                </div>
                <div className="pl-14">
                  <div className="flex gap-2 p-3 rounded-lg bg-muted/50 border border-muted">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-sm italic text-foreground/80">
                      {task.notes || "No notes provided for this lead."}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
              <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">No tasks assigned yet</p>
              <p className="text-sm">New assignments will appear here.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
