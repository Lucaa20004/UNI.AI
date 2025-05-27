import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsWindow() {
  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure your application settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}