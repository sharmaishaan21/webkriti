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
app.get('/users',db.getusers);
app.get('/users/:id',db.getuserbyid);
app.post('/users',db.createuser);
app.put('/users/:id',db.updateuser);
app.delete('/users/:id',db.deleteuser);
app.listen(port,()=>{
    console.log(`The website is running at port number ${port}`);
})