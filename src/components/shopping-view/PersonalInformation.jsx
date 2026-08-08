import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser, userDetails } from "@/store/shop/account-slice";
import ResetPasswordDialog from "./reset-password";
import { Loader2 } from "lucide-react";

export default function PersonalInfoForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
  });

  useEffect(() => {
    dispatch(userDetails(user?.id)).then((data) => {
      setFormData({
        ...formData,
        name: data?.payload?.user?.name,
        email: data?.payload?.user?.email,
        mobile: data?.payload?.user?.mobile,
        gender: data?.payload?.user?.gender,
      });
    });
  }, [user?.id, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleUpdate = (e) => {
    setIsLoading(true);
    e.preventDefault();
    dispatch(updateUser({ userId: user?.id, userFormData: formData }))
      .then((data) => {
        setFormData({
          ...formData,
          name: data?.payload?.user?.name,
          email: data?.payload?.user?.email,
          mobile: data?.payload?.user?.mobile,
          gender: data?.payload?.user?.gender,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    setFormData(user);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">
          Personal Information
        </CardTitle>
        <CardDescription>
          View and update your profile details here.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleUpdate}>
        <CardContent className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile Field */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              name="mobile"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender Field */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="flex space-x-4 pt-1">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleGenderChange}
                  className="h-4 w-4 cursor-pointer accent-primary text-primary focus:ring-ring"
                />
                <Label
                  htmlFor="male"
                  className="font-normal cursor-pointer text-sm"
                >
                  Male
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleGenderChange}
                  className="h-4 w-4 cursor-pointer accent-primary text-primary focus:ring-ring"
                />
                <Label
                  htmlFor="female"
                  className="font-normal cursor-pointer text-sm"
                >
                  Female
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleGenderChange}
                  className="h-4 w-4 cursor-pointer accent-primary text-primary focus:ring-ring"
                />
                <Label
                  htmlFor="other"
                  className="font-normal cursor-pointer text-sm"
                >
                  Other
                </Label>
              </div>
            </div>
          </div>

          {/* Reset Password Toggle Trigger */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-sm text-accent"
              onClick={() => setShowPasswordReset(!showPasswordReset)}
              disabled
            >
              Forgot your password? Click here to reset it.
            </Button>
          </div>

          {/* Password Reset Section */}
          {showPasswordReset && (
            <ResetPasswordDialog
              open={showPasswordReset}
              setOpen={setShowPasswordReset}
            />
          )}
        </CardContent>

        {/* Action Buttons at Bottom */}
        <CardFooter className="flex justify-end space-x-3 bg-muted p-6 border-t border-border rounded-b-lg">
          <Button className="w-30" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button className="w-30" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </span>
            ) : (
              <p>Update</p>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
