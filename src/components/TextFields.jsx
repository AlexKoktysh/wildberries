import { TextField } from "@mui/material";
import { useState, useEffect } from "react";

export const TextFields = ({ value, onBlur, id, clear }) => {
    const [defaul, setDefault] = useState(value);
    const [input, setInput] = useState(value);
    const onChange = (value) => {
        setInput(value);
        onBlur("reserve_qty", id, value);
    };
    useEffect(() => {
        if (clear) return setInput(defaul);
    }, [clear]);

    return (
        <TextField
            sx={{ marginY: "20px", width: "100%" }}
            label="Количество"
            value={input}
            multiline
            maxRows={4}
            onChange={(event) => onChange(event.target.value)}
        />
    );
};