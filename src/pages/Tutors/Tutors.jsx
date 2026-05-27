import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";

const Tutors = () => {
  const axiosSecure = useAxios();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: responseData = {
      tutors: [],
      totalCount: 0,
    },
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["public-tutors", debouncedSearch, currentPage],

    queryFn: async () => {
      const res = await axiosSecure.get("/api/users", {
        params: {
          role: "tutor",
          search: debouncedSearch,
          page: currentPage,
          limit: itemsPerPage,
        },
      });

      if (Array.isArray(res.data)) {
        return {
          tutors: res.data,
          totalCount: res.data.length,
        };
      }

      return res.data;
    },

    placeholderData: (prev) => prev,
  });

  const tutors = responseData?.tutors || [];
  const totalCount = responseData?.totalCount || 0;

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const visiblePages = [];

  for (
    let i = Math.max(1, currentPage - 2);
    i <= Math.min(totalPages, currentPage + 2);
    i++
  ) {
    visiblePages.push(i);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      className="min-h-screen bg-[#f8fafc] pt-28 pb-20 select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
          >
            Find Your{" "}
            <span className="text-[#40bfff]">
              Perfect Tutor
            </span>
          </motion.h2>

          <p className="text-slate-500 font-bold text-lg mb-8">
            Search from our verified pool of expert educators.
          </p>

          <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search by name, institution, or skills..."
                className="w-full pl-14 h-14 bg-slate-50 border-none rounded-2xl font-bold outline-none text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-[#40bfff]/20 transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button className="bg-[#40bfff] hover:bg-[#3498db] border-none text-white font-black px-10 h-14 rounded-2xl w-full md:w-auto shadow-lg shadow-blue-100 transition-colors">
              Search
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
            <Loader2
              className="animate-spin text-[#40bfff]"
              size={40}
            />

            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              Loading Tutors...
            </p>
          </div>
        )}

        {isError && (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-2 text-rose-500">
            <AlertTriangle size={40} />

            <p className="font-black uppercase tracking-wider">
              {error.message}
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tutors.length > 0 ? (
                tutors.map((tutor, idx) => (
                  <motion.div
                    key={tutor._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -10 }}
                    className="p-8 rounded-[3rem] border border-slate-100 bg-white hover:shadow-2xl shadow-[0_15px_40px_-15px_rgba(0,0,0,0.03)] transition-all duration-500 flex flex-col items-center text-center group"
                  >
                    <div className="relative mb-6">
                      <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-md group-hover:border-[#40bfff] transition-colors duration-500">
                        <img
                          src={
                            tutor.image ||
                            "https://i.ibb.co/default-avatar.png"
                          }
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      </div>

                      {tutor.status === "active" && (
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                          <CheckCircle
                            size={22}
                            className="text-[#40bfff]"
                            fill="white"
                          />
                        </div>
                      )}
                    </div>

                    <h4 className="text-2xl font-black text-slate-800 mb-1 leading-tight group-hover:text-[#40bfff] transition-colors">
                      {tutor.name}
                    </h4>

                    <p className="text-[#40bfff] font-bold text-xs mb-2 uppercase tracking-widest min-h-[1rem] line-clamp-1">
                      {tutor.institution ||
                        "Independent Mentor"}
                    </p>

                    <p className="text-slate-400 font-bold text-xs mb-5 lowercase first-letter:uppercase">
                      {tutor.qualification ||
                        "Expert Educator"}
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-3 mb-8 mt-auto">
                      <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100/50">
                        <Star
                          size={14}
                          fill="#f1c40f"
                          className="text-[#f1c40f]"
                        />

                        <span className="text-xs font-black text-slate-700">
                          5.0
                        </span>
                      </div>

                      <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100/30">
                        <MapPin
                          size={14}
                          className="text-[#40bfff]"
                        />

                        <span className="text-xs font-black text-slate-600 line-clamp-1">
                          {tutor.phone !== "N/A"
                            ? "Bogra"
                            : "Remote"}
                        </span>
                      </div>
                    </div>

                    <Link
                      to={`/tutor/${tutor._id}`}
                      className="w-full mt-auto"
                    >
                      <button className="w-full py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 font-black text-slate-700 hover:bg-[#40bfff] hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-2 group/btn">
                        View Profile

                        <ArrowRight
                          size={18}
                          className="group-hover/btn:translate-x-1 transition-transform"
                        />
                      </button>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                  <AlertTriangle
                    size={36}
                    className="text-slate-300"
                  />

                  <p className="font-black text-slate-300 uppercase tracking-widest text-sm">
                    No expert tutors found
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14 flex-wrap">
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="h-12 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ChevronLeft size={16} />
                </button>

                {visiblePages.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-12 w-12 rounded-xl font-black transition-all ${
                      currentPage === pageNum
                        ? "bg-[#40bfff] text-white shadow-lg shadow-blue-100"
                        : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="h-12 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tutors;