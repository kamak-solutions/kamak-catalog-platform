import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";

interface CatalogCategory {
  id: string;
  name: string;
}

interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  type: "PRODUCT" | "SERVICE";
  active: boolean;
  tenantId: string;
  categoryId: string | null;
  category: CatalogCategory | null;
  createdAt: string;
  updatedAt: string;
}

interface MyCatalogPageProps {
  onLogout: () => void;
}

export function MyCatalogPage({ onLogout }: MyCatalogPageProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [message, setMessage] = useState("Carregando...");
  const [formMessage, setFormMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [categoryId, setCategoryId] = useState("");

  async function loadItems() {
    try {
      const response = await api.get<CatalogItem[]>("/catalog/my-items");
      setItems(response.data);
      setMessage("");
    } catch {
      setMessage("Falha ao carregar o catálogo.");
    }
  }

  async function loadCategories() {
    try {
      const response = await api.get<CatalogCategory[]>("/catalog/my-categories");
      setCategories(response.data);
    } catch {
      // tratar depois
    }
  }

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    try {
      await api.post("/catalog/items", {
        name,
        description: description || undefined,
        price: price || undefined,
        type,
        categoryId: categoryId || undefined
      });

      setName("");
      setDescription("");
      setPrice("");
      setType("PRODUCT");
      setCategoryId("");
      setFormMessage("Item criado com sucesso.");

      await loadItems();
    } catch {
      setFormMessage("Falha ao criar item.");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <h1>Meu Catálogo</h1>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            onLogout();
          }}
        >
          Sair
        </button>
      </div>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 16,
          marginBottom: 24
        }}
      >
        <h2>Novo item</h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <input
            type="text"
            placeholder="Nome do item"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <input
            type="text"
            placeholder="Preço"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as "PRODUCT" | "SERVICE")
            }
          >
            <option value="PRODUCT">Produto</option>
            <option value="SERVICE">Serviço</option>
          </select>

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button type="submit">Criar item</button>
        </form>

        {formMessage && <p>{formMessage}</p>}
      </section>

      {message && <p>{message}</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {items.map((item) => (
          <article
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16
            }}
          >
            <h2>{item.name}</h2>
            <p>{item.description ?? "Sem descrição"}</p>
            <p>Preço: {item.price ?? "Não informado"}</p>
            <p>Tipo: {item.type}</p>
            <p>Status: {item.active ? "Ativo" : "Inativo"}</p>
            <p>Categoria: {item.category?.name ?? "Sem categoria"}</p>
          </article>
        ))}
      </div>
    </main>
  );
}