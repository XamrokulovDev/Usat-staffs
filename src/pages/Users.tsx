import { useState, useEffect } from "react";
import axios from "axios";
import { CiSearch } from "react-icons/ci";

interface ApiUser {
  id: number;
  fullName: string;
  phone: string;
  additionalPhone: string;
  username: string;
  applicationDate: string;
  referrerOperator?: {
    name: string;
  };
}

interface User {
  id: number;
  name: string;
  phone: string;
  additionalPhone: string;
  referrerOperator: {
    name: string;
  };
  telegram: string;
  createdAt: Date;
}

export default function Users() {
  const _api = import.meta.env.VITE_API;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDays, setFilterDays] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${_api}/api/users/`);
      const { data } = response;
      if (data.success) {
        const formattedUsers: User[] = data.data
          .sort(
            (a: ApiUser, b: ApiUser) =>
              new Date(b.applicationDate).getTime() -
              new Date(a.applicationDate).getTime()
          )
          .map((item: ApiUser) => {
            return {
              id: item.id,
              name: item.fullName,
              phone: item.phone,
              additionalPhone: item.additionalPhone,
              telegram: `@${item.username}`,
              referrerOperator: {
                name: item.referrerOperator ? item.referrerOperator.name : "-",
              },
              createdAt: new Date(item.applicationDate),
            };
          }).reverse();
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [_api]);

  const now = new Date();

  const filteredUsers = users.filter((user) => {
    const matchSearch = [
      user.name,
      user.phone,
      user.additionalPhone,
      user.telegram,
      user.referrerOperator.name,
      formatDate(user.createdAt),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterDays !== null) {
      const diffTime = now.getTime() - user.createdAt.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return matchSearch && diffDays <= filterDays;
    }

    return matchSearch;
  });

  function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} - ${hours}:${minutes}`;
  }

  return (
    <div className="container flex flex-col items-center justify-center bg-[#21466D] rounded-2xl overflow-auto mt-40 p-8">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl text-[#FFC82A] font-medium mb-4">
          Barcha arizachilar
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-60 relative mb-6">
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

      <div className="mt-10 w-full">
        {loading ? (
          <p className="text-center text-[#fff] text-lg">Yuklanmoqda...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-[#fff] text-lg">
            Hozircha ma'lumot mavjud emas!
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center text-[#fff] text-lg">
            Qidiruvga mos ma'lumot topilmadi!
          </p>
        ) : (
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead className="text-[#fff]">
              <tr>
                <th className="border border-[#fff] px-4 py-3">№</th>
                <th className="border border-[#fff] px-4 py-3">Ism Familiya</th>
                <th className="border border-[#fff] px-4 py-3">
                  Telefon raqami
                </th>
                <th className="border border-[#fff] px-4 py-3">
                  Qo'shimcha telefon raqami
                </th>
                <th className="border border-[#fff] px-4 py-3">
                  Telegram username
                </th>
                <th className="border border-[#fff] px-4 py-3">
                  Qabul qilgan operator
                </th>
                <th className="border border-[#fff] px-4 py-3">
                  <div className="flex justify-center">
                    <select
                      value={filterDays ?? ""}
                      onChange={(e) =>
                        setFilterDays(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="px-4 border border-[#21466D] rounded-lg bg-[#21466D] text-[#fff] focus:outline-none transition-colors duration-200 cursor-pointer"
                    >
                      <option value="" className="cursor-pointer">
                        Barchasi
                      </option>
                      <option value="1" className="cursor-pointer">
                        1 kunlik
                      </option>
                      <option value="2" className="cursor-pointer">
                        2 kunlik
                      </option>
                      <option value="3" className="cursor-pointer">
                        3 kunlik
                      </option>
                      <option value="7" className="cursor-pointer">
                        1 haftalik
                      </option>
                    </select>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-[#fff]">
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {user.name}
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {user.phone}
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {user.additionalPhone}
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {user.telegram}
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {user.referrerOperator.name}
                  </td>
                  <td className="text-center border border-[#fff] px-4 py-2">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}