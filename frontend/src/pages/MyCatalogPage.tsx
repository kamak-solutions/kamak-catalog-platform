import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
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
  imageUrl: string | null;
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

function formatPrice(price: string | null) {
  if (!price) return "Não informado";

  const numeric = Number(price);

  if (Number.isNaN(numeric)) return price;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numeric);
}

function getUserFromStorage() {
  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as {
      name?: string;
      email?: string;
      role?: string;
      tenantId?: string;
    };
  } catch {
    return null;
  }
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1100);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1100);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
}

export function MyCatalogPage({ onLogout }: MyCatalogPageProps) {
  const isDesktop = useIsDesktop();
  const isMobile = !isDesktop;

  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [message, setMessage] = useState("Carregando catálogo...");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [categoryId, setCategoryId] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editType, setEditType] = useState<"PRODUCT" | "SERVICE">("PRODUCT");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deactivatingItemId, setDeactivatingItemId] = useState<string | null>(
    null,
  );

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const storedUser = useMemo(() => getUserFromStorage(), []);
  const storedTenant = useMemo(() => {
    const raw = localStorage.getItem("tenant");

    if (!raw) return null;

    try {
      return JSON.parse(raw) as {
        id?: string;
        name?: string;
        slug?: string;
        createdAt?: string;
      };
    } catch {
      return null;
    }
  }, []);

  const publicCatalogUrl = storedTenant?.slug
    ? `${window.location.origin}/catalogo/${storedTenant.slug}`
    : "";

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
      const response = await api.get<CatalogCategory[]>(
        "/catalog/my-categories",
      );
      setCategories(response.data);
    } catch {
      // tratar depois
    }
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategoryMessage("");
    setIsCreatingCategory(true);

    try {
      await api.post("/catalog/categories", {
        name: categoryName,
      });

      setCategoryName("");
      setCategoryMessage("Categoria criada com sucesso.");

      await loadCategories();
    } catch {
      setCategoryMessage("Falha ao criar categoria.");
    } finally {
      setIsCreatingCategory(false);
    }
  }

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setIsFormOpen(true);
      setIsItemModalOpen(false);
      setIsCategoryModalOpen(false);
    } else {
      setIsFormOpen(false);
    }
  }, [isDesktop]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");
    setIsSubmitting(true);

    try {
      await api.post("/catalog/items", {
        name,
        description: description || undefined,
        price: price || undefined,
        imageUrl: imageUrl || undefined,
        type,
        categoryId: categoryId || undefined,
      });

      setName("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setType("PRODUCT");
      setCategoryId("");
      setFormMessage("Item criado com sucesso.");

      if (isMobile) {
        setIsItemModalOpen(false);
      }

      await loadItems();
    } catch {
      setFormMessage("Falha ao criar item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(item: CatalogItem) {
    setEditingItemId(item.id);
    setEditName(item.name);
    setEditDescription(item.description ?? "");
    setEditPrice(item.price ?? "");
    setEditImageUrl(item.imageUrl ?? "");
    setEditType(item.type);
    setEditCategoryId(item.categoryId ?? "");
    setEditMessage("");
  }

  function cancelEditing() {
    setEditingItemId(null);
    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditImageUrl("");
    setEditType("PRODUCT");
    setEditCategoryId("");
    setEditMessage("");
  }

  async function handleSaveEdit(itemId: string) {
    setEditMessage("");
    setIsSavingEdit(true);

    try {
      await api.patch(`/catalog/items/${itemId}`, {
        name: editName,
        description: editDescription || undefined,
        price: editPrice || undefined,
        imageUrl: editImageUrl || undefined,
        type: editType,
        categoryId: editCategoryId || null,
      });

      setEditMessage("Item atualizado com sucesso.");
      await loadItems();
      setEditingItemId(null);
    } catch {
      setEditMessage("Falha ao atualizar item.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function handleToggleActive(itemId: string, active: boolean) {
    setDeactivatingItemId(itemId);

    try {
      await api.patch(`/catalog/items/${itemId}`, {
        active,
      });

      await loadItems();
    } catch {
      setMessage("Falha ao atualizar status do item.");
    } finally {
      setDeactivatingItemId(null);
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && item.active) ||
      (statusFilter === "INACTIVE" && !item.active);

    const matchesCategory =
      !categoryFilter || item.categoryId === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeItems = items.filter((item) => item.active).length;
  const inactiveItems = items.filter((item) => !item.active).length;

  return (
    <main
      style={{
        ...styles.page,
        ...(isDesktop ? styles.pageDesktop : styles.pageMobile),
      }}
    >
      <div
        style={{
          ...styles.container,
          ...(isDesktop ? styles.containerDesktop : styles.containerMobile),
        }}
      >
        <header style={styles.headerCard}>
          <div style={styles.headerTop}>
            <div>
              <p style={styles.eyebrow}>Painel</p>
              <h1 style={styles.pageTitle}>Meu Catálogo</h1>
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                onLogout();
              }}
              style={styles.logoutButton}
            >
              Sair
            </button>
          </div>

          <div style={styles.userBadges}>
            <span style={styles.badgePrimary}>
              {storedUser?.name ?? "Usuário"}
            </span>
            <span style={styles.badgeInfo}>
              {storedUser?.role ?? "Sem perfil"}
            </span>
            <span style={styles.badgeNeutral}>
              {storedUser?.email ?? "Sem e-mail"}
            </span>
          </div>
        </header>

        <div
          style={{
            ...styles.contentGrid,
            ...(isDesktop
              ? styles.contentGridDesktop
              : styles.contentGridMobile),
          }}
        >
          <aside
            style={{
              ...styles.sidebar,
              ...(isDesktop ? styles.sidebarDesktop : styles.sidebarMobile),
            }}
          >
            <section style={styles.panelCard}>
              <div style={styles.panelHeader}>
                <div>
                  <h2 style={styles.sectionTitle}>Novo item</h2>
                  <p style={styles.sectionSubtitle}>
                    Cadastre produtos e serviços do catálogo.
                  </p>
                </div>

                {isDesktop && (
                  <button
                    type="button"
                    onClick={() => setIsFormOpen((prev) => !prev)}
                    style={styles.toggleButton}
                  >
                    {isFormOpen ? "Fechar" : "+ Novo item"}
                  </button>
                )}
              </div>

              {isDesktop && isFormOpen && (
                <form onSubmit={handleSubmit} style={styles.form}>
                  <input
                    type="text"
                    placeholder="Nome do item"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    style={styles.input}
                  />

                  <textarea
                    placeholder="Descrição"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    style={styles.textarea}
                  />

                  <input
                    type="text"
                    placeholder="Preço"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    style={styles.input}
                  />

                  <input
                    type="text"
                    placeholder="URL da imagem"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    style={styles.input}
                  />

                  <select
                    value={type}
                    onChange={(event) =>
                      setType(event.target.value as "PRODUCT" | "SERVICE")
                    }
                    style={styles.input}
                  >
                    <option value="PRODUCT">Produto</option>
                    <option value="SERVICE">Serviço</option>
                  </select>

                  <select
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    style={styles.input}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      ...styles.primaryButton,
                      opacity: isSubmitting ? 0.75 : 1,
                    }}
                  >
                    {isSubmitting ? "Criando..." : "Criar item"}
                  </button>

                  {formMessage && (
                    <p
                      style={{
                        ...styles.feedback,
                        color: formMessage.includes("sucesso")
                          ? "#15803d"
                          : "#b91c1c",
                      }}
                    >
                      {formMessage}
                    </p>
                  )}
                </form>
              )}

              {isMobile && (
                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(true)}
                    style={styles.primaryButton}
                  >
                    + Novo item
                  </button>
                </div>
              )}
            </section>

            <section style={styles.panelCard}>
              <h2 style={styles.sectionTitle}>Categorias</h2>
              <p style={styles.sectionSubtitle}>
                Crie e visualize categorias do seu catálogo.
              </p>

              {isDesktop ? (
                <>
                  <form
                    onSubmit={handleCreateCategory}
                    style={{ ...styles.form, marginTop: 14 }}
                  >
                    <input
                      type="text"
                      placeholder="Nome da categoria"
                      value={categoryName}
                      onChange={(event) => setCategoryName(event.target.value)}
                      style={styles.input}
                    />

                    <button
                      type="submit"
                      disabled={isCreatingCategory}
                      style={{
                        ...styles.primaryButton,
                        opacity: isCreatingCategory ? 0.75 : 1,
                      }}
                    >
                      {isCreatingCategory ? "Criando..." : "Criar categoria"}
                    </button>

                    {categoryMessage && (
                      <p
                        style={{
                          ...styles.feedback,
                          color: categoryMessage.includes("sucesso")
                            ? "#15803d"
                            : "#b91c1c",
                        }}
                      >
                        {categoryMessage}
                      </p>
                    )}
                  </form>

                  <div
                    style={{
                      display: "grid",
                      gap: 8,
                      marginTop: 14,
                    }}
                  >
                    {categories.length === 0 && (
                      <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                        Nenhuma categoria cadastrada.
                      </p>
                    )}

                    {categories.map((category) => (
                      <div key={category.id} style={styles.categoryListItem}>
                        {category.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    style={styles.secondaryButton}
                  >
                    Gerenciar categorias
                  </button>
                </div>
              )}
            </section>

            {isDesktop && (
              <section style={styles.panelCard}>
                <h2 style={styles.sectionTitle}>Resumo</h2>

                <div style={styles.statsGrid}>
                  <div style={{ ...styles.statCard, background: "#eef4ff" }}>
                    <span style={{ ...styles.statLabel, color: "#1d4ed8" }}>
                      Total
                    </span>
                    <strong style={styles.statValue}>{items.length}</strong>
                  </div>

                  <div style={{ ...styles.statCard, background: "#eefbf3" }}>
                    <span style={{ ...styles.statLabel, color: "#15803d" }}>
                      Ativos
                    </span>
                    <strong style={styles.statValue}>{activeItems}</strong>
                  </div>

                  <div style={{ ...styles.statCard, background: "#fff1f2" }}>
                    <span style={{ ...styles.statLabel, color: "#b91c1c" }}>
                      Inativos
                    </span>
                    <strong style={styles.statValue}>{inactiveItems}</strong>
                  </div>

                  <div style={{ ...styles.statCard, background: "#f6f0ff" }}>
                    <span style={{ ...styles.statLabel, color: "#7c3aed" }}>
                      Categorias
                    </span>
                    <strong style={styles.statValue}>
                      {categories.length}
                    </strong>
                  </div>
                </div>
              </section>
            )}
            {publicCatalogUrl && (
              <section style={styles.panelCard}>
                <h2 style={styles.sectionTitle}>Catálogo público</h2>
                <p style={styles.sectionSubtitle}>
                  Abra e compartilhe a vitrine pública da sua loja.
                </p>

                <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
                  <input
                    type="text"
                    value={publicCatalogUrl}
                    readOnly
                    style={styles.input}
                  />

                  <div style={styles.actionsRow}>
                    <a
                      href={publicCatalogUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        ...styles.primaryButton,
                        textDecoration: "none",
                        textAlign: "center",
                      }}
                    >
                      Ver catálogo
                    </a>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(publicCatalogUrl);
                          setCopiedMessage(true);

                          window.setTimeout(() => {
                            setCopiedMessage(false);
                          }, 2000);
                        } catch {
                          setCopiedMessage(false);
                          window.alert("Não foi possível copiar o link.");
                        }
                      }}
                      style={styles.secondaryButton}
                    >
                      {copiedMessage ? "Copiado!" : "Copiar link"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </aside>

          <section
            style={{
              ...styles.catalogCard,
              ...(isDesktop
                ? styles.catalogCardDesktop
                : styles.catalogCardMobile),
            }}
          >
            <div style={styles.catalogHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Itens cadastrados</h2>
                <p style={styles.sectionSubtitle}>
                  Visualize e acompanhe os itens do seu catálogo.
                </p>
              </div>
            </div>

            <div
              style={{
                ...styles.toolbar,
                ...(isDesktop ? styles.toolbarDesktop : styles.toolbarMobile),
              }}
            >
              <input
                type="text"
                placeholder="Buscar por nome ou descrição"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{ ...styles.input, minWidth: 0 }}
              />

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                style={styles.input}
              >
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as "ALL" | "ACTIVE" | "INACTIVE",
                  )
                }
                style={styles.input}
              >
                <option value="ALL">Todos os status</option>
                <option value="ACTIVE">Somente ativos</option>
                <option value="INACTIVE">Somente inativos</option>
              </select>
            </div>

            {message && <p style={styles.loadingText}>{message}</p>}

            {!message && filteredItems.length === 0 && (
              <div style={styles.emptyState}>
                Nenhum item encontrado com os filtros atuais.
              </div>
            )}

            <div
              style={{
                ...styles.itemsList,
                ...(isDesktop
                  ? styles.itemsListDesktop
                  : styles.itemsListMobile),
                flex: isDesktop ? 1 : undefined,
                minHeight: isDesktop ? 0 : undefined,
              }}
            >
              {filteredItems.map((item) => {
                const isEditing = editingItemId === item.id;

                return (
                  <article
                    key={item.id}
                    style={{
                      ...styles.itemCard,
                      background: item.active ? "#ffffff" : "#fbfcfe",
                    }}
                  >
                    {!isEditing ? (
                      <>
                        <div style={styles.itemTop}>
                          {item.imageUrl && (
                            <div style={styles.imageWrapper}>
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                style={styles.itemImage}
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={styles.itemTitleRow}>
                              <h3 style={styles.itemTitle}>{item.name}</h3>

                              <span
                                style={{
                                  ...styles.pill,
                                  background:
                                    item.type === "PRODUCT"
                                      ? "#e8f0ff"
                                      : "#e9f9ef",
                                  color:
                                    item.type === "PRODUCT"
                                      ? "#2457d6"
                                      : "#198754",
                                }}
                              >
                                {item.type === "PRODUCT"
                                  ? "Produto"
                                  : "Serviço"}
                              </span>

                              <span
                                style={{
                                  ...styles.pill,
                                  background: item.active
                                    ? "#eaf8ef"
                                    : "#fff0f0",
                                  color: item.active ? "#15803d" : "#b91c1c",
                                }}
                              >
                                {item.active ? "Ativo" : "Inativo"}
                              </span>
                            </div>

                            <p style={styles.itemDescription}>
                              {item.description ?? "Sem descrição"}
                            </p>
                          </div>

                          <div style={styles.actionsRow}>
                            <button
                              type="button"
                              onClick={() => startEditing(item)}
                              style={styles.secondaryButton}
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleActive(item.id, !item.active)
                              }
                              disabled={deactivatingItemId === item.id}
                              style={{
                                ...(item.active
                                  ? styles.dangerButton
                                  : styles.primaryButton),
                                opacity:
                                  deactivatingItemId === item.id ? 0.7 : 1,
                              }}
                            >
                              {deactivatingItemId === item.id
                                ? "Atualizando..."
                                : item.active
                                  ? "Desativar"
                                  : "Ativar"}
                            </button>
                          </div>
                        </div>

                        <div style={styles.metaRow}>
                          <span style={styles.metaBadge}>
                            Preço: {formatPrice(item.price)}
                          </span>
                          <span style={styles.metaBadge}>
                            Categoria: {item.category?.name ?? "Sem categoria"}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ display: "grid", gap: 12 }}>
                        <h3 style={{ ...styles.itemTitle, margin: 0 }}>
                          Editando item
                        </h3>

                        <input
                          type="text"
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          style={styles.input}
                          placeholder="Nome do item"
                        />

                        <textarea
                          value={editDescription}
                          onChange={(event) =>
                            setEditDescription(event.target.value)
                          }
                          rows={3}
                          style={styles.textarea}
                          placeholder="Descrição"
                        />

                        <input
                          type="text"
                          value={editPrice}
                          onChange={(event) => setEditPrice(event.target.value)}
                          style={styles.input}
                          placeholder="Preço"
                        />

                        <input
                          type="text"
                          value={editImageUrl}
                          onChange={(event) =>
                            setEditImageUrl(event.target.value)
                          }
                          style={styles.input}
                          placeholder="URL da imagem"
                        />

                        <select
                          value={editType}
                          onChange={(event) =>
                            setEditType(
                              event.target.value as "PRODUCT" | "SERVICE",
                            )
                          }
                          style={styles.input}
                        >
                          <option value="PRODUCT">Produto</option>
                          <option value="SERVICE">Serviço</option>
                        </select>

                        <select
                          value={editCategoryId}
                          onChange={(event) =>
                            setEditCategoryId(event.target.value)
                          }
                          style={styles.input}
                        >
                          <option value="">Sem categoria</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>

                        <div style={styles.actionsRow}>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item.id)}
                            disabled={isSavingEdit}
                            style={{
                              ...styles.primaryButton,
                              opacity: isSavingEdit ? 0.75 : 1,
                            }}
                          >
                            {isSavingEdit ? "Salvando..." : "Salvar"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditing}
                            style={styles.secondaryButton}
                          >
                            Cancelar
                          </button>
                        </div>

                        {editMessage && (
                          <p
                            style={{
                              ...styles.feedback,
                              color: editMessage.includes("sucesso")
                                ? "#15803d"
                                : "#b91c1c",
                            }}
                          >
                            {editMessage}
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {isMobile && isItemModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.sectionTitle}>Novo item</h2>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                style={styles.secondaryButton}
              >
                Fechar
              </button>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                placeholder="Nome do item"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={styles.input}
              />

              <textarea
                placeholder="Descrição"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                style={styles.textarea}
              />

              <input
                type="text"
                placeholder="Preço"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder="URL da imagem"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                style={styles.input}
              />

              <select
                value={type}
                onChange={(event) =>
                  setType(event.target.value as "PRODUCT" | "SERVICE")
                }
                style={styles.input}
              >
                <option value="PRODUCT">Produto</option>
                <option value="SERVICE">Serviço</option>
              </select>

              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                style={styles.input}
              >
                <option value="">Sem categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...styles.primaryButton,
                  opacity: isSubmitting ? 0.75 : 1,
                }}
              >
                {isSubmitting ? "Criando..." : "Criar item"}
              </button>

              {formMessage && (
                <p
                  style={{
                    ...styles.feedback,
                    color: formMessage.includes("sucesso")
                      ? "#15803d"
                      : "#b91c1c",
                  }}
                >
                  {formMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {isMobile && isCategoryModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.sectionTitle}>Categorias</h2>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                style={styles.secondaryButton}
              >
                Fechar
              </button>
            </div>

            <form
              onSubmit={handleCreateCategory}
              style={{ ...styles.form, marginTop: 14 }}
            >
              <input
                type="text"
                placeholder="Nome da categoria"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                style={styles.input}
              />

              <button
                type="submit"
                disabled={isCreatingCategory}
                style={{
                  ...styles.primaryButton,
                  opacity: isCreatingCategory ? 0.75 : 1,
                }}
              >
                {isCreatingCategory ? "Criando..." : "Criar categoria"}
              </button>

              {categoryMessage && (
                <p
                  style={{
                    ...styles.feedback,
                    color: categoryMessage.includes("sucesso")
                      ? "#15803d"
                      : "#b91c1c",
                  }}
                >
                  {categoryMessage}
                </p>
              )}
            </form>

            <div
              style={{
                display: "grid",
                gap: 8,
                marginTop: 14,
              }}
            >
              {categories.length === 0 && (
                <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                  Nenhuma categoria cadastrada.
                </p>
              )}

              {categories.map((category) => (
                <div key={category.id} style={styles.categoryListItem}>
                  {category.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #eef4ff 0%, #f5f7fb 32%, #f7f9fc 100%)",
    color: "#18212f",
  },
  pageDesktop: {
    minHeight: "100vh",
    overflowY: "auto",
  },
  pageMobile: {
    height: "auto",
    overflow: "visible",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: 20,
  },
  containerDesktop: {
    height: "auto",
  },
  containerMobile: {
    height: "auto",
    padding: 12,
  },
  headerCard: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#64748b",
    fontWeight: 800,
  },
  pageTitle: {
    margin: "6px 0 0",
    fontSize: 32,
    lineHeight: 1.05,
    color: "#0f172a",
    fontWeight: 800,
  },
  logoutButton: {
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    padding: "11px 16px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  userBadges: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  },
  badgePrimary: {
    background: "#eef2ff",
    color: "#3730a3",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
  },
  badgeInfo: {
    background: "#ecfeff",
    color: "#155e75",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
  },
  badgeNeutral: {
    background: "#f8fafc",
    color: "#475569",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 13,
  },
  contentGrid: {
    display: "grid",
    gap: 16,
  },
  contentGridDesktop: {
    gridTemplateColumns: "350px minmax(0, 1fr)",
    alignItems: "start",
    minHeight: 0,
  },
  contentGridMobile: {
    height: "auto",
    minHeight: "auto",
  },
  sidebar: {
    display: "grid",
    gap: 16,
  },
  sidebarDesktop: {
    alignSelf: "start",
    minHeight: 0,
  },
  sidebarMobile: {
    position: "static",
    height: "auto",
    overflow: "visible",
  },
  panelCard: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 22,
    padding: 16,
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: 12,
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
    color: "#0f172a",
    fontWeight: 800,
  },
  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.45,
  },
  toggleButton: {
    border: "1px solid #dbeafe",
    background: "#ffffff",
    color: "#1d4ed8",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  form: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  },
  input: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #cfd8e3",
    fontSize: 14,
    background: "#ffffff",
    color: "#111827",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #cfd8e3",
    fontSize: 14,
    resize: "vertical",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
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
  secondaryButton: {
    border: "1px solid #cfd8e3",
    background: "#ffffff",
    color: "#0f172a",
    padding: "11px 14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerButton: {
    border: "none",
    background: "#b91c1c",
    color: "#ffffff",
    padding: "11px 14px",
    borderRadius: 12,
    fontWeight: 700,
    cursor: "pointer",
  },
  feedback: {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 14,
  },
  statCard: {
    borderRadius: 18,
    padding: 16,
    minHeight: 102,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: 34,
    lineHeight: 1,
    color: "#0f172a",
  },
  catalogCard: {
    background: "#ffffff",
    border: "1px solid #dbe4f0",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },
  catalogCardDesktop: {
    minHeight: 420,
    display: "flex",
    flexDirection: "column",
  },
  catalogCardMobile: {
    height: "auto",
    overflow: "visible",
  },
  catalogHeader: {
    marginBottom: 14,
  },
  toolbar: {
    display: "grid",
    gap: 12,
    marginBottom: 16,
  },
  toolbarDesktop: {
    gridTemplateColumns: "minmax(0, 1fr) 220px 220px",
    alignItems: "center",
  },
  toolbarMobile: {
    gridTemplateColumns: "1fr",
  },
  loadingText: {
    color: "#64748b",
    fontWeight: 700,
  },
  emptyState: {
    border: "1px dashed #cbd5e1",
    borderRadius: 18,
    padding: 24,
    textAlign: "center",
    color: "#64748b",
    fontWeight: 600,
  },
  itemsList: {
    display: "grid",
    gap: 12,
  },
  itemsListDesktop: {
    paddingRight: 0,
  },
  itemsListMobile: {
    overflow: "visible",
    paddingRight: 0,
  },
  itemCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 4px 10px rgba(15, 23, 42, 0.02)",
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: 12,
    flexWrap: "wrap",
  },
  imageWrapper: {
    width: 88,
    height: 88,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    flexShrink: 0,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  itemTitleRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTitle: {
    margin: 0,
    fontSize: 17,
    color: "#0f172a",
    fontWeight: 800,
  },
  pill: {
    padding: "5px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  itemDescription: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.45,
    fontSize: 14,
  },
  metaRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  },
  metaBadge: {
    background: "#f8fafc",
    color: "#334155",
    padding: "8px 11px",
    borderRadius: 999,
    fontSize: 12,
    border: "1px solid #edf2f7",
  },
  actionsRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  categoryListItem: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    background: "#f8fafc",
    fontSize: 14,
    fontWeight: 600,
    color: "#334155",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    padding: 12,
    zIndex: 999,
  },
  modalContent: {
    width: "100%",
    maxWidth: 640,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
};
