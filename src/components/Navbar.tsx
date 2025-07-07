import { NavLink } from "react-router-dom";

// import image 
import logo from "../assets/logo.webp";

const Navbar = () => {
  const handleLogout = (): void => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-40 bg-[#21466D] text-[#fff] py-5 shadow-md z-50">
      <div className="container flex justify-between items-center mx-auto px-4">
        <NavLink to="/">
          <img 
            src={logo} 
            alt="Website Logo"
            loading="lazy" 
            className="w-50"
          />
        </NavLink>
        <ul className="flex items-center gap-8">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 ${
                  isActive ? "text-[#FFC82A] font-semibold" : ""
                } hover:text-[#FFC82A]`
              }
            >
              Barcha Xodimlar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 ${
                  isActive ? "text-[#FFC82A] font-semibold" : ""
                } hover:text-[#FFC82A]`
              }
            >
              Arizachilar
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="cursor-pointer font-medium bg-[#FFC82A] text-[#21466D] rounded-lg px-10 py-2 hover:bg-[#FFC82A] transition ml-20"
            >
              Chiqish
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;