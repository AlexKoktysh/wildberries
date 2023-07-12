import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export const InputComponent = (props) => {
    const { label, options, id, setEditRows, changeFocusInput } = props;
    const [value, setValue] = useState([]);

    const change = (newValue) => {
        setValue([...newValue]);
        setEditRows(label, id, newValue);
    };
    const focus = () => {
        changeFocusInput(id);
    };

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
                change(newValue)
            }}
            value={value}
            onFocus={focus}
        />
    );
};