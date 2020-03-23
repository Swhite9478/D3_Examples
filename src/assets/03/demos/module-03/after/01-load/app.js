d3.csv('data/harry_potter.csv').then(res => {
  console.log('Local csv: ', res);
});

d3.json('data/harry_potter.json').then(res => {
  console.log('Local json: ', res);
});

// To get your TMDb API key, request your key after registering. Instructions at:
// https://developers.themoviedb.org/3/getting-started/introduction

// d3.json(
//   'https://api.themoviedb.org/3/movie/671?api_key=<add your API key here>'
// ).then(res => {
//   console.log('API call: ', res);
// });

const potter = d3.csv('data/harry_potter.csv');
const rings = d3.csv('data/lord_of_the_rings.csv');

Promise.all([potter, rings]).then(res => {
  console.log('Multiple requests: ', res);
  console.log('Multiple requests concat: ', [...res[0], ...res[1]]);
});
