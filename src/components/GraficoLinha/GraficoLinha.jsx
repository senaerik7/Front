import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import "./GraficoLinha.css";

function GraficoLinha({ dados }) {
    return (
        <div className="grafico-card">
            <p className="grafico-titulo">Variação do Caixa</p>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dados}>
                    <XAxis dataKey="data" />
                    <YAxis />
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