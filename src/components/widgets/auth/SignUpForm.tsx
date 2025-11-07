"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormMessageAlert } from "../../ui/FormMessageAlert"; // Import success message component
import { CustomButton } from "../../ui/CustomButton";
import { TextField } from "../../blocks/TextField";
import { MailIcon, LockIcon, GoogleIcon, MicrosoftIcon } from "../../icons";
import { authOperation } from "@/lib/BE-library/main";
import { PatientRegistrationPayload } from "@/lib/BE-library/interfaces";
import { setTokenCookie } from "@/lib/auth-utils";

export const SignUpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();

  // Initialize Auth Operation
  // Sử dụng authOperation đã được export từ main.ts

  const passwordRules = [
    { rule: /[A-Z]/, message: "Kết hợp chữ hoa và chữ thường" },
    { rule: /.{8,}/, message: "Tối thiểu 8 ký tự" },
    { rule: /\d/, message: "Chứa ít nhất 1 số" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);
    setError("");
    setSuccess("");

    // Basic validation
    if (!name.trim()) {
      setError("Họ tên là bắt buộc.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    // Check password requirements
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Mật khẩu phải chứa ít nhất một chữ cái viết hoa.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    if (!/\d/.test(password)) {
      setError("Mật khẩu phải chứa ít nhất một số.");
      setLoading(false);
      setIsDisabled(false);
      return;
    }

    try {
      const registrationPayload: PatientRegistrationPayload = {
        email,
        password,
        fullName: name,
      };

      const result = await authOperation.patientRegister(registrationPayload);

      if (result.success && result.data) {
        // Store token in cookie
        setTokenCookie(result.data.accessToken, result.data.expiration);
        
        console.log("Registration successful:", result.data);
        setSuccess(`Đăng ký thành công với vai trò ${result.data.role}! Đang chuyển hướng đến trang chủ...`);
        
        // Redirect to patient dashboard
        setTimeout(() => {
          router.push("/dashboard/home");
        }, 1500);
      } else {
        setError(result.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    }

    setLoading(false);
    setIsDisabled(false);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-xl font-semibold leading-none tracking-tight">Đăng ký</h3>
        <p className="text-sm text-zinc-500">
          Đã có tài khoản?{" "}
          <a href="/auth/login" className="text-foreground underline">
            Đăng nhập
          </a>
        </p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="p-6 pt-0 flex flex-col gap-4">
        {/* Name Field */}
        <TextField
          label="Họ tên"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          validRules={[
            { rule: /.+/, message: "Họ tên là bắt buộc." },
          ]}
        />

        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          id="email"
          icon={<MailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          validRules={[
            { rule: /.+/, message: "Email là bắt buộc." },
            { rule: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Nhập địa chỉ email hợp lệ" },
          ]}
        />

        {/* Password Field */}
        <TextField
          label="Mật khẩu"
          type="password"
          id="password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          validRules={[
            { rule: /.+/, message: "Mật khẩu là bắt buộc." },
            { rule: /[A-Z]/, message: "Mật khẩu không đáp ứng yêu cầu." },
            { rule: /.{8,}/, message: "Mật khẩu không đáp ứng yêu cầu." },
            { rule: /\d/, message: "Mật khẩu không đáp ứng yêu cầu." },
          ]}
        />

        {/* Password Rules */}
        <ul className="text-sm space-y-1">
          {passwordRules.map((rule, index) => (
            <li
              key={index}
              className={
                rule.rule.test(password) ? "text-green-500" : "text-muted-foreground"
              }
            >
              • {rule.message}
            </li>
          ))}
        </ul>

        {success && <FormMessageAlert message={success} success={true}/>} {/* Display success message */}
        {error && <FormMessageAlert message={error} />} {/* Display error message */}

        {/* Submit CustomButton */}
        <CustomButton
          type="submit"
          className="w-full bg-primary text-primary-foreground"
          spinnerIcon={loading}
          disabled={loading || isDisabled}
        >
          {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </CustomButton>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="h-px flex-1 bg-foreground" />
          Hoặc tiếp tục với
          <div className="h-px flex-1 bg-foreground" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <CustomButton
            className=" w-full border hover:bg-accent hover:text-accent-foreground"
            onClick={() => console.log("Google login")}
          >
            <GoogleIcon className="mr-2" />
            Google
          </CustomButton>
          <CustomButton
            className="!text-foreground w-full border hover:bg-accent hover:text-accent-foreground"
            onClick={() => console.log("Microsoft login")}
          >
            <MicrosoftIcon className="mr-2" />
            Microsoft
          </CustomButton>
        </div>
      </form>
      <p className="items-center p-6 inline-bloc bg-muted rounded-b-xl border-t pt-6 text-xs text-muted-foreground">
        Bằng việc đăng ký, bạn đồng ý với{" "}
        <a href="#" className="font-medium text-foreground underline">
          Điều khoản sử dụng
        </a>{" "}
        và{" "}
        <a href="#" className="font-medium text-foreground underline">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi. Cần trợ giúp?{" "}
        <a href="#" className="font-medium text-foreground underline">
          Liên hệ với chúng tôi
        </a>
        .
      </p>
    </div>
  );
};
