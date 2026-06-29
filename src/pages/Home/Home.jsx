import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-titulo">Gerencie seu caixa diário com simplicidade</h1>
                <p className="home-subtitulo">Analise planilhas existentes ou crie novas em poucos cliques</p>

                <div className="home-cards">
                    <div className="home-card" onClick={() => navigate("/dashboard")}>
                        <span className="home-card-icone">⬆</span>
                        <h2 className="home-card-titulo">Analisar Planilha</h2>
                        <p className="home-card-descricao">Faça upload de uma planilha e visualize o dashboard</p>
                    </div>

                    <div className="home-card" onClick={() => navigate("/formulario")}>
                        <span className="home-card-icone home-card-icone--verde">📄</span>
                        <h2 className="home-card-titulo">Criar Planilha</h2>
                        <p className="home-card-descricao">Monte seus lançamentos e exporte uma planilha pronta</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;