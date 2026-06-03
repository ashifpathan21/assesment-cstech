import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";
import type { IAgentDetails } from "../types";
import { addAgent, updateAgent } from "../services/apis/agent";

interface AgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agent?: IAgentDetails;
  onSuccess: () => void;
}

const AgentDialog = ({ isOpen, onClose, agent, onSuccess }: AgentDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    countryCode: "",
    phoneNumber: "",
  });

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name,
        email: agent.email,
        password: agent.password || "",
        countryCode: agent.countryCode,
        phoneNumber: agent.phoneNumber,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        countryCode: "",
        phoneNumber: "",
      });
    }
  }, [agent, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (agent) {
      await updateAgent(formData, agent._id);
    } else {
      await addAgent(formData as any);
    }
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{agent ? "Update Agent" : "Add New Agent"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!agent}
            />
          </Field>
          <div className="flex gap-4">
            <Field className="flex-1">
              <FieldLabel htmlFor="countryCode">Country Code</FieldLabel>
              <Input
                id="countryCode"
                name="countryCode"
                placeholder="+1"
                value={formData.countryCode}
                onChange={handleChange}
                required
              />
            </Field>
            <Field className="flex-2">
              <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Field>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{agent ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDialog;
