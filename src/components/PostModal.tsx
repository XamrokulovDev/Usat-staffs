import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface ModalProps {
  onClose: () => void;
  refreshOperators: () => void;
}

const Modal = ({ onClose, refreshOperators }: ModalProps) => {
  const _api = import.meta.env.VITE_API;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<null | { text: string; type: "success" | "error" | "warning" }>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage({ text: "Formani to'ldiring!", type: "warning" });
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    try {
      setLoading(true);
      const payload = { name };
      const res = await axios.post(
        `${_api}/api/operators/`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setMessage({
          text: "Xodim muvaffaqiyatli qo'shildi!",
          type: "success",
        });
        setTimeout(() => {
          setMessage(null);
          onClose();
          refreshOperators();
        }, 1000);
      } else {
        setMessage({
          text: "Xodim qo'shishda xatolik!",
          type: "error",
        });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Xatolik:", error);
      setMessage({
        text: "Xodim qo'shishda xatolik!",
        type: "error",
      });
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { duration: 0.3 } }}
          exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
          className="bg-white text-[#21466D] rounded-lg w-[400px] relative p-8"
        >
          <button
            onClick={onClose}
            className="cursor-pointer absolute top-3 right-3 bg-[#21466D] text-white rounded p-1"
          >
            <IoMdClose size={22} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Xodim qo'shish</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Xodim ismini kiriting!"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded w-full outline-none my-4 p-2"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#21466D] hover:bg-[#193b58]"
              } text-white rounded cursor-pointer mt-3 p-[10px]`}
            >
              {loading ? "Qo'shilmoqda..." : "Qo'shish"}
            </button>
          </form>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${
              message.type === "success"
                ? "bg-white text-[#21466D]"
                : message.type === "warning"
                ? "bg-yellow-400 text-[#21466D]"
                : "bg-red-500 text-white"
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
    </>
  );
};

export default Modal;