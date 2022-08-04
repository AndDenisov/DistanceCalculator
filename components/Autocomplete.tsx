import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import throttle from 'lodash/throttle';

interface Suggestion {
  value: string;
  unrestricted_value: string;
  data: Record<string, string>;
}

const url =
  'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

const getRequestOptions = (value) => ({
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Token 3635187f050475b1ac72e05aa9e9d9ad7dd6a2e6 ',
  },
  body: JSON.stringify({ query: value }),
});


const fetchData = async (inputValue, callback) => {
  const response = await fetch(
    url,
    getRequestOptions(inputValue) as RequestInit
  );
  const result = await response.json();
  callback(result.suggestions);
};

export default function AddressAutocomplete({ onChange, label }) {
  const [value, setValue] = React.useState<Suggestion | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly Suggestion[]>([]);


  const fetchWithDebounce = React.useMemo(
    () =>
      throttle(
        (
          request: { input: string },
          callback: (results?: readonly Suggestion[]) => void
        ) => {
          fetchData(request.input, callback);
        },
        2000,
        {
          trailing: true,
        }
      ),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetchWithDebounce(
      { input: inputValue },
      (results?: readonly Suggestion[]) => {
        if (active) {
          let newOptions: readonly Suggestion[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setOptions(newOptions);
        }
      }
    );

    return () => {
      active = false;
    };
  }, [inputValue, value, fetchWithDebounce]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 300 }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.value
      }
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      onChange={(event: any, newValue: Suggestion | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        onChange(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} fullWidth />
      )}
      renderOption={(props, option) => {
        const label = option.value;
        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
}
