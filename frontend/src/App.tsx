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
import { useState } from "react";
import axios from "axios"

function App() {
  const [serverUrl, setServerUrl] = useState("ws://localhost:9000");
  const [cp_id, setCpId] = useState("CP_001");

  const handleConnect = async () => {
    try {
      const res = await axios.post('http://localhost:8080/emulator', {
      action: 'connect',
      serverUrl: 'ws://localhost:9000',
      chargePointId: cp_id,
    });
      console.log(res);
      toast.success("Connected to charger");
    } catch (error) {
      console.log(error);
      toast.error("Failed to connect to charger", error.message);
    }
  }

  return (
    <div className="flex min-h-svh w-screen flex-col items-center justify-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Charger Url</FieldLabel>
              <FieldDescription>Enter the URL of the charger</FieldDescription>
              <Input
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
              />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Charger ID</FieldLabel>
              <FieldDescription>Enter the ID of the charger</FieldDescription>
              <Input
                value={cp_id}
                onChange={(e) => setCpId(e.target.value)}
              />
            </Field>
            <Button
              className="mt-4 w-full cursor-pointer"
              onClick={handleConnect}
            >
              Connect
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
