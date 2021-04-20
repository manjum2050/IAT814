var connect = require('connect');
 var serveStatic = require('serve-static');

 connect()
     .use(serveStatic(__dirname))
     .listen(8080, () => console.log('Server running on 8080...')); // change the port number if 8080 is busy.