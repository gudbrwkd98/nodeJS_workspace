/*웹서버 구축하기!!*/
var http = require("http");
var fs = require("fs");//file system 내장모듈
var url = require("url");  //내장모듈
var mysql = require("mysql");//외부모듈
var con; //접속 성공시 그 정보를 보유한 객체, 이 객체가 있어야 접속된 상태에서 쿼리문을
//수행할 수 있다

var server = http.createServer(function(req,res){

        //클라이언트가 원하는 것이 무엇인지를 구분하기 위한  url 분석!!
        console.log("클라이언트의 요청 url ", req.url); //한줄로 되어 있다..즉 구분을 못한다..
        //섞여잇는 url 을 분석(parsing)하기 위해서는 전담 모듈을 이용하자!! url 내장모듈

    var parseObj = url.parse(req.url,true);

    //분석시, true 를 매개변수로 전달하면, 파라미터들을 {json}으로 묶어준다..
    //장점?  json은 객체표기법이므로, 데이터들을 .점찍고 마치 객체다루듯 접근할 수 있기 때문에
    //직관성이 높아진다..즉 다루기 쉬워진다.(배열보다 낫다 ^^)

    res.writeHead(200,{"Content-Type" : "text/html;charset=utf8"});
    var param = parseObj.query;
    if(parseObj.pathname=="/member/registForm"){//회원가입 양식디자인 폼을 원하면..
        fs.readFile("./registForm.html", "utf-8", function(error, data){
            if(error){
                console.log("읽기 실패 ㅜㅜ", error);
            }else{
                res.end(data);// html파일을 읽어들인 결과문자열을 클라이언트의 응답정보로 저장
            }
        });
    }else if(parseObj.pathname === "/member/regist"){//회원가입을 원하면...
        //mysql에 insert 할 예정
        //response.end("회원등록을 합니다");
        //클라이언트의 브라우저에서 전송되어온 파라미터(변수)들을 받아보자!!!

            var sql = "insert into member2(uid,password,uname,phone,email,addr,memo,receive) ";
            sql += "values(?,?,?,?,?,?,?,?)";//바인드 변수를 이용
            con.query(sql,[param.m_id,
                                    param.m_pass,
                                    param.m_name,
                                    param.phone+param.m_cpnumber1+param.m_cpnumber2,
                                    param.m_email+'@'+param.m_emailadd,
                                    param.m_address,
                                    param.m_memo,
                                    param.chk_info],function(error,result,field){
                if(error){
                    console.log("등록실패",error);
                }else{
                    var msg="<script>";
                    msg+="alert('가입 성공');";
                    msg+="location.href='/member/list';";// <a href=""> 동일
                    //  /member/list 로 재접속(클라이언트가 지정한 주소로 재접속함)
                    msg+="</script>";

                    res.end(msg); //응답정보 구성
                }
            });
      //쿼리수행
    }else if(parseObj.pathname==="/member/list"){
        // res.writeHead(200,{"Content-Type" : "text/html;charset=utf8"});
        // res.end("회원목록");
        //회원목록을 원하면...
        // mysql에 select 할 예정
        var sql = "select * from member2";
        con.query(sql,function(error,record,fields){
            if(error){
                ("읽어들이기 오류...",error);
            }else{
                var tag = "<table border='1px' width='80%'> ";
                 tag += "<tr>"            
                          tag +=        "<td>member2_id</td>";
                          tag +=        " <td>uid</td>";
                          tag +=        " <td>password</td>";
                          tag +=        " <td>uname</td>";
                          tag +=        " <td>phone</td>";
                          tag +=        " <td>email</td>"      ; 
                          tag +=        " <td>addr</td> "   ;       
                          tag +=        " <td>memo</td>"   ;         
                          tag +=        " <td>receive</td> "   ;          
                          tag +=  "</tr>";

                for(var i = 0 ; i < record.length;i++){
                    tag += "<tr>"            //배열의 각 요소마다 회원정보  json 추출
                    tag +=        "<td>"+record[i].member2_id+"</td>";
                    tag +=        " <td>"+record[i].uid+"</td>";
                    tag +=        " <td>"+record[i].password+"</td>";
                    tag +=        " <td>"+record[i].uname+"</td>";
                    tag +=        " <td>"+record[i].phone+"</td>";
                    tag +=        " <td>"+record[i].email+"</td>"      ; 
                    tag +=        " <td>"+record[i].addr+"</td> "   ;       
                    tag +=        " <td>"+record[i].memo+"</td>"   ;         
                    tag +=        " <td>"+record[i].receive+"</td> "   ;          
                    tag +=  "</tr>";
 
                }
                tag+="</table>";
                res.end(tag);
            }
        });

    }else if (parseObj.pathname === "/member/del"){//회원탈퇴를 원하면...

    }else if (parseObj.pathname === "/member/edit"){//회원수정을 원하면...

    }
});

function connectDB(){

  con =  mysql.createConnection({
        url:"locahost",
        user:"root",
        password:"1234",
        database:"node"
    });

}


server.listen(9000,function(){
    console.log("서버 가동중...");
    connectDB();
});