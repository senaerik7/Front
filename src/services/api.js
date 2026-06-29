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

export async function exportExcel(lancamentos, file = null) {
    const formData = new FormData();
    formData.append("lancamentos", JSON.stringify(lancamentos));
    if (file) formData.append("file", file);

    const response = await fetch(`${API_URL}/export`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) throw new Error("Erro ao gerar planilha");

    return response.blob();
}

export async function getTemplate() {
    const response = await fetch(`${API_URL}/template`);
    return response.json();
}