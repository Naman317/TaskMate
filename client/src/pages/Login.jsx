import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../assets/axios";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { setUser } from "../redux/slices/authSlice";
import useToast from "../hooks/useToast";
import { auth, googleProvider, signInWithPopup } from "../firebase";

const Login = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (data) => {
    const loginPromise = API.post("user/login", data, {
      withCredentials: true,
    });

    toast.promise(loginPromise, {
      loading: "Signing you in...",
      success: (res) => {
        const { user, token } = res.data;
        dispatch(setUser({ user, token }));
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
        return "Welcome back!";
      },
      error: (err) => err.response?.data?.message || "Login failed. Please check your credentials.",
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const res = await API.post("user/google-auth", {
        name: googleUser.displayName || googleUser.email.split("@")[0],
        email: googleUser.email,
        avatar: googleUser.photoURL || "",
        googleId: googleUser.uid,
      }, { withCredentials: true });

      const { user: userData, token } = res.data;
      dispatch(setUser({ user: userData, token }));
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
      toast.success("Welcome back!", `Signed in as ${userData.email}`);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error(err?.response?.data?.message || err?.message || "Google sign in failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-2xl border border-white/30">
                T
              </div>
              <span className="text-3xl font-bold tracking-tight">Tasky</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Master your workflow with <span className="text-white/80">precision.</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-12">
              Plan, track, and collaborate on your team's tasks in one beautiful, streamlined interface.
            </p>
            <div className="space-y-4">
              {[
                "Smart Task Organization",
                "Real-time Team Collaboration",
                "Advanced Analytics & Insights",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-white/60" size={20} />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Abstract shapes */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-12 justify-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Tasky</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Please enter your details to sign in.</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-input rounded-lg bg-card hover:bg-accent text-foreground font-medium transition-all shadow-sm mb-6 disabled:opacity-50"
          >
            <FcGoogle size={20} />
            <span>{googleLoading ? "Signing in..." : "Continue with Google"}</span>
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input"></div>
            </div>
            <span className="relative px-4 bg-background text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Or with email
            </span>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <Input
              label="Email Address"
              placeholder="name@company.com"
              type="email"
              {...register("email", { required: "Email is required" })}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              placeholder="••••••••"
              type="password"
              {...register("password", { required: "Password is required" })}
              error={errors.password?.message}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-input text-primary focus:ring-primary/20" />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
              <Link to="/forgot-password" title="Forgot Password" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              label="Sign In"
              className="w-full"
              isLoading={isSubmitting}
            />
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
