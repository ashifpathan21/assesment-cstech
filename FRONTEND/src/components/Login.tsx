import { useNavigate } from "react-router-dom";
import { login } from "../services/apis/user";
import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useState } from "react";
import type { ILogin } from "../types";

const Login = ({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const [data, setData] = useState<ILogin>({
    email: "",
    password: "",
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        login(data, navigate, setLoading);
      }}
      className="p-2 w-full flex flex-col items-center gap-3"
    >
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

export default Login;
