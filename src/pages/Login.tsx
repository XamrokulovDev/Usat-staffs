import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("token", "qwerty");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff]">
      <form onSubmit={handleSubmit} className="max-w-md bg-[#21466D] border border-[#21466D] p-8 rounded-2xl w-full flex flex-col gap-3">
        <h2 className="text-2xl mb-6 text-[#fff] font-semibold text-center">Tizimga kirish</h2>
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
          Kirish
        </button>
      </form>
    </div>
  );
}