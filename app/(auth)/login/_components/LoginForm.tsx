"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { loginSchema, LoginSchema } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";

export const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => login(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username / Email</Label>
        <Input
          id="username"
          type="text"
          placeholder="masukkan username atau email"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Kata Sandi</Label>
        <Input
          id="password"
          type="password"
          placeholder="masukkan kata sandi"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-md">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Masuk...
          </span>
        ) : (
          "Masuk"
        )}
      </Button>

      <p className="text-center text-sm text-gray-500 mt-2">
        Lupa kata sandi?{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Reset di sini
        </a>
      </p>

      <p className="text-center text-gray-400 text-xs italic mt-4">
        “Sebaik-baik kalian adalah yang belajar Al-Qur’an dan mengajarkannya.”
      </p>
    </form>
  );
};
