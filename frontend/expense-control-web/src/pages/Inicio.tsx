import { useEffect, useState } from "react";
import { api } from "../services/api";

function Inicio() {

  // Estados para armazenar transações, totais, pessoas, categorias, campos do formulário e erros
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
  const [erros, setErros] = useState<any>({});
  const [erroMenorReceita, setErroMenorReceita] = useState("");
  const [totaisCategoria, setTotaisCategoria] = useState<any>(null);

  // Filtra as categorias com base no tipo selecionado (Despesa, Receita ou Ambas):
  const categoriasFiltradas = categorias.filter((c) => {
    if (c.finalidade === "Ambas") return true;
    return c.finalidade === tipo;
  });

  useEffect(() => {
  carregarTransacoes();
  carregarTotais();
  carregarPessoas();
  carregarCategorias();
  carregarTotaisCategoria();
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

  function calcularIdade(dataNascimento: string) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();

    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    return idade;
  } 

  // Função para agilizar o registro de uma transaçao diretamente na tela inicial:
  async function criarTransacaoRapida(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const novosErros: any = {};

    // Tratamento de erros, se campos estiverem vazios ou não selecionados, então exibe a mensagem de erro:
    if (!descricao) novosErros.descricao = "Descrição é obrigatória";
    if (!valor || Number(valor) <= 0) novosErros.valor = "Valor deve ser maior que zero";
    if (!pessoaId) novosErros.pessoaId = "Selecione uma pessoa";
    if (!categoriaId) novosErros.categoriaId = "Selecione uma categoria";

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    // Verificação adicional para impedir registro de receita de menores de idade:
    if (erroMenorReceita) {
      return;
    }

    setErros({});
    setErroMenorReceita("");


    try {
      await api.post("/transacoes", {
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId: Number(pessoaId),
        categoriaId: Number(categoriaId)
      });

      // Limpa os campos e fecha o modal após criar a transação:
      setDescricao("");
      setValor("");
      setTipo("Despesa");
      setPessoaId("");
      setCategoriaId("");
      setModalTransacaoAberta(false);

      await carregarTransacoes();
      await carregarTotais();
    } catch (error: any) {
      const mensagem = error?.response?.data || "Erro ao criar transação.";
      alert(mensagem);
    }
  }

  // Função para carregar os totais de receitas e despesas por categoria:
  async function carregarTotaisCategoria() {
    try {
      const response = await api.get("/categorias/totais-por-categoria");
      setTotaisCategoria(response.data);
    } catch (error) {
      console.error("Erro ao carregar totais por categoria", error);
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
                <h3>Transação</h3>
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
                  className={erros.descricao ? "input-erro" : ""}
                />
                {erros.descricao && <span className="erro-texto">{erros.descricao}</span>}

                <input
                  type="number"
                  step="0.01"
                  placeholder="Valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className={erros.valor ? "input-erro" : ""}
                />
                {erros.valor && <span className="erro-texto">{erros.valor}</span>}

                <select value={tipo} onChange={(e) => {
                  const novoTipo = e.target.value;
                  setTipo(novoTipo);

                  if (pessoaId) {
                    const pessoaSelecionada = pessoas.find(p => p.id === Number(pessoaId));

                    if (pessoaSelecionada) {
                      const idade = calcularIdade(pessoaSelecionada.dataNascimento);

                      if (idade < 18 && novoTipo === "Receita") {
                        setErroMenorReceita("Menores de idade não podem gerar receita");
                        return;
                      }
                    }
                  }

                  setErroMenorReceita("");
                }} className={erroMenorReceita ? "input-erro" : ""}>
                  <option value="Despesa">Despesa</option>
                  <option value="Receita">Receita</option>
                </select>

                <select value={pessoaId} onChange={(e) => {
                  const novaPessoaId = e.target.value;
                  setPessoaId(novaPessoaId);

                  const pessoaSelecionada = pessoas.find(p => p.id === Number(novaPessoaId));

                  if (pessoaSelecionada) {
                    const idade = calcularIdade(pessoaSelecionada.dataNascimento);

                    if (idade < 18 && tipo === "Receita") {
                      setErroMenorReceita("Menores de idade não podem gerar receita");
                      return;
                    }
                  }

                  setErroMenorReceita("");
                }} className={erros.pessoaId ? "input-erro" : ""}>
                  <option value="">Selecione uma pessoa</option>
                  {pessoas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
                {erros.pessoaId && <span className="erro-texto">{erros.pessoaId}</span>}

                <select
                  value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className={erros.categoriaId ? "input-erro" : ""}>
                  <option value="">Selecione uma categoria</option>
                  {categoriasFiltradas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.descricao}
                    </option>
                  ))}
                </select>
                {erros.categoriaId && <span className="erro-texto">{erros.categoriaId}</span>}
                <button type="submit">Registrar transação</button>
                {erroMenorReceita && (
                  <span className="erro-texto" style={{ marginTop: "8px", display: "block" }}>
                    {erroMenorReceita}
                  </span>
                )}
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

      <section className="card">
        <h3 className="secao-titulo">Totais por Categoria</h3>

        {totaisCategoria && totaisCategoria.categorias.length > 0 ? (
          <>
            <ul className="lista-apresentavel">
              {totaisCategoria.categorias.map((c: any) => (
                <li key={c.id} className="lista-item">
                  <div className="lista-item-info">
                    <span className="lista-item-titulo">{c.descricao}</span>
                    <span className="lista-item-descricao">
                      Receitas: R$ {Number(c.receitas).toFixed(2)} |
                      Despesas: R$ {Number(c.despesas).toFixed(2)} |
                      Saldo: R$ {Number(c.saldo).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "16px" }}>
              <strong>Total Geral</strong>
              <div>
                Receitas: R$ {Number(totaisCategoria.totalGeral.totalReceitas).toFixed(2)} |
                Despesas: R$ {Number(totaisCategoria.totalGeral.totalDespesas).toFixed(2)} |
                Saldo: R$ {Number(totaisCategoria.totalGeral.saldo).toFixed(2)}
              </div>
            </div>
          </>
        ) : (
          <div className="lista-vazia">Nenhum dado disponível.</div>
        )}
      </section>
    </div>
  );
}

export default Inicio;