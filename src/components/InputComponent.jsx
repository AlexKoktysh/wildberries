import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';

export const InputComponent = (props) => {
    const { label, options, id, setEditRows, changeFocusInput, defaultValue, clear } = props;
    const [value, setValue] = useState([]);

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
            defaultValue={defaultValue}
            getOptionLabel={(option) => option?.organisation_name || option}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={label}
                />
            )}
            onChange={(event, newValue) => {
                change(newValue)
            }}
            value={value}
            onFocus={focus}
        />
    );
};