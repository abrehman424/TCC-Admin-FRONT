import React, { useState } from "react";
import Eye from "../../assets/SVG/eyeorange.svg";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import { useNavigate } from "react-router-dom";

const AssignedOrders = ({ orders = [], handleSort, renderSortIcon }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(orders.map((o) => o.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-[#E7F7ED] text-[#088B3A]";
      case "Shipped":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Cancelled":
        return "bg-[#FCECD6] text-[#CA4E2E]";
      default:
        return "bg-[#E1FDFD] text-[#3E77B0]";
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <table className="hidden lg:table w-full text-left text-sm leading-[150%] tracking-[-3%] border-collapse">
          <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
            <tr className="cursor-pointer">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                  onChange={handleSelectAll}
                  checked={
                    selected.length === orders.length && orders.length > 0
                  }
                />
              </th>
              <th className="px-4 py-3" onClick={() => handleSort("id")}>
                Order ID {renderSortIcon("id")}
              </th>
              <th
                className="px-4 py-3"
                onClick={() => handleSort("traveler.name")}
              >
                Traveler Name {renderSortIcon("traveler.name")}
              </th>
              <th
                className="px-4 py-3"
                onClick={() => handleSort("partner.name")}
              >
                Partner Name {renderSortIcon("partner.name")}
              </th>
              <th className="px-4 py-3" onClick={() => handleSort("eta")}>
                ETA {renderSortIcon("eta")}
              </th>
              <th
                className="px-4 py-3"
                onClick={() => handleSort("created_at")}
              >
                Date {renderSortIcon("created_at")}
              </th>
              <th className="px-4 py-3" onClick={() => handleSort("status")}>
                Status {renderSortIcon("status")}
              </th>
              <th
                className="px-4 py-3"
                onClick={() => handleSort("total_price")}
              >
                Total {renderSortIcon("total_price")}
              </th>
              <th className="px-4 py-3">View</th>
            </tr>
          </thead>

          <tbody className="bg-white fw4 text-[#232323]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="text-sm hover:bg-[#FEF2E6] cursor-pointer transition-colors"
                onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                    checked={selected.includes(order.id)}
                    onChange={() => handleSelectOne(order.id)}
                  />
                </td>

                <td className="px-4 py-3 text-[#F77F00] fw5">
                  #ODR-{order.id}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2.5">
                    <img
                      src={order?.traveler?.profile_photo || DefaultProfile}
                      alt="Traveler"
                      className="w-6 h-6 rounded-xl object-cover object-center"
                      onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    />
                    <div>
                      <p className="text-[#4F4F4F] text-sm">
                        {order.traveler?.name}
                      </p>
                      <p className="text-[#6C6C6C] text-xs">
                        {order.traveler?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2.5">
                    <img
                      src={order?.partner?.profile_photo || DefaultProfile}
                      alt="Partner"
                      className="w-6 h-6 rounded-xl object-cover object-center"
                      onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    />
                    <div>
                      <p className="text-[#4F4F4F] text-sm">
                        {order.partner?.name}
                      </p>
                      <p className="text-[#6C6C6C] text-xs">
                        {order.partner?.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">{order.eta || "-"}</td>
                <td className="px-4 py-3">{order.created_at}</td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs fw5 rounded-md ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-3">${order.total_price}</td>

                <td className="px-4 py-3">
                  <button
                    className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E]"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/ordersdetail/${order.id}`);
                    }}
                  >
                    <img src={Eye} alt="View" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex flex-col bg-white rounded-lg shadow p-4 cursor-pointer gap-2"
            onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                  checked={selected.includes(order.id)}
                  onChange={() => handleSelectOne(order.id)}
                />
                <p className="fw5 text-orange">#ODR-{order.id}</p>
              </div>

              <span
                className={`px-2 py-1 text-xs fw5 rounded-md ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              <div onClick={(e) => e.stopPropagation()}>
                <button
                  className="p-2 rounded-lg border bg-[#FEF2E6] text-[#CA4E2E]"
                  onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
                >
                  <img src={Eye} alt="View" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ">
              <span className="flex justify-between gap-3 items-center fw5 text-sm">
                Traveler Name:
                <img
                  src={order?.traveler?.profile_photo || DefaultProfile}
                  alt="Traveler"
                  className="w-8 h-8 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.src = DefaultProfile)}
                />
                <div>
                  <p className="text-sm fw5">{order.traveler?.name}</p>
                  <p className="text-xs text-gray-500">
                    {order.traveler?.email}
                  </p>
                </div>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex justify-between gap-3 items-center fw5 text-sm">
                Partner Name:
                <img
                  src={order?.partner?.profile_photo || DefaultProfile}
                  alt="Partner"
                  className="w-8 h-8 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.src = DefaultProfile)}
                />
                <div>
                  <p className="text-sm fw5">{order.partner?.name}</p>
                  <p className="text-xs text-gray-500">
                    {order.partner?.email}
                  </p>
                </div>
              </span>
            </div>
            <div className="flex flex-cols-2 justify-between">
              <div className="flex gap-2 items-center text-sm">
                <p className="text-sm ">ETA: </p> {order.eta || "-"}
              </div>
              <div className="flex gap-2 items-center text-sm">
                <p className="text-sm ">Date: </p> {order.created_at}
              </div>
            </div>
            <div className="flex gap-2 items-center text-sm">
              <p className="fw5">Total:</p> ${order.total_price}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AssignedOrders;
