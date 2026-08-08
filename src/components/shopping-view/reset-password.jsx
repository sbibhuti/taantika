import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function ResetPasswordDialog({ open, setOpen }) {
  const { user: accountUser } = useSelector((state) => state.account);
  const [passwordformData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswordFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (accountUser) {
      setPasswordFormData({
        ...passwordformData,
        currentPassword: accountUser?.password,
      });
    }
  }, [accountUser]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    // if (newPassword !== confirmPassword) {
    //   alert("Passwords do not match");
    //   return;
    // }

    // try {
    //   setLoading(true);

    //   // Replace with your API call
    //   await new Promise((resolve) => setTimeout(resolve, 1500));

    //   alert("Password updated successfully");
    //   setOpen(false);

    //   // Clear fields
    //   setCurrentPassword("");
    //   setNewPassword("");
    //   setConfirmPassword("");
    // } catch (error) {
    //   alert("Failed to update password");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new secure password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              value={passwordformData?.currentPassword}
              onChange={(e) => handleChange(e.target.value)}
              required
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={passwordformData?.newPassword}
              onChange={(e) => handleChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={passwordformData?.confirmPassword}
              onChange={(e) => handleChange(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
