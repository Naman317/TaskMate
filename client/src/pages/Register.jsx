import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import API from "../assets/axios";
import { MdOutlineAddTask } from "react-icons/md";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { FiArrowLeft } from "react-icons/fi";
import { setUser } from "../redux/slices/authSlice";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/user/register", {
        ...data,
        isAdmin: false,
      });

      const userData = res.data;
      dispatch(setUser(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className='w-full min-h-screen flex bg-white font-sans'>
      {/* Left Side: Branding (Consistent with Login) */}
      <div className='hidden lg:flex w-2/5 bg-mesh relative overflow-hidden items-center justify-center border-r border-dark-100'>
        <div className='absolute inset-0 bg-gradient-to-br from-secondary-600/20 to-primary-600/20 z-0'></div>
        
        <div className='relative z-10 max-w-md px-12'>
          <Link to='/' className='inline-flex items-center gap-2 text-primary-600 font-semibold mb-12 hover:gap-3 transition-all'>
            <FiArrowLeft /> Back to Login
          </Link>

          <div className='flex items-center gap-3 mb-8'>
            <div className='p-3 bg-secondary-600 rounded-2xl shadow-premium'>
              <MdOutlineAddTask className='text-white text-3xl' />
            </div>
            <h1 className='text-3xl font-display font-bold tracking-tight text-dark-900'>TaskHub</h1>
          </div>
          
          <h2 className='text-4xl font-display font-extrabold text-dark-900 leading-tight mb-6'>
            Start your <span className='text-gradient'>journey</span> with us today.
          </h2>
          <p className='text-lg text-dark-600 mb-8 leading-relaxed'>
            Join thousands of teams who have already transformed their productivity with TaskHub.
          </p>

          <div className='space-y-4'>
            {['No credit card required', 'Unlimited collaborators', 'Advanced analytics', '24/7 Priority support'].map((feature, i) => (
              <div key={i} className='flex items-center gap-3 text-dark-700 font-medium'>
                <div className='w-6 h-6 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center text-xs'>✓</div>
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className='w-full lg:w-3/5 flex items-center justify-center p-8 bg-dark-50/30 lg:bg-white'>
        <div className='w-full max-w-lg'>
          <div className='lg:hidden flex items-center gap-3 mb-10'>
            <div className='p-2 bg-secondary-600 rounded-xl'>
              <MdOutlineAddTask className='text-white text-2xl' />
            </div>
            <h1 className='text-2xl font-display font-bold'>TaskHub</h1>
          </div>

          <div className='mb-10'>
            <h3 className='text-3xl font-display font-bold text-dark-900 mb-2'>Create Account</h3>
            <p className='text-dark-500'>Fill in the details below to get started with your 14-day free trial.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='col-span-2 space-y-2'>
              <label className='text-sm font-semibold text-dark-700 ml-1'>Full Name</label>
              <div className='relative'>
                <AiOutlineUser className='absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-xl z-10' />
                <Textbox
                  placeholder='John Doe'
                  type='text'
                  name='name'
                  className='pl-12'
                  register={register("name", {
                    required: "Name is required!",
                  })}
                  error={errors.name?.message}
                />
              </div>
            </div>

            <div className='col-span-2 space-y-2'>
              <label className='text-sm font-semibold text-dark-700 ml-1'>Email Address</label>
              <div className='relative'>
                <AiOutlineMail className='absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-xl z-10' />
                <Textbox
                  placeholder='name@company.com'
                  type='email'
                  name='email'
                  className='pl-12'
                  register={register("email", {
                    required: "Email is required!",
                  })}
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className='col-span-2 space-y-2'>
              <label className='text-sm font-semibold text-dark-700 ml-1'>Password</label>
              <div className='relative'>
                <AiOutlineLock className='absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 text-xl z-10' />
                <Textbox
                  placeholder='••••••••'
                  type='password'
                  name='password'
                  className='pl-12'
                  register={register("password", {
                    required: "Password is required!",
                  })}
                  error={errors.password?.message}
                />
              </div>
            </div>

            <div className='col-span-2 flex items-start gap-2 px-1'>
              <input type='checkbox' id='terms' className='mt-1 w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500' required />
              <label htmlFor='terms' className='text-sm text-dark-600'>
                I agree to the <Link to='#' className='text-primary-600 font-bold'>Terms of Service</Link> and <Link to='#' className='text-primary-600 font-bold'>Privacy Policy</Link>.
              </label>
            </div>

            <Button
              type='submit'
              label='Create Account'
              className='col-span-2 btn-primary h-14 text-lg bg-gradient-to-r from-secondary-600 to-primary-600'
            />
          </form>

          <p className='mt-10 text-center text-dark-500 font-medium'>
            Already have an account?{" "}
            <Link to='/' className='text-primary-600 font-bold hover:text-primary-700 transition-all'>
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
