import { useEffect, useState } from "react";
import { api } from "../services/api.ts";

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

export function MyCatalogPage() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [message, setMessage] = useState("Carregando...");

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await api.get<CatalogItem[]>("/catalog/my-items");
        setItems(response.data);
        setMessage("");
      } catch {
        setMessage("Falha ao carregar o catálogo.");
      }
    }

    loadItems();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 24 }}>
      <h1>Meu Catálogo</h1>

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