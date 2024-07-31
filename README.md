Code to get API info
```
const model = 'spark';
console.log(model);
const apiUrl = `https://api.api-ninjas.com/v1/cars?model=${model}`;

fetch(apiUrl, {
  method: 'GET',
  headers: {
    'X-Api-Key': '+Q7oY2WzWPvMxAYRfCVsog==L5nkF9CS3pf6Vkqr'
  }
})
  .then(response => {
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```