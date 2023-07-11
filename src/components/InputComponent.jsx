import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export const InputComponent = (props) => {
    const { label, options } = props;
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
        />
    );
};