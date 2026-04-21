import { useState } from "react";
import Inicio from "./pages/Inicio";
import Cadastros from "./pages/Cadastros";
import "./App.css";

function App() {
  const [telaAtual, setTelaAtual] = useState<"inicio" | "cadastros">("inicio");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>Controle de Gastos</h1>
        </div>

        <nav className="header-nav">
          <button
            className={telaAtual === "inicio" ? "active" : ""}
            onClick={() => setTelaAtual("inicio")}
          >
            Transações
          </button>

          <button
            className={telaAtual === "cadastros" ? "active" : ""}
            onClick={() => setTelaAtual("cadastros")}
          >
            Cadastros
          </button>
        </nav>

        <div className="header-right" />
      </header>

      <main className="app-content">
        {telaAtual === "inicio" && <Inicio />}
        {telaAtual === "cadastros" && <Cadastros />}
      </main>
    </div>
  );
}

export default App;