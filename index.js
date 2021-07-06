const express=require('express');
const bodyParser=require('body-parser');
const app=express();
const db=require('./queries');
const port=3000;
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.get('/',(req,res)=>{
    res.json({info:'Node.js, express and postgres api'});
})
app.get('/users',db.getUsers);
app.get('/users/:id',db.getUserById);
app.post('/users',db.createUser);
app.put('/users/:id',db.updateUser);
app.delete('/users/:id',db.deleteUser);
app.listen(port,()=>{
    console.log(`The website is running at port number ${port}`);
})