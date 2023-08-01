import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import { Tooltip } from '@mui/material';

export const InputComponent = (props) => {
    const { label, options, id, setEditRows, defaultValue, clear } = props;
    const [value, setValue] = useState(defaultValue[0]);

    const change = (newValue) => {
        setValue([...newValue]);
        setEditRows(label, id, newValue);
    };

    useEffect(() => {
        if (clear) return setValue([]);
    }, [clear]);

    return (
        <Autocomplete
            multiple={true}
            options={options}
            freeSolo={label === "Артикул в Lillo"}
            getOptionLabel={(option) => option?.organisation_name || option}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label={label}
                />
            )}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Tooltip key={option?.organisation_name || option} title={option?.organisation_name || option}>
                        <Chip
                            label={option?.organisation_name || option}
                            {...getTagProps({ index })}
                        />
                    </Tooltip>
                ))
            }
            sx={{ maxWidth: "300px" }}
            onChange={(event, newValue) => {
                change(newValue)
            }}
            value={value}
        />
    );
};