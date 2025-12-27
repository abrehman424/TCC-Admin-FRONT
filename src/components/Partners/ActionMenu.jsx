// import React, { useEffect, useRef } from "react";
// import { Link } from "react-router-dom";

// const ActionMenu = ({ partner, isOpen, setOpenActionId, paginatedPartners, items }) => {

//   const menuRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setOpenActionId(null);
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, setOpenActionId]);

//   if (!isOpen) return null;


//   const isNearBottom = [
//     paginatedPartners[paginatedPartners.length - 1]?.id,
//     paginatedPartners[paginatedPartners.length - 2]?.id,
//   ].includes(partner.id);

//   return (
//     <div
//       ref={menuRef}
//       className={`absolute w-[140px] bg-white rounded-md shadow-[0_0_3px_#00000033] z-40 ${isNearBottom ? "bottom-full mb-1" : "top-full mt-1"
//         } right-0`}
//     >
//       {items.map((item, idx) =>
//         item.type === "link" ? (
//           <Link
//             key={idx}
//             to={item.to.replace(":id", partner.id)}

//             onClick={(e) => {
//               e.stopPropagation();
//               setOpenActionId(null)
//             }}
//             className="flex w-full items-center px-4 py-2 text-[12px] text-[#4F4F4F] leading-[150%] tracking-[-0.03em] hover:bg-[#FEF2E6]"
//           >
//             {item.label}
//           </Link>
//         ) : (
//           <button
//             key={idx}
//             onClick={(e) => {
//               e.stopPropagation();
//               item.onClick?.(partner);
//               setOpenActionId(null);
//             }}
//             className="flex w-full items-center px-4 py-2 text-[12px] text-[#4F4F4F] leading-[150%] tracking-[-0.03em] hover:bg-[#FEF2E6]"
//           >
//             {item.label}
//           </button>
//         )
//       )}
//     </div>
//   );
// };

// export default ActionMenu;



import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const ActionMenu = ({
  partner,
  isOpen,
  setOpenActionId,
  paginatedPartners,
  items,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handlePointerDownOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenActionId(null);
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handlePointerDownOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handlePointerDownOutside);
    };
  }, [isOpen, setOpenActionId]);

  if (!isOpen) return null;

  const isNearBottom = [
    paginatedPartners[paginatedPartners.length - 1]?.id,
    paginatedPartners[paginatedPartners.length - 2]?.id,
  ].includes(partner.id);

  return (
    <div
      ref={menuRef}
      onPointerDown={(e) => e.stopPropagation()} // ⭐ CRITICAL
      className={`absolute w-[140px] bg-white rounded-md shadow-[0_0_3px_#00000033] z-50 ${isNearBottom ? "bottom-full mb-1" : "top-full mt-1"
        } right-0`}
    >
      {items.map((item, idx) =>
        item.type === "link" ? (
          <Link
            key={idx}
            to={item.to.replace(":id", partner.id)}
            onClick={(e) => {
              e.stopPropagation();
              setOpenActionId(null);
            }}
            className="flex w-full items-center px-4 py-2 text-[12px] text-[#4F4F4F] hover:bg-[#FEF2E6]"
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={idx}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.(partner);
              setOpenActionId(null);
            }}
            className="flex w-full items-center px-3 py-2 text-[12px] text-[#4F4F4F] hover:bg-[#FEF2E6]"
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
};

export default ActionMenu;
