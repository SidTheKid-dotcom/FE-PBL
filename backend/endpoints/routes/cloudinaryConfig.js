/* require('dotenv').config({ path: '../../.env' }); */
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'drsrly7uq',
  api_key: '533573756455784',
  api_secret: 'j9vg83-BGsL878ttorbF9_1MTUc'
});

module.exports = cloudinary;
