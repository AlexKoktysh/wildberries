import { Button } from "@mui/material";
import { useEffect } from "react";

export const ButtonComponent = ({ submitServer, disabled }) => {
    const submit = () => {
        submitServer();
    };

    return (
        <Button variant='contained' onClick={submit} disabled={disabled}>Редактировать</Button>
    );
};