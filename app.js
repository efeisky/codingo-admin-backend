const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');

app.use(cors({
  origin: 'https://codingo-admin.netlify.app',
  credentials: true,
}));

require('./sql/db_connection').default;
require('./Routes/get_ip')(app);
require('./Routes/login')(app);
require('./Routes/setting')(app);
require('./Routes/auth')(app);
require('./Routes/reports/reports')(app);
require('./Routes/lesson/lesson')(app);
require('./Routes/lesson/question')(app);
require('./Routes/lesson/information')(app);
require('./Routes/secret_routes/admin/admin')(app);

const server_port = process.env.SERVER_PORT || 8020;

server.listen(server_port, () => {
    console.log(`Codingo Admin Server ${server_port} portu üzerinden çalışıyor..\nhttp://localhost:${server_port}/`);
});
