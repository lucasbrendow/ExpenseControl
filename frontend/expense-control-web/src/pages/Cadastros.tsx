import { useEffect, useState } from "react";
import { api } from "../services/api";

function Cadastros() {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [nomePessoa, setNomePessoa] = useState("");
  const [dataNascimentoPessoa, setDataNascimentoPessoa] = useState("");

  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [finalidadeCategoria, setFinalidadeCategoria] = useState("Despesa");

  const [errosPessoa, setErrosPessoa] = useState<any>({});
  const [errosCategoria, setErrosCategoria] = useState<any>({});

  useEffect(() => {
    carregarPessoas();
    carregarCategorias();
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

    // Tratamento de erros, se campos estiverem vazios ou não selecionados, então exibe a mensagem de erro:
    const erros: any = {};
    if (!nomePessoa.trim()) erros.nome = "Nome é obrigatório";
    if (!dataNascimentoPessoa) erros.dataNascimento = "Data de nascimento é obrigatória";

    if (Object.keys(erros).length > 0) {
      setErrosPessoa(erros);
      return;
    }

    setErrosPessoa({});

    try {
      await api.post("/pessoa", {
        nome: nomePessoa,
        dataNascimento: dataNascimentoPessoa
      });

      setNomePessoa("");
      setDataNascimentoPessoa("");

      await carregarPessoas();
    } catch (error: any) {
      const mensagem = error?.response?.data || "Erro ao criar pessoa.";
      alert(mensagem);
    }
  }

  async function criarCategoria(event: React.FormEvent) {
    event.preventDefault();

    // Tratamento de erros, se campos estiverem vazios ou não selecionados, então exibe a mensagem de erro:
    const erros: any = {};
    if (!descricaoCategoria.trim())
      erros.descricao = "Descrição é obrigatória";

    if (!finalidadeCategoria)
      erros.finalidade = "Selecione a finalidade";

    if (Object.keys(erros).length > 0) {
      setErrosCategoria(erros);
      return;
    }

    setErrosCategoria({});

    try {
      await api.post("/categorias", {
        descricao: descricaoCategoria,
        finalidade: finalidadeCategoria
      });

      setDescricaoCategoria("");
      setFinalidadeCategoria("Despesa");

      await carregarCategorias();
    } catch (error: any) {
      const mensagem = error?.response?.data || "Erro ao criar categoria.";
      alert(mensagem);
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

      <form onSubmit={criarPessoa} className="formulario-pessoa">
        <div className="linha-form">
          <div style={{ width: "80%" }}>
            <input
              type="text"
              placeholder="Nome"
              value={nomePessoa}
              onChange={(e) => setNomePessoa(e.target.value)}
              className={errosPessoa.nome ? "input-erro" : ""}
            />
            {errosPessoa.nome && <span className="erro-texto">{errosPessoa.nome}</span>}
          </div>

          <div style={{ width: "20%" }}>
            <input
              type="date"
              value={dataNascimentoPessoa}
              onChange={(e) => setDataNascimentoPessoa(e.target.value)}
              className={errosPessoa.dataNascimento ? "input-erro" : ""}
            />
            {errosPessoa.dataNascimento && (
              <span className="erro-texto">{errosPessoa.dataNascimento}</span>
            )}
          </div>
        </div>
        <div className="linha-botao">
          <button type="submit" className="botao-pequeno">
            Cadastrar
          </button>
        </div>
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

        <form onSubmit={criarCategoria} className="formulario-categoria">
          <div className="linha-form">
            <div style={{ width: "80%" }}>
              <input
                type="text"
                placeholder="Descrição"
                value={descricaoCategoria}
                onChange={(e) => setDescricaoCategoria(e.target.value)}
                className={errosCategoria.descricao ? "input-erro" : ""}
              />
              {errosCategoria.descricao && (
                <span className="erro-texto">{errosCategoria.descricao}</span>
              )}
            </div>

            <div style={{ width: "20%"}}>
              <select
                value={finalidadeCategoria}
                onChange={(e) => setFinalidadeCategoria(e.target.value)}
                className={errosCategoria.finalidade ? "input-erro" : ""}
                style={{ height: "46px"}}
              >
                <option value="Despesa">Despesa</option>
                <option value="Receita">Receita</option>
                <option value="Ambas">Ambas</option>
              </select>

              {errosCategoria.finalidade && (
                <span className="erro-texto">{errosCategoria.finalidade}</span>
              )}
            </div>
          </div>

          <div className="linha-botao">
            <button type="submit" className="botao-pequeno">
              Cadastrar
            </button>
          </div>
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
    </div>
  );
}

export default Cadastros;