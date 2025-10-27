import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";

function App() {
  const [serverUrl, setServerUrl] = useState("ws://localhost:9000");
  const [cpId, setCpId] = useState("CP_001");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");

  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      toast.info("Already connected to WebSocket");
      return;
    }

    try {
      setConnectionStatus("connecting");
      const ws = new WebSocket(serverUrl);

      ws.onopen = () => {
        setConnectionStatus("connected");
        toast.success("WebSocket connected");
      };

      ws.onclose = () => {
        setConnectionStatus("disconnected");
        toast.error("WebSocket disconnected");
        wsRef.current = null;
      };

      ws.onerror = () => {
        setConnectionStatus("error");
        toast.error("WebSocket error");
      };

      wsRef.current = ws;
    } catch (err) {
      console.error(err);
      setConnectionStatus("error");
    }
  };


  const handleConnect = async () => {
    try {
      setConnectionStatus("connecting");

      await axios.post("http://localhost:8080/emulator", {
        action: "connect",
        serverUrl,
        chargePointId: cpId,
      });

      connectWebSocket();
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to charger", {
        description: error?.message,
      });
      setConnectionStatus("error");
    }
  };

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500 animate-pulse";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex min-h-svh w-screen flex-col items-center justify-center">
      <Card className="w-1/3 shadow-lg border">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg font-semibold">Charger Emulator</CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${getStatusColor()}`}
              title={connectionStatus}
            ></span>
            <span className="text-sm capitalize text-muted-foreground">
              {connectionStatus}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <CardDescription className="mb-4">
            Connect to a charger server via WebSocket
          </CardDescription>

          <FieldGroup>
            <Field>
              <FieldLabel>Charger URL</FieldLabel>
              <FieldDescription>Enter the WebSocket URL</FieldDescription>
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
              />
            </Field>

            <FieldSeparator />

            <Field>
              <FieldLabel>Charger ID</FieldLabel>
              <FieldDescription>Enter the charger’s ID</FieldDescription>
              <Input
                value={cpId}
                onChange={(e) => setCpId(e.target.value)}
              />
            </Field>

            <Button
              className="mt-4 w-full cursor-pointer"
              onClick={handleConnect}
              disabled={connectionStatus === "connecting"}
            >
              {connectionStatus === "connecting" ? "Connecting..." : "Connect"}
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
