import React, { useState, useEffect, useMemo, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate, Link, useParams } from "react-router-dom";
import ridersData from "../../data/RidersData";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Rating from "../../assets/SVG/rating.svg";
import backward from "../../assets/SVG/backward.svg";
import { useRiders } from "../../hooks/useRiders";
import Pagination from "../../components/Pagination";
import API from "../../services/api";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb";

const AssignRider = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data: riders = [], isLoading, isError } = useRiders();

  const statusRef = useRef(null);

  const [filteredRiders, setFilteredRiders] = useState([]);
  const [selected, setSelected] = useState(null);

  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const statusColors = {
    Online: "bg-[#E7F7ED] text-[#088B3A]",
    Offline: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  useEffect(() => {
    if (!riders || riders.length === 0) return;
    let temp = [...riders];

    if (status !== "Status") {
      temp = temp.filter(
        (r) => r.availability_status.toLowerCase() === status.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.phone.includes(searchTerm)
      );
    }

    setFilteredRiders(temp);
    setPage(1);
  }, [searchTerm, status, riders]);

  const totalPages = Math.ceil(filteredRiders.length / perPage);
  const paginatedRiders = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredRiders.slice(start, start + perPage);
  }, [filteredRiders, page, perPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedRiders.map((r) => r.id));
    } else {
      setSelected(null);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(selected === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAssign = async () => {
    if (!selected) {
      alert("Please select a rider");
      return;
    }

    console.log("Assigning rider:", selected, "to order:", id);

    try {
      await API.post("/orders/assign-rider", {
        order_id: id,
        rider_id: selected,
      });

      toast.success("Rider assigned successfully");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Failed to assign rider");
    }
  };

  return (
    <div className="gap-6 p-2">
      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center text-xs leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#6C6C6C]">Orders </p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]"> Assign Order</p>
        </div> */}
        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/" },
            { label: "Orders", path: "/orders" },

            { label: "Assign Rider" },
          ]}
        />
        <div className="flex gap-3 items-center">
          <Link to="/orders" className="group">
            <img
              src={backward}
              alt="backward"
              className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
            />
          </Link>
          <span className="text-2xl fw6 font-roboto text-[#232323]">
            Select Rider
          </span>
        </div>
      </div>

      <div className="bg-[#FFFFFF] rounded-lg border-color p-6 gap-6 ">
        <div className="flex  md:flex-row md:items-center items-center justify-between  gap-4">
          <div className="relative text-[#9A9A9A] w-full md:w-[320px] px-4 py-2 gap-3 text-xs leading-[150%] tracking-[-3%]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-6 md:pl-6">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search riders..."
              className="pl-8 md:pl-8 pr-2 px-4 py-2 border border-[#D9D9D9] rounded-xl text-base w-full md:w-[320px] focus:outline-none focus:border-[#D9D9D9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative mt-2 md:mt-0" ref={statusRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-0.5 text-xs text-[#9A9A9A] min-w-[79px] h-[36px]"
            >
              {status}
              <FiChevronDown size={12} />
            </button>
            {statusOpen && (
              <div className="absolute bg-white border-color rounded-lg shadow-lg w-28 z-20">
                {["Online", "Offline"].map((s) => (
                  <p
                    key={s}
                    className="px-4 py-2 hover:bg-[#FEF2E6] cursor-pointer text-sm"
                    onClick={() => {
                      setStatus(s);
                      setStatusOpen(false);
                    }}
                  >
                    {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto hidden">
          <table className="w-full  rounded-t-lg ">
            <thead className="">
              <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left"></th>
                <th className="px-4 py-3 text-left">Rider ID</th>
                <th className="px-4 py-3 text-left">Rider Name</th>
                <th className="px-4 py-3 text-left">Rating</th>
                <th className="px-4 py-3 text-left">Current Order</th>
                <th className="px-4 py-3 text-left">ETA</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRiders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No riders found.
                  </td>
                </tr>
              ) : (
                paginatedRiders.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => handleSelectOne(r.id)}
                    className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] cursor-pointer transition-colors"
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-lg cursor-pointer"
                        checked={selected === r.id}
                        onChange={() => handleSelectOne(r.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-3">{r.id}</td>
                    <td className="px-4 py-3 flex gap-2.5 items-center">
                      <img
                        src={r.profile_photo || DefaultProfile}
                        alt="Rider"
                        className="w-6 h-6 rounded-xl object-cover object-center"
                      />
                      <div>
                        <p className="text-[#4F4F4F] text-sm">{r.name}</p>
                        <p className="text-[#6C6C6C] text-xs">{r.email}</p>
                      </div>
                    </td>
                    <td className="px-2.5 py-4 items-center gap-1.5">
                      <span className="flex gap-1.5">
                        <img src={Rating} alt="" />
                        {r.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#232323]">
                      {r.current_assigned_orders}
                    </td>
                    <td className="px-4 py-3 text-[#232323] ">{r.eta}</td>
                    <td className="px-4 py-3 text-[#232323]">
                      <span
                        className={`px-3 py-1 rounded-md text-xs fw5 ${
                          statusColors[r.availability_status] || ""
                        }`}
                      >
                        {r.availability_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="block md:hidden py-3 space-y-4">
          {paginatedRiders.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-lg border-color p-4 cursor-pointer flex flex-col gap-2"
              onClick={() => handleSelectOne(r.id)}
            >
              <div className="flex justify-between  ">
                <div className="flex  gap-3 items-center text-sm">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[1.5px] border-[#9A9A9A]"
                    checked={selected === r.id}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectOne(r.id);
                    }}
                  />
                  <div className="flex gap-2 fw4">
                    <p className="fw5 text-orange text-sm">Rider ID:</p> {r.id}
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-md text-xs fw5 ${
                      statusColors[r.availability_status] || ""
                    }`}
                  >
                    {r.availability_status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={r.profile_photo || DefaultProfile}
                  alt="Rider"
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-sm fw5">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 ">
                <div className="flex gap-2 text-xs">
                  <p className="text-sm flex items-center gap-1">
                    Rating:
                    <img src={Rating} alt="" /> {r.rating}
                  </p>
                </div>

                <div className="flex gap-2 text-sm">
                  <p>Current Order:</p>
                  {r.current_assigned_orders}
                </div>
                <div className="flex gap-2 text-sm">
                  <p>ETA: </p> {r.eta}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredRiders.length}
          fullWidth={true}
        />
      </div>

      <div className="relative bottom-0 left-0 right-0 bg-[#FFFFFF] px-6 py-6 flex  md:flex-row gap-3 justify-end">
        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
        >
          Cancel
        </button>
        <button
          onClick={handleAssign}
          className="px-4 py-3 text-sm border border-[#F77F00] bg-[#FEF2E6] text-[#F77F00] rounded-lg hover:bg-[#F77F00] hover:text-[#FFFFFF]"
        >
          Assign
        </button>
      </div>
    </div>
  );
};

export default AssignRider;
