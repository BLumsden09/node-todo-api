// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  // db.collection('Todos').deleteOne({text: 'Training with Rich'}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({name: 'Kristofer Wright'}).then((result) => {
    console.log(result);
  })
  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b0890ee07fed7063841ece6')}).then((result) => {
    console.log(JSON.stringify(result, undefined(, 2)));
  });
  //client.close();
});
