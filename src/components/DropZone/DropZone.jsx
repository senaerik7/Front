import { useRef } from "react";
import "./DropZone.css";

function DropZone({ onUpload }) {
    const inputRef = useRef(null);

    function handleClick() {
        inputRef.current.click();
    }

    function handleChange(e) {
        const file = e.target.files[0];
        if (file) onUpload(file);
    }

    function handleDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) onUpload(file);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    return (
        <div
            className="dropzone"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
                onChange={handleChange}
            />
            <span className="dropzone-icone">⬆</span>
            <p className="dropzone-texto">Arraste um arquivo .xlsx ou clique para selecionar</p>
        </div>
    );
}

export default DropZone;