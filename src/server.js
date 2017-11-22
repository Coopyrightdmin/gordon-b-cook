const express = require('express');
const bodyParser = require('body-parser');
const path  = require("path");

// -- Recast.ai
const config = require('./config')
const recastai = require('recastai').default
const client = new recastai(config.REQUEST_TOKEN)
const api = require('./alim-confianceApi')

// -- Express
const app = express();
const port = config.PORT || 5000;

app.set('port', port);
app.use(bodyParser.json());

var html_dir = './html/';
app.use(express.static(path.join(__dirname, 'html')));

app.post('/', function(req, res) {
    console.log('[GET] /');
	res.sendFile(html_dir + 'index.html');
  });

app.post('/discover', function(req, res) {
    console.log('[GET] /discover');
	const param = req.body.conversation.memory['param'];
    return api.discover(param.raw)
      .then(function(list) {
        res.json({
          replies: list,
        });
      })
      .catch(function(err) {
        console.error('api::discover error: ', err);
      });
  });
  
app.listen(port, function() {
  console.log(`App is listening on port ${port}`);
});