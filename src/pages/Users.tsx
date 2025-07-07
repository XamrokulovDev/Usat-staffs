import { useState } from "react";
import { CiSearch } from "react-icons/ci";

interface User {
  id: number;
  name: string;
  phone: string;
  telegram: string;
  createdAt: string;
}

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const users: User[] = [
    {
      id: 1,
      name: "Ulfatjon Xamrokulov",
      phone: "+998900302423",
      telegram: "@Ulfatjon19",
      createdAt: "07.07.2025",
    },
    {
      id: 2,
      name: "Madina Rustamova",
      phone: "+998911234567",
      telegram: "@MadinaDev",
      createdAt: "06.07.2025",
    },
    {
      id: 3,
      name: "John Doe",
      phone: "+998912345678",
      telegram: "@JohnDoe",
      createdAt: "05.07.2025",
    }
  ];

  const filteredUsers = users.filter((user) =>
    [user.name, user.phone, user.telegram, user.createdAt]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container flex flex-col items-center justify-center bg-[#21466D] rounded-2xl overflow-auto mt-40 p-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl text-[#FFC82A] font-medium mb-4">Barcha arizachilar</h1>
        <div className="w-60 relative mb-6">
          <input
            placeholder="Qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300/50 rounded focus:outline-none placeholder:text-gray-300 text-[#fff] pr-10"
          />
          <CiSearch size={22} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#fff]" />
        </div>
      </div>

      <div className="mt-10 w-full">
        {users.length === 0 ? (
          <p className="text-center text-[#fff] text-lg">Hozircha ma'lumot mavjud emas!</p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-[#fff] text-lg">Qidiruvga mos ma'lumot topilmadi!</p>
        ) : (
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead className="text-[#fff]">
              <tr>
                <th className="border border-[#fff] px-4 py-3">№</th>
                <th className="border border-[#fff] px-4 py-3">Ism Familiya</th>
                <th className="border border-[#fff] px-4 py-3">Telefon raqami</th>
                <th className="border border-[#fff] px-4 py-3">Telegram username</th>
                <th className="border border-[#fff] px-4 py-3">Kelib tushgan vaqt</th>
              </tr>
            </thead>
            <tbody className="text-[#fff]">
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="text-center border border-[#fff] px-4 py-2">{index + 1}</td>
                  <td className="text-center border border-[#fff] px-4 py-2">{user.name}</td>
                  <td className="text-center border border-[#fff] px-4 py-2">{user.phone}</td>
                  <td className="text-center border border-[#fff] px-4 py-2">{user.telegram}</td>
                  <td className="text-center border border-[#fff] px-4 py-2">{user.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}