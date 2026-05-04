import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../assets/axios";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { setUser } from "../redux/slices/authSlice";
import useToast from "../hooks/useToast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const registerPromise = API.post("user/register", {
      ...data,
      isAdmin: false,
    });

    toast.promise(registerPromise, {
      loading: "Creating your account...",
      success: (res) => {
        const { user, token } = res.data;
        dispatch(setUser({ user, token }));
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
        return "Account created successfully!";
      },
      error: (err) => err.response?.data?.message || "Registration failed. Please try again.",
    });
  };


  return (
    <div className="flex min-h-screen bg-background">
      {/* Left side - Visuals (Consistent with Login) */}
      <div className="hidden lg:flex w-5/12 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-lg text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-12 transition-colors">
              <ArrowLeft size={18} /> Back to Login
            </Link>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center font-bold text-2xl border border-white/30">
                T
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">Tasky</span>
            </div>
            
            <h1 className="text-4xl font-extrabold leading-tight mb-6">
              Join the future of <span className="text-white/80">productivity.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-10 leading-relaxed">
              Experience the most intuitive way to manage your work, automate your workflows, and grow your team.
            </p>
            
            <div className="space-y-4">
              {[
                "14-day free trial",
                "Unlimited projects & tasks",
                "Integrated team chat",
                "Custom reporting dashboards",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-white/60" size={18} />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Tasky</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Start your journey with Tasky today.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                placeholder="John Doe"
                type="text"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Email Address"
                placeholder="name@company.com"
                type="email"
                {...register("email", { required: "Email is required" })}
                error={errors.email?.message}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                error={errors.password?.message}
              />
            </div>

            <div className="md:col-span-2 flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 rounded border-input text-primary focus:ring-primary/20" 
                required 
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the <Link to="#" className="text-primary font-semibold hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                label="Create Account"
                className="w-full h-12 text-base shadow-lg shadow-primary/20"
                isLoading={isSubmitting}
              />
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
