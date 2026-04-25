import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Design system smoke test</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meter-reading">Meter reading</Label>
            <Input id="meter-reading" type="number" placeholder="0.00" />
          </div>
          <div className="flex items-center gap-3">
            <Button>Save reading</Button>
            <Button variant="outline">Cancel</Button>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
