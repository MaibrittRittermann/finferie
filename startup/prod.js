const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

module.exports = function (app) {
    app.use(helmet());
    app.use(compression());

    const corsOpts = {
        origin: '*',
      
        methods: [
          'GET',
          'POST',
        ],
      
        allowedHeaders: [
          'Content-Type',
        ],
    };
      
    app.use(cors(corsOpts));
}