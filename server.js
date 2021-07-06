const express=require('express');
const bodyParser=require('body-parser');
const bcrypt= require('bcrypt');
const session=require('express-session');
const flash=require('express-flash');
const passport=require('passport');
const initializePassport=require('./passportConfig');
initializePassport(passport);
const {pool}=require('./dbConfig');
require("dotenv").config();
const app=express();
//const db=require('./queries');
const port=process.env.port || 3000;
app.set("view engine","ejs");
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
app.use(flash());
app.get('/',(req,res)=>{
    res.render('index');
})
app.get('/users/register',(req,res)=>{
    res.render('register');
})
app.get('/users/login',(req,res)=>{
    res.render('login');
})
app.get('/users/dashboard',(req,res)=>{
    res.render('dashboard',{ user: req.user.name});
})
app.post('/users/register',async (req,res)=>{
    let { name, username, password, email, bio, picture}=req.body;
    let errors=[];
    console.log({
        name,
        username,
        password,
        email,
        bio,
        picture
    });
    
    if(!name || !username || !password || !email || !bio || !picture)
    {
        errors.push({ message: " Please enter all the fields"});
    }
    if ( errors.length>0)
    {
        res.render("register",{errors});
    }
    else
    {
        let hashedPassword= await bcrypt.hash(password,10);
        console.log(hashedPassword);
        pool.query(`SELECT * FROM users WHERE email=$1`,[email],(err,results)=>{
            if(err)
            {
                throw err;
            }
            console.log(results.rows);
            if (results.rows.length > 0)
            {
                errors.push({message: "Email already registered"});
                res.render("register",{errors});
            }
            else
            {
                pool.query(`INSERT INTO users (name, username, password, email, bio, picture) VALUES ($1,$2,$3,$4,$5,$6)`,[name,username,password,email,bio,picture],(err,results)=>{
                    if (err)
                    {
                        throw err;
                    }
                    console.log(results.rows);
                    req.flash("success_message","You are now registered. Please log-in.");
                    res.redirect('/users/login');
                })
            }
        })
    }
 });
// app.get('/users',db.getUsers);
// app.get('/users/:id',db.getUserById);
// app.post('/users',db.createUser);
// app.put('/users/:id',db.updateUser);
// app.delete('/users/:id',db.deleteUser);
app.post('/users/login',passport.authenticate("local",{
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
}))
app.listen(port,()=>{
    console.log(`The website is running at port number ${port}`);
})