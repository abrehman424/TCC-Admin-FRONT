import React, { useState } from "react";
import TCCImage from "../assets/Images/TCC_bg.jpg";
import { FiEye } from "react-icons/fi";
import logo from "../assets/SVG/logo.svg";
import EyeOff from "../assets/SVG/password-hidden.svg";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    // <div
    //   className="min-h-screen flex flex-col  lg:flex-row bg-contain relative"
    //   style={{ backgroundImage: `url(${TCCImage})` }}
    // >
    //   <div className=" lg:flex relative flex-col justify-between text-white p-5">
    //     <div className="font-bold text-2xl top-[40px] left-[40.28px]">
    //       <img src={logo} alt="" />
    //     </div>
    //      <div
    //       className="bg-gradient-to-b mt-8 from-[#F77F00]/40 to-[#666666]/40  lg:p-8 rounded-lg "
    //     >
    //       <h2
    //         className="text-2xl sm:text-4xl lg:text-7xl font-semibold font-roboto leading-tight"
    //       >
    //         <span className="text-orange-400">Grow</span> with every traveler
    //       </h2>
    //      <p
    //         className="mt-3 text-sm sm:text-base lg:text-lg text-gray-200 font-inter leading-relaxed"
    //       >
    //         Reach high-value guests where they stay. List your best pieces and
    //         get paid without adding headcount
    //       </p>
    //     </div>
    //   </div>

    //   <div className="w-1/2 bg-white flex items-center justify-center">
    //     <div className="w-full max-w-[480px]  ">
    //       <h2 className="text-[42px] font-medium font-roboto text-[#232323] mb-2 flex items-center justify-center leading-[130%]">
    //         Sign Up
    //       </h2>
    //       <p className="text-[#6C6C6C] text-base mb-10 flex items-center justify-center pt-3">
    //         Welcome to start your business!
    //       </p>

    //       <form className="space-y-3">
    //         <div className="flex flex-col gap-y-6">
    //           <div className="relative">
    //             <input
    //               type="text"
    //               id="name"
    //               name="name"
    //               className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
    //               placeholder=" "
    //             />
    //             <label
    //               for="name"
    //               className="absolute text-base ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
    //             >
    //               Name
    //             </label>
    //           </div>
    //           <div className="relative">
    //             <input
    //               type="text"
    //               id="email"
    //               name="email"
    //               className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
    //               placeholder=" "
    //             />
    //             <label
    //               for="email"
    //               className="absolute text-base ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
    //             >
    //               Email
    //             </label>
    //           </div>
    //           <div className="relative">
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               id="password"
    //               name="password"
    //               className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9]  focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
    //               placeholder=" "
    //             />
    //             <label
    //               for="password"
    //               className="ms-3 absolute text-base text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    //             >
    //               Password
    //             </label>

    //             <button
    //               type="button"
    //               onClick={() => setShowPassword(!showPassword)}
    //               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    //             >
    //               {showPassword ? (
    //                 <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
    //               ) : (
    //                 <FiEye size={20} />
    //               )}
    //             </button>
    //           </div>
    //           <div className="relative">
    //             <input
    //               type={showConfirmPassword ? "text" : "password"}
    //               id="confirm password"
    //               name="confirme_password"
    //               className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9]  focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
    //               placeholder=" "
    //             />
    //             <label
    //               for="confirm password"
    //               className="ms-3 absolute text-base text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    //             >
    //               Confirm Password
    //             </label>
    //             <button
    //               type="button"
    //               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    //               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 courser"
    //             >
    //               {showConfirmPassword ? (
    //                 <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
    //               ) : (
    //                 <FiEye size={20} />
    //               )}
    //             </button>
    //           </div>
    //         </div>
    //         <div className="flex items-center justify-between text-sm mb-6">
    //           <label className="flex items-center space-x-2 cursor-pointer">
    //             <input
    //               type="checkbox"
    //               className="w-[18px] h-[18px] rounded-md appearance-none border border-gray-300 
    //            checked:bg-orange-500 checked:border-orange-500 
    //            relative 
    //            checked:after:content-[''] 
    //            checked:after:absolute checked:after:inset-0 checked:after:mx-auto checked:after:mt-[2px]
    //            checked:after:w-[6px] checked:after:h-[10px] 
    //            checked:after:border-r-2 checked:after:border-b-2 
    //            checked:after:border-white checked:after:rotate-45"
    //             />
    //             <span className="text-[#6C6C6C]">
    //               I agree with the{" "}
    //               <a href="#" class="text-[#F77F00] hover:underline">
    //                 terms and conditions
    //               </a>
    //               .
    //             </span>
    //           </label>
    //         </div>

    //         <button
    //           type="submit"
    //           className="w-full bg-orange text-white text-base fw6 py-4 rounded-lg transition"
    //         >
    //           Sign up
    //         </button>
    //       </form>

    //       <p className="text-center text-base font-inter text-gray-600 mt-6">
    //         If you have an account?{" "}
    //         <Link to="/login" className="text-[#F77F00] fw6">
    //           Login
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </div>


    <div
  className="min-h-screen flex flex-col lg:flex-row bg-contain relative"
  style={{ backgroundImage: `url(${TCCImage})` }}
>
  {/* ================= LEFT SECTION ================= */}
  <div className="w-full lg:w-1/2 flex flex-col justify-between text-white p-4 sm:p-5">
    <div className="font-bold text-2xl">
      <img src={logo} alt="logo" />
    </div>

    <div className="bg-gradient-to-b mt-6 lg:mt-0 from-[#F77F00]/40 to-[#666666]/40 p-4 sm:p-6 lg:p-8 rounded-lg">
      <h2 className="text-2xl sm:text-4xl lg:text-7xl font-semibold font-roboto leading-tight">
        <span className="text-orange-400">Grow</span> with every traveler
      </h2>
      <p className="mt-3 text-sm sm:text-base lg:text-lg text-gray-200 font-inter leading-relaxed">
        Reach high-value guests where they stay. List your best pieces and
        get paid without adding headcount
      </p>
    </div>
  </div>

  {/* ================= RIGHT SECTION ================= */}
  <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-4 sm:px-6 py-10 lg:py-0">
    <div className="w-full max-w-[480px]">
      <h2 className="text-3xl sm:text-[42px] font-medium font-roboto text-[#232323] mb-2 text-center leading-[130%]">
        Sign Up
      </h2>
      <p className="text-[#6C6C6C] text-sm sm:text-base mb-8 text-center pt-2">
        Welcome to start your business!
      </p>

      <form className="space-y-3">
        <div className="flex flex-col gap-y-6">
          {/* Name */}
          <div className="relative">
            <input className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] peer" placeholder=" " />
            <label className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2">
              Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] peer" placeholder=" " />
            <label className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2">
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] peer"
              placeholder=" "
            />
            <label className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2">
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <img src={EyeOff} className="w-5 h-5" />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] peer"
              placeholder=" "
            />
            <label className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2">
              Confirm Password
            </label>

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? (
                <img src={EyeOff} className="w-5 h-5" />
              ) : (
                <FiEye size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm my-6">
          <input type="checkbox" className="mt-1" />
          <span className="text-[#6C6C6C]">
            I agree with the{" "}
            <a href="#" className="text-[#F77F00] hover:underline">
              terms and conditions
            </a>
            .
          </span>
        </div>

        <button className="w-full bg-orange text-white py-4 rounded-lg">
          Sign up
        </button>
      </form>

      <p className="text-center text-sm sm:text-base text-gray-600 mt-6">
        If you have an account?{" "}
        <Link to="/login" className="text-[#F77F00]">
          Login
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default Signup;
