import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MyCatalogPage } from "./pages/MyCatalogPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useSession } from "./hooks/useSession";

function App() {
  const [sessionVersion, setSessionVersion] = useState(0);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  const { isLoading, isAuthenticated } = useSession(sessionVersion);

  function refreshSession() {
    setAuthView("login");
    setSessionVersion((prev) => prev + 1);
  }

  if (isLoading) {
    return <p style={{ padding: 24 }}>Validando sessão...</p>;
  }

  if (!isAuthenticated) {
    if (authView === "register") {
      return (
        <RegisterPage
          onRegisterSuccess={refreshSession}
          onGoToLogin={() => setAuthView("login")}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={refreshSession}
        onGoToRegister={() => setAuthView("register")}
      />
    );
  }

  return <MyCatalogPage onLogout={refreshSession} />;
}

export default App;
