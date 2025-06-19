import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    const storedUserId = localStorage.getItem("pendingUserId");

    if (!storedEmail || !storedUserId) {
      toast.error("Session expired. Please register again.");
      navigate("/register");
    } else {
      setEmail(storedEmail);
      setUserId(storedUserId);
    }
  }, [navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      return toast.error("Enter a valid 6-digit code.");
    }

    try {
      setLoading(true);
      await axiosInstance.post("/api/auth/verify-email", { userId, code });
      


      toast.success("Email verified!");
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("pendingUserId");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axiosInstance.post("/api/auth/resend-code", { email });
      toast.success("Verification code resent to your email.");
    } catch (error) {
      toast.error("Could not resend verification code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          Verify Your Email
        </h2>
        <p className="mb-6 text-sm text-gray-600 text-center">
          Enter the 6-digit code sent to <strong>{email || "your email"}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 text-xl text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full mt-4 text-sm text-blue-600 hover:underline"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
