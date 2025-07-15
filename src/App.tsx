import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import withAuth from './components/WithAuth';
import RouterLayout from "./layout/Routerlayout";
import Users from "./pages/Users";
import Staffs from './pages/Staffs';
import StaffDetails from "./pages/StaffDetails";
import NotAnswered from "./pages/NotAnswered";
import News from "./pages/News";
import NotAnsweredDetails from "./pages/NotAnsweredDetails";

const HomeWithAuth = withAuth(Home);
const UsersWithAuth = withAuth(Users);
const StaffWithAuth = withAuth(Staffs);
const StaffDetailsWithAuth = withAuth(StaffDetails);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RouterLayout />}>
          <Route path="/" element={<HomeWithAuth />} />
          <Route path="/users" element={<UsersWithAuth />} />
          <Route path="/staffs" element={<StaffWithAuth />} />
          <Route path="/staff-details/:id" element={<StaffDetailsWithAuth />} />
          <Route path="/not-answered" element={<NotAnswered />} />
          <Route path="/not-answered/:id" element={<NotAnsweredDetails />} />
          <Route path="/news" element={<News />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}