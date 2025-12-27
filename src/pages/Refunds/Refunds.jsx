import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiMoreHorizontal,
} from "react-icons/fi";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import Pagination from "../../components/Pagination";
import { useRefunds } from "../../hooks/useRefund";
import Breadcrumb from "../../components/Breadcrumb";

const Refunds = () => {
  const navigate = useNavigate();
  const statusRef = useRef(null);
  const actionRefs = useRef({});
  const { data: refunds = [], isLoading } = useRefunds();

  // Ensure refunds is always an array
  const safeRefunds = Array.isArray(refunds) ? refunds : [];

  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openActionId, setOpenActionId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const statusColors = {
    Pending: "bg-[#E1FDFD] text-[#3E77B0]",
    Processed: "bg-[#E7F7ED] text-[#088B3A]",
    Rejected: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
      if (
        openActionId &&
        actionRefs.current[openActionId] &&
        !actionRefs.current[openActionId].contains(event.target)
      ) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openActionId]);

  useEffect(() => {
    // Ensure refunds is an array before processing
    if (!Array.isArray(safeRefunds)) {
      setFilteredRefunds([]);
      return;
    }

    let temp = [...safeRefunds];

    if (status !== "Status") {
      temp = temp.filter(
        (r) => r?.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (searchTerm.trim() !== "") {
      temp = temp.filter(
        (r) =>
          r?.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          r?.order_id
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r?.order?.traveler?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r?.order?.partner?.business_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r?.refund_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      temp.sort((a, b) => {
        // Handle nested keys like "order.traveler_name"
        const keys = sortConfig.key.split(".");
        let valA = a;
        let valB = b;

        for (const key of keys) {
          valA = valA?.[key];
          valB = valB?.[key];
        }

        valA = (valA || "").toString().toLowerCase();
        valB = (valB || "").toString().toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredRefunds(temp);

    // Only reset page when filters change, not on every render
    if (searchTerm || status !== "Status") {
      setPage(1);
    }
  }, [searchTerm, status, sortConfig, safeRefunds]); // Use safeRefunds to prevent infinite loop

  const paginatedRefunds = useMemo(() => {
    if (!Array.isArray(filteredRefunds)) {
      return [];
    }
    const start = (page - 1) * perPage;
    return filteredRefunds.slice(start, start + perPage);
  }, [filteredRefunds, page, perPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedRefunds.map((r) => r.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1 text-xs">
      <FiArrowUp
        className={
          sortConfig.key === key && sortConfig.direction === "asc"
            ? "text-[#F77F00]"
            : "text-gray-400"
        }
      />
      <FiArrowDown
        className={
          sortConfig.key === key && sortConfig.direction === "desc"
            ? "text-[#F77F00]"
            : "text-gray-400"
        }
      />
    </span>
  );

  return (
    <div className="gap-6 p-2">
      <Breadcrumb
        items={[{ label: "Dashboard", path: "/" }, { label: "Refunds" }]}
      />
      <div className="bg-white rounded-lg border-color p-4 md:p-6  mt-4">
        <div className="flex f md:flex-row  md:items-center justify-between py-4 items-center  gap-4">
          <div className="relative w-full md:w-[320px] ">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search refunds..."
              className="pl-8 pr-2 px-4 py-2 border border-gray-300 rounded-xl w-full md:w-[320px] focus:outline-none focus:border-[#D9D9D9]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative md:mt-0" ref={statusRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center justify-between border border-[#23232333] rounded-md px-3 py-1 gap-2 text-xs text-[#9A9A9A] h-[36px]"
            >
              {status}
              <FiChevronDown size={12} />
            </button>
            {statusOpen && (
              <div className="absolute mt-1 bg-white border-color rounded-lg shadow-lg w-28 z-20">
                {["Pending", "Processed", "Rejected"].map((s) => (
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

        <div className="hidden md:block overflow-x-auto  min-h-[200px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9] text-sm uppercase text-[#6C6C6C]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-lg"
                    onChange={handleSelectAll}
                    checked={
                      selected.length === paginatedRefunds.length &&
                      paginatedRefunds.length > 0
                    }
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("refund_id")}
                >
                  Refund ID {renderSortIcon("refund_id")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  Order ID {renderSortIcon("id")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("order.traveler_name")}
                >
                  Traveler Name {renderSortIcon("order.traveler_name")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("order.partner_name")}
                >
                  Partner Name {renderSortIcon("order.partner_name")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("requested_at")}
                >
                  Date {renderSortIcon("requested_at")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status {renderSortIcon("status")}
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer"
                  onClick={() => handleSort("amount")}
                >
                  Total {renderSortIcon("amount")}
                </th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10">
                    <div className="flex flex-col justify-center items-center h-40 gap-2">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>

                      <p className="text-orange-500 fw5 flex items-center">
                        Loading Refunds
                        <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
                          <span className="animate-bounce">.</span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          >
                            .
                          </span>
                          <span
                            className="animate-bounce"
                            style={{ animationDelay: "0.4s" }}
                          >
                            .
                          </span>
                        </span>
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRefunds.length === 0 ? (
                <tr>
                  <td colSpan={9} className="h-[200px]">
                    <div className="flex flex-col items-center justify-center h-full text-centerp-6">
                      <p className="text-orange-500 font-semibold text-lg">
                        No refunds found.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting filters or check back later.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRefunds.map((r, index) => {
                  const isNearBottom = index >= paginatedRefunds.length - 2;
                  return (
                    <tr
                      key={r.id}
                      className="text-sm bg-[#FFFFFF] hover:bg-[#FEF2E6] transition-colors cursor-pointer"
                      onClick={() => navigate(`/refund/refundsdetail/${r.id}`)}
                    >
                      <td
                        className="px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded-lg"
                          checked={selected.includes(r.id)}
                          onChange={() => handleSelectOne(r.id)}
                        />
                      </td>
                      <td className="px-4 py-3">{r.refund_id}</td>
                      <td className="px-4 py-3">#{r.id}</td>
                      <td className="px-4 py-3">{r.order?.traveler_name}</td>
                      <td className="px-4 py-3">{r.order?.partner_name}</td>
                      <td className="px-4 py-3">{r.requested_at}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            statusColors[r.status] || ""
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">${r.amount}</td>
                      <td
                        className="px-4 py-3 relative text-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="p-1.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00]"
                          onClick={() =>
                            setOpenActionId(openActionId === r.id ? null : r.id)
                          }
                        >
                          <FiMoreHorizontal size={20} />
                        </button>
                        {openActionId === r.id && (
                          <div
                            className={`absolute w-[140px] bg-white rounded-md z-5 ${
                              isNearBottom ? "bottom-full" : "top-full"
                            } right-4`}
                            style={{ boxShadow: "0px 0px 3px 0px #00000033" }}
                          >
                            <button
                              className="px-4 py-2 hover:bg-[#FEF2E6] w-full text-left text-sm"
                              onClick={() =>
                                navigate(`/refund/refundsdetail/${r.id}`)
                              }
                            >
                              View Detail
                            </button>
                            {/* <button
                              className="px-4 py-2 gap-2.5 hover:bg-[#FEF2E6] w-full text-left text-sm"
                              onClick={() => navigate(`/support/chatsupport`)}
                            >
                              Chat Support
                            </button> */}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="block md:hidden space-y-4">
          {paginatedRefunds.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-lg border-color p-4 flex flex-col gap-2 cursor-pointer"
              
            >
              <div className="flex  items-center justify-between">
                <div className="flex gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[1.5px] border-gray-400"
                    checked={selected.includes(r.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectOne(r.id);
                    }}
                  />
                  <div className="flex gap-2" onClick={() => navigate(`/refund/refundsdetail/${r.id}`)}>
                    <p className="fw5"> ID:</p> {r.refund_id}
                    </div>
                </div>
                    <div >
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          statusColors[r.status] || ""
                        }`}
                      >
                        {r.status}
                      </span>
                </div>
              </div>
              <div className="flex gap-2 text-sm" onClick={() => navigate(`/refund/refundsdetail/${r.id}`)}>
                 <p className="fw5">Traveler: </p> {r.order?.traveler_name}
                 </div>
                 <div className="flex gap-2 text-sm">
              <p className="fw5">Partner: </p> {r.order?.partner_name}
                 </div>
              
              <div className="grid grid-cols-2 " onClick={() => navigate(`/refund/refundsdetail/${r.id}`)}>
                <div className="flex gap-2 text-sm">
                <p className="fw5">Order: </p> #{r.id}
                </div>
                <div className="flex gap-2 text-sm">
              <p className="fw5">Total: </p> ${r.amount}
              </div>
              </div>
              <div className="flex gap-2 text-sm" onClick={() => navigate(`/refund/refundsdetail/${r.id}`)}>
                <p className="fw5">Date:</p> {r.requested_at}
              </div>
            </div>
          ))}
        </div>

        {paginatedRefunds.length > 0 && (
          <Pagination
            page={page}
            setPage={setPage}
            perPage={perPage}
            setPerPage={setPerPage}
            totalItems={filteredRefunds.length}
            options={[5, 10, 25, 50]}
            fullWidth={true}
          />
        )}
      </div>
    </div>
  );
};

export default Refunds;
