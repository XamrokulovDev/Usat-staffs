import { useState } from "react";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function Login() {
  const _api = import.meta.env.VITE_API;
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<null | { text: string; type: "success" | "error" }>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${_api}/api/login`, {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("token", "ruxsat bor");
        setMessage({ text: "Kirish muvaffaqiyatli!", type: "success" });

        setTimeout(() => {
          setMessage(null);
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage({ text: "Kirish ruxsati sizda yo'q!", type: "error" });
        setTimeout(() => setMessage(null), 2000);
      }
    } catch (error) {
      console.error("Login xatoligi:", error);
      setMessage({ text: "Kirish ruxsati sizda yo'q!", type: "error" });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff]">
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-[#21466D] border border-[#21466D] p-8 rounded-2xl w-full flex flex-col gap-3"
      >
        <h2 className="text-2xl mb-6 text-[#fff] font-semibold text-center">
          Tizimga kirish
        </h2>
        <input
          type="text"
          placeholder="Loginni kiriting!"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300/50 rounded focus:outline-none placeholder:text-gray-300 text-[#fff]"
          required
        />
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Parolni kiriting!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300/50 rounded focus:outline-none placeholder:text-gray-300 text-[#fff] pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#fff]"
          >
            {showPassword ? (
              <AiFillEyeInvisible size={22} className="cursor-pointer" />
            ) : (
              <AiFillEye size={22} className="cursor-pointer" />
            )}
          </button>
        </div>
        <button
          type="submit"
          className="cursor-pointer w-full bg-[#FFC82A] text-[#21466D] py-2 px-4 rounded font-medium hover:bg-yellow-400"
        >
          Tizimga kirish
        </button>
      </form>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${
              message.type === "success"
                ? "bg-white text-[#21466D]"
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
    </div>
  );
}