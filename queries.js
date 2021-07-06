const Pool=require('pg').Pool;
const pool=new Pool({
    user:'webkriti',
    host:'localhost',
    database:'pages',
    password:'Ishu@123',
    port:5432,
});
const getUsers=(req,res)=>{
    pool.query('SELECT * FROM users ORDER BY id ASC',(err,results)=>{
        if(err)
        {
            throw err;
        }
        res.status(200).json(results.rows);
    })
}
const getUserById=(req,res)=>{
    const id=parseInt(req.params.id);
    pool.query('SELECT * FROM users WHERE id=$1',[id],(err,results)=>{
        if(err)
        {
            throw err;
        }
        res.status(200).json(results.rows);
    })
}
const createUser=(req,res)=>{
    const {name,username,password,email,bio,picture}=req.body;
    pool.query('INSERT INTO users(name,username,password,email,bio,picture) VALUES($1,$2,$3,$4,$5,$6)',[name,username,password,email,bio,picture],(err,results)=>{
        if(err)
        {
            throw err;
        }
        res.status(201).send(`User added with ID: ${result.insertId}`);
    })
}
const updateUser=(req,res)=>{
    const id=parseInt(req.params.id);
    const {name,username,password,email,bio,picture}=req.body;
    pool.query('UPDATE users SET name=$1,username=$2,password=$3,email=$4,bio=$5,picture=$6 WHERE id=$7'),[name,username,password,email,bio,picture,id],(err,results)=>{
        if (err)
        {
            throw err;
        }
        res.status(200).send(`User modified with ID:${id}`);
    }
}
const deleteUser=(req,res)=>{
    const id=parseInt(req.params.id);
    pool.query('DELETE FROM users WHERE id=$1',[id],(err,results)=>{
        if (err)
        {
            throw err;
        }
        res.status(200).send(`User deleted with ID: ${id}`);
    })
}
module.exports={
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}