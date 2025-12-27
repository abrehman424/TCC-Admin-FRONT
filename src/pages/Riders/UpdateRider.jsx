import React, { useState, useEffect } from "react";
import backward from "../../assets/SVG/backward.svg";
import { FiChevronDown } from "react-icons/fi";
import Upload from "../../assets/SVG/upload.svg";
import { FaTimes } from "react-icons/fa";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb";


const GEOAPIFY_KEY = import.meta.env.VITE_APP_GEOAPIFY_KEY;


const Dropdown = ({
  label,
  options = [],
  multiple = false,
  value = multiple ? [] : "",
  onChange,
  triggerClass,
  dropdownClass,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  const handleSelect = (opt) => {
    if (multiple) {
      const newValue = value.includes(opt)
        ? value.filter((v) => v !== opt)
        : [...value, opt];
      onChange(newValue);
    } else {
      onChange(opt);
      setOpen(false);
    }
  };

  const displayValue = multiple
    ? value.length > 0
      ? value.join(", ")
      : label
    : value || label;

  /* ✅ Close on outside click (mobile + desktop) */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative w-full"
      onMouseEnter={() => window.innerWidth >= 768 && setOpen(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setOpen(false)}
    >
      {/* Trigger */}
      <div
        className={`flex items-center border border-[#afaaaa89] rounded-lg px-4 py-4 cursor-pointer bg-white ${triggerClass}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[#121212] text-sm flex-1 truncate">
          {displayValue}
        </span>
        <FiChevronDown
          className={`transition-transform duration-300 w-5 h-5 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className={`absolute top-full left-0 mt-1 w-full bg-white border border-[#D9D9D9] rounded-lg shadow-md z-50 ${dropdownClass}`}
        >
          {options.map((opt, index) => (
            <span
              key={index}
              onClick={() => handleSelect(opt)}
              className={`block px-4 py-2 text-sm cursor-pointer rounded hover:bg-[#F77F00] hover:text-white ${
                multiple && value.includes(opt)
                  ? "bg-[#f6a34b] text-white mb-1"
                  : ""
              }`}
            >
              {opt}
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};


const UpdateRider = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        latitude: "",
        longitude: "",
        insurance_expire_date: "",
        assigned_region: [],
        vehicle_type: "",
        vehicle_name: "",
        license_plate: "",
        profile_photo: null,
    });

          const [suggestions, setSuggestions] = useState([]);
    
    const [errors, setErrors] = useState({});
    const [rider, setRider] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [licenseImages, setLicenseImages] = useState({ front: null, back: null });

    useEffect(() => {
        const fetchRider = async () => {
            try {
                const res = await API.get(`/riders/${id}`);
                const rider = res.data.data;

                setRider(rider);

                setFormData({
                    first_name: rider.first_name,
                    last_name: rider.last_name,
                    email: rider.email,
                    phone: rider.phone,
                    address: rider.address,
                    latitude: rider.latitude,
                    longitude: rider.longitude,
                    insurance_expire_date: rider.insurance_expire_date || "",
                    assigned_region: rider.assigned_region ? rider.assigned_region.split(",") : [],
                    vehicle_type: rider.vehicle_type,
                    vehicle_name: rider.vehicle_name,
                    license_plate: rider.license_plate,
                    profile_photo: rider.profile_photo || null,
                });

                setProfileImage(rider.profile_photo || rid_image);
                setLicenseImages({
                    front: rider.documents?.license_front || null,
                    back: rider.documents?.license_back || null,
                });
            } catch (err) {
                console.error("Error fetching rider:", err);
                toast.error("Failed to load rider details!");
            }
        };

        fetchRider();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e, type, side) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === "license") {
            setLicenseImages((prev) => ({ ...prev, [side]: file }));
            setErrors((prev) => ({ ...prev, [`license_${side}`]: null }));
        } else if (type === "profile") {
            const profile = URL.createObjectURL(file);
            setProfileImage(profile);
            setFormData((prev) => ({ ...prev, profile_photo: file }));
            setErrors((prev) => ({ ...prev, profile_photo: null }));
        }
    };

    const handleDelete = (type, side = null) => {
        if (type === "profile") {
            setProfileImage(rider.profile_photo || rid_image);
        } else if (type === "license") {
            setLicenseImages((prev) => ({ ...prev, [side]: null }));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const payload = new FormData();
            Object.keys(formData).forEach((key) => {
                if (Array.isArray(formData[key])) {
                    payload.append(key, formData[key].join(","));
                } else {
                    payload.append(key, formData[key]);
                }
            });

            if (formData.profile_photo instanceof File) payload.append("profile_photo", formData.profile_photo);
            if (licenseImages.front instanceof File) payload.append("license_front", licenseImages.front);
            if (licenseImages.back instanceof File) payload.append("license_back", licenseImages.back);

            await API.post(`/riders/update/${id}`, payload, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Rider updated successfully!");
            navigate("/riders");
        } catch (err) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error("Failed to update rider!");
            }
        }
    };


         const handleAddressChange = async (e) => {
    const value = e.target.value;
    handleChange(e);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {

      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          value
        )}&apiKey=${GEOAPIFY_KEY}`
      );
      setSuggestions(res.data.features);
    } catch (err) {
      console.error("Geoapify error:", err);
    }
  };

  const handleSelectAddress = (place) => {
    const formatted = place.properties.formatted;
    const lat = place.geometry.coordinates[1];
    const lon = place.geometry.coordinates[0];

    setFormData({ ...formData, address: formatted, latitude: lat, longitude: lon });
    setSuggestions([]);

    // // Optional: Open in Google Maps
    // window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");
  };


    return (
         <form
            onSubmit={handleUpdate}
            className="flex flex-col p-4 gap-6 md:p-6 lg:p-8 max-w-[1200px] mx-auto"
        >


            <div className="flex flex-col gap-4">
                {/* <div className="flex items-center text-xs gap-1 text-[#6C6C6C]">
                    <p>Dashboard</p>
                    <span className="mx-1 text-[#9A9A9A]">/</span>
                    <p>Riders</p>
                    <span className="mx-1 text-[#9A9A9A]">/</span>
                    <p className="text-[#F77F00]">Update Rider</p>
                </div> */}
                <Breadcrumb
            items={[
              { label: "Dashboard", path: "/" },
              { label: "Riders", path: "/riders" },

              { label: "Update Rider" },
            ]}
          />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                    <div className="flex flex-col gap-2.5">
                        <div className="flex gap-3 items-center">
                            <Link to="/riders" className="group">
                                <img
                                    src={backward}
                                    alt="backward"
                                    className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
                                />
                            </Link>

                            <span className="text-2xl fw6 font-roboto text-[#232323]">
                                Update Rider
                            </span>
                        </div>
                        <p className="text-sm fw4 text-[#232323]">
                            Update delivery riders who handle pickup & drop-off.
                        </p>
                    </div>

                    <div className="flex gap-2 flex-wrap md:flex-nowrap justify-end self-end">
                        <button
                            type="button"
                            onClick={() => navigate("/riders")}
                            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg p-3 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="border border-[#F77F00] rounded-lg px-4 py-3 text-xs bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div
                className="p-6 flex flex-col gap-6 rounded-lg bg-white "
                style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
            >

                <div>
                    <h2 className="text-lg text-[#232323] fw6 leading-[150%] tracking-[-3%] ">
                        Personal Information
                    </h2>

                    <div className="flex gap-4 md:mt-4">
                        <img
                            src={profileImage}
                            alt="Par_Profile"
                            className="w-18 h-18 rounded-[10px]"
                        />

                        <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-2 w-full">
                            <input
                                type="file"
                                name="profileImage"
                                id="profileImage"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "profile")}
                            />
                            <label
                                htmlFor="profileImage"
                                className="border border-[#F77F00] text-center bg-[#F77F00] rounded-lg p-3 text-xs text-[#FEF2E6] cursor-pointer hover:bg-orange hover:text-white"
                            >
                                Upload new picture
                            </label>
                            <button
                                type="button"
                                className="border border-[#F77F00] rounded-lg p-3 text-xs bg-[#FEF2E6] text-[#F77F00]"
                                onClick={() => handleDelete("profile")}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                placeholder=" "
                            />
                            <label
                                htmlFor="first_name"
                                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                First Name
                            </label>
                        </div>
                        {errors.first_name && (
                            <p className="text-red-500 text-xs mt-1 ms-2">{errors.first_name[0]}</p>
                        )}
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                placeholder=" "
                            />
                            <label
                                htmlFor="last_name"
                                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                Last Name
                            </label>
                        </div>
                        {errors.last_name && (
                            <p className="text-red-500 text-xs mt-1 ms-2">{errors.last_name[0]}</p>
                        )}
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                placeholder=" "
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                Email
                            </label>
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 ms-2">{errors.email[0]}</p>
                        )}
                    </div>
                    <div>

                        <div className="relative">
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                placeholder=" "
                            />
                            <label
                                htmlFor="phone"
                                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                Phone Number
                            </label>
                        </div>
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1 ms-2">{errors.phone[0]}</p>
                        )}
                    </div>
                    <div>

                        <div className="relative">
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleAddressChange}
                                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                placeholder=" "
                            />
                            <label htmlFor="address" className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                                Address
                            </label>

                             {suggestions.length > 0 && (
                    <ul className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-md mt-1 w-full max-h-48 overflow-y-auto">
                      {suggestions.map((s, i) => (
                        <li
                          key={i}
                          onClick={() => handleSelectAddress(s)}
                          className="px-3 py-2 hover:bg-orange-100 cursor-pointer text-sm"
                        >
                          {s.properties.formatted}
                        </li>
                      ))}
                    </ul>
                  )}

                        </div>
                        {errors.address && (
                            <p className="text-red-500 text-xs mt-1 ms-2">{errors.address[0]}</p>
                        )}
                    </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Latitude */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="latitude"
                                        name="latitude"
                                        value={formData.latitude}
                                        disabled
                                        placeholder="Address latitude"
                                        className="block p-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9]"
                                    />
                                    <label
                                        htmlFor="latitude"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Latitude
                                    </label>
                                </div>

                                {/* Longitude */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="longitude"
                                        name="longitude"
                                        value={formData.longitude}
                                        disabled
                                        placeholder="Address longitude"
                                        className="block p-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9]"
                                    />
                                    <label
                                        htmlFor="longitude"
                                        className="absolute text-sm ms-4 text-gray-500 -translate-y-4 scale-75 top-2 z-10 bg-white px-2"
                                    >
                                        Longitude
                                    </label>
                                </div>
                            </div>
                            
                    <div>


                        <div className="relative">
                            <input
                                type="date"
                                id="insurance_expire_date"
                                name="insurance_expire_date"
                                value={formData.insurance_expire_date}
                                onChange={handleChange}
                                className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                            />
                            <label
                                htmlFor="insurance_expire_date"
                                className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                            >
                                Insurance Expire Date
                            </label>
                        </div>
                        {errors.insurance_expire_date && (
                            <p className="text-red-500 text-xs mt-1 ms-2">{errors.insurance_expire_date[0]}</p>
                        )}
                    </div>
                    <div>
                    </div>
                </div>

                <div
                    className="p-6 flex flex-col gap-6 rounded-lg bg-white"
                    style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
                >
                    <h2 className="text-lg text-[#232323] fw6">Work Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="relative">

                                <Dropdown
                                    label="Select Assigned Region"
                                    options={["Brooklyn", "Queens", "Manhattan"]}
                                    multiple={true}
                                    value={formData.assigned_region}
                                    onChange={(val) =>
                                        setFormData((prev) => ({ ...prev, assigned_region: val }))
                                    }
                                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer appearance-none focus:outline-none"
                                    dropdownClass="w-full"
                                />
                                <label
                                    htmlFor="assigned_region"
                                    className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Assigned Region
                                </label>
                            </div>
                            {errors.assigned_region && (
                                <p className="text-red-500 text-xs mt-1 ms-2">{errors.assigned_region[0]}</p>
                            )}
                        </div>
                        <div>

                            <div className="relative">
                                <Dropdown
                                    label="Select Vehicle Type"
                                    options={["Bike", "Car", "Scooter", "Van"]}
                                    multiple={false}
                                    value={formData.vehicle_type}
                                    onChange={(val) =>
                                        setFormData((prev) => ({ ...prev, vehicle_type: val }))
                                    }
                                    dropdownClass="w-full"
                                />
                                <label
                                    htmlFor="vehicle_type"
                                    className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    Vehicle Type
                                </label>
                            </div>
                            {errors.vehicle_type && (
                                <p className="text-red-500 text-xs mt-1 ms-2">{errors.vehicle_type[0]}</p>
                            )}
                        </div>
                        <div>

                            <div className="relative">
                                <input
                                    type="text"
                                    id="vehicle_name"
                                    name="vehicle_name"
                                    value={formData.vehicle_name}
                                    onChange={handleChange}
                                    className="block p-4 pt-4 w-full text-sm text-[#121212] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                    placeholder=" "
                                />
                                <label htmlFor="vehicle_name" className="absolute text-sm ms-4 text-[#232323]  duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4">
                                    Vehicle Name
                                </label>
                            </div>
                            {errors.vehicle_name && (
                                <p className="text-red-500 text-xs mt-1 ms-2">{errors.vehicle_name[0]}</p>
                            )}
                        </div>
                        <div>

                            <div className="relative">
                                <input
                                    type="text"
                                    id="license_plate"
                                    name="license_plate"
                                    value={formData.license_plate}
                                    onChange={handleChange}
                                    className="block p-4 pt-4 w-full text-sm text-[#232323] bg-transparent rounded-xl border border-[#D9D9D9] peer focus:outline-none"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="license_plate"
                                    className="absolute text-sm ms-4 text-[#232323] duration-300 transform -translate-y-4 scale-75 top-2 bg-white px-2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                                >
                                    License Plate
                                </label>
                            </div>
                            {errors.license_plate && (
                                <p className="text-red-500 text-xs mt-1 ms-2">{errors.license_plate[0]}</p>
                            )}
                        </div>
                        {/* <div>
                        </div> */}
                    </div>
                </div>

                <div
                    className="p-6 flex flex-col gap-6 rounded-lg bg-white"
                    style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
                >
                    <h1 className="text-lg text-[#232323] fw6">License</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                            onClick={() => document.getElementById("licenseFront").click()}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="licenseFront"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "license", "front")}
                            />
                            {licenseImages.front ? (
                                <div className="relative w-full">
                                    <img
                                        src={
                                            licenseImages.front instanceof File
                                                ? URL.createObjectURL(licenseImages.front)
                                                : licenseImages.front
                                        }
                                        alt="License Front"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLicenseImages((prev) => ({ ...prev, front: null }));
                                        }}
                                    >
                                        <FaTimes className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (

                                <div className="cursor-pointer flex flex-col items-center">
                                    <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                                    <p className="text-base fw6 text-[#6C6C6C]">
                                        Upload license Front image.
                                    </p>
                                    <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                                </div>
                            )}
                        </div>


                        <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center cursor-pointer"
                            onClick={() => document.getElementById("licenseBack").click()}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                id="licenseBack"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "license", "back")}
                            />
                            {licenseImages.back ? (
                                <div className="relative w-full">
                                    <img
                                        src={
                                            licenseImages.back instanceof File
                                                ? URL.createObjectURL(licenseImages.back)
                                                : licenseImages.back
                                        }
                                        alt="License Back"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        className="absolute -top-4 -right-4 bg-[#F77F00]/80 text-white text-xs rounded-full w-10 h-10 flex items-center justify-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLicenseImages((prev) => ({ ...prev, back: null }));
                                        }}
                                    >
                                        <FaTimes className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (
                                // <p className="text-sm text-gray-500">Upload License Back</p>
                                <div className="cursor-pointer flex flex-col items-center">
                                    <img src={Upload} alt="" className="w-8 h-8 mb-2" />
                                    <p className="text-base fw6 text-[#6C6C6C]">
                                        Upload license Back image.
                                    </p>
                                    <p className="text-xs text-[#9A9A9A]">Only PNG, JPG allowed.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </form>
    );
};
export default UpdateRider;
