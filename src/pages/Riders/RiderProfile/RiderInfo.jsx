import React, { useState } from "react";
import { useDownloadRiderZip } from "../../../hooks/useRiders";
import riderImg from "../../../assets/Images/rid_profile.jpg";
import ImagePreviewGallery from "../../../components/ImagePreviewGallery";

const GEOAPIFY_KEY = import.meta.env.VITE_APP_GEOAPIFY_KEY;

const RiderInfo = ({ items = [], riderId }) => { 
  const [previewImage, setPreviewImage] = useState(null);
  const { mutate: downloadZip, isLoading } = useDownloadRiderZip();

  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500">No rider information available.</p>; 
  }

  return (
    <div className="flex flex-col gap-3">
      {(items || []).map((item, idx) => {
        const hasImage = !!item.image;

        if (hasImage) {
          return (
            <div key={idx} className="flex items-center justify-between py-2.5 leading-[150%] tracking-[normal]">
              <div className="flex items-center gap-6">
                <img
                  src={item.image || riderImg}
                  alt={item.value || "Rider"}
                  className="w-14 h-14 rounded-xl object-cover cursor-pointer"
                  onClick={() => setPreviewImage(item.image)}
                  onError={(e) => { e.currentTarget.src = riderImg; }}
                />
                <div className="fw4">
                  <p className="text-lg fw6 text-[#232323]">{item.value || "N/A"}</p>
                  {item.email && (
                    <p className="text-xs text-[#6C6C6C]">
                      <a href={`mailto:${item.email}`} className="hover:underline">
                        {item.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {item.status && (
                <span
                  className={`px-3 py-1 rounded-md text-xs fw5 ${
                    item.status === "Online"
                      ? "bg-[#E7F7ED] text-[#088B3A]"
                      : item.status === "Suspended"
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              )}
            </div>
          );
        }

        return (
          <div key={idx} className="flex justify-between fw5 gap-2">
            <div className="flex gap-2 text-xs">
              <span className="w-40 text-[#6C6C6C]">{item.label || "N/A"}</span>
              <span className="text-[#9A9A9A]"> : </span>

              <span className="text-[#232323]">
                {item.label?.toLowerCase().includes("email") ? (
                  <a href={`mailto:${item.value}`} className="hover:underline">
                    {item.value || "N/A"}
                  </a>
                ) : item.label?.toLowerCase().includes("phone") ? (
                  <a href={`tel:${item.value}`} className="hover:underline">
                    {item.value || "N/A"}
                  </a>
                ) : item.label?.toLowerCase().includes("address") ? (
                  <a
                    href={
                      item.latitude && item.longitude
                        ? `https://www.google.com/maps?q=${item.latitude},${item.longitude}`
                        : `https://www.google.com/maps/search/?api=${GEOAPIFY_KEY}&query=${encodeURIComponent(item.value || "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item.value || "N/A"}
                  </a>
                ) : (
                  item.value || "N/A"
                )}
              </span>
            </div>

            {item.actions && item.actions.length > 0 && (
              <div className="flex gap-2">
                {item.actions.map((action, i) => (
                  <button
                    key={i}
                    disabled={isLoading}
                    onClick={() => {
                      if (!item.docUrls || item.docUrls.length === 0) return;

                      if (action === "View") {
                        item.docUrls.forEach((url) => window.open(url, "_blank"));
                      } else if (action === "Download") {
                        downloadZip(riderId);
                      }
                    }}
                    className="border border-[#F77F00] bg-[#F77F00] rounded-lg px-4 py-2 text-sm text-[#FEF2E6] disabled:opacity-50"
                  >
                    {isLoading && action === "Download" ? "Downloading..." : action}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <ImagePreviewGallery imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
};

export default RiderInfo;
