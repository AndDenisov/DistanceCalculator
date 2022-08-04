const getUrl = ({ landing, container }) =>
  `https://api.routing.yandex.net/v2/route?apiKey=04711eb6-e99c-4155-9ce6-73fc2f961acc&waypoints=${landing.lat},${landing.lon}|${container.lat},${container.lon}&avoid_tolls=true`;

const requestOptions = {
  method: 'GET',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'text/html; charset=utf-8',
  },
};

export default async function handler(req, res) {
  const { body } = req;
  const payloadData = JSON.parse(body);
  console.log(payloadData);
  const distanceData = await fetch(
    getUrl(payloadData),
    requestOptions as RequestInit
  );
  console.log(distanceData);
  res.status(200).send({ message: 'OK' });
}
