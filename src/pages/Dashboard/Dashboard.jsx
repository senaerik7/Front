import { useState, useMemo } from "react";
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
    const [diaInicio, setDiaInicio] = useState("");
    const [diaFim, setDiaFim] = useState("");

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

    const dadosFiltrados = useMemo(() => {
        if (!dados) return null;

        const inicio = diaInicio ? parseInt(diaInicio) : null;
        const fim = diaFim ? parseInt(diaFim) : null;

        const filtrarSerie = (serie) =>
            serie.filter((item) => {
                const dia = parseInt(item.data);
                if (inicio && dia < inicio) return false;
                if (fim && dia > fim) return false;
                return true;
            });

        const serieDiaria = filtrarSerie(dados.serie_diaria);
        const serieAcumulado = filtrarSerie(dados.serie_acumulado);

        const totalReceitas = serieDiaria.reduce((acc, item) => acc + item.receita, 0);
        const totalDespesas = serieDiaria.reduce((acc, item) => acc + item.despesa, 0);
        const lucro = totalReceitas - totalDespesas;
        const margem = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0;

        return {
            ...dados,
            total_receitas: totalReceitas,
            total_despesas: totalDespesas,
            lucro_acumulado: lucro,
            margem_lucro: margem,
            serie_diaria: serieDiaria,
            serie_acumulado: serieAcumulado,
        };
    }, [dados, diaInicio, diaFim]);

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

                {dadosFiltrados && (
                    <>
                        <div className="dashboard-topo">
                            <h2 className="dashboard-titulo">Dashboard</h2>
                            <div className="dashboard-filtro">
                                <label>Dia início</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="1"
                                    value={diaInicio}
                                    onChange={(e) => setDiaInicio(e.target.value)}
                                />
                                <label>Dia fim</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="31"
                                    value={diaFim}
                                    onChange={(e) => setDiaFim(e.target.value)}
                                />
                                <button onClick={() => { setDiaInicio(""); setDiaFim(""); }}>
                                    Limpar
                                </button>
                            </div>
                        </div>

                        <div className="dashboard-kpis">
                            <KpiCard titulo="TOTAL DE RECEITAS" valor={dadosFiltrados.total_receitas} cor="verde" />
                            <KpiCard titulo="TOTAL DE DESPESAS" valor={dadosFiltrados.total_despesas} cor="vermelho" />
                            <KpiCard titulo="CAIXA" valor={dadosFiltrados.lucro_acumulado} cor={dadosFiltrados.lucro_acumulado >= 0 ? "verde" : "vermelho"} />
                            <KpiCard titulo="MEDIA DE RECEITA" valor={dadosFiltrados.media_receitas} cor="verde" />
                            <KpiCard titulo="MEDIA DE DESPESAS" valor={dadosFiltrados.media_despesas} cor="vermelho" />
                            <KpiCard titulo="MEDIA DE LUCRO/PREJUÍZO" valor={dadosFiltrados.media_lucro} cor={dadosFiltrados.media_lucro >= 0 ? "verde" : "vermelho"} />
                        </div>
                        <div className="dashboard-graficos">
                            <GraficoBarras dados={dadosFiltrados.serie_diaria} />
                            <GraficoLinha dados={dadosFiltrados.serie_acumulado} />
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;