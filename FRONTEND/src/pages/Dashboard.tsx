import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { IUser, IAgentDetails, File as IFile } from "../types";
import ReactCountryFlag from "react-country-flag";
import { getUserDetails } from "../services/apis/user";
import countryCodes from "country-codes-list";
import StatCard from "../components/StatCard";
import { Button } from "../components/ui/button";
import {
  Bell,
  CheckCircle,
  FileText,
  GitPullRequestDraft,
  Settings,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";
import { DataTable } from "../components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import AgentDialog from "../components/AgentDialog";
import FileDialog from "../components/FileDialog";
import TaskDialog from "../components/TaskDialog";
import ConfirmDialog from "../components/ConfirmDialog";
import { deleteAgent } from "../services/apis/agent";
import { deleteFile } from "../services/apis/file";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser>();
  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [maxTask, setMaxTask] = useState<number>(0);
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });
  const [selectedAgent, setSelectedAgent] = useState<IAgentDetails | undefined>();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = () => {
    getUserDetails(navigate, setUser, setLoading);
  };

  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
      return;
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    if (user) {
      let totalT = 0,
        maxT = 0;
      user.agents.forEach((agent) => {
        totalT += agent.assignedTask.length;
        maxT = Math.max(maxT, agent.assignedTask.length);
      });
      setMaxTask(maxT);
      setTotalTasks(totalT);
    }
  }, [user]);

  const handleDeleteAgent = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Agent",
      description: "Are you sure you want to delete this agent? This action cannot be undone.",
      onConfirm: async () => {
        await deleteAgent(id);
        fetchData();
      },
    });
  };

  const handleDeleteFile = (id: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete File",
      description: "Are you sure you want to delete this file? This will also remove all associated tasks.",
      onConfirm: async () => {
        await deleteFile(id);
        fetchData();
      },
    });
  };

  const agentColumns = useMemo<ColumnDef<IAgentDetails>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ReactCountryFlag
              countryCode={
                countryCodes.filter(
                  "countryCallingCode",
                  row.original.countryCode.replace(/[^0-9]/g, ""),
                )[0]?.countryCode
              }
              svg
            />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        cell: ({ row }) => (
          <span>
            {row.original.countryCode} {row.original.phoneNumber}
          </span>
        ),
      },
      {
        header: "Tasks",
        cell: ({ row }) => (
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
            {row.original.assignedTask.length}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              title="View Tasks"
              onClick={() => {
                setSelectedAgent(row.original);
                setIsTaskDialogOpen(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              title="Edit Agent"
              onClick={() => {
                setSelectedAgent(row.original);
                setIsAgentDialogOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              title="Delete Agent"
              onClick={() => handleDeleteAgent(row.original._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const fileColumns = useMemo<ColumnDef<IFile>[]>(
    () => [
      {
        accessorKey: "url",
        header: "File",
        cell: ({ row }) => (
          <a
            href={row.original.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            View File
          </a>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          let color = "bg-gray-100 text-gray-800";
          if (status === "DONE") color = "bg-green-100 text-green-800";
          if (status === "FAILED") color = "bg-red-100 text-red-800";
          if (status === "PROCESSING") color = "bg-blue-100 text-blue-800";

          return (
            <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Uploaded At",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDeleteFile(row.original._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <nav className="max-w-screen w-full overflow-x-hidden py-1 px-5 flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <section className="flex items-center gap-2 p-1 ">
          <div className=" w-8 h-8 text-primary">
            <GitPullRequestDraft className="w-full h-full" />
          </div>
          <h1 className="text-lg md:text-2xl font-bold">
            Lead Management Dashboard
          </h1>
        </section>
        <section className="flex items-center gap-4 p-3 ">
          <section className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </section>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant={"destructive"} size="sm" onClick={() => navigate("/logout")}>
              Logout
            </Button>
          </div>
        </section>
      </nav>

      {loading ? (
        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </main>
      ) : (
        <main className="p-6 flex flex-col gap-8 max-w-7xl mx-auto">
          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Agents"
              value={user?.agents.length || 0}
              color="purple"
              subtitle="Registered agents"
              icon={<Users className="w-6 h-6" />}
            />
            <StatCard
              title="Total Files"
              value={user?.files.length || 0}
              color="green"
              subtitle="Uploaded datasets"
              icon={<FileText className="w-6 h-6" />}
            />
            <StatCard
              title="Total Tasks"
              value={totalTasks}
              color="indigo"
              subtitle="Assigned tasks"
              icon={<CheckCircle className="w-6 h-6" />}
            />
            <StatCard
              title="Performance"
              value={maxTask}
              color="blue"
              subtitle="Max task peak"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </section>

          {/* Agents Section */}
          <section className="bg-card rounded-xl border shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Agents</h2>
                <p className="text-muted-foreground">Manage your working agents and their assignments.</p>
              </div>
              <Button onClick={() => {
                setSelectedAgent(undefined);
                setIsAgentDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Agent
              </Button>
            </div>
            <DataTable columns={agentColumns} data={user?.agents || []} />
          </section>

          {/* Files Section */}
          <section className="bg-card rounded-xl border shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Files</h2>
                <p className="text-muted-foreground">Upload and process CSV/Excel files for task distribution.</p>
              </div>
              <Button onClick={() => setIsFileDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Upload File
              </Button>
            </div>
            <DataTable columns={fileColumns} data={user?.files || []} />
          </section>
        </main>
      )}

      <AgentDialog
        isOpen={isAgentDialogOpen}
        onClose={() => setIsAgentDialogOpen(false)}
        agent={selectedAgent}
        onSuccess={fetchData}
      />
      <FileDialog
        isOpen={isFileDialogOpen}
        onClose={() => setIsFileDialogOpen(false)}
        onSuccess={fetchData}
      />
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        tasks={selectedAgent?.assignedTask || []}
        agentName={selectedAgent?.name || ""}
      />
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </>
  );
};

export default Dashboard;

