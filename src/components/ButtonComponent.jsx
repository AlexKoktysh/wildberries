import { Button } from "@mui/material";

export const ButtonComponent = ({ disabled }) => {
    const submit = () => {
        console.log("submit");
    };

    return (
        <Button variant='contained' onClick={submit} disabled={disabled}>Редактировать</Button>
    );
};