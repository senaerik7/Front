import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./GraficoBarras.css";

function GraficoBarras({ dados }) {
    return (
        <div className="grafico-card">
            <p className="grafico-titulo">Receitas vs Despesas</p>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dados}>
                    <XAxis dataKey="data" />
                    <YAxis />
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