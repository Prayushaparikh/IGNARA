import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
import Layout         from "./components/shared/Layout.jsx";
import Landing        from "./pages/Landing.jsx";
import Login          from "./pages/Login.jsx";
import Register       from "./pages/Register.jsx";
import Dashboard      from "./pages/Dashboard.jsx";
import Quiz           from "./pages/Quiz.jsx";
import QuizResults    from "./pages/QuizResults.jsx";
import Careers        from "./pages/Careers.jsx";
import CareerDetail   from "./pages/CareerDetail.jsx";
import Challenges     from "./pages/Challenges.jsx";
import Compiler       from "./pages/Compiler.jsx";
import TeacherDash    from "./pages/TeacherDashboard.jsx";
import Roadmap        from "./pages/Roadmap.jsx";
import Lessons        from "./pages/Lessons.jsx";

function PrivateRoute({ children, role }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/quiz"      element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/quiz/results" element={<PrivateRoute><QuizResults /></PrivateRoute>} />
        <Route path="/careers"      element={<PrivateRoute><Careers /></PrivateRoute>} />
        <Route path="/careers/:id"  element={<PrivateRoute><CareerDetail /></PrivateRoute>} />
        <Route path="/challenges"        element={<PrivateRoute><Challenges /></PrivateRoute>} />
        <Route path="/challenges/:id"    element={<PrivateRoute><Compiler /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><Roadmap /></PrivateRoute>} />
        <Route path="/lessons" element={<PrivateRoute><Lessons /></PrivateRoute>} />
        <Route path="/teacher" element={<PrivateRoute role="teacher"><TeacherDash /></PrivateRoute>} />
      </Route>
    </Routes>
  );
}
