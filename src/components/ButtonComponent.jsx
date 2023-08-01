import { Button } from "@mui/material";

export const ButtonComponent = ({ submitServer, disabled, text = "Редактировать" }) => {
    const submit = () => {
        submitServer();
    };

    return (
        <Button variant='contained' onClick={submit} disabled={disabled}>{text}</Button>
    );
};