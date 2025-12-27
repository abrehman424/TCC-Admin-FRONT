import React, { useState } from "react";
import { FiArrowDown, FiArrowUp, FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProductReqInfo from "../../components/Dialogs/ProductReqInfo";
import ActionMenu from "../../components/Partners/ActionMenu";
import { useStatusUpdateProduct } from "../../hooks/useProducts";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import productImg from "../../assets/Images/Pro_img.jpg";
import { toast } from "react-toastify";

const ApprovedProducts = ({
  paginatedProducts = [],
  openActionId,
  setOpenActionId,
  handleSort,
  sortConfig,
}) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: statusUpdate } = useStatusUpdateProduct();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedProducts.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSuspendProduct = (id, status) => {
    statusUpdate(
      { id, status },
      {
        onSuccess: (res) => {
          if (res?.data?.success) {
            toast.success(
              `Product ${
                status === "accept" ? "activated" : "suspended"
              } successfully!`
            );
          } else {
            toast.error(res?.message || "Failed to update product status");
          }

          fetchProduct();
        },
      }
    );
  };

  const renderSortIcon = (key) => {
    return (
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
  };

  const statusColors = {
    Pending: "bg-[#E1FDFD] text-[#3E77B0]",
    Active: "bg-[#E7F7ED]  text-[#088B3A]",
    Suspended: "bg-[#FCECD6] text-[#CA4E2E]",
  };

  console.log("first approve products are:", paginatedProducts);
  return (
    <>
      <table className="hidden lg:table w-full text-left text-sm border-collapse leading-[150%] tracking-[-3%]">
        <thead className="bg-[#F9F9F9] text-[#6C6C6C]">
          <tr className="cursor-pointer">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-400"
                onChange={handleSelectAll}
                checked={
                  selected.length === paginatedProducts.length &&
                  paginatedProducts.length > 0
                }
              />
            </th>
            <th className="px-4 py-3" onClick={() => handleSort("product_id")}>
              Product ID {renderSortIcon("product_id")}
            </th>

            <th className="px-4 py-3" onClick={() => handleSort("name")}>
              Product {renderSortIcon("name")}
            </th>

            <th className="px-4 py-3">Partner Name</th>

            <th
              className="px-4 py-3"
              onClick={() => handleSort("condition_grade")}
            >
              Grade {renderSortIcon("condition_grade")}
            </th>

            <th className="px-4 py-3" onClick={() => handleSort("stock")}>
              Stock {renderSortIcon("stock")}
            </th>

            <th className="px-4 py-3" onClick={() => handleSort("status")}>
              Status {renderSortIcon("status")}
            </th>

            <th className="px-4 py-3" onClick={() => handleSort("buy_price")}>
              Price {renderSortIcon("buy_price")}
            </th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white text-[#232323]">
          {paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan={9} className="h-[200px]">
                <div className="flex flex-col items-center justify-center h-full text-centerp-6">
                  <p className="text-orange-500 font-semibold text-lg">
                    No approved products found.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting filters or check back later.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            paginatedProducts.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-[#FEF2E6] cursor-pointer transition-colors"
                onClick={() => navigate(`/products/productsdetail/${p.id}`)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400"
                    checked={selected.includes(p.id)}
                    onChange={() => handleSelectOne(p.id)}
                  />
                </td>

                <td className="px-4 py-3 text-[#4F4F4F]">{p.product_id}</td>

                <td className="px-4 py-3 flex items-center gap-2">
                  <img
                    src={p.primary_image}
                    alt={p.name}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      e.currentTarget.src = productImg;
                    }}
                  />
                  <span>{p.name}</span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={p.partner?.profile_photo}
                      alt={p.partner?.name}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = DefaultProfile;
                      }}
                    />
                    <div>
                      <p className="font-medium text-sm">{p.partner?.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.partner?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3   ">
                  <div className=" rounded-md bg-[#F9F9F9] gap-2.5 px-3 py-1 flex justify-center ">
                    {p.condition_grade}
                  </div>
                </td>
                <td className="px-4 py-3">{p.stock}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      statusColors[p.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-4 py-3">${p.buy_price}</td>

                <td
                  className="px-4 py-3 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="inline-block relative">
                    <button
                      className="p-1.5 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E] w-[34px] h-[34px]"
                      onClick={() =>
                        setOpenActionId(openActionId === p.id ? null : p.id)
                      }
                    >
                      <FiMoreHorizontal size={20} />
                    </button>

                    <ActionMenu
                      partner={p}
                      isOpen={openActionId === p.id}
                      setOpenActionId={setOpenActionId}
                      paginatedPartners={paginatedProducts}
                      items={[
                        {
                          label: "View",
                          type: "link",
                          to: `/products/productsdetail/${p.id}`,
                        },
                        ...(p.status !== "Active"
                          ? [
                              {
                                label: "Accept",
                                onClick: () =>
                                  handleSuspendProduct(p.id, "accept"),
                              },
                            ]
                          : []),
                        ...(p.status !== "Suspended"
                          ? [
                              {
                                label: "Reject",
                                onClick: () =>
                                  handleSuspendProduct(p.id, "reject"),
                              },
                            ]
                          : []),
                        {
                          label: "Request Information",
                          onClick: () => {
                            setSelectedProduct(p);
                            setIsDialogOpen(true);
                          },
                        },
                      ]}
                    />

                    <ProductReqInfo
                      isOpen={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                      onSend={() => setIsDialogOpen(false)}
                      product={selectedProduct}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 lg:hidden">
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-orange-500 font-semibold text-lg">
              No approved products found.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting filters or check back later.
            </p>
          </div>
        ) : (
          paginatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/productsdetail/${p.id}`)}
              className="border-color rounded-xl p-3 bg-white transition cursor-pointer relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img
                    src={p.primary_image}
                    onError={(e) => (e.currentTarget.src = productImg)}
                    alt={p.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500">ID: {p.product_id}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenActionId(openActionId === p.id ? null : p.id);
                  }}
                  className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E]"
                >
                  <FiMoreHorizontal size={18} />
                </button>
              </div>
              <div className="flex justify-between  ">
                <div className="flex items-center gap-3 mt-3">
                  <img
                    src={p.partner?.profile_photo}
                    onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    className="w-8 h-8 rounded-full"
                    alt=""
                  />
                  <div>
                    <p className="text-sm font-medium">{p.partner?.name}</p>
                    <p className="text-xs text-gray-500">{p.partner?.email}</p>
                  </div>
                </div>
                <div className="pt-2.5">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        statusColors[p.status]
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="flex gap-2">
                  <p className="text-gray-400 text-xs">Grade:</p>{" "}
                  {p.condition_grade}
                </div>

                <div className="flex gap-2 ">
                  <p className="text-gray-400 text-xs">Stock:</p> {p.stock}
                </div>

                <div className="flex gap-2 ">
                  <p className="text-gray-400 text-xs">Price:</p> ${p.buy_price}
                </div>
              </div>

              <ActionMenu 
                partner={p}
                isOpen={openActionId === p.id}
                setOpenActionId={setOpenActionId}
                paginatedPartners={paginatedProducts}
                items={[
                  {
                    label: "View",
                    type: "link",
                    to: `/products/productsdetail/${p.id}`,
                  },
                  ...(p.status !== "Active"
                    ? [
                        {
                          label: "Accept",
                          onClick: () => handleSuspendProduct(p.id, "accept"),
                        },
                      ]
                    : []),
                  ...(p.status !== "Suspended"
                    ? [
                        {
                          label: "Reject",
                          onClick: () => handleSuspendProduct(p.id, "reject"),
                        },
                      ]
                    : []),
                  {
                    label: "Request Information",
                    onClick: () => {
                      setSelectedProduct(p);
                      setIsDialogOpen(true);
                    },
                  },
                ]}
              />
               <ProductReqInfo
                      isOpen={isDialogOpen}
                      onClose={() => setIsDialogOpen(false)}
                      onSend={() => setIsDialogOpen(false)}
                      product={selectedProduct}
                    />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ApprovedProducts;
