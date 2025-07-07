export default function Home() {
  const handleLogout = (): void => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container flex flex-col items-center justify-center bg-[#21466D] rounded-2xl overflow-auto mt-40 p-8">
        <div className="w-full flex items-center justify-between">
          <h1 className="text-2xl text-[#FFC82A] font-medium mb-4">Barcha ishchilar ro'yxati</h1>
          <button className="cursor-pointer font-medium bg-[#FFC82A] text-[#21466D] rounded-lg mb-5 py-2 px-4">Xodim qo'shish</button>
        </div>
      <div className="mt-10 w-full">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead className="text-[#fff]">
          <tr>
              <th className="border border-[#fff] px-4 py-3">№</th>
              <th className="border border-[#fff] px-4 py-3">Ism Familiya</th>
              <th className="border border-[#fff] px-4 py-3">Operator</th>
              <th className="border border-[#fff] px-4 py-3">Linklar</th>
          </tr>
          </thead>
          <tbody className="text-[#fff]">
          <tr>
              <td className="text-center border border-[#fff] px-4 py-2">1</td>
              <td className="text-center border border-[#fff] px-4 py-2">Ali</td>
              <td className="text-center border border-[#fff] px-4 py-2">Valiyev</td>
              <td className="text-center border border-[#fff] px-4 py-2">Meneger</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}