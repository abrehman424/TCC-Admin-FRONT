import React, { useState, useMemo } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import ApprovedProducts from "./ApprovedProducts";
import PendingProducts from "./PendingProducts";
import Pagination from "../../components/Pagination";
import productsData from "../../data/ProductsData";
import { useProducts } from "../../hooks/useProducts";
import Breadcrumb from "../../components/Breadcrumb";

const Products = () => {


  const { data: products = { approved: [], suspended: [], pending: [] }, isLoading, isError } = useProducts();

  const [activeTab, setActiveTab] = useState("approved");
  const [search, setSearch] = useState("");
  const [pageApproved, setPageApproved] = useState(1);
  const [pagePending, setPagePending] = useState(1);
  const [pageSuspended, setPageSuspended] = useState(1);
  const [perPageApproved, setPerPageApproved] = useState(10);
  const [perPagePending, setPerPagePending] = useState(10);
  const [perPageSuspended, setPerPageSuspended] = useState(10);


  const [openActionId, setOpenActionId] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


  const currentData = Array.isArray(products?.[activeTab]) ? products[activeTab] : [];


  const page =
    activeTab === "approved"
      ? pageApproved
      : activeTab === "pending"
        ? pagePending
        : pageSuspended;

  const perPage =
    activeTab === "approved"
      ? perPageApproved
      : activeTab === "pending"
        ? perPagePending
        : perPageSuspended;

  const setPage =
    activeTab === "approved"
      ? setPageApproved
      : activeTab === "pending"
        ? setPagePending
        : setPageSuspended;

  const setPerPage =
    activeTab === "approved"
      ? setPerPageApproved
      : activeTab === "pending"
        ? setPerPagePending
        : setPerPageSuspended;

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(currentData)) {
      return [];
    }
    return currentData.filter((p) => {
      const name = p.name?.toLowerCase() || p.productName?.toLowerCase() || "";
      const partner = p.partner?.business_name?.toLowerCase() || p.partnerName?.toLowerCase() || "";
      return (
        name.includes(search.toLowerCase()) ||
        partner.includes(search.toLowerCase())
      );
    });
  }, [currentData, search]);


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = useMemo(() => {
    if (!Array.isArray(filteredProducts)) {
      return [];
    }
    let sorted = [...filteredProducts];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        let valA = a[sortConfig.key] ?? "";
        let valB = b[sortConfig.key] ?? "";


        if (!isNaN(valA) && !isNaN(valB)) {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }

        if (sortConfig.key === "created_at") {
          return sortConfig.direction === "asc"
            ? new Date(valA) - new Date(valB)
            : new Date(valB) - new Date(valA);
        }


        return sortConfig.direction === "asc"
          ? valA.toString().localeCompare(valB)
          : valB.toString().localeCompare(valA);
      });
    }
    return sorted;
  }, [filteredProducts, sortConfig]);

  const paginatedProducts = useMemo(() => {
    if (!Array.isArray(sortedProducts)) {
      return [];
    }
    const start = (page - 1) * perPage;
    return sortedProducts.slice(start, start + perPage);
  }, [sortedProducts, page, perPage]);



  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center text-xs gap-1">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className="mx-2 text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Products</p>
        </div> */}
         <Breadcrumb
                    items={[
                      { label: "Dashboard", path: "/" },
                     
                      { label: "Products" },
                    ]}
                  />
        <div>
          <h2 className="text-2xl font-semibold text-[#232323]">Products</h2>
          <p className="text-[#232323] text-sm">
            View and manage all products in the platform.
          </p>
        </div>
      </div>

      <div className="flex gap-4 bg-[#FEECD9] rounded-lg p-2 w-fit">
        
        <button
          onClick={() => setActiveTab("approved")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "approved"
            ? "bg-orange text-white shadow"
            : "text-gray-600"
            }`}
        >
          Approved ({Array.isArray(products.approved) ? products.approved.length : 0})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "pending"
            ? "bg-orange text-white shadow"
            : "text-gray-600"
            }`}
        >
          Pending ({Array.isArray(products.pending) ? products.pending.length : 0})
        </button>
        <button
          onClick={() => setActiveTab("suspended")}
          className={`px-3 py-1.5 rounded-md text-sm fw5 transition ${activeTab === "suspended"
            ? "bg-orange text-white shadow"
            : "text-gray-600"
            }`}
        >
          Suspended ({Array.isArray(products.suspended) ? products.suspended.length : 0})
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border-color p-3 overflow-x-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <div className="relative text-[#9A9A9A]">
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
              className="pl-9 pr-2 px-4 py-2 border border-gray-300 rounded-xl text- sm:w-[260px]  md:w-[320px] focus:outline-none"
            />
          </div>

        </div>

         {isLoading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>


            <p className="text-orange-500 fw5 flex items-center">
              Loading Products
              <span className="flex space-x-1 ml-1 text-2xl font-bold leading-none">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
              </span>
            </p>


          </div>
        ) : activeTab === "approved" ? (
          <ApprovedProducts
            paginatedProducts={paginatedProducts}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
            handleSort={handleSort}
            sortConfig={sortConfig}
            
          />
        ) : activeTab === "suspended" ? (
          <ApprovedProducts
            paginatedProducts={paginatedProducts}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
            handleSort={handleSort}
            sortConfig={sortConfig}
          />
        ) : (
          <ApprovedProducts
            paginatedProducts={paginatedProducts}
            openActionId={openActionId}
            setOpenActionId={setOpenActionId}
            handleSort={handleSort}
            sortConfig={sortConfig}
          />
        )}

        {paginatedProducts.length > 0 && (

          
          <Pagination
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalItems={filteredProducts.length}
          options={[5, 10, 25, 50]}
          fullWidth={true}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
