import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Field, FieldLabel } from "./ui/field";
import { signup } from "../services/apis/user";
import { useNavigate } from "react-router-dom";
import type { ISignup } from "../types";

const Signup = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<ISignup>({
    email: "",
    password: "",
    name: "",
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signup(data, navigate, setLoading);
      }}
      className="p-2 w-full flex flex-col items-center gap-3"
    >
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
          placeholder="Ash"
          id="name"
          type="text"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
          placeholder="fasf@gmail.com"
          id="email"
          type="email"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
          placeholder="87654321"
          id="password"
          type="password"
          maxLength={8}
        />
      </Field>
      <Button disabled={loading} variant={"ghost"}>
        Submit
      </Button>
    </form>
  );
};

export default Signup;
