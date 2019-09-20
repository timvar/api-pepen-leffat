exports.handler = async (event) => {
  console.log(event);
  if (event.httpMethod === 'PUT'){
      let response = putTVShow(event);
      return done(response);
  } else if (event.httpMethod === 'GET'){
      let response = getTVShow(event);
      return done(response);
  }
};

const getTVShow = event => {
  let genre = event.pathParameters.genre;
  return tvShows[genre];
}

const tvShows = {
  news: 'Uutiset',
  nature: 'Avara Luonto',
  sports: 'Urheiluruutu'
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
