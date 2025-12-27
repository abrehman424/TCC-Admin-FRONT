import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Assigned from "../../assets/SVG/assigned.svg";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";

const PendingOrders = ({ orders = [], handleSort, renderSortIcon }) => {
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
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm leading-[150%] tracking-[-3%] min-w-[800px]">
          <thead className="bg-[#F9F9F9] text-[#6C6C6C] fw5">
            <tr>
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
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                Order ID {renderSortIcon("id")}
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort("traveler.name")}
              >
                Traveler Name {renderSortIcon("traveler.name")}
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort("partner.name")}
              >
                Partner Name {renderSortIcon("partner.name")}
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort("eta")}
              >
                ETA {renderSortIcon("eta")}
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                Date {renderSortIcon("created_at")}
              </th>
              <th
                className="px-4 py-3 cursor-pointer"
                onClick={() => handleSort("total_price")}
              >
                Total {renderSortIcon("total_price")}
              </th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="bg-[#FFFFFF] fw4 text-[#232323]">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="text-sm hover:bg-[#FEF2E6] transition-colors cursor-pointer"
                onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-400"
                    checked={selected.includes(order.id)}
                    onChange={() => handleSelectOne(order.id)}
                  />
                </td>

                <td className="px-4 py-3 text-[#F77F00] fw5">
                  #ODR-{order.id}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={order?.traveler?.profile_photo || DefaultProfile}
                      alt="Traveler"
                      className="w-6 h-6 rounded-xl object-cover"
                      onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    />
                    <div className="flex flex-col">
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
                  <div className="flex gap-2.5 items-center">
                    <img
                      src={order?.partner?.profile_photo || DefaultProfile}
                      alt="Partner"
                      className="w-6 h-6 rounded-xl object-cover"
                      onError={(e) => (e.currentTarget.src = DefaultProfile)}
                    />
                    <div className="flex flex-col">
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
                <td className="px-4 py-3">${order.total_price}</td>

                <td className="px-4 py-3">
                  <button
                    className="flex gap-2 p-2.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00] text-[#F77F00] hover:bg-[#f1e8e1] transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/assignrider/${order.id}`);
                    }}
                  >
                    <img src={Assigned} alt="Assigned" />
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="block md:hidden space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border-color p-4 cursor-pointer flex flex-col gap-2"
            onClick={() => navigate(`/orders/ordersdetail/${order.id}`)}
          >
            <div className="flex  justify-between">
              <div className="flex gap-3 items-center">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-[1.5px] border-[#9A9A9A]"
                  checked={selected.includes(order.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectOne(order.id);
                  }}
                />
                <p className="fw5 text-orange">#ODR-{order.id}</p>
              </div>
              <div className="">
                <button
                  className="px-1.5 py-1 rounded-lg border text-xs bg-[#FEF2E6] text-[#CA4E2E]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/orders/ordersdetail/${order.id}`);
                  }}
                >
                  Assigned Rider
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex justify-between gap-2 items-center fw5 text-sm">
                Traveler Name:
                <img
                  src={order?.traveler?.profile_photo || DefaultProfile}
                  alt="Traveler"
                  className="w-10 h-10 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.src = DefaultProfile)}
                />
                <div className="flex flex-col">
                  <p className="text-sm fw5">{order.traveler?.name}</p>
                  <p className="text-xs text-gray-500">
                    {order.traveler?.email}
                  </p>
                </div>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex justify-between gap-2 items-center fw5 text-sm">
                Partner Name:
                <img
                  src={order?.partner?.profile_photo || DefaultProfile}
                  alt="Partner"
                  className="w-10 h-10 rounded-xl object-cover"
                  onError={(e) => (e.currentTarget.src = DefaultProfile)}
                />
                <div className="flex flex-col">
                  <p className="text-sm fw5">{order.partner?.name}</p>
                  <p className="text-xs text-gray-500">
                    {order.partner?.email}
                  </p>
                </div>
              </span>
            </div>
            <div className="flex flex-cols-2 justify-between">
              <div className="flex items-center gap-2 text-xs">
                <p className="text-sm">ETA: </p> {order.eta || "-"}
              </div>
              <div className="flex items-center gap-2 text-xs ">
                <p className="text-sm">Date: </p> {order.created_at}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <p className="fw5">Total: </p> ${order.total_price}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PendingOrders;
