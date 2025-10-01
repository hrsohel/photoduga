import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic here

  };

  return (
    <div className="flex items-center justify-center  my-40">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-medium text-foreground">
            Change Your Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="old-password"
                className="text-sm text-muted-foreground"
              >
                Enter old password
              </Label>
              <Input
                id="old-password"
                type="password"
                placeholder="Enter old password"
                value={formData.oldPassword}
                onChange={(e) =>
                  handleInputChange("oldPassword", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="new-password"
                className="text-sm text-muted-foreground"
              >
                Set new password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Set new password"
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm text-muted-foreground"
              >
                Re-enter new password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-b from-[#10200B] to-[#2f4b26] text-white font-medium py-2.5"
            >
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
