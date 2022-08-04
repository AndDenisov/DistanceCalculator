import * as React from 'react';
import AddressAutocomplete from '../components/Autocomplete';
import Button from '@mui/material/Button';

const url = '/api/getDistance';

const getRequestOptions = (value) => ({
  method: 'POST',
  body: JSON.stringify({ landing: value.landing, container: value.container }),
});

export default function Index() {
  const [landingAddress, setLandingAddress] = React.useState(null);
  const [containerAddress, setContainerAddress] = React.useState(null);

  const fetchDistance = async () => {
    const response = await fetch(
      url,
      getRequestOptions({
        landing: {
          lat: landingAddress.data.geo_lat,
          lon: landingAddress.data.geo_lon,
        },
        container: {
          lat: containerAddress.data.geo_lat,
          lon: containerAddress.data.geo_lon,
        },
      })
    );
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <AddressAutocomplete
        label="Адрес выгрузки"
        onChange={(value) => setLandingAddress(value)}
      />
      <AddressAutocomplete
        label="Адрес сдачи контейнера"
        onChange={(value) => setContainerAddress(value)}
      />
      <Button onClick={fetchDistance}>Рассчитать расстояние</Button>
    </div>
  );
}
