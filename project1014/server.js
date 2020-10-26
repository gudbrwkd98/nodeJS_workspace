/* 웹서버 구축하기 */
// 모듈이란? 기능을 모아놓은 자바스크립트 파일....js
var http = require("http"); //http 내부 모듈 가져오기
var url = require("url");
var fs = require("fs");
var mysql = require("mysql");
var ejs = require("ejs");
var con;
let conStr={
    "url":"localhost",
    "user":"root",
    "password":"1234",
    "database":"node"
};
//서버 객체 생성
var server = http.createServer(function(req,res){
    var urlJson = url.parse(req.url,true);
   
    if(urlJson.pathname ==="/"){
        fs.readFile("./index.html","utf-8",function(error,data){
            if(error){
                console.log("로드 실패,,,");
            }else{
            res.writeHead(200,{"Content-Type":"text/html;charset:urf-8"});
            res.end(data);
            }
        });
    }else if(urlJson.pathname === "/member/registForm"){
        fs.readFile("./registForm.html","utf-8",function(error,data){
            if(error){
                console.log("로드 실패,,,");
            }else{
            res.writeHead(200,{"Content-Type":"text/html;charset:urf-8"});   
            res.end(data);
            }
        });
    }else if(urlJson.pathname === "/member/loginForm"){
        fs.readFile("./loginForm.html","utf-8",function(error,data){
            if(error){
                console.log("로드 실패,,,");
            }else{
            res.writeHead(200,{"Content-Type":"text/html;charset:urf-8"});
            res.end(data);
            }
        });
    } else if(urlJson.pathname ==="/member/regist"){
        //브라우저에 전송된 파라미터를 먼저 받아야 한다...
        //get 방식의 파라미터 받기

        var sql = "insert into member2(uid,password,uname,phone,email,addr,memo,receive)";
        sql+=" values(?,?,?,?,?,?,?,?)";
        var para = urlJson.query;
        con.query(sql,[para.m_id,
                              para.m_pass,
                              para.m_name,
                              para.phone+para.m_cpnumber1+para.m_cpnumber2,
                              para.m_email+"@"+para.m_emailadd,
                              para.m_address,
                              para.m_memo,
                              para.chk_info
                                ],function(error,result,field){
                                    if(error){
                                        console.log("실패",error);
                                    }else{
                                        sql = "select last_insert_id() as member2_id";
                                        con.query(sql,function(error,record,field){
                                            if(error){
                                                console,log("pk가져오기 실패",error);
                                            }else{
                                                console.log("record",record);
                                                var obj = record[0].member2_id;
                                                 for(var i =0; i<para.skill_id.length; i++){
                                                    sql = "insert into member_skill(member2_id,skill_id)";
                                                    sql+= " values('"+obj+"','"+para.skill_id[i]+"')";

                                                    con.query(sql,function(error,result,field){
                                                        if(error){
                                                            console.log("스킬실패",error);
                                                        }else{
                                                            console.log("성공");
                                                        }
                                                    });

                                                   }
                                            }
                                        });
                                   
                                    }
                                });

                                fs.readFile("./loginForm.html","utf-8",function(error,data){
                                    if(error){
                                        console.log("로드 실패,,,");
                                    }else{
                                    res.writeHead(200,{"Content-Type":"text/html;charset:urf-8"});   
                                    res.end(data);
                                    }
                                });
    } else if (urlJson.pathname === "/member/list"){ //목록보기
            var sql = "select * from member2";

            con.query(sql,function(error,record,field){
                console.log("회원목록",record);
                var tag ="<table width = '100%' border='1px'>";
                tag += "<tr>";
                tag += "<td>member2_id </td>";
                tag += "<td>uid</td>";
                tag += "<td>password</td>";
                tag += "<td>phone</td>";
                tag += "<td>email</td>";
                tag += "<td>receive</td>";
                tag += "<td>addr</td>";
                tag += "<td>memo</td>";
                tag+= "</tr>";

                for(var i = 0 ; i < record.length; i++){
                    tag += "<tr>";
                    tag += "<td><a href='/member/detail?member2_id="+record[i].member2_id+"'>"+ record[i].member2_id+"</a></td>";
                    tag += "<td>"+ record[i].uid+"</td>";
                    tag += "<td>"+ record[i].password+"</td>";
                    tag += "<td>"+ record[i].uname+"</td>";
                    tag += "<td>"+ record[i].phone+"</td>";
                    tag += "<td>"+ record[i].email+"</td>";
                    tag += "<td>"+ record[i].addr+"</td>";
                    tag += "<td>"+ record[i].memo+"</td>";
                    tag+= "</tr>";
                }

                tag += "<tr>";
                tag += "<td colspan ='9'><a href='/'>메인으로</a></td>";
                tag += "</tr>";

                tag +="</table>";

                res.writeHead(200,{"Content-Type" : "text/html; charset=utf-8"});
                res.end(tag);
            });
            
    }else if(urlJson.pathname =="/member/detail"){
            //회원의 상세 정보
        con.query("select*from member2 where member2_id ="+urlJson.query.member2_id+"",function(error,record,field){
                if(error){
                    console.log("실패");
                }else {
                    var member = record[0];
                    fs.readFile("./detail.ejs","utf-8",function(error,data){
                        if(error){
                            console.log("에러");
                        }else{
                            res.writeHead(200,{"Content-Type" : "text/html; charset=utf-8"});
                            res.end(ejs.render(data,{
                                uid:member.uid,
                                uname:member.uname,
                                m_address:member.addr
                            }));
                        }
                    });
            
                }
        });

    }
});

//mysql 접속
function getConnection(){
    con = mysql.createConnection(conStr);//json을 매개변수로 넣어주면됨
}
//서버 가동

server.listen(7878,function(){
    console.log("My Server is running at 7878 port...");
    getConnection();
});