import { useState } from "react";
import Signup from "../components/Signup";
import Login from "../components/Login";
import { Button } from "../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <main className="h-screen w-screen flex items-center justify-center ">
      <Card className="w-full max-w-150 rounded-xl ">
        <CardHeader>
          <CardTitle className="hidden md:flex lg:flex xl:flex">
            {mode === "login" ? "Login" : "Register"}
          </CardTitle>
          <CardAction>
            <Button
              onClick={() => {
                setMode("login");
              }}
              className="flex-1 rounded-2xl"
              variant={mode === "login" ? "default" : "secondary"}
              size={"lg"}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                setMode("signup");
              }}
              className=" rounded-2xl flex-1"
              variant={mode === "signup" ? "default" : "secondary"}
              size={"lg"}
            >
              Signup
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="duration-1000 transition-all">
          {mode === "login" ? (
            <Login loading={loading} setLoading={setLoading} />
          ) : (
            <Signup loading={loading} setLoading={setLoading} />
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
