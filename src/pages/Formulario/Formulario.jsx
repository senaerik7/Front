import { useState, useRef } from "react";
import { exportExcel } from "../../services/api";
import TabelaLancamentos from "../../components/TabelaLancamentos/TabelaLancamentos";
import "./Formulario.css";

function Formulario() {
    const [lancamentos, setLancamentos] = useState([]);
    const [arquivoExistente, setArquivoExistente] = useState(null);
    const [form, setForm] = useState({ data: "", descricao: "", tipo: "receita", valor: "" });
    const [erro, setErro] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const inputArquivoRef = useRef(null);

    function handleArquivo(e) {
        const file = e.target.files[0];
        if (file) setArquivoExistente(file);
    }

    function handleDropArquivo(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) setArquivoExistente(file);
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleAdicionar() {
        if (!form.data || !form.descricao || !form.valor) {
            setErro("Preencha todos os campos antes de adicionar.");
            return;
        }
        if (parseFloat(form.valor) <= 0) {
            setErro("O valor deve ser maior que zero.");
            return;
        }
        setErro(null);
        setLancamentos([...lancamentos, { ...form, valor: parseFloat(form.valor) }]);
        setForm({ data: "", descricao: "", tipo: "receita", valor: "" });
    }

    function handleRemover(index) {
        setLancamentos(lancamentos.filter((_, i) => i !== index));
    }

    async function handleGerar() {
        if (lancamentos.length === 0) {
            setErro("Adicione pelo menos um lançamento.");
            return;
        }
        try {
            const blob = await exportExcel(lancamentos, arquivoExistente);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "caixa-diario.xlsx";
            a.click();
            URL.revokeObjectURL(url);
            setModalAberto(true);
        } catch (e) {
            setErro("Erro ao gerar planilha. Tente novamente.");
        }
    }

    return (
        <div className="formulario-container">
            <h1 className="formulario-titulo">Novo lançamento</h1>

            <div
                className="formulario-dropzone"
                onClick={() => inputArquivoRef.current.click()}
                onDrop={handleDropArquivo}
                onDragOver={(e) => e.preventDefault()}
            >
                <input ref={inputArquivoRef} type="file" accept=".xlsx" style={{ display: "none" }} onChange={handleArquivo} />
                <span className="formulario-dropzone-icone">⬆</span>
                <p className="formulario-dropzone-texto">
                    {arquivoExistente ? arquivoExistente.name : "Adicionar a uma planilha existente"}
                </p>
                <p className="formulario-dropzone-subtexto">Opcional — arraste um .xlsx ou clique para selecionar</p>
            </div>

            <div className="formulario-campos">
                <div className="formulario-campo">
                    <label>Data</label>
                    <input type="date" name="data" value={form.data} onChange={handleChange} />
                </div>
                <div className="formulario-campo formulario-campo--largo">
                    <label>Descrição</label>
                    <input type="text" name="descricao" placeholder="Ex: Venda de produto" value={form.descricao} onChange={handleChange} />
                </div>
                <div className="formulario-campo">
                    <label>Tipo</label>
                    <select name="tipo" value={form.tipo} onChange={handleChange}>
                        <option value="receita">Receita</option>
                        <option value="despesa">Despesa</option>
                    </select>
                </div>
                <div className="formulario-campo">
                    <label>Valor</label>
                    <input type="number" name="valor" placeholder="0,00" min="0" step="0.01" value={form.valor} onChange={handleChange} />
                </div>
                <button className="formulario-btn-adicionar" onClick={handleAdicionar}>Adicionar</button>
            </div>

            {erro && <p className="formulario-erro">{erro}</p>}

            <TabelaLancamentos lancamentos={lancamentos} onRemover={handleRemover} />

            <div className="formulario-rodape">
                <button className="formulario-btn-gerar" onClick={handleGerar}>Gerar planilha</button>
            </div>

            {modalAberto && (
                <div className="formulario-modal-overlay">
                    <div className="formulario-modal">
                        <p>Planilha gerada com sucesso!</p>
                        <button onClick={() => setModalAberto(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Formulario;