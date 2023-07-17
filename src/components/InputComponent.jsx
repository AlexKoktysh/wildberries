import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

export const InputComponent = (props) => {
    const { label, options, id, setEditRows, changeFocusInput, defaultValue, clear } = props;
    console.log(defaultValue)
    const [value, setValue] = useState(defaultValue[0]);

    const change = (newValue) => {
        setValue([...newValue]);
        setEditRows(label, id, newValue);
    };
    const focus = () => {
        changeFocusInput(id);
    };

    useEffect(() => {
        if (clear) return setValue([]);
    }, [clear]);

    return (
        <Autocomplete
            multiple={true}
            options={options}
            getOptionLabel={(option) => option?.organisation_name || option}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={label}
                />
            )}
            sx={{ maxWidth: "300px" }}
            onChange={(event, newValue) => {
                change(newValue)
            }}
            value={value}
            onFocus={focus}
        />
    );
};