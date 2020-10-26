const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    url: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password : process.env.DATABSAE_PASSWORD,
    database : process.env.DATABASE
});

exports.register = (req,res) => {
    console.log(req.body);

    const { name,email,password,passwordConfirm} = req.body;

        db.query("Select email from users where email = ? " , [email], async (err,results) =>{
            if(err){
                console.log(err);
            }
            if(results.length > 0){
                return res.render('register',{
                    message: "That email is already in use"
                })
            }else if(password !== passwordConfirm){
                return res.render('register',{
                     message:"Password do not match"
                })
            }

            let hashedPassword = await bcrypt.hash(password,8);
            console.log(hashedPassword);
            
            db.query("insert into users set ?",{name : name,email: email,password: hashedPassword}, (err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(results);
                    return res.render('register',{
                        message2: "User registered"
                    })
                }

            })
        });

}

exports.login = async (req,res) =>{
    try {
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Please Enter an Email and Password'
            });
        }

        db.query('Select * from users where email = ? ' , [email], async (error,results) =>{
           
            if(!results || await bcrypt.compare(password,results[0].password )){
                res.status(400).render('login',{
                    message:"Email or password is invalied"
                });
            }else{
                const id = results[0].id;
                const token = jwt.sign({id} ,process.env.JWT_SECRET,{
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is : ", token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24  * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt',token,cookieOptions);
                res.status(200).redirect("/welcome");
            }
           
           
            if(error){
                console.log(error);
            }else{

            }
        });

    } catch (error) {
        console.log(error);
    }
}