import React, { useState, useEffect, useMemo } from "react";
import {
  FiChevronDown,
  FiSearch,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import Eye from "../../assets/SVG/eyeorange.svg";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import DefaultProfile from "../../assets/Images/rid_profile.jpg";
import API from "../../services/api";
import Breadcrumb from "../../components/Breadcrumb";

const Support = () => {
  const navigate = useNavigate();

  const [supportTickets, setSupportTickets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await API.get("/support-tickets");
        if (res.data.success) {
          setSupportTickets(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch support tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedTickets.map((t) => t.id));
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
      case "Pending":
        return "bg-[#E5F6FD] text-[#0AA6D7]";
      case "In Progress":
        return "bg-[#FEFCDD] text-[#B2A23F]";
      case "Resolved":
        return "bg-[#E7F7ED] text-[#088B3A]";
      default:
        return "";
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => (
    <span className="inline-flex flex-row ml-1">
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

  const filteredTickets = useMemo(() => {
    let result = supportTickets.filter((t) => {
      const ticketId = t.ticket_id || "";
      const name = t.sender?.name || "";
      const email = t.sender?.email || "";
      const subject = t.subject || "";
      return (
        ticketId.toLowerCase().includes(search.toLowerCase()) ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        subject.toLowerCase().includes(search.toLowerCase())
      );
    });

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let valA = "";
        let valB = "";

        switch (sortConfig.key) {
          case "ticket_id":
            valA = a.ticket_id || "";
            valB = b.ticket_id || "";
            break;
          case "name":
            valA = a.sender?.name || "";
            valB = b.sender?.name || "";
            break;
          case "subject":
            valA = a.subject || "";
            valB = b.subject || "";
            break;
          case "date":
            valA = a.created_at || "";
            valB = b.created_at || "";
            break;
          case "status":
            valA = a.status || "";
            valB = b.status || "";
            break;
          default:
            return 0;
        }

        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [search, supportTickets, sortConfig]);

  const paginatedTickets = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredTickets.slice(start, start + perPage);
  }, [filteredTickets, page, perPage]);

  return (
    <div className="flex flex-col gap-6 p-3">
      <div className="flex flex-col gap-4">
        {/* <div className="flex items-center text-xs gap-1 leading-[150%] tracking-[-3%]">
          <p className="text-[#6C6C6C]">Dashboard</p>
          <span className=" text-[#9A9A9A]">/</span>
          <p className="text-[#F77F00]">Support</p>
        </div> */}
        <Breadcrumb
          items={[{ label: "Dashboard", path: "/" }, { label: "Support" }]}
        />
        <div>
          <h2 className="text-2xl font-roboto fw6 text-[#232323]">
            Support Ticket
          </h2>
          <p className="text-[#232323] text-sm">
            View and manage all queries from the users in the platform.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border-color overflow-x-auto p-6 gap-6">
        <div className="flex  md:flex-row md:items-center justify-between gap-4 p-2">
          <div className="relative w-full md:w-[320px] text-[#9A9A9A]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
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
              className="pl-9 pr-2 py-2 border border-[#D9D9D9] rounded-lg text-base w-full md:w-[320px] focus:outline-none"
            />
          </div>
          <button className="flex items-center justify-between border border-[#23232333] rounded-lg px-3 py-2 text-sm text-[#9A9A9A] gap-3 max-w-[127px]">
            Status
            <FiChevronDown size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>

            <p className="text-orange-500 fw5 flex items-center">
              Loading Support Tickets
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
        ) : (
          <>
          <div className="hidden md:block overflow-x-auto w-full">
  <table className="w-full min-w-[900px] text-left text-sm border-collapse">
              <thead className="bg-[#F9F9F9] text-[#6C6C6C] font-medium">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                      onChange={handleSelectAll}
                      checked={
                        selected.length === paginatedTickets.length &&
                        paginatedTickets.length > 0
                      }
                    />
                  </th>

                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("ticket_id")}
                  >
                    Ticket ID {renderSortIcon("ticket_id")}
                  </th>
                  <th className="px-4 py-3">User Type</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name {renderSortIcon("name")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("subject")}
                  >
                    Subject {renderSortIcon("subject")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date {renderSortIcon("date")}
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status {renderSortIcon("status")}
                  </th>
                  <th className="px-4 py-3">View</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[#232323]">
                {paginatedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-[#FEF2E6] cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(`/support/chatsupport/${ticket.id}`)
                    }
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4.5 h-4.5 rounded border-[1.5px] border-[#9A9A9A]"
                        checked={selected.includes(ticket.id)}
                        onChange={() => handleSelectOne(ticket.id)}
                      />
                    </td>

                    <td className="p-2.5">{ticket.ticket_id}</td>
                    <td className="p-2.5">{ticket.sender?.type}</td>
                    <td className="px-2.5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={ticket?.sender?.profile_photo || DefaultProfile}
                          alt={ticket?.sender?.name}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = DefaultProfile;
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-[#4F4F4F]">
                            {ticket?.sender?.name}
                          </span>
                          <span className="text-xs text-[#6C6C6C]">
                            {ticket?.sender?.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5">{ticket.subject}</td>
                    <td className="p-2.5">{ticket.created_at}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-3 py-1 text-xs fw5 rounded-md ${getStatusClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <button
                        className="p-2.5 rounded-lg border bg-[#FEF2E6] border-[#F77F00]"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/support/chatsupport/${ticket.id}`);
                        }}
                      >
                        <img src={Eye} alt="view" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
</div>
            {/* Card layout for mobile */}
            <div className="md:hidden flex flex-col gap-4">
              {paginatedTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className=" flex flex-col border-color rounded-lg p-4 bg-white shadow-sm cursor-pointer gap-2"
                  onClick={() => navigate(`/support/chatsupport/${ticket.id}`)}
                >
                  <div className="flex justify-between items-center ">
                    <p className="fw5 text-sm">Ticket: #{ticket.ticket_id}</p>
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={ticket?.sender?.profile_photo || DefaultProfile}
                      alt={ticket?.sender?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm text-[#4F4F4F]">
                        {ticket?.sender?.name}
                      </span>
                      <span className="text-xs text-[#6C6C6C]">
                        {ticket?.sender?.email}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-[#232323] mb-1">
                    Subject: {ticket.subject}
                  </div>
                  <div className="text-sm text-[#232323]">
                    Date: {ticket.created_at}
                  </div>
                </div>
              ))}
            </div>

            {paginatedTickets.length > 0 && (
              <Pagination
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                totalItems={filteredTickets.length}
                options={[5, 10, 25, 50]}
                fullWidth={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Support;
