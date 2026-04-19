import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";
import type { RegisterResponse } from "../types/auth";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onGoToLogin: () => void;
}

export function RegisterPage({
  onRegisterSuccess,
  onGoToLogin,
}: RegisterPageProps) {
  const [userName, setUserName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post<RegisterResponse>("/auth/register", {
        userName,
        tenantName,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("tenant", JSON.stringify(response.data.tenant));

      setMessage("Cadastro realizado com sucesso.");
      onRegisterSuccess();
    } catch {
      setMessage("Falha ao cadastrar conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Plataforma</p>
          <h1 style={styles.title}>Criar conta</h1>
          <p style={styles.subtitle}>
            Cadastre sua conta e crie sua loja para começar a montar o catálogo.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Seu nome"
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Nome da loja ou serviço"
            value={tenantName}
            onChange={(event) => setTenantName(event.target.value)}
            style={styles.input}
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.primaryButton,
              opacity: isSubmitting ? 0.75 : 1,
            }}
          >
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.includes("sucesso") ? "#15803d" : "#b91c1c",
            }}
          >
            {message}
          </p>
        )}

        <button type="button" onClick={onGoToLogin} style={styles.linkButton}>
          Já tenho conta
        </button>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background:
      "linear-gradient(180deg, #eef4ff 0%, #f5f7fb 32%, #f7f9fc 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  },
  header: {
    marginBottom: 20,
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    color: "#64748b",
    fontWeight: 800,
  },
  title: {
    margin: "8px 0 6px",
    fontSize: 30,
    lineHeight: 1.05,
    color: "#0f172a",
    fontWeight: 800,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.5,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  input: {
    padding: "13px 14px",
    borderRadius: 14,
    border: "1px solid #cfd8e3",
    fontSize: 14,
    background: "#ffffff",
    color: "#111827",
    outline: "none",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  primaryButton: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    padding: "13px 16px",
    borderRadius: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
  },
  message: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: 700,
  },
  linkButton: {
    marginTop: 10,
    border: "none",
    background: "transparent",
    color: "#1d4ed8",
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
  },
};