import { App } from "./App";
import React, { useEffect, useState } from "react";

export const Handler = () => {
    const [open, setOpen] = useState(false);
    const [editFields, setEditFields] = useState({});

    const focus = (id) => {
        return setEditFields((prev) => {
            if (prev.id && prev.id !== id) {
                setOpen(true);
            }
            return prev;
        });
    };

    return <App open={open} setOpen={setOpen} editFields={editFields} setEditFields={setEditFields} focus={focus} />
};