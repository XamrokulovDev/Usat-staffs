import { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy, FaCheckCircle } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

export interface Message {
  text: string;
  type: "success" | "error" | "warning";
}

export interface Operator {
  id: number;
  name: string;
  link: string;
  referalCount: number;
}

export default function NotAnswered() {
  const _api = import.meta.env.VITE_API;
  const [operators, setOperators] = useState<Operator[]>([]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOperators = async () => {
    try {
      const res = await axios.get(`${_api}/api/operators/`);
      if (res.data.success) {
        setOperators(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {
      console.error("Xatolik operatorlarni olishda:", error);
    } finally {
      setLoading(false);
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
          </div>
        </div>

        <div className="mt-10 w-full overflow-x-auto">
          {loading ? (
            <p className="text-center text-[#fff] text-lg">Yuklanmoqda...</p>
          ) : operators.length === 0 ? (
            <p className="text-center text-[#fff] text-lg">
              Hozircha ma'lumot mavjud emas!
            </p>
          ) : filteredOperators.length === 0 ? (
            <p className="text-center text-[#fff] text-lg">
              Qidiruvga mos ma'lumot topilmadi!
            </p>
          ) : (
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead className="text-[#fff]">
                <tr>
                  <th className="border border-[#fff] px-4 py-3">№</th>
                  <th className="w-1/3 border border-[#fff] px-4 py-3">Ism Familiya</th>
                  <th className="w-1/3 border border-[#fff] px-4 py-3">Linklar</th>
                  <th className="w-1/5 border border-[#fff] px-4 py-3">Referallar</th>
                </tr>
              </thead>
              <tbody className="text-[#fff]">
                {filteredOperators.map((operator, index) => (
                  <tr key={operator.id}>
                    <td className="text-center border border-[#fff] px-4 py-2">{index + 1}</td>
                    <td className="text-center border border-[#fff] underline px-4 py-2">
                      <NavLink to={`/staff-details/${operator.id}`}>{operator.name}</NavLink>
                    </td>
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
                    <td className="text-center border border-[#fff] underline flex items-center justify-center gap-2 px-4 py-2">
                      <NavLink to={`/staff-details/${operator.id}`}>{operator.referalCount}</NavLink>
                      <NavLink to={`/staff-details/${operator.id}`} className="text-blue-500">ko'rish</NavLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
    </>
  );
}