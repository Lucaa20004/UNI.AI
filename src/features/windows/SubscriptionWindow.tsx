import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionWindow() {
  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your subscription plans here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}