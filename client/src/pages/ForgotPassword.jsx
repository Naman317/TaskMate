import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import useToast from "../hooks/useToast";

const ForgotPassword = () => {
  const [isSent, setIsSent] = useState(false);
  const toast = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Mocking the reset process since backend email service isn't set up
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsSent(true);
        toast.success("Reset link sent!", "Please check your inbox for instructions.");
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:flex w-5/12 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-6">Security First.</h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              We take your account security seriously. Follow the instructions sent to your email to safely reset your password.
            </p>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <Mail className="text-white" size={24} />
              <span className="text-sm">Encryption standard: AES-256</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-12 transition-colors">
            <ArrowLeft size={18} /> Back to Login
          </Link>

          {!isSent ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Forgot Password?</h2>
                <p className="text-muted-foreground mt-2">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email Address"
                  placeholder="name@company.com"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format"
                    }
                  })}
                  error={errors.email?.message}
                />

                <Button
                  type="submit"
                  label="Send Reset Link"
                  className="w-full"
                  isLoading={isSubmitting}
                />
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold">Check your email</h2>
              <p className="text-muted-foreground mt-3 mb-8">
                We've sent a password reset link to your email. It may take a few minutes to arrive.
              </p>
              <Button 
                variant="outline" 
                label="Resend Link" 
                className="w-full" 
                onClick={() => setIsSent(false)}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
