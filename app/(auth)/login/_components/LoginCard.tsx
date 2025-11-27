import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";

export const LoginCard = () => {
  return (
    <Card className="w-full max-w-md shadow-xl border-none rounded-2xl bg-white">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold text-blue-700">
          Sistem Manajemen Yayasan Qur’an
        </CardTitle>
        <p className="text-sm text-gray-500">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  );
};
