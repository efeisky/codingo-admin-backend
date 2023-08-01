const {randomUUID} = require('crypto');

const CreateUniqueID = () => {return 'cadm-' + randomUUID()};

module.exports = CreateUniqueID;