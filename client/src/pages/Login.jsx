import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../assets/axios";
import { Link } from "react-router-dom";

import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { setUser } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await API.post("/user/login", data,{
    withCredentials:true
});
      const userData = res.data;
console.log(userData);
      dispatch(setUser(userData));

      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err.response?.data || err.message);
console.log(err);
      alert("Login failed. Please check your email or password.");
    }
  };

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>

        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg flex flex-col items-center justify-center gap-5'>
            <span className='border rounded-full text-lg px-3 py-1 text-gray-600'>Your Smart Task Hub </span>
            <p className='text-3xl font-black text-center text-blue-700'>Plan, track, and deliver</p>
            <p className='text-3xl font-black text-center text-blue-700'>all in one place.</p>
          </div>
        </div>

        <div className='w-full md:w-1/3 p-4 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700'>
                Please enter your credentials.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email is required!",
                })}
                error={errors.email?.message}
              />

              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password?.message}
              />

              <Button
                type='submit'
                label='Submit'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
            </div>
<p className='text-center text-sm mt-4'>
  Don't have an account?{" "}
  <Link to='/register' className='text-blue-600 underline'>
    Register
  </Link>
</p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
