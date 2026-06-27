import "./KpiCard.css";

function KpiCard({ titulo, valor, cor, tipo }) {
    function formatarValor() {
        if (tipo === "percentual") return `${valor.toFixed(1)}%`;
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    return (
        <div className="kpicard">
            <p className="kpicard-titulo">{titulo}</p>
            <p className={`kpicard-valor kpicard-valor--${cor || "neutro"}`}>
                {formatarValor()}
            </p>
        </div>
    );
}

export default KpiCard;