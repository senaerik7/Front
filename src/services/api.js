const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadExcel(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload/dashboard`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const erro = await response.json();
        throw new Error(erro.detail || "Erro ao fazer upload");
    }

    return response.json();
}

export async function exportExcel(lancamentos) {
    const response = await fetch(`${API_URL}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lancamentos),
    });

    if (!response.ok) throw new Error("Erro ao exportar planilha");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caixa-diario.xlsx";
    a.click();
    URL.revokeObjectURL(url);
}

export async function getTemplate() {
    const response = await fetch(`${API_URL}/template`);
    return response.json();
}

export async function uploadXlsxExistente(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload/xlsx_existente`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Erro ao ler planilha existente");

    return response.json();
}