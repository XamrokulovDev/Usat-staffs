import { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import PostModal from "../components/PostModal";

export interface Message {
  text: string;
  type: "success" | "error" | "warning";
}

export interface Operator {
  id: number;
  name: string;
  link: string;
}

export default function Home() {
  const _api = import.meta.env.VITE_API;
  const [operators, setOperators] = useState<Operator[]>([]);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<null | Message>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOperators = async () => {
    try {
      const res = await axios.get(`${_api}/api/operators/`);
      if (res.data.success) {
        setOperators(res.data.data);
      }
    } catch (error) {
      console.error("Xatolik operatorlarni olishda:", error);
      setMessage({ text: "Operatorlarni olishda xatolik!", type: "error" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Nusxa olishda xatolik:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      const res = await axios.delete(`${_api}/api/operators/${id}`);
      if (res.data.success) {
        setOperators(operators.filter((op) => op.id !== id));
        setMessage({ text: "Xodim o‘chirildi!", type: "success" });
      } else {
        setMessage({ text: "O‘chirishda xatolik!", type: "error" });
      }
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
      setMessage({ text: "O‘chirishda xatolik!", type: "error" });
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleAdd = () => {
    setIsPostModalOpen(true);
  };

  const filteredOperators = operators.filter((op) =>
    op.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="container flex flex-col items-center justify-center bg-[#21466D] rounded-2xl overflow-auto mt-40 p-8">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl text-[#FFC82A] font-medium mb-4">
            Barcha ishchilar ro'yxati
          </h1>
          <div className="flex items-center gap-8">
            <div className="w-60 relative mb-5">
              <input
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300/50 rounded focus:outline-none placeholder:text-gray-300 text-[#fff] pr-10"
              />
              <CiSearch
                size={22}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#fff]"
              />
            </div>
            <button
              onClick={handleAdd}
              className="cursor-pointer font-medium bg-[#FFC82A] text-[#21466D] rounded-lg mb-5 py-2 px-4"
            >
              Xodim qo'shish
            </button>
          </div>
        </div>

        {/* 🔥 Jadval */}
        <div className="mt-10 w-full overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead className="text-[#fff]">
              <tr>
                <th className="border border-[#fff] px-4 py-3">№</th>
                <th className="w-1/3 border border-[#fff] px-4 py-3">Ism Familiya</th>
                <th className="w-1/3 border border-[#fff] px-4 py-3">Linklar</th>
                <th className="w-1/5 border border-[#fff] px-4 py-3">O'chirish</th>
              </tr>
            </thead>
            <tbody className="text-[#fff]">
              {filteredOperators.map((operator, index) => (
                <tr key={operator.id}>
                  <td className="text-center border border-[#fff] px-4 py-2">{index + 1}</td>
                  <td className="text-center border border-[#fff] px-4 py-2">{operator.name}</td>
                  <td className="border border-[#fff] px-4 py-2">
                    <div className="flex items-center justify-between relative">
                      <p className="break-all">{operator.link}</p>
                      <button
                        className="text-[#fff] cursor-pointer ml-2"
                        onClick={() => handleCopy(operator.link)}
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    <button
                      onClick={() => handleDelete(operator.id)}
                      className="cursor-pointer bg-red-500 text-white rounded px-3 py-1"
                      disabled={deletingId === operator.id}
                    >
                      {deletingId === operator.id ? "O‘chirilmoqda..." : "O‘chirish"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOperators.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center border border-[#fff] px-4 py-2">
                    Hech narsa topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-white text-[#21466D] flex items-center gap-2 rounded-md z-50 px-4 py-2 shadow-lg"
          >
            <FaCheckCircle className="text-green-600" />
            <span>Nusxa olindi!</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${
              message.type === "success" ? "bg-white text-[#21466D]" : "bg-red-500 text-white"
            } flex items-center gap-2 rounded-md z-50 px-4 py-2 shadow-lg`}
          >
            {message.type === "success" ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaTimesCircle className="text-white" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isPostModalOpen && (
          <PostModal
            onClose={() => setIsPostModalOpen(false)}
            refreshOperators={fetchOperators}
          />
        )}
      </AnimatePresence>
    </>
  );
}