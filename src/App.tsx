import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import withAuth from "./components/WithAuth";
import RouterLayout from "./layout/Routerlayout";
import Staffs from "./pages/Staffs";
import Users from "./pages/Users";

const HomeWithAuth = withAuth(Home);
const StaffsWithAuth = withAuth(Staffs);
const UsersWithAuth = withAuth(Users);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RouterLayout />}>
          <Route path="/" element={<HomeWithAuth />} />
          <Route path="/staff" element={<StaffsWithAuth />} />
          <Route path="/users" element={<UsersWithAuth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}