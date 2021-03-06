const axios = require('axios');
const config = require('./config');

function discover(location, filter, rating) {
  return apiCall(location, filter).then(response =>
    apiResultToList(response.data.records)
  );
}

function apiCall(location, filter) {
				console.log(filter);
  return axios.get(`https://dgal.opendatasoft.com/api/records/1.0/search/?refine.filtre=` + filter, {
    params: {
		dataset: "export_alimconfiance",
		q: location
    }
  });
}

function apiResultToList(results) {
  if (results.length === 0) {
    return [
      {
        type: 'quickReplies',
        content: {
          title: 'Sorry, but I could not find any results for your request :(',
          buttons: [{ title: 'Start over', value: 'Start over' }],
        },
      },
    ];
  }

  const cards = results.slice().map(e => ({
    title: e.fields.app_libelle_etablissement,
    subtitle: e.fields.synthese_eval_sanit + `     (` + new Date(e.fields.date_inspection).toDateString() + `)`,
	imageUrl: `https://maps.googleapis.com/maps/api/staticmap?zoom=12&size=400x400&scale=2&maptype=roadmap&key=`+ config.GOOGLE_API_KEY + `&center=`+ e.fields.geores,
    buttons: [
      {
        type: 'web_url',
        value: `https://www.societe.com/cgi-bin/search?champs=` + e.fields.siret,
        title: 'View More',
      },
    ],
  }));
  return [
    {
      type: 'text',
      content: "Here's what I found for you!"
    },
    { type: 'list', content: { elements: cards, buttons: [] }},
  ];
}

module.exports = {
  discover
};