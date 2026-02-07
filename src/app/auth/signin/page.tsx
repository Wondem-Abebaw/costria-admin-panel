// app/auth/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LucidePhone,
  Mail,
  Phone,
  PhoneIcon,
} from "lucide-react";
import { toast } from "sonner";
import useDynamicMutation from "@/lib/api/use-post-data";

const loginSchema = z.object({
  phoneNumber: z.string(),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const postMutation = useDynamicMutation({});
  const [showPassword, setShowPassword] = useState(false);

  const error = searchParams.get("error");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (error === "session_expired") {
      toast.error("Your session has expired. Please login again.");
    }
  }, [error]);

  const onSubmit = async (data: LoginForm) => {
    try {
      await postMutation.mutateAsync({
        url: "auth/admin-login",
        method: "POST",
        headers: {},
        body: {
          phoneNumber: data.phoneNumber,
          password: data.password,
        },
        onSuccess: async (res) => {
          console.log("🚀 ~ onSubmit ~ res:", res);
          toast.loading("Login Successful, Redirecting to home page...");

          await signIn("credentials", {
            data: JSON.stringify(res),
            callbackUrl: "/",
          });
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Costria Admin Panel
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Sign in to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative mt-1">
                <LucidePhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phoneNumber"
                  type="phoneNumber"
                  placeholder="+251948261915"
                  {...register("phoneNumber")}
                  className="pl-10"
                  disabled={postMutation.isPending}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  key={showPassword ? "text" : "password"}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-10 pr-10"
                  disabled={postMutation.isPending}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={postMutation.isPending}
            >
              {postMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Admin access only</p>
            <p className="mt-2">
              Need access?{" "}
              <span className="text-primary">Contact super administrator</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
