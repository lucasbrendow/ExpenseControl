import { useEffect, useState } from "react";
import { criarPessoa, listarPessoa } from "../services/pessoaService";
import type { Pessoa } from "../types/Pessoa";

export default function Pessoa() {
  const [pessoas, setPessoa] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const carregarPessoa = async () => {
    const data = await listarPessoa();
    setPessoa(data);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();

    await criarPessoa({
      nome,
      dataNascimento,
    });

    setNome("");
    setDataNascimento("");
    await carregarPessoa();
  };

  useEffect(() => {
    carregarPessoa();
  }, []);

  return (
    <div>
      <h1>Pessoas</h1>

      <form onSubmit={salvar}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="date"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />

        <button type="submit">Salvar</button>
      </form>

      <ul>
        {pessoas.map((pessoa) => (
          <li key={pessoa.id}>
            {pessoa.nome} - {pessoa.dataNascimento}
          </li>
        ))}
      </ul>
    </div>
  );
}