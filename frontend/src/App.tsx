import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MyCatalogPage } from "./pages/MyCatalogPage";
import { useSession } from "./hooks/useSession";

function App() {
  const [sessionVersion, setSessionVersion] = useState(0);
  const { isLoading, isAuthenticated } = useSession(sessionVersion);

  function refreshSession() {
    setSessionVersion((prev) => prev + 1);
  }

  if (isLoading) {
    return <p style={{ padding: 24 }}>Validando sessão...</p>;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={refreshSession} />;
  }

  return <MyCatalogPage onLogout={refreshSession} />;
}

export default App;