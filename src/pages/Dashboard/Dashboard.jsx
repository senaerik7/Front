import { useState } from "react";
import { uploadExcel } from "../../services/api";
import DropZone from "../../components/DropZone/DropZone";
import KpiCard from "../../components/KpiCard/KpiCard";
import GraficoBarras from "../../components/GraficoBarras/GraficoBarras";
import GraficoLinha from "../../components/GraficoLinha/GraficoLinha";
import "./Dashboard.css";

function Dashboard() {
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState(null);
    const [carregando, setCarregando] = useState(false);

    async function handleUpload(file) {
        setCarregando(true);
        setErro(null);
        try {
            const resultado = await uploadExcel(file);
            setDados(resultado);
        } catch (e) {
            setErro(e.message);
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <span className="dashboard-logo-icone">▣</span>
                <span className="dashboard-logo-texto">Caixa Diário</span>
            </header>

            <main className="dashboard-main">
                {!dados && (
                    <>
                        <DropZone onUpload={handleUpload} />
                        {carregando && <p className="dashboard-msg">Carregando...</p>}
                        {erro && <p className="dashboard-erro">{erro}</p>}
                    </>
                )}

                {dados && (
                    <>
                        <h2 className="dashboard-titulo">Dashboard</h2>
                        <div className="dashboard-kpis">
                            <KpiCard titulo="CAIXA" valor={dados.caixa} cor={dados.caixa >= 0 ? "verde" : "vermelho"} />
                            <KpiCard titulo="MEDIA DE RECEITA" valor={dados.media_receita} cor="verde" />
                            <KpiCard titulo="MEDIA DE DESPESAS" valor={dados.media_despesa} cor="vermelho" />
                            <KpiCard titulo="MEDIA DE LUCRO/PREJUÍZO" valor={dados.media_lucro} cor={dados.media_lucro >= 0 ? "verde" : "vermelho"} />
                        </div>
                        <div className="dashboard-graficos">
                            <GraficoBarras dados={dados.serie_diaria} />
                            <GraficoLinha dados={dados.serie_acumulado} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;