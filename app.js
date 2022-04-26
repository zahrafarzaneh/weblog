const path = require("path");
const mongoose=require('mongoose')
const connectDB= require('./config/db');
const debug = require('debug')('weblog-project')
const express = require("express");
const bodyParser=require("body-parser")
const expressLayouts=require('express-ejs-layouts');
const dotEnv = require("dotenv");
const morgan = require('morgan');
const session = require('express-session');
const MongoStore=require('connect-mongo')
const flash =require('connect-flash');
const passport = require ("passport")
const blogRoutes = require("./routes/blog");
const dashRouter=require('./routes/doshbord');
const notFond=require('./controllers/errorController')
const winston= require("./config/winston")

//* Load Config
dotEnv.config({ path: "./config/config.env" });
//CONNECT DATABASE
connectDB();

debug('connect to databace')
//passport configuration
require ("./config/passport")
const app = express();
//loggin
/* مورگان که یک میدلور است 
در حالتی که تعریفش میکنیم می اید
 و برای ما متد و استاتوس های مربوط به متد 
  است را لاگ میگیردhttp 
  */
if(process.env.NODE_ENV==="development"){
    debug('morgan Enabled')
    app.use(morgan('combined',{stream:winston.stream}))
}
//body parser
app.use(bodyParser.urlencoded({extends:false}))
app.use(bodyParser.json())
//SESSION
app.use(session({
    secret:process.env.SECRET_KEY_SESSION,
    resave:false,
    saveUninitialized:false,
    unset:"destroy",
    store: MongoStore.create({mongoUrl:'mongodb://localhost:27017/blog_db'})
}))
app.use(passport.initialize())
app.use(passport.session())
//FLASH
app.use(flash());
//* View Engine
app.use(expressLayouts)
app.set("view engine", "ejs");
app.set("layout","./layout/mainLayout")
app.set("views", "view");

//* Static Folder
app.use(express.static(path.join(__dirname, "public")));

//* Routes
app.use("/dashbord",dashRouter);
app.use(blogRoutes);
app.use("/users",require('./routes/users'))
app.use(notFond.notfond)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
);
