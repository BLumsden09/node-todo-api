const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) =>{
//     console.log(hash);
//   });
// });

var hashPass = '$2a$10$UGBQy1wpQP1VDwt7kUgoZu.IZZ/zcTtl.vqOf9Wv72ut.EK/yV3Wy';

bcrypt.compare(password, hashPass, (err, res) => {
  console.log(res);
});
