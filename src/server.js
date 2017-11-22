const express = require('express');
const bodyParser = require('body-parser');
const path  = require("path");
const pluralize = require('pluralize');

// -- Recast.ai
const config = require('./config');
const recastai = require('recastai').default;
const client = new recastai(config.REQUEST_TOKEN);
const api = require('./alim-confianceApi');

// -- Express
const app = express();
const port = config.PORT || 5000;

app.set('port', port);
app.use(bodyParser.json());

const html_dir = './html/';
app.use(express.static(path.join(__dirname, 'html')));

app.post('/', function(req, res) {
    console.log('[GET] /');
	res.sendFile(html_dir + 'index.html');
  });

app.post('/discover', function(req, res) {
    console.log('[GET] /discover');
	var location = req.body.conversation.memory['location'].raw;
	var filter = req.body.conversation.memory['filter'].raw;
	var rating = ''; //req.body.conversation.memory['rating'].raw;

    return api.discover(location, getFilter(filter), rating)
      .then(function(content) {
        res.json({
          replies: content,
        });
      })
      .catch(function(err) {
        console.error('api::discover error: ', err);
      });
  });
  
app.listen(port, function() {
  console.log(`App is listening on port ${port}`);
});


function getFilter(filter) {	
	
	const filters = [
	  { value: 'Restauration collective', name: 'Canteen' },
	  { value: 'Restaurant', name: 'Restaurant' },
	  { value: 'Alimentation générale', name: 'Grossery' },
	  { value: 'Alimentation générale', name: 'Food Store' },
	  { value: 'Traiteur', name: 'Caterer' },
	  { value: 'Boucherie-Charcuterie', name: 'Butchery' },
	  { value: 'Libre service', name: 'Self-service' }
	];

	var row = filters.find(function(elem) {
		return elem.name.toLowerCase() === pluralize.singular(filter.toLowerCase());
	});
	  
	if (row) {
		return row.value;
	}
	return null;
}