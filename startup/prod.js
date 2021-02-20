const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

module.exports = function (app) {
    app.use(helmet());
    app.use(compression());

    // app.use(function(req, res, next) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    //     res.setHeader('Access-Control-Allow-Credentials', true);
    //     next();
    // });

    const corsOpts = {
        origin: '*',
      
        methods: [
          'GET',
          'POST',
          'PUT',
          'DELETE'
        ],
      
        allowedHeaders: [
          'Content-Type',
        ],
    };
      
    app.use(cors(corsOpts));
}