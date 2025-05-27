import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page is only accessible to administrators.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}