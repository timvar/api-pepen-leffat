const AWS = require('aws-sdk');

let documentClient = new AWS.DynamoDB.DocumentClient({
  'region': 'eu-west-1'
});


module.exports = class DB {
  get(key, value, table) {
    return new Promise((resolve, reject) => {

      if (!table) throw 'table needed';
      if (typeof key !== 'string') throw `key was not string and was ${JSON.stringify(key)} on table ${table}`;
      if (typeof value !== 'string') throw `value was not string and was ${JSON.stringify(value)} on table ${table}`;
      
      let params = {
        TableName: table,
        Key: {[key]: value}
      };
    
      documentClient.get(params, function(err, data) {
        if (err) {
            console.log(`There was an error fetching the data for ${key} ${value} on table ${table}`, err);
            return reject(err);
        }
        return resolve(data.Item);
      });
    })
  }

  write(genre, ID, data, table) {
    return new Promise((resolve, reject) => {

      if (typeof ID !== 'string') throw `the id must be a string and not ${ID}`;
      if (!data) throw "data is needed";
      if (!table) throw 'table name is needed';    
      
      let params = {
          TableName: table,
          Item: { ...data, ID: ID, genre: genre }
      };    
      
      documentClient.put(params, function(err, result) {
          if (err) {
              console.log("Err in writeForCall writing messages to dynamo:", err);
              console.log(params);
              return reject(err);
          }
          console.log('wrote data to table ', table)
          return resolve({ ...result.Attributes, ...params.Item });
      });
  });
  }
  
  async increment(genre, ID, table) {
    if (!table) throw 'table needed';
    if (!ID) throw 'ID needed';
    let data;
    try {
        data = await this.get('movie-genre', ID, table);
        if (!data.count) throw 'no count in data'
    } catch (err) {    
        data = { "movie-genre": ID, count: 0, genre: genre };
    };
    let newData = { ...data, count: data.count + 1 };
    return this.write(genre, ID, newData, table);
  }

  scan(key, value, table) {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: table,
            FilterExpression: `${key} = :value`,
            ExpressionAttributeValues: { ':value': value }
        };

        documentClient.scan(params, function(err, data) {
            if (err) reject(err)
            resolve(data);
        });
    });
  }
}