"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormMessageAlert } from "../../ui/FormMessageAlert";
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { MailIcon, LockIcon, GoogleIcon, MicrosoftIcon } from "../../icons";
import { authOperation } from "@/lib/BE-library/main";
import { LoginPayload } from "@/lib/BE-library/interfaces";
import { setTokenCookie, getRedirectPath } from "@/lib/auth-utils";

export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);
    setError("");
    setSuccess("");

    
    if (!email.includes("@")) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    try {
      const loginPayload: LoginPayload = { email, password };
      const result = await authOperation.adminLogin(loginPayload);

      if (result.success && result.data) {
        
        setTokenCookie(result.data.accessToken, result.data.expiration);
        
        const userRole = result.data.role;
        setSuccess(`Đăng nhập thành công với vai trò ${userRole}! Đang chuyển hướng đến trang chủ...`);
        
        
        setTimeout(() => {
          const redirectPath = getRedirectPath(userRole);
          router.push(redirectPath);
        }, 1500);
      } else {
        setError(result.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    }

    setLoading(false);
    setIsDisabled(false);
  };
  return (
    <div>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-xl font-semibold leading-none tracking-tight">Đăng nhập</h3>
        <p className="text-sm text-zinc-500 text-muted-foreground">
          Nhập thông tin chi tiết của bạn bên dưới để đăng nhập vào tài khoản.
        </p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="p-6 pt-0 flex flex-col gap-4">
        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          id="email"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field */}
        <TextField
          label="Mật khẩu"
          type="password"
          id="password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
          <a
            href="/auth/forgot-password"
            className="text-sm underline text-muted-foreground"
          >
            Quên mật khẩu?
          </a>
        </TextField>

        {success && <FormMessageAlert message={success} success={true} />} {/* Display success message */}
        {error && <FormMessageAlert message={error} />} {/* Display error message */}

        {/* Submit Button */}
        <CustomButton
          type="submit"
          className="w-full !bg-primary text-primary-foreground"
          spinnerIcon={loading}
          disabled={loading || isDisabled}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </CustomButton>
      </form>
      <p className="items-center p-6 pt-0 flex justify-center gap-1 text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <a href="/auth/signup" className="underline font-semibold text-foreground">
          Đăng ký
        </a>
      </p>
    </div>
  );
};
