import { useEffect, useState } from "react";
import { api } from "../services/api";

function Cadastros() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [nomePessoa, setNomePessoa] = useState("");
  const [dataNascimentoPessoa, setDataNascimentoPessoa] = useState("");

  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [finalidadeCategoria, setFinalidadeCategoria] = useState("Despesa");

  const [transacoes, setTransacoes] = useState<any[]>([]);

  const [descricaoTransacao, setDescricaoTransacao] = useState("");
  const [valorTransacao, setValorTransacao] = useState("");
  const [tipoTransacao, setTipoTransacao] = useState("Despesa");
  const [pessoaIdTransacao, setPessoaIdTransacao] = useState("");
  const [categoriaIdTransacao, setCategoriaIdTransacao] = useState("");

  useEffect(() => {
    carregarPessoas();
    carregarCategorias();
    carregarTransacoes();
  }, []);

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

  async function criarPessoa(event: React.FormEvent) {
    event.preventDefault();

    try {
      await api.post("/pessoa", {
        nome: nomePessoa,
        dataNascimento: dataNascimentoPessoa
      });

      setNomePessoa("");
      setDataNascimentoPessoa("");

      await carregarPessoas();
    } catch (error) {
      console.error("Erro ao criar pessoa", error);
      alert("Não foi possível criar a pessoa.");
    }
  }

  async function criarCategoria(event: React.FormEvent) {
    event.preventDefault();

    try {
      await api.post("/categorias", {
        descricao: descricaoCategoria,
        finalidade: finalidadeCategoria
      });

      setDescricaoCategoria("");
      setFinalidadeCategoria("Despesa");

      await carregarCategorias();
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      alert("Não foi possível criar a categoria.");
    }
  }

  async function carregarTransacoes() {
    try {
      const response = await api.get("/transacoes");
      setTransacoes(response.data);
    } catch (error) {
      console.error("Erro ao carregar transações", error);
    }
  }

  async function criarTransacao(event: React.FormEvent) {
    event.preventDefault();

    try {
      await api.post("/transacoes", {
        descricao: descricaoTransacao,
        valor: Number(valorTransacao),
        tipo: tipoTransacao,
        pessoaId: Number(pessoaIdTransacao),
        categoriaId: Number(categoriaIdTransacao)
      });

      setDescricaoTransacao("");
      setValorTransacao("");
      setTipoTransacao("Despesa");
      setPessoaIdTransacao("");
      setCategoriaIdTransacao("");

      await carregarTransacoes();
    } catch (error) {
      console.error("Erro ao criar transação", error);
      alert("Não foi possível criar a transação.");
    }
  }

  async function excluirPessoa(id: number) {
    const confirmar = window.confirm("Deseja realmente excluir esta pessoa?");

    if (!confirmar) {
      return;
    }

    try {
      await api.delete(`/pessoa/${id}`);
      await carregarPessoas();
    } catch (error) {
      console.error("Erro ao excluir pessoa", error);
      alert("Não foi possível excluir a pessoa.");
    }
  }

  return (
    <div>
      <h2>Cadastros</h2>

      <section className="card">
        <h3 className="secao-titulo">Cadastro de Pessoas</h3>

        <form onSubmit={criarPessoa} className="formulario-bloco">
          <input
            type="text"
            placeholder="Nome"
            value={nomePessoa}
            onChange={(e) => setNomePessoa(e.target.value)}
          />

          <input
            type="date"
            value={dataNascimentoPessoa}
            onChange={(e) => setDataNascimentoPessoa(e.target.value)}
          />

          <button type="submit">Cadastrar pessoa</button>
        </form>

        {pessoas.length === 0 ? (
          <div className="lista-vazia">Nenhuma pessoa cadastrada.</div>
        ) : (
          <ul className="lista-apresentavel">
            {pessoas.map((p) => (
              <li key={p.id} className="lista-item">
                <div className="lista-item-info">
                  <span className="lista-item-titulo">{p.nome}</span>
                  <span className="lista-item-descricao">
                    Data de nascimento: {new Date(p.dataNascimento).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <button
                  type="button"
                  className="botao-perigo"
                  onClick={() => excluirPessoa(p.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3 className="secao-titulo">Cadastro de Categorias</h3>

        <form onSubmit={criarCategoria} className="formulario-bloco">
          <input
            type="text"
            placeholder="Descrição"
            value={descricaoCategoria}
            onChange={(e) => setDescricaoCategoria(e.target.value)}
          />

          <select
            value={finalidadeCategoria}
            onChange={(e) => setFinalidadeCategoria(e.target.value)}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
            <option value="Ambas">Ambas</option>
          </select>

          <button type="submit">Cadastrar categoria</button>
        </form>

        {categorias.length === 0 ? (
          <div className="lista-vazia">Nenhuma categoria cadastrada.</div>
        ) : (
          <ul className="lista-apresentavel">
            {categorias.map((c) => (
              <li key={c.id} className="lista-item">
                <div className="lista-item-info">
                  <span className="lista-item-titulo">{c.descricao}</span>
                  <span className="lista-item-descricao">
                    Finalidade: {c.finalidade}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3 className="secao-titulo">Cadastro de Transações</h3>

        <form onSubmit={criarTransacao} className="formulario-bloco">
          <input
            type="text"
            placeholder="Descrição"
            value={descricaoTransacao}
            onChange={(e) => setDescricaoTransacao(e.target.value)}
          />

          <input
            type="number"
            step="0.01"
            placeholder="Valor"
            value={valorTransacao}
            onChange={(e) => setValorTransacao(e.target.value)}
          />

          <select
            value={tipoTransacao}
            onChange={(e) => setTipoTransacao(e.target.value)}
          >
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>

          <select
            value={pessoaIdTransacao}
            onChange={(e) => setPessoaIdTransacao(e.target.value)}
          >
            <option value="">Selecione uma pessoa</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>

          <select
            value={categoriaIdTransacao}
            onChange={(e) => setCategoriaIdTransacao(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.descricao} ({c.finalidade})
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar transação</button>
        </form>

        {transacoes.length === 0 ? (
          <div className="lista-vazia">Nenhuma transação cadastrada.</div>
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
    </div>
  );
}

export default Cadastros;