const Koa = require('koa');
const koaBody = require('koa-body')
const router = require('koa-router')()
const logger = require('koa-logger')
const fs = require('fs')

const app = new Koa();
// app.use(logger())
// app.use(koaBody())

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

// router.get('/', (ctx)=>{
//   // res.sendFile(__dirname + '/src/index.html');
//   // ctx.response.type = 'html';
//   // ctx.response.body = fs.createReadStream(__dirname + '/src/index.html');
//   ctx.response.body = '1'
// });


io.on('connection', (socket) => {  
  
  socket.on('new message', (data) => {
    console.log(socket.username + 'send a new message'); 
    // we tell the client to execute 'new message'
    socket.emit('res', {
      username: socket.username,
      message: data,
      type:'single'
    });
  });
  socket.on('add username', (username) => {
    // we tell the client to execute 'new message'
    socket.username = username;
    socket.broadcast.emit('res', {
      username: socket.username,
      message: 'add username',
      type:'broadcast'
    });
  });
});



// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// })

// app.use(router.routes())
// app.listen(port, host)
// consola.ready({
//   message: `Server listening on http://${host}:${port}`,
//   badge: true
// })


server.listen(3001);

