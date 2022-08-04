const getUrl = ({ landing, container }) =>
  `https://api.routing.yandex.net/v2/route?apikey=04711eb6-e99c-4155-9ce6-73fc2f961acc&waypoints=${landing.lat},${landing.lon}|${container.lat},${container.lon}&avoid_tolls=true`;

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
  const response = await fetch(
    getUrl(payloadData),
    requestOptions as RequestInit
  );
  const {route} = await response.json();
  const distance = Math.round(route.legs.reduce((acc, item) => {
    if (item.status === "OK") {
      acc += item.steps.reduce((acc, step) => acc + step.length, 0);
    }
    return acc;
  }, 0) / 1000);
  res.status(200).send({ distance });
}
