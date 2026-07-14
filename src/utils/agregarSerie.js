function parseDataBR(str) {
    const [dia, mes, ano] = str.split("-").map(Number);
    return new Date(ano, mes - 1, dia);
}

function definirGranularidade(dataInicial, dataFinal) {
    const diffDias = (dataFinal - dataInicial) / (1000 * 60 * 60 * 24);

    if (diffDias <= 31) return "dia";
    if (diffDias <= 180) return "semana";
    if (diffDias <= 730) return "mes";
    return "trimestre";
}

function chaveAgrupamento(data, granularidade) {
    if (granularidade === "dia") {
        return data.toISOString().slice(0, 10);
    }

    if (granularidade === "semana") {
        const d = new Date(data);
        const diaSemana = (d.getDay() + 6) % 7;
        d.setDate(d.getDate() - diaSemana);
        return d.toISOString().slice(0, 10);
    }

    if (granularidade === "mes") {
        return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;
    }

    const trimestre = Math.floor(data.getMonth() / 3) + 1;
    return `${data.getFullYear()}-T${trimestre}`;
}

function formatarLabel(chave, granularidade) {
    if (granularidade === "dia" || granularidade === "semana") {
        const [ano, mes, dia] = chave.split("-");
        return `${dia}/${mes}`;
    }

    if (granularidade === "mes") {
        const [ano, mes] = chave.split("-");
        const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return `${nomes[Number(mes) - 1]}/${ano.slice(2)}`;
    }

    const [ano, trimestre] = chave.split("-T");
    return `${trimestre}º tri/${ano.slice(2)}`;
}

function agruparPorGranularidade(dados) {
    const datas = dados.map((item) => parseDataBR(item.data));
    const dataInicial = new Date(Math.min(...datas));
    const dataFinal = new Date(Math.max(...datas));
    const granularidade = definirGranularidade(dataInicial, dataFinal);

    const itensComData = dados.map((item) => ({
        ...item,
        _data: parseDataBR(item.data),
        _chave: chaveAgrupamento(parseDataBR(item.data), granularidade),
    }));

    itensComData.sort((a, b) => a._data - b._data);

    return { itensComData, granularidade };
}

export function agregarSerieDiaria(dados) {
    if (!dados || dados.length === 0) {
        return { dadosAgregados: [], granularidade: "dia" };
    }

    const { itensComData, granularidade } = agruparPorGranularidade(dados);
    const grupos = new Map();

    itensComData.forEach((item) => {
        if (!grupos.has(item._chave)) {
            grupos.set(item._chave, { chave: item._chave, receita: 0, despesa: 0 });
        }

        const grupo = grupos.get(item._chave);
        grupo.receita += item.receita;
        grupo.despesa += item.despesa;
    });

    const dadosAgregados = Array.from(grupos.values())
        .sort((a, b) => a.chave.localeCompare(b.chave))
        .map((grupo) => ({
            data: formatarLabel(grupo.chave, granularidade),
            receita: Math.round(grupo.receita * 100) / 100,
            despesa: Math.round(grupo.despesa * 100) / 100,
        }));

    return { dadosAgregados, granularidade };
}

export function agregarSerieAcumulada(dados) {
    if (!dados || dados.length === 0) {
        return { dadosAgregados: [], granularidade: "dia" };
    }

    const { itensComData, granularidade } = agruparPorGranularidade(dados);
    const grupos = new Map();

    itensComData.forEach((item) => {
        grupos.set(item._chave, { chave: item._chave, saldo: item.saldo });
    });

    const dadosAgregados = Array.from(grupos.values())
        .sort((a, b) => a.chave.localeCompare(b.chave))
        .map((grupo) => ({
            data: formatarLabel(grupo.chave, granularidade),
            saldo: grupo.saldo,
        }));

    return { dadosAgregados, granularidade };
}