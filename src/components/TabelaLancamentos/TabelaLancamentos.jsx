import "./TabelaLancamentos.css";

function TabelaLancamentos({ lancamentos, onRemover }) {
    if (lancamentos.length === 0) return null;

    return (
        <div className="tabela-container">
            <p className="tabela-titulo">Lançamentos adicionados</p>
            <table className="tabela">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>DESCRIÇÃO</th>
                        <th>TIPO</th>
                        <th>VALOR</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {lancamentos.map((l, i) => (
                        <tr key={i}>
                            <td>{(() => {
                                const partes = l.data.split("-");
                                if (partes.length === 3 && partes[0].length === 2) {
                                    return `${partes[0]}/${partes[1]}/${partes[2]}`;
                                }
                                const date = new Date(l.data + "T00:00:00");
                                return isNaN(date) ? l.data : date.toLocaleDateString("pt-BR");
                            })()}</td>
                            <td>{l.descricao}</td>
                            <td>
                                <span className={`tabela-badge tabela-badge--${l.tipo}`}>
                                    {l.tipo === "receita" ? "Receita" : "Despesa"}
                                </span>
                            </td>
                            <td>{l.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                            <td>
                                <button className="tabela-btn-remover" onClick={() => onRemover(i)}>✕</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TabelaLancamentos;