import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
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
  slug: string;
  createdAt: string;
}

interface PublicCatalogResponse {
  tenant: PublicCatalogTenant;
  items: PublicCatalogItem[];
}

function formatPrice(price: string | null) {
  if (!price) return "Sob consulta";

  const numeric = Number(price);

  if (Number.isNaN(numeric)) return price;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

function useViewport() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}

export function PublicCatalogPage() {
  const { slug } = useParams();
  const { isMobile, isTablet } = useViewport();

  const [data, setData] = useState<PublicCatalogResponse | null>(null);
  const [message, setMessage] = useState("Carregando catálogo...");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const response = await api.get<PublicCatalogResponse>(
          `/public/catalog/${slug}`,
        );
        setData(response.data);
        setMessage("");
      } catch {
        setMessage("Catálogo não encontrado.");
      }
    }

    if (slug) {
      loadCatalog();
    }
  }, [slug]);

  return (
    <main
      style={{
        ...styles.page,
        ...(isMobile ? styles.pageMobile : isTablet ? styles.pageTablet : {}),
      }}
    >
      <div
        style={{
          ...styles.container,
          ...(isMobile
            ? styles.containerMobile
            : isTablet
              ? styles.containerTablet
              : {}),
        }}
      >
        {message && <p style={styles.message}>{message}</p>}

        {data && (
          <>
            <header
              style={{
                ...styles.hero,
                ...(isMobile
                  ? styles.heroMobile
                  : isTablet
                    ? styles.heroTablet
                    : {}),
              }}
            >
              <div style={styles.heroText}>
                <p style={styles.eyebrow}>Catálogo público</p>

                <h1
                  style={{
                    ...styles.title,
                    ...(isMobile
                      ? styles.titleMobile
                      : isTablet
                        ? styles.titleTablet
                        : {}),
                  }}
                >
                  {data.tenant.name}
                </h1>

                <p
                  style={{
                    ...styles.subtitle,
                    ...(isMobile ? styles.subtitleMobile : {}),
                  }}
                >
                  Confira os produtos e serviços disponíveis desta loja.
                </p>

                <div style={styles.heroBadges}>
                  <span style={styles.heroBadge}>
                    {data.items.length} {data.items.length === 1 ? "item" : "itens"}
                  </span>
                  <span style={styles.heroBadge}>Loja online</span>
                </div>
              </div>
            </header>

            {data.items.length === 0 ? (
              <section style={styles.emptyState}>
                <h2 style={styles.emptyTitle}>Nenhum item disponível no momento</h2>
                <p style={styles.emptyDescription}>
                  Esta loja ainda está organizando a vitrine. Volte em breve para
                  conferir as novidades.
                </p>
              </section>
            ) : (
              <section
                style={{
                  ...styles.grid,
                  ...(isMobile
                    ? styles.gridMobile
                    : isTablet
                      ? styles.gridTablet
                      : {}),
                }}
              >
                {data.items.map((item) => (
                  <article
                    key={item.id}
                    style={{
                      ...styles.card,
                      ...(isMobile ? styles.cardMobile : {}),
                    }}
                  >
                    <div
                      style={{
                        ...styles.imageWrapper,
                        ...(isMobile
                          ? styles.imageWrapperMobile
                          : isTablet
                            ? styles.imageWrapperTablet
                            : {}),
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={styles.image}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div style={styles.imageFallback}>Sem imagem</div>
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.cardContent,
                        ...(isMobile ? styles.cardContentMobile : {}),
                      }}
                    >
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

                      <h2
                        style={{
                          ...styles.itemTitle,
                          ...(isMobile ? styles.itemTitleMobile : {}),
                        }}
                      >
                        {item.name}
                      </h2>

                      <p style={styles.description}>
                        {item.description ?? "Sem descrição disponível."}
                      </p>

                      <div style={styles.cardFooter}>
                        <strong
                          style={{
                            ...styles.price,
                            ...(isMobile ? styles.priceMobile : {}),
                          }}
                        >
                          {formatPrice(item.price)}
                        </strong>
                      </div>
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

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef4ff 0%, #f5f7fb 32%, #f7f9fc 100%)",
    padding: "24px 16px 40px",
  },
  pageMobile: {
    padding: "12px 10px 24px",
  },
  pageTablet: {
    padding: "18px 14px 32px",
  },
  container: {
    maxWidth: 1240,
    margin: "0 auto",
  },
  containerMobile: {
    maxWidth: "100%",
  },
  containerTablet: {
    maxWidth: 900,
  },
  message: {
    textAlign: "center",
    color: "#475569",
    fontWeight: 700,
    padding: "32px 0",
  },
  hero: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef4ff 100%)",
    border: "1px solid #dbe4f0",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
    marginBottom: 24,
  },
  heroMobile: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
  },
  heroTablet: {
    padding: 22,
  },
  heroText: {
    display: "grid",
    gap: 12,
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
    margin: 0,
    fontSize: 40,
    lineHeight: 1.02,
    color: "#0f172a",
    fontWeight: 800,
    wordBreak: "break-word",
  },
  titleMobile: {
    fontSize: 24,
    lineHeight: 1.08,
    wordBreak: "break-word",
  },
  titleTablet: {
    fontSize: 32,
    lineHeight: 1.05,
  },
  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.6,
    maxWidth: 720,
  },
  subtitleMobile: {
    fontSize: 14,
    lineHeight: 1.5,
  },
  heroBadges: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
    alignItems: "center",
  },
  heroBadge: {
    background: "#ffffff",
    color: "#334155",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid #dbe4f0",
  },
  emptyState: {
    background: "#ffffff",
    border: "1px dashed #cbd5e1",
    borderRadius: 24,
    padding: 36,
    textAlign: "center",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.04)",
  },
  emptyTitle: {
    margin: "0 0 8px",
    fontSize: 24,
    color: "#0f172a",
    fontWeight: 800,
  },
  emptyDescription: {
    margin: 0,
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
    gap: 18,
  },
  gridMobile: {
    gridTemplateColumns: "1fr",
    gap: 14,
  },
  gridTablet: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    display: "flex",
    flexDirection: "column",
  },
  cardMobile: {
    borderRadius: 20,
  },
  imageWrapper: {
    width: "100%",
    height: 260,
    background: "#f8fafc",
    overflow: "hidden",
    borderBottom: "1px solid #e2e8f0",
  },
  imageWrapperMobile: {
    height: 180,
  },
  imageWrapperTablet: {
    height: 220,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontWeight: 700,
    fontSize: 14,
  },
  cardContent: {
    padding: 18,
    display: "grid",
    gap: 12,
    flex: 1,
  },
  cardContentMobile: {
    padding: 14,
    gap: 10,
  },
  badges: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBadge: {
    background: "#e8f0ff",
    color: "#2457d6",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  categoryBadge: {
    background: "#f8fafc",
    color: "#334155",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    border: "1px solid #e2e8f0",
  },
  itemTitle: {
    margin: 0,
    fontSize: 22,
    color: "#0f172a",
    fontWeight: 800,
    lineHeight: 1.15,
  },
  itemTitleMobile: {
    fontSize: 18,
    lineHeight: 1.15,
  },
  description: {
    margin: 0,
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.6,
    minHeight: 44,
  },
  cardFooter: {
    marginTop: "auto",
    paddingTop: 4,
  },
  price: {
    fontSize: 28,
    color: "#0f172a",
    fontWeight: 800,
    lineHeight: 1,
  },
  priceMobile: {
    fontSize: 24,
  },
};