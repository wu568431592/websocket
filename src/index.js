const Koa = require('koa');
const koaBody = require('koa-body')
const router = require('koa-router')()
const logger = require('koa-logger')
// const fs = require('fs')

const app = new Koa();
app.use(logger())
app.use(koaBody())

const cors = require('@koa/cors');
app.use(cors());

const host = '127.0.0.1';
const port = 3001;

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
    socket.emit('res', {
      username: socket.username,
      message: data,
      type:'single'
    });
  });
  socket.on('add username', (username) => {
    socket.username = username;
    socket.broadcast.emit('res', {
      username: socket.username,
      message: 'add username',
      type:'broadcast'
    });
  });
});

app.use((ctx, next) => {
  console.log(ctx.path)
  if (ctx.path.split('/')[1] !== 'api') {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  } else {
    next()
  }
})
router.post('/api/testPost', (ctx) => {
  ctx.status = 200
  ctx.body = 'Hello World'
})

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

app.use(router.routes())
// app.listen(port, host)


server.listen(port, host);
console.log(`Server listening on http://${host}:${port}`)

