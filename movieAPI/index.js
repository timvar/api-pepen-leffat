const DB = require('./dynamo');
const Dynamo = new DB();

exports.handler = async (event) => {
  console.log(event);
  if (event.httpMethod === 'PUT'){
      let response = await putMovie(event);
      return done(response);
  } else if (event.httpMethod === 'GET'){
      let response = await getMovie(event);
      return done(response);
  }
};

const getMovie = async event => {
  let genre = event.pathParameters.genre;
  let data = await Dynamo.scan('genre', genre, 'movie-api');
  let result = data.Items.sort((a,b) => b.count - a.count);
  result = result.map(({count, ID, genre})=> { return {count, ID, genre}});
  return data;
}

const putMovie = async event => {
  let { movie } = JSON.parse(event.body);
  let genre = event.pathParameters.genre;
  let ID = `${movie}-${genre}`;
  return Dynamo.increment(genre, ID, 'movie-api')
}

const done = response => {
  return {
      statusCode: '200',
      body: JSON.stringify(response),
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
      }
  }
}
