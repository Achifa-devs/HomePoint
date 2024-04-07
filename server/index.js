const { 
    express,
    path,
    fs,
    parser,
    mocha,
    morgan,
    cors,
    shortId,
    jwt,
    io
} = require('./modules');

const cookieParser = require('cookie-parser');
const greetingTime = require("greeting-time");

const sellerGetRouter = require('./routes/seller/get');
const sellerDeleteRouter = require('./routes/seller/delete');
const sellerUpdateRouter = require('./routes/seller/update');
const sellerPostRouter = require('./routes/seller/post');
   
greetingTime(new Date());
require('dotenv').config(); 

const app = express(); 
app.use(cookieParser()); 
app.use(morgan('dev'));  

app.use(cors({
  origin: '*',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'UPDATE'],
  credentials: true,
  optionsSuccessStatus: 200
})); 
 

app.use(sellerGetRouter)
app.use(sellerDeleteRouter)
app.use(sellerUpdateRouter)
app.use(sellerPostRouter)





var server = app.listen(process.env.PORT,_ => console.log('app is live @',process.env.PORT));
io(server, {cors: {origin: '*'}}).on('connection',(socket) => {
  
});
 



process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use  
});
