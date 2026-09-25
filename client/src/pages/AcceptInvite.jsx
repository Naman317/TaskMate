import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle2, UserCheck, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import API from "../assets/axios";
import { setUser } from "../redux/slices/authSlice";
import useToast from "../hooks/useToast";
import { auth, googleProvider, signInWithPopup } from "../firebase";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const rawToken = searchParams.get("token") || "";
  // Extract clean 48-char hex token even if accidental duplicate URL strings are appended
  const hexMatch = rawToken.match(/[a-f0-9]{48}/i);
  const token = hexMatch ? hexMatch[0] : rawToken.trim();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!token) {
      setErrorMsg("Missing or invalid invitation token.");
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/user/invitation/${encodeURIComponent(token)}`);
        setInvitation(res.data.invitation);
        setValue("email", res.data.invitation.email);
      } catch (err) {
        setErrorMsg(err?.response?.data?.message || "This invitation link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token, setValue]);

  const handleManualAccept = async (data) => {
    try {
      setSubmitting(true);
      const res = await API.post("/user/accept-invite", {
        token,
        name: data.name,
        password: data.password,
      });

      const { user, token: authToken } = res.data;
      dispatch(setUser({ user, token: authToken }));
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Welcome to Tasky!", `Account activated for ${user.email}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to activate account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAccept = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const res = await API.post("/user/accept-invite", {
        token,
        name: googleUser.displayName || googleUser.email.split("@")[0],
        email: googleUser.email,
        avatar: googleUser.photoURL || "",
        password: "google_oauth_user",
      });

      const { user, token: authToken } = res.data;
      dispatch(setUser({ user, token: authToken }));
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Welcome to the team!", `Signed in as ${user.email}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to connect Google account with invitation.");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card p-8 border rounded-2xl shadow-soft text-center"
        >
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Invitation Unavailable</h2>
          <p className="text-muted-foreground mt-2 mb-6">{errorMsg}</p>
          <Button label="Go to Sign In" onClick={() => navigate("/")} className="w-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-card p-8 border rounded-2xl shadow-soft"
      >
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">Tasky</span>
        </div>

        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
            <Sparkles size={14} /> Team Invitation
          </span>
          <h1 className="text-2xl font-bold text-foreground">You're Invited to Join the Workspace!</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Invited by <span className="font-semibold text-foreground">{invitation?.invitedBy}</span> as{" "}
            <span className="font-semibold text-primary">{invitation?.title}</span> (Role: {invitation?.role}).
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleAccept}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-input rounded-lg bg-background hover:bg-accent text-foreground font-medium transition-all shadow-sm mb-6 disabled:opacity-50"
        >
          <FcGoogle size={20} />
          <span>{googleLoading ? "Connecting Google..." : "Join with Google"}</span>
        </button>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-input"></div>
          </div>
          <span className="relative px-4 bg-card text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            Or set up password
          </span>
        </div>

        <form onSubmit={handleSubmit(handleManualAccept)} className="space-y-4">
          <Input
            label="Your Assigned Email"
            type="email"
            value={invitation?.email || ""}
            disabled
            className="bg-muted cursor-not-allowed"
          />

          <Input
            label="Full Name"
            placeholder="John Doe"
            type="text"
            {...register("name", { required: "Full name is required" })}
            error={errors.name?.message}
          />

          <Input
            label="Create Password"
            placeholder="••••••••"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            label="Activate Account & Enter Workspace"
            className="w-full h-11 text-base mt-2"
            isLoading={submitting}
          />
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AcceptInvite;
