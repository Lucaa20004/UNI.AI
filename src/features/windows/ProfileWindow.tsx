import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileWindow() {
  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your profile settings here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}