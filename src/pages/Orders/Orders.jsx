import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import AssignedOrders from "./AssignedOrders";
import PendingOrders from "./PendingOrders";
import Pagination from "../../components/Pagination";
import { useOrders } from "../../hooks/useOrder";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const Orders = () => {
  const { data: orders = { pending: [], approved: [] }, isLoading, isError } = useOrders();
const location = useLocation();
  
    const [activeTab, setActiveTab] = useState(() => {
   
    return location.state?.activeTab || "assigned";
  });
  const [search, setSearch] = useState("");
  const [pagePending, setPagePending] = useState(1);
  const [pageAssigned, setPageAssigned] = useState(1);
  const [perPagePending, setPerPagePending] = useState(10);
  const [perPageAssigned, setPerPageAssigned] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


  const getValueByPath = (obj, path) =>
    path.split(".").reduce((acc, part) => acc && acc[part], obj);

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

  // Data selection - ensure arrays are always available
  const data = useMemo(() => {
    if (activeTab === "pending") {
      return Array.isArray(orders?.pending) ? orders.pending : [];
    }
    return Array.isArray(orders?.approved) ? orders.approved : [];
  }, [activeTab, orders]);
  const page = activeTab === "pending" ? pagePending : pageAssigned;
  const perPage = activeTab === "pending" ? perPagePending : perPageAssigned;
  const setPage = activeTab === "pending" ? setPagePending : setPageAssigned;
  const setPerPage = activeTab === "pending" ? setPerPagePending : setPerPageAssigned;

  // Filter
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((o) => {
      const orderId = o?.order_id || o?.id || "";
      const travelerName = o?.traveler_name || o?.traveler?.name || "";
      const partnerName = o?.partner_name || o?.partner?.business_name || o?.partner?.name || "";
      const riderName = o?.rider_name || o?.rider?.name || "";
      const searchText = `${orderId} ${travelerName} ${partnerName} ${riderName}`.toLowerCase();
      return searchText.includes(search.toLowerCase());
    });
  }, [data, search]);


  const sortedOrders = useMemo(() => {
    if (!Array.isArray(filteredOrders)) {
      return [];
    }
    if (!sortConfig.key) return filteredOrders;
    return [...filteredOrders].sort((a, b) => {
      const aValue = getValueByPath(a, sortConfig.key)?.toString().toLowerCase() || "";
      const bValue = getValueByPath(b, sortConfig.key)?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortConfig]);


  const paginatedOrders = useMemo(() => {
    if (!Array.isArray(sortedOrders)) {
      return [];
    }
    const start = (page - 1) * perPage;
    return sortedOrders.slice(start, start + perPage);
  }, [sortedOrders, page, perPage]);

 return (
  <div className="flex flex-col gap-6 p-3 sm:p-4 lg:p-6">

    <div className="flex flex-col gap-4">
      <Breadcrumb
        items={[
          { label: "Dashboard", path: "/" },
          { label: "Orders" },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="gap-2">
          <h2 className="text-xl sm:text-2xl fw6 font-roboto text-[#232323]">
            Orders
          </h2>
          <p className="text-[#232323] text-sm">
            View and manage all orders in the platform.
          </p>
        </div>
      </div>
    </div>

    {/* Tabs – like Products */}
    <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-full sm:w-fit overflow-x-auto whitespace-nowrap">
      <button
        onClick={() => setActiveTab("assigned")}
        className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${
          activeTab === "assigned"
            ? "bg-orange text-white shadow"
            : "text-gray-600"
        }`}
      >
        Assigned ({Array.isArray(orders?.approved) ? orders.approved.length : 0})
      </button>

      <button
        onClick={() => setActiveTab("pending")}
        className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${
          activeTab === "pending"
            ? "bg-orange text-white shadow"
            : "text-gray-600"
        }`}
      >
        Pending ({Array.isArray(orders?.pending) ? orders.pending.length : 0})
      </button>
    </div>

    <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">

      <div className="flex  md:flex-row md:items-center justify-between gap-4 p-2">
        <div className="relative text-[#9A9A9A] w-full sm:w-[320px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-5">
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-2 px-4 py-2 border border-[#D9D9D9] bg-white rounded-lg w-full focus:outline-none"
          />
        </div>

        <button className="flex items-center justify-center md:justify-start border border-[#23232333] rounded-lg px-3 py-1 text-sm text-[#9A9A9A] gap-2 h-[42px]">
          Status <FiChevronDown size={16} />
        </button>
      </div>

      {/* Loader / Tables */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-40 gap-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>

          <p className="text-orange-500 fw5 flex items-center">
            Loading Orders
            <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
            </span>
          </p>
        </div>
      ) : activeTab === "pending" ? (
        <PendingOrders
          orders={paginatedOrders}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      ) : (
        <AssignedOrders
          orders={paginatedOrders}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      )}

      <Pagination
        page={page}
        setPage={setPage}
        perPage={perPage}
        setPerPage={setPerPage}
        totalItems={filteredOrders.length}
        options={[5, 10, 25, 50]}
        fullWidth={true}
      />
    </div>
  </div>
);

};

export default Orders;
