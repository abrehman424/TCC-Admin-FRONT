import React, { useState } from "react";
import API from "../../services/api.js";
import infoLogo from "../../assets/Images/request_info.png";
import { FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductReqInfo = ({ isOpen, product, onClose, onSend }) => {
  if (!isOpen) return null;


  const [formData, setFormData] = useState({
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);


  const handleClickInside = (e) => {
    e.stopPropagation();
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await API.post("/partners/request-information", {
        to: product?.partner?.email, 
        businessName: product?.partner?.business_name || product?.partner?.businessName || 'Partner',
        message: formData.message,
        deadline: null,
      });

      onSend();
      toast.success("Email sent successfully!"); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send email");
      toast.error(`Error: ${err.response?.data?.message || "Failed to send email"}`); 
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
  <div
    className="fixed inset-0 flex items-center justify-center bg-black/10 z-50 px-4"
    onClick={handleOverlayClick}
  >
    <div
      className="
        flex flex-col 
        bg-white 
        rounded-lg 
        shadow-lg 
        w-full 
        max-w-[503px] 
        p-6 sm:p-10 
        gap-8 
        max-h-[90vh] 
        overflow-y-auto
      "
      onClick={handleClickInside}
    >
      <div className="flex items-center justify-center text-center gap-6">
        <img
          src={infoLogo}
          alt="Request Information"
          className="w-[56px] h-[56px]"
          style={{
            background:
              "linear-gradient(0deg, #EBFFEC, #EBFFEC), linear-gradient(180deg, rgba(255, 140, 66, 0.2) 0%, rgba(255, 94, 91, 0.2) 100%)",
          }}
        />
      </div>

      <div className="flex flex-col gap-4 text-center">
        <h2 className="font-roboto font-medium text-xl text-[#232323]">
          Request Additional Information
        </h2>
        <p className="text-sm text-[#6C6C6C]">
          Ask the partner to provide missing or clarifying details before approval
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              className="peer block w-full rounded-md border border-gray-300 px-3 pt-6 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Your message"
              onClick={handleClickInside}
            ></textarea>
            <label
              htmlFor="message"
              className="absolute left-3 top-1.5 text-gray-500 text-xs transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-gray-700"
            >
              Message
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-orange text-white py-3 rounded-md transition font-medium text-sm ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Request"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`w-full bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 transition font-medium text-sm ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default ProductReqInfo;