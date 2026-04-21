import { useEffect, useState } from "react";
import { api } from "../services/api";

function Inicio() {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [totais, setTotais] = useState<any>(null);
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Despesa");
  const [pessoaId, setPessoaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [modalTransacaoAberta, setModalTransacaoAberta] = useState(false);

  useEffect(() => {
  carregarTransacoes();
  carregarTotais();
  carregarPessoas();
  carregarCategorias();
  }, []);

  async function carregarTransacoes() {
    try {
      const response = await api.get("/transacoes");
      setTransacoes(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações", error);
    }
  }

  async function carregarTotais() {
  try {
    const response = await api.get("/pessoa/totais");
    setTotais(response.data);
  } catch (error) {
    console.error("Erro ao carregar totais", error);
  }
}
  async function carregarPessoas() {
    try {
      const response = await api.get("/pessoa");
      setPessoas(response.data);
    } catch (error) {
      console.error("Erro ao carregar pessoas", error);
    }
  }

  async function carregarCategorias() {
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias", error);
    }
  }

  // Função para agilizar o registro de uma transação diretamente na tela inicial
  async function criarTransacaoRapida(event: React.FormEvent) {
    event.preventDefault();

    try {
      await api.post("/transacoes", {
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId: Number(pessoaId),
        categoriaId: Number(categoriaId)
      });

      setDescricao("");
      setValor("");
      setTipo("Despesa");
      setPessoaId("");
      setCategoriaId("");
      setModalTransacaoAberta(false);

      await carregarTransacoes();
      await carregarTotais();
    } catch (error) {
      console.error("Erro ao criar transação", error);
      alert("Não foi possível criar a transação.");
    }
  }

  return (
    <div className="cards-coluna">
      <section className="card">
        <div className="secao-cabecalho">
          <h3>Movimentações</h3>
          <button type="button" onClick={() => setModalTransacaoAberta(true)}>
            Nova transação
          </button>
        </div>

        {modalTransacaoAberta && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-cabecalho">
                <h3>Transação Rápida</h3>
                <button
                  type="button"
                  className="botao-fechar"
                  onClick={() => setModalTransacaoAberta(false)}
                >
                  Fechar
                </button>
              </div>

              <form onSubmit={criarTransacaoRapida} className="formulario-bloco">
                <input
                  type="text"
                  placeholder="Descrição"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                />

                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />

                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="Despesa">Despesa</option>
                  <option value="Receita">Receita</option>
                </select>

                <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)}>
                  <option value="">Selecione uma pessoa</option>
                  {pessoas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>

                <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.descricao} ({c.finalidade})
                    </option>
                  ))}
                </select>

                <button type="submit">Registrar transação</button>
              </form>
            </div>
          </div>
        )}

        {transacoes.length === 0 ? (
          <div className="lista-vazia">Nenhuma transação encontrada.</div>
        ) : (
          <ul className="lista-apresentavel">
            {transacoes.map((t) => (
              <li key={t.id} className="lista-item">
                <div className="lista-item-info">
                  <span className="lista-item-titulo">
                    {t.descricao} — R$ {Number(t.valor).toFixed(2)}
                  </span>
                  <span className="lista-item-descricao">
                    {t.tipo} | Pessoa: {t.pessoa?.nome} | Categoria: {t.categoria?.descricao}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3 className="secao-titulo">Totais por Pessoa</h3>

        {totais && totais.pessoas.length > 0 ? (
          <>
            <ul className="lista-apresentavel">
              {totais.pessoas.map((p: any) => (
                <li key={p.id} className="lista-item">
                  <div className="lista-item-info">
                    <span className="lista-item-titulo">{p.nome}</span>
                    <span className="lista-item-descricao">
                      Receitas: R$ {Number(p.receitas).toFixed(2)} | Despesas: R$ {Number(p.despesas).toFixed(2)} | Saldo: R$ {Number(p.saldo).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div
              style={{
                marginTop: "16px",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#eff6ff",
                border: "1px solid #bfdbfe"
              }}
            >
              <strong>Total Geral</strong>
              <div style={{ marginTop: "6px", color: "#374151" }}>
                Receitas: R$ {Number(totais.totalGeral.totalReceitas).toFixed(2)} | Despesas: R$ {Number(totais.totalGeral.totalDespesas).toFixed(2)} | Saldo: R$ {Number(totais.totalGeral.saldo).toFixed(2)}
              </div>
            </div>
          </>
        ) : (
          <div className="lista-vazia">Nenhum total disponível.</div>
        )}
      </section>
    </div>
  );
}

export default Inicio;