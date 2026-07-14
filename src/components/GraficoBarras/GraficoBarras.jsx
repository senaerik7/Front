import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { agregarSerieDiaria } from "../../utils/agregarSerie";
import "./GraficoBarras.css";

const LABELS_GRANULARIDADE = {
    dia: "por dia",
    semana: "por semana",
    mes: "por mês",
    trimestre: "por trimestre",
};

function GraficoBarras({ dados }) {
    const { dadosAgregados, granularidade } = agregarSerieDiaria(dados);
    const intervalo = Math.max(0, Math.ceil(dadosAgregados.length / 8) - 1);

    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <p className="grafico-titulo">Receitas vs Despesas</p>
                <span className="grafico-granularidade">{LABELS_GRANULARIDADE[granularidade]}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosAgregados}>
                    <XAxis
                        dataKey="data"
                        tick={{ fontSize: 11 }}
                        interval={intervalo}
                        angle={-35}
                        textAnchor="end"
                        height={50}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="receita" name="Receitas" fill="#4472C4" />
                    <Bar dataKey="despesa" name="Despesas" fill="#E74C3C" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default GraficoBarras;