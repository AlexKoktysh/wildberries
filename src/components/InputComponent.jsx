import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

export const InputComponent = (props) => {
    const { label, options, id, setEditSellerRows, setEditLilloRows } = props;
    const [value, setValue] = useState([]);
    useEffect(() => {
        if (label === "Артикул в Lillo") setEditLilloRows(id, value);
        if (label === "Поставщик") setEditSellerRows(id, value);
    }, [value]);

    return (
        <Autocomplete
            multiple
            options={options}
            getOptionLabel={(option) => option?.organisation_name || option}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={label}
                />
            )}
            onChange={(event, newValue) => {
                setValue([
                    ...newValue,
                ]);
            }}
            value={value}
        />
    );
};