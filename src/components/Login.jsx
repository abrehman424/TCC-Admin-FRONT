import React, { useEffect, useState } from "react";
import TCCImage from "../assets/Images/TCC_bg.jpg";
import { FiEye } from "react-icons/fi";
import logo from "../assets/SVG/logo.svg";
import apple from "../assets/SVG/apple.svg";
import shopify from "../assets/SVG/shopify.svg";
import google from "../assets/SVG/google.svg";
import EyeOff from "../assets/SVG/password-hidden.svg";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [oauthLoading, setOauthLoading] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setFieldErrors(err.errors);
    }
  };

  // OAuth handlers
  const handleGoogleLogin = () => {
    setOauthLoading("google");
    setError("");

    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://travelclothingclub-admin.online/api";

    // Option 1: Direct redirect (current approach)
    window.location.href = `${API_URL}/social/google/redirect`;

    // Option 2: Popup approach (uncomment if you prefer popup)
    // const popup = window.open(
    //   `${API_URL}/social/google/redirect`,
    //   'google-oauth',
    //   'width=500,height=600,scrollbars=yes,resizable=yes'
    // );

    // const handleMessage = (event) => {
    //   if (event.origin !== new URL(API_URL).origin) return;
    //
    //   if (event.data.type === 'OAUTH_SUCCESS') {
    //     localStorage.setItem('auth_token', event.data.token);
    //     localStorage.setItem('auth_user', JSON.stringify(event.data.user));
    //     localStorage.setItem('type', event.data.user.type || 'admin');
    //     window.location.href = '/';
    //   } else if (event.data.type === 'OAUTH_ERROR') {
    //     setError(event.data.error);
    //   }
    //
    //   setOauthLoading(null);
    //   window.removeEventListener('message', handleMessage);
    //   popup.close();
    // };

    // window.addEventListener('message', handleMessage);
  };

  const handleAppleLogin = () => {
    setOauthLoading("apple");
    setError("");

    // Direct redirect to backend OAuth endpoint
    const API_URL =
      import.meta.env.VITE_API_URL ||
      "https://travelclothingclub-admin.online/api";
    window.location.href = `${API_URL}/social/apple/redirect`;
  };

  const handleShopifyLogin = async () => {
    try {
      setOauthLoading("shopify");
      setError("");

      const shopDomain = prompt(
        "Enter your Shopify shop domain (e.g., mystore.myshopify.com):"
      );
      if (!shopDomain) {
        setOauthLoading(null);
        return;
      }

      // Validate shop domain format
      const shopDomainRegex = /^[a-zA-Z0-9-]+\.myshopify\.com$/;
      if (!shopDomainRegex.test(shopDomain)) {
        setError(
          "Invalid shop domain format. Please use format: mystore.myshopify.com"
        );
        setOauthLoading(null);
        return;
      }

      // Use oauthService for consistency
      const oauthService = (await import("../services/oauthService")).default;

      // Store shop domain for the service
      sessionStorage.setItem("shopify_domain", shopDomain);

      // Direct redirect to backend OAuth endpoint
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://travelclothingclub-admin.online/api";
      window.location.href = `${API_URL}/social/shopify/redirect?shop=${encodeURIComponent(
        shopDomain
      )}`;
    } catch (error) {
      setError(error.message || "Failed to initiate Shopify login");
      setOauthLoading(null);
    }
  };

  useEffect(() => {
    setInterval(() => {
      setError("");
    }, 10000);
  }, []);

  // return (

  //   <div
  //     className="min-h-screen flex bg-contain relative"
  //     style={{ backgroundImage: `url(${TCCImage})` }}
  //   >
  //     <div className="w-1/2 relative flex flex-col  justify-between text-white p-5">
  //       <div className="font-bold text-2xl top-[40px] left-[40.28px]">
  //         <img src={logo} alt="" />
  //       </div>
  //       <div className="bg-gradient-to-b from-[#F77F00]/40 to-[#666666]/40 p-8 rounded-lg">
  //         <h2 className="text-7xl font-semibold font-roboto">
  //           <span className="text-orange-400">Grow</span> with every traveler
  //         </h2>
  //         <p className="mt-3 text-lg text-gray-200 font-inter">
  //           Reach high-value guests where they stay. List your best pieces and
  //           get paid without adding headcount
  //         </p>
  //       </div>
  //     </div>

  //     <div className="w-1/2 bg-white flex items-center justify-center">
  //       <div className="w-full max-w-[480px]  ">
  //         <h2 className="text-[42px] font-medium font-roboto text-[#232323] mb-2 flex items-center justify-center leading-[130%]">
  //           Welcome back!
  //         </h2>
  //         <p className="text-[#6C6C6C] text-base mb-10 flex items-center justify-center pt-3">
  //           Let’s get back to your business!
  //         </p>
  //         <form className="space-y-3" onSubmit={handleSubmit}>
  //           {/* <form className="space-y-3"> */}

  //           {error && Object.keys(fieldErrors).length === 0 && (
  //             <div className="p-4 mb-4 text-smrounded-lg bg-red-500/60 text-white" role="alert">
  //               <span className="font-medium ">{error}</span>
  //             </div>

  //           )}

  //           <div className="flex flex-col gap-y-6">

  //             <div className="mb-2">
  //               <div className="relative">
  //                 <input
  //                   type="text"
  //                   id="email"
  //                   name="email"
  //                   value={email}
  //                   onChange={(e) => setEmail(e.target.value)}
  //                   className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9] focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
  //                   placeholder=" "
  //                 />
  //                 <label
  //                   htmlFor="email"
  //                   className="absolute text-base ms-4 text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto   start-1"
  //                 >
  //                   Email
  //                 </label>

  //               </div>
  //               {fieldErrors.email && fieldErrors.email.map((msg, i) => (
  //                 <p key={i} className="text-red-500 text-sm mt-1">{msg}</p>
  //               ))}
  //             </div>
  //             <div className="mb-2">
  //               <div className="relative">
  //                 <input
  //                   type={showPassword ? "text" : "password"}
  //                   id="password"
  //                   name="password"
  //                   value={password}
  //                   onChange={(e) => setPassword(e.target.value)}
  //                   className="block p-4 pt-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border-1 border-[#D9D9D9]  focus:outline-none focus:ring-0 focus:border-[#D9D9D9] peer"
  //                   placeholder=" "

  //                 />
  //                 <label
  //                   htmlFor="password"
  //                   className="ms-3 absolute text-base text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#202020]  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
  //                 >
  //                   Password
  //                 </label>

  //                 <button
  //                   type="button"
  //                   onClick={() => setShowPassword(!showPassword)}
  //                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
  //                 >
  //                   {showPassword ? (
  //                     <img src={EyeOff} alt="Hide password" className="w-5 h-5" />
  //                   ) : (
  //                     <FiEye size={20} />
  //                   )}
  //                 </button>

  //               </div>
  //               {fieldErrors.password && fieldErrors.password.map((msg, i) => (
  //                 <p key={i} className="text-red-500 text-sm mt-1">{msg}</p>
  //               ))}
  //             </div>
  //           </div>
  //           <div className="flex items-center justify-between text-sm mb-6">
  //             <label className="flex items-center space-x-2">
  //               <input
  //                 type="checkbox"
  //                 checked={rememberMe}
  //                 onChange={(e) => setRememberMe(e.target.checked)}
  //                 className="w-[18px] h-[18px] rounded-md appearance-none border border-gray-300
  //              checked:bg-orange-500 checked:border-orange-500
  //              relative
  //              checked:after:content-['']
  //              checked:after:absolute checked:after:inset-0 checked:after:mx-auto checked:after:mt-[1px]
  //              checked:after:w-[6px] checked:after:h-[10px]
  //              checked:after:border-r-2 checked:after:border-b-2
  //              checked:after:border-white checked:after:rotate-45"

  //               />
  //               <span className="fw5 text-[#6C6C6C]">Remember me</span>
  //             </label>
  //             <Link to="/forgot-password" className="text-[#F77F00] hover:underline fw5">
  //               Forgot password?
  //             </Link>
  //           </div>

  //           <button
  //             type="submit"
  //             className="w-full bg-orange text-white text-base fw6 py-4 rounded-lg transition "
  //           >
  //             Sign in
  //           </button>
  //         </form>
  //         <div className="flex items-center my-4 py-0.5 px-1">
  //           <div className="flex-grow border-t border-gray-300"></div>
  //           <span className="mx-2 text-gray-500 text-xs ">or sign in with</span>
  //           <div className="flex-grow border-t border-gray-300"></div>
  //         </div>

  //         <div className="space-y-3">
  //           <button
  //             onClick={handleGoogleLogin}
  //             disabled={oauthLoading !== null}
  //             className="w-full border border-[#D9D9D9] py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  //           >
  //             {oauthLoading === 'google' ? (
  //               <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
  //             ) : (
  //               <img src={google} alt="" />
  //             )}
  //             <span className="text-base fw6">
  //               {oauthLoading === 'google' ? 'Connecting...' : 'Sign in with Google'}
  //             </span>
  //           </button>

  //           <div className="flex space-x-4">
  //             <button
  //               onClick={handleAppleLogin}
  //               disabled={oauthLoading !== null}
  //               className="w-1/2 border border-[#D9D9D9] py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  //             >
  //               {oauthLoading === 'apple' ? (
  //                 <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
  //               ) : (
  //                 <img src={apple} alt="" />
  //               )}
  //               <span className="text-base fw6">
  //                 {oauthLoading === 'apple' ? 'Connecting...' : 'Sign in with Apple'}
  //               </span>
  //             </button>
  //             <button
  //               onClick={handleShopifyLogin}
  //               disabled={oauthLoading !== null}
  //               className="w-1/2 border border-[#D9D9D9] py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  //             >
  //               {oauthLoading === 'shopify' ? (
  //                 <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
  //               ) : (
  //                 <img src={shopify} alt="" />
  //               )}
  //               <span className="text-base fw6">
  //                 {oauthLoading === 'shopify' ? 'Connecting...' : 'Sign in with Shopify'}
  //               </span>
  //             </button>
  //           </div>
  //         </div>

  //         <p className="text-center text-base font-inter text-gray-600 mt-6">
  //           {/* Don’t have an account?{" "}
  //           <Link to="/signup" className="text-[#F77F00] fw6 ">
  //             Sign up
  //           </Link> */}
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div
      className="min-h-screen flex flex-col  lg:flex-row bg-contain relative"
      style={{ backgroundImage: `url(${TCCImage})` }}
    >
      {/* ================= LEFT SECTION (HIDDEN ON SMALL) ================= */}
      <div className=" lg:flex relative flex-col justify-between text-white p-5">
        <div className="font-bold text-2xl top-[40px] left-[40.28px]">
          <img src={logo} alt="logo" />
        </div>

        <div className="bg-gradient-to-b mt-8 from-[#F77F00]/40 to-[#666666]/40  lg:p-8 rounded-lg ">
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
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[480px] py-10">
          <div className="flex justify-center  lg:hidden">
            <img src={logo} alt="logo" className="h-10" />
          </div>

          <h2 className="text-3xl sm:text-[42px] font-medium font-roboto text-[#232323] mb-2 text-center leading-[130%]">
            Welcome back!
          </h2>
          <p className="text-[#6C6C6C] text-sm sm:text-base mb-8 text-center">
            Let’s get back to your business!
          </p>

          <form className="space-y-3" onSubmit={handleSubmit}>
            {error && Object.keys(fieldErrors).length === 0 && (
              <div className="p-4 text-sm rounded-lg bg-red-500/60 text-white">
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* ================= INPUTS ================= */}
            <div className="flex flex-col gap-y-6">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none peer"
                    placeholder=" "
                  />
                  <label className="absolute text-base ms-4 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-focus:scale-75 peer-focus:top-2">
                    Email
                  </label>
                </div>
                {fieldErrors.email?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block p-4 w-full text-sm text-[#202020] bg-transparent rounded-xl border border-[#D9D9D9] focus:outline-none peer"
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
                {fieldErrors.password?.map((msg, i) => (
                  <p key={i} className="text-red-500 text-sm mt-1">
                    {msg}
                  </p>
                ))}
              </div>
            </div>

            {/* ================= OPTIONS ================= */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm my-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-[18px] h-[18px] rounded-md border border-gray-300 checked:bg-orange-500"
                />
                <span className="text-[#6C6C6C]">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[#F77F00] text-center"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-orange text-white py-4 rounded-lg"
            >
              Sign in
            </button>
          </form>

          {/* ================= OAUTH ================= */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-color" />
            <span className="mx-2 text-xs text-gray-500">or sign in with</span>
            <div className="flex-grow border-t border-color" />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              className="w-full border-color py-4 rounded-lg flex justify-center gap-3"
            >
              <img src={google} />
              Sign in with Google
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAppleLogin}
                className="w-full sm:w-1/2 border-color py-4 rounded-lg flex justify-center gap-3"
              >
                <img src={apple} />
                Apple
              </button>

              <button
                onClick={handleShopifyLogin}
                className="w-full sm:w-1/2 border-color py-4 rounded-lg flex justify-center gap-3"
              >
                <img src={shopify} />
                Shopify
              </button>
            </div>
          </div>
          <p className="text-center text-base font-inter text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#F77F00] fw6 ">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
