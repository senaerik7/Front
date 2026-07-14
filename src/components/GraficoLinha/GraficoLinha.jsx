import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { agregarSerieAcumulada } from "../../utils/agregarSerie";
import "./GraficoLinha.css";

const LABELS_GRANULARIDADE = {
    dia: "por dia",
    semana: "por semana",
    mes: "por mês",
    trimestre: "por trimestre",
};

function GraficoLinha({ dados }) {
    const { dadosAgregados, granularidade } = agregarSerieAcumulada(dados);
    const intervalo = Math.max(0, Math.ceil(dadosAgregados.length / 8) - 1);

    return (
        <div className="grafico-card">
            <div className="grafico-header">
                <p className="grafico-titulo">Variação do Caixa</p>
                <span className="grafico-granularidade">{LABELS_GRANULARIDADE[granularidade]}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dadosAgregados}>
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
                    <Area
                        type="linear"
                        dataKey="saldo"
                        name="Saldo"
                        stroke="#2e7d5e"
                        fill="#d0ede3"
                        dot={{ r: 4, fill: "#fff", stroke: "#2e7d5e", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default GraficoLinha;