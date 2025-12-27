import React, { useEffect, useState } from "react";
import Paypal from "../../assets/SVG/paypal.svg";
import { RefundData } from "../../data/RefundData";
import backward from "../../assets/SVG/backward.svg";
import { Link, useParams } from "react-router-dom";
import { getRefundById } from "../../services/refundService";
import { useStatusUpdateRefund } from "../../hooks/useRefund";
import { toast } from "react-toastify";
import productImg from "../../assets/Images/Pro_img.jpg";
import DefaultProfile from "../../assets/Images/trv_profile.jpg";
import ImagePreviewGallery from "../../components/ImagePreviewGallery";
import Breadcrumb from "../../components/Breadcrumb";

const GEOAPIFY_KEY = import.meta.env.VITE_APP_GEOAPIFY_KEY;


const RefundsDetail = () => {
  const { id } = useParams();
  const [refund, setRefund] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { mutate: statusUpdate } = useStatusUpdateRefund();

  const fetchRefund = async () => {
    try {
      const res = await getRefundById(id);
      setRefund(res.data.data);
    } catch (error) {
      console.error("Error fetching refund data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRefund();
    }
  }, [id]);

  const customer = refund?.traveler;
  const orderInfo = refund?.order;
  const items = refund?.order?.items || [];
  const partner = refund?.partner;
  const rider = refund?.order?.rider;
  const shippingAddress = refund?.traveler?.addresses?.find(
    (addr) => addr?.type === "shipping"
  );

  console.log("shipping address", shippingAddress);

  const billingAddress = refund?.traveler?.addresses?.find(
    (addr) => addr?.type === "billing"
  );

  const {
    transactions,
  } = RefundData;

  const handleRefundStatus = (refundId, status) => {

    statusUpdate(
      { id: refundId, status: status },
      {
        onSuccess: () => {
          toast.success(
            `Refund ${status} successfully!`
          );
          fetchRefund();
        },
        onError: () => {
          toast.error("Failed to update refund status");
        },
      }

    );
  };

  return (
    <div className="flex flex-col p-2">
      <div className="flex flex-col gap-4">

        <Breadcrumb
          items={[
            { label: "Dashboard", path: "/" },
            { label: "Refund", path: "/refund" },
            { label: "Details" },
          ]}
        />


        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex gap-3 items-center">
              <Link to="/refund" className="group">
                <img
                  src={backward}
                  alt="backward"
                  className="w-6 h-6 transform transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>
              <span className="text-2xl fw6 font-roboto text-[#232323]">
                {refund?.refund_id}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleRefundStatus(refund?.id, "Rejected")}
              type="button"
              className="border border-[#F77F00] bg-[#FEF2E6] rounded-lg py-3 px-4 gap-2 text-xs text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
            >
              Reject
            </button>
            <button
              onClick={() => handleRefundStatus(refund?.id, "Processed")}
              type="submit"
              className="border border-[#F77F00] rounded-lg py-3 px-4 gap-2  text-xs bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white"
            >
              Approve
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
          <h2 className="text-lg fw6 text-[#232323]">Customer</h2>
          <div className="flex justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={customer?.profile_photo}
                alt={customer?.name}
                className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                onClick={() => setPreviewImage(customer?.profile_photo || DefaultProfile)}

                onError={(e) => { e.currentTarget.src = DefaultProfile; }}

              />
              <div>
                <p className="text-sm fw6 text-[#232323]">{customer?.name}</p>
                <p className="text-xs fw4 text-[#6C6C6C]">{customer?.email}</p>
              </div>
            </div>
            {/* <div className="flex justify-center gap-2">
              <Link
                to="/support/chatsupport"
                className="border border-[#F77F00]  bg-[#FEF2E6] text-[#F77F00] hover:bg-[#F77F00] hover:text-white rounded-lg px-4 py-3 gap-2 text-xs "
              >
                Chat support
              </Link>
            </div> */}
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            {refund?.reason && (
              <div className="flex flex-col flex-1 gap-6 ">
                <h3 className="text-lg fw6 text-[#232323] ">Reason for refund</h3>
                <p className="text-sm fw4 text-[#4F4F4F] ">{refund?.reason}</p>
              </div>
            )}
            {refund?.images.length > 0 && (
              <div className="flex flex-col  flex-1 gap-6">
                <h3 className="text-lg fw6 text-[#232323] ">Evidence Images</h3>
                <div className="flex gap-3 flex-wrap">
                  {refund?.images?.map((img, index) => (
                    <img
                      key={index}
                      src={img.image_path}
                      alt={`Evidence ${index + 1}`}
                      className="w-25 h-25 rounded-[11.63px] border-[0.36px] border-[#BBBBBB] object-cover cursor-pointer"
                      onClick={() => setPreviewImage(img.image_path || productImg)}
                      onError={(e) => { e.currentTarget.src = productImg; }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="  min-h-screen gap-6 ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 leading-[150%] tracking-[-3%]">
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm leading-[150%] tracking-[-3%]">
                <h2 className=" text-lg fw6 text-[#232323] ">
                  Order Information
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 justify-between text-sm text-[#9A9A9A] fw5 gap-2 ">
                  <div className="flex flex-col gap-2">
                    <p className="">Date</p>
                    <p className="text-[#232323]">{orderInfo?.created_at}</p>
                  </div>
                  <div className=" flex flex-col gap-2 ">
                    <p className="">Items</p>
                    <p className="text-[#232323]">{orderInfo?.items_count}</p>
                  </div>
                  <div className=" flex flex-col gap-2 ">
                    <p className="">ETA</p>
                    <p className="text-[#232323]">{orderInfo?.eta}</p>
                  </div>
                  <div className=" flex flex-col gap-2 ">
                    <p className=" ">Status</p>
                    <span className="bg-[#E1FDFD] text-[#3E77B0] text-xs px-3 py-1 rounded-md">
                      {orderInfo?.status}
                    </span>
                  </div>
                  <div className=" flex flex-col gap-2 ">
                    <p className="">Total</p>
                    <p className="text-[#232323]">${orderInfo?.total_price}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white p-6 gap-6 rounded-2xl shadow-sm text-[#232323] leading-[150%] tracking-[-3%]">
                <h2 className="text-lg fw6 mb-4">Items</h2>

                <div className="overflow-x-auto ">
                  <table className="w-full text-xs fw5 ">

                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className=" ">
                          <td className="flex items-center gap-2.5 p-2.5">
                            <img
                              src={item.product_image || productImg}
                              alt={item.product_name}
                              className="w-12 h-12 rounded-xl object-cover cursor-pointer"
                              onClick={() => setPreviewImage(item.product_image || productImg)}

                              onError={(e) => { e.currentTarget.src = productImg; }}

                            />
                            <p>{item.product_name}</p>
                          </td>
                          <td className="gap-2.5 p-2.5 text-right align-middle">${item.price}</td>
                          <td className="gap-2.5 p-2.5 text-right align-middle">{item.quantity}</td>
                          <td className="gap-2.5 p-2.5 text-right align-middle">
                            ${item.total}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 gap-3 text-sm shadow-sm rounded-2xl bg-[#F9F9F9] fw5 text-[#232323] leading-[150%] tracking-[-3%]">
                  <div className="flex justify-between border-b border-[#D9D9D9] ">
                    <p>Subtotal</p>
                    <p>${refund?.order?.total_price}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Total</p>
                    <p>${refund?.order?.total_price}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-[#FFFFFF] p-6 rounded-2xl shadow-sm gap-6 ">
                <h2 className="text-lg fw6 text-[#232323]">Transactions</h2>
                <div className="flex justify-between text-sm fw5">
                  <div className="flex flex-cols-3 items-center justify-between gap-3">
                    <img src={Paypal} alt="" className="flex justify-center" />

                    <div className="flex flex-col gap-1 ">
                      <span className="text-[#232323]">
                        Payment via
                        {transactions.method}
                      </span>
                      <p className="text-xs text-[#9A9A9A] fw4">
                        Paypal fees: ${transactions.fees}
                      </p>
                    </div>
                  </div>
                  <div className="text-[#9A9A9A]">
                    <p>Date</p>
                    <p className="text-[#232323]">{transactions.date}</p>
                  </div>
                  <div className="text-[#9A9A9A] ">
                    <p>Total</p>
                    <p className="text-[#232323]">${refund?.order?.total_price}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6  leading-[150%] tracking-[-3%]">
              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6  text-[#232323]">Partner</h2>
                <div className="flex items-center gap-2.5">
                  <img
                    src={partner?.profile_photo}
                    alt={partner?.name}
                    className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                    onClick={() => setPreviewImage(partner?.profile_photo || DefaultProfile)}
                    onError={(e) => { e.currentTarget.src = DefaultProfile; }}

                  />
                  <div className="flex flex-col gap-1">
                    <p className="fw6 text-sm text-[#232323]">{partner?.name}</p>

                    <p className="text-xs text-[#6C6C6C]">
                      <a href={`mailto:${partner?.email}`} className="hover:underline">
                        {partner?.email}
                      </a>
                    </p>
                    <p className="text-xs text-[#6C6C6C]">
                      <a href={`tel:${partner?.phone}`} className="hover:underline">
                        {partner?.phone}
                      </a>
                    </p>
                  </div>
                </div>
                <p className="w-[314px] text-xs text-[#232323]">
                  {/* {partner?.address} */}
                   <a
                href={
                  partner?.latitude && partner?.longitude
                    ? `https://www.google.com/maps?q=${partner?.latitude},${partner?.longitude}`
                    : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(partner?.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {partner?.address}
              </a>
                </p>
              </div>
              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6  text-[#232323]">Rider</h2>
                <div className="flex items-center gap-2.5">
                  <img
                    src={rider?.profile_photo}
                    alt={rider?.name}
                    className="w-10 h-10 rounded-xl object-cover cursor-pointer"
                    onClick={() => setPreviewImage(rider?.profile_photo || DefaultProfile)}

                    onError={(e) => { e.currentTarget.src = DefaultProfile; }}

                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm fw6 text-[#232323]">{rider?.name}</p>

                    <p className="text-xs text-[#6C6C6C]">
                      <a href={`mailto:${rider?.email}`} className="hover:underline">
                        {rider?.email}
                      </a>
                    </p>
                    <p className="text-xs text-[#6C6C6C]">
                      <a href={`tel:${rider?.phone}`} className="hover:underline">
                        {rider?.phone}
                      </a>
                    </p>
                  </div>
                </div>
                <p className="w-[314px] text-xs text-[#232323]">
                  {/* {rider?.address} */}

                    <a
                href={
                  rider?.latitude && rider?.longitude
                    ? `https://www.google.com/maps?q=${rider?.latitude},${rider?.longitude}`
                    : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(rider?.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {rider?.address}
              </a>
                </p>
              </div>

              <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                <h2 className="text-lg fw6 text-[#232323]">Contact Person</h2>
                <p className="fw5 text-sm text-[#232323]">{customer?.name}</p>
                <p className="text-xs text-[#6C6C6C]">
                  <a href={`mailto:${customer?.email}`} className="hover:underline">
                    {customer?.email}
                  </a>
                </p>
                <p className="text-xs text-[#6C6C6C]">
                  <a href={`tel:${customer?.phone}`} className="hover:underline">
                    {customer?.phone}
                  </a>
                </p>


              </div>

              {shippingAddress ? (
                <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                  <h2 className="text-lg fw6 text-[#232323]">Shipping Address</h2>
                  <p className="fw5 text-sm text-[#232323]">{shippingAddress?.name}</p>
                  <p className="text-sm fw4 text-[#232323]">
                    <a
                href={
                  shippingAddress.latitude && shippingAddress.longitude
                    ? `https://www.google.com/maps?q=${shippingAddress.latitude},${shippingAddress.longitude}`
                    : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(shippingAddress.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {shippingAddress?.address}
              </a>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shipping address available</p>
              )}

              {billingAddress ? (
                <div className="flex flex-col bg-white p-6 gap-6 rounded-lg shadow-sm">
                  <h2 className="text-lg fw6 text-[#232323]">Billing Address</h2>
                  <p className="fw5 text-sm text-[#232323]">{billingAddress?.name}</p>
                  <p className="text-sm fw4 text-[#232323]">
                  <a
                href={
                  billingAddress.latitude && billingAddress.longitude
                    ? `https://www.google.com/maps?q=${billingAddress.latitude},${billingAddress.longitude}`
                    : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(billingAddress.address)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {billingAddress?.address}
              </a>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No shipping address available</p>
              )}

            </div>
          </div>
        </div>
      </div>
      <ImagePreviewGallery imageUrl={previewImage} onClose={() => setPreviewImage(null)} />

    </div>
  );
};

export default RefundsDetail;
