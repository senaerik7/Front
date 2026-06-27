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
            const resultado = {
                total_receitas: 18400.00,
                total_despesas: 12750.00,
                lucro_acumulado: 5650.00,
                margem_lucro: 30.7,
                serie_diaria: [
                    { data: "01", receita: 1500, despesa: 700 },
                    { data: "02", receita: 1800, despesa: 1200 },
                    { data: "03", receita: 2200, despesa: 1700 },
                    { data: "04", receita: 1000, despesa: 400 },
                    { data: "05", receita: 2000, despesa: 1600 },
                    { data: "06", receita: 1400, despesa: 900 },
                    { data: "07", receita: 1900, despesa: 1300 },
                    { data: "08", receita: 2500, despesa: 1500 },
                    { data: "09", receita: 1200, despesa: 750 },
                    { data: "10", receita: 2700, despesa: 1900 },
                ],
                serie_acumulado: [
                    { data: "01", saldo: 800 },
                    { data: "02", saldo: 1400 },
                    { data: "03", saldo: 1900 },
                    { data: "04", saldo: 2500 },
                    { data: "05", saldo: 2900 },
                    { data: "06", saldo: 3400 },
                    { data: "07", saldo: 4000 },
                    { data: "08", saldo: 5000 },
                    { data: "09", saldo: 5450 },
                    { data: "10", saldo: 6250 },
                ],
            };
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
                            <KpiCard titulo="MARGEM DE LUCRO" valor={dadosFiltrados.margem_lucro} tipo="percentual" />
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