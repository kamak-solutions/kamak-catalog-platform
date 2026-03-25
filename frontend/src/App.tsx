import { LoginPage } from "./pages/LoginPage";
import { MyCatalogPage } from "./pages/MyCatalogPage";

function App() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <LoginPage />;
  }

  return <MyCatalogPage />;
}

export default App;