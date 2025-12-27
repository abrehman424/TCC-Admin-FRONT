import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import RiderTabs from "./RiderProfile/RiderTab";
import Details from "./RiderProfile/Details";
import Orders from "../../components/Orders";
import backward from "../../assets/SVG/backward.svg";
import { getRiderById } from "../../services/riderService";
import { useStatusUpdateRider } from "../../hooks/useRiders";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb";

const RiderProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [rider, setRider] = useState(null);

  const { mutate: statusUpdate } = useStatusUpdateRider();

  const fetchRider = async () => {
    try {
      const res = await getRiderById(id);
      setRider(res.data.data);
    } catch (error) {
      console.error("Error fetching rider data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRider();
    }
  }, [id]);

  if (!rider)
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-2">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-orange-500 fw5 flex items-center">
          Loading Riders
          <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
          </span>
        </p>
      </div>
    );

  const handleRiderStatus = (rider) => {
    const newStatus = rider.status === "Active" ? "suspended" : "active";

    statusUpdate(
      { id: rider.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Rider ${newStatus === "active" ? "suspended" : "active"} successfully!`
          );
          fetchRider();
        },
        onError: () => {
          toast.error("Failed to update rider status");
        },
      }
    );
  };

  return (
    <div className="flex flex-col p-3 gap-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Riders", path: "/riders" },
          { label: "Details" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link to="/riders" className="group">
              <img
                src={backward}
                alt="backward"
                className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
              />
            </Link>
            <h1 className="text-2xl font-roboto fw6 text-[#232323] truncate">
              Rider Details
            </h1>
          </div>
          <p className="text-sm text-[#6C6C6C]">
            Detailed profile, activity, and preferences of the Rider.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => handleRiderStatus(rider)}
            className={`border rounded-lg px-4 py-2 text-sm transition ${
              rider?.status === "Active"
                ? "border-[#F77F00] bg-[#FEF2E6] text-[#F77F00]"
                : "border-green-600 bg-green-50 text-green-600"
            }`}
          >
            {rider?.status === "Active" ? "Suspended" : "Active"}
          </button>
          <Link
            to={`/riders/update-rider/${id}`}
            className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg px-4 py-2 text-sm text-[#F77F00] hover:bg-[#F77F00] hover:text-white transition truncate text-center"
          >
            Edit Partner Information
          </Link>
        </div>
      </div>

      <RiderTabs activeTab={activeTab} setActiveTab={setActiveTab} rider={rider} />

      <div className="overflow-x-auto">
        {activeTab === "details" && <Details rider={rider} />}
        {activeTab === "orders" && <Orders order={rider} />}
      </div>
    </div>
  );
};

export default RiderProfile;
