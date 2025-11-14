"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

export const LoginForm = () => {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = z.object({
    email: z.string().min(4, "Invalid user name"),
    password: z
      .string()
      .min(1, "Password is required")
      .max(256, "Password must be at best 256 characters"),
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          toast.error(ctx.error.message);
        },
      }
    );
  };

  const isPending = form.formState.isSubmitting;
  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Please sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  //   onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                  type="button"
                >
                  <Image
                    src="/logos/github.svg"
                    alt="Github Logo"
                    height={20}
                    width={20}
                  />
                  Continue with Github
                </Button>
                <Button
                  //   onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                  disabled={isPending}
                  type="button"
                >
                  <Image
                    src="/logos/google.svg"
                    alt="Google Logo"
                    height={20}
                    width={20}
                  />
                  Continue with Google
                </Button>

                <div className="flex items-center">
                  <hr className="grow border-gray-300" />
                  <span className="mx-2 text-gray-400 text-sm">or</span>
                  <hr className="grow border-gray-300" />
                </div>

                <div className="grid gap-6">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter email address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Password <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <Checkbox label="Remember me" defaultChecked />
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-sm text-gray-500 font-normal"
                    onClick={() => setAuthStep("resetEmail")}
                  >
                    Forgot password?
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center">
                    <AlertTriangle className="text-red-700 mr-2" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  ) : (
                    "Login"
                  )}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                Don't have an account?
                <button
                  className="text-primary hover:underline ms-1"
                  onClick={() => router.push("/register")}
                  type="button"
                >
                  Register
                </button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
