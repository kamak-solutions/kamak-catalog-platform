import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";
import type { LoginResponse } from "../types/auth";

export function LoginPage() {
  const [email, setEmail] = useState("maria@example.com");
  const [password, setPassword] = useState("123456");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login realizado com sucesso.");
    } catch (error) {
      setMessage("Falha no login.");
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 24 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>

      {message && <p>{message}</p>}
    </main>
  );
}