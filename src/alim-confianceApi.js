const axios = require('axios');

function discover(param) {
  return apiCall(param).then(response =>
    apiResultToList(response.data.records)
  );
}

function apiCall(param) {
  return axios.get(`https://dgal.opendatasoft.com/api/records/1.0/search/`, {
    params: {
		dataset: "export_alimconfiance",
		q: param,
		rows: 10
    },
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

  const cards = results.slice(0,10).map(e => ({
    title: e.fields.app_libelle_etablissement,
    subtitle: e.fields.synthese_eval_sanit
  }));
  return [
    {
      type: 'text',
      content: "Here's what I found for you!",
    },
    { type: 'list', content: { elements: cards }},
  ];
}

module.exports = {
  discover,
};