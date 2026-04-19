import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

interface PublicCatalogCategory {
  id: string;
  name: string;
}

interface PublicCatalogItem {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  imageUrl: string | null;
  type: "PRODUCT" | "SERVICE";
  active: boolean;
  categoryId: string | null;
  category: PublicCatalogCategory | null;
}

interface PublicCatalogTenant {
  id: string;
  name: string;
  createdAt: string;
}

interface PublicCatalogResponse {
  tenant: PublicCatalogTenant;
  items: PublicCatalogItem[];
}

function formatPrice(price: string | null) {
  if (!price) return "Não informado";

  const numeric = Number(price);

  if (Number.isNaN(numeric)) return price;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

export function PublicCatalogPage() {
  const { tenantId } = useParams();
  const [data, setData] = useState<PublicCatalogResponse | null>(null);
  const [message, setMessage] = useState("Carregando catálogo...");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await api.get<PublicCatalogResponse>(
          `/public/catalog/${tenantId}`,
        );
        setData(response.data);
        setMessage("");
      } catch {
        setMessage("Catálogo não encontrado.");
      }
    }

    if (tenantId) {
      loadCatalog();
    }
  }, [tenantId]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {message && <p style={styles.message}>{message}</p>}

        {data && (
          <>
            <header style={styles.hero}>
              <p style={styles.eyebrow}>Catálogo público</p>
              <h1 style={styles.title}>{data.tenant.name}</h1>
              <p style={styles.subtitle}>
                Confira os itens disponíveis desta loja.
              </p>
            </header>

            {data.items.length === 0 ? (
              <section style={styles.emptyState}>
                Nenhum item ativo disponível no momento.
              </section>
            ) : (
              <section style={styles.grid}>
                {data.items.map((item) => (
                  <article key={item.id} style={styles.card}>
                    {item.imageUrl && (
                      <div style={styles.imageWrapper}>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={styles.image}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div style={styles.cardContent}>
                      <div style={styles.badges}>
                        <span style={styles.typeBadge}>
                          {item.type === "PRODUCT" ? "Produto" : "Serviço"}
                        </span>

                        {item.category?.name && (
                          <span style={styles.categoryBadge}>
                            {item.category.name}
                          </span>
                        )}
                      </div>

                      <h2 style={styles.itemTitle}>{item.name}</h2>

                      <p style={styles.description}>
                        {item.description ?? "Sem descrição"}
                      </p>

                      <strong style={styles.price}>
                        {formatPrice(item.price)}
                      </strong>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef4ff 0%, #f5f7fb 32%, #f7f9fc 100%)",
    padding: "24px 16px",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  message: {
    textAlign: "center",
    color: "#475569",
    fontWeight: 700,
    padding: "32px 0",
  },
  hero: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
    marginBottom: 24,
  },
  eyebrow: {
    margin: 0,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#64748b",
    fontWeight: 800,
  },
  title: {
    margin: "8px 0 6px",
    fontSize: 36,
    lineHeight: 1.05,
    color: "#0f172a",
    fontWeight: 800,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.5,
  },
  emptyState: {
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: 20,
    padding: 32,
    textAlign: "center",
    color: "#64748b",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#f8fafc",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardContent: {
    padding: 16,
  },
  badges: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  typeBadge: {
    background: "#e8f0ff",
    color: "#2457d6",
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  categoryBadge: {
    background: "#f8fafc",
    color: "#334155",
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #e2e8f0",
  },
  itemTitle: {
    margin: "0 0 8px",
    fontSize: 20,
    color: "#0f172a",
    fontWeight: 800,
  },
  description: {
    margin: "0 0 16px",
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.5,
  },
  price: {
    fontSize: 20,
    color: "#0f172a",
  },
};