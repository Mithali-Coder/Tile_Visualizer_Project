import { useApp } from "./context/AppContext.jsx";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const { user } = useApp();
  return user ? <Dashboard /> : <Login />;
}
