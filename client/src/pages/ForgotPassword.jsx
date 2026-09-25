import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2, Lock, KeyRound } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useToast from "../hooks/useToast";
import API from "../assets/axios";

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [step, setStep] = useState(tokenParam ? 2 : 1); // 1: Request, 2: Reset Form, 3: Success
  const [userEmail, setUserEmail] = useState(emailParam || "");
  const [resetToken, setResetToken] = useState(tokenParam || "");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenParam) {
      setResetToken(tokenParam);
      if (emailParam) setUserEmail(emailParam);
      setStep(2);
    }
  }, [tokenParam, emailParam]);

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: errorsRequest },
  } = useForm();

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch,
    formState: { errors: errorsReset },
  } = useForm();

  const handleRequestReset = async (data) => {
    try {
      setIsLoading(true);
      const res = await API.post("/user/forgot-password", { email: data.email });
      setUserEmail(data.email);
      setResetToken(res.data.resetToken || "");
      setStep(2);
      toast.success("Reset verification ready", "Please set your new password below.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to generate password reset request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    try {
      setIsLoading(true);
      await API.post("/user/reset-password", {
        email: userEmail,
        token: resetToken,
        password: data.newPassword,
      });
      setStep(3);
      toast.success("Password updated!", "You can now log in with your new password.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex w-5/12 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-6">Security First.</h1>
            <p className="text-lg text-primary-foreground/80 mb-8 leading-relaxed">
              We take your account security seriously. Set a strong, unique password to safeguard your workspace and team data.
            </p>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <Mail className="text-white" size={24} />
              <span className="text-sm">End-to-End Session Encryption</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={18} /> Back to Login
          </Link>

          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Forgot Password?</h2>
                <p className="text-muted-foreground mt-2">
                  Enter the email address associated with your account to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmitRequest(handleRequestReset)} className="space-y-6">
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
                  type="email"
                  {...registerRequest("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format"
                    }
                  })}
                  error={errorsRequest.email?.message}
                />

                <Button
                  type="submit"
                  label="Continue to Password Reset"
                  className="w-full"
                  isLoading={isLoading}
                />
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Lock size={24} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Create New Password</h2>
                <p className="text-muted-foreground mt-2">
                  Resetting password for <span className="font-semibold text-foreground">{userEmail}</span>.
                </p>
              </div>

              <form onSubmit={handleSubmitReset(handleResetPassword)} className="space-y-6">
                <Input
                  label="New Password"
                  placeholder="••••••••"
                  type="password"
                  {...registerReset("newPassword", { 
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  error={errorsReset.newPassword?.message}
                />

                <Input
                  label="Confirm New Password"
                  placeholder="••••••••"
                  type="password"
                  {...registerReset("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: (val) => {
                      if (watch("newPassword") !== val) {
                        return "Passwords do not match";
                      }
                    }
                  })}
                  error={errorsReset.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  label="Update Password"
                  className="w-full"
                  isLoading={isLoading}
                />
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold">Password Reset Successful!</h2>
              <p className="text-muted-foreground mt-3 mb-8">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <Button 
                label="Sign In Now" 
                className="w-full" 
                onClick={() => navigate("/")}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
