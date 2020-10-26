/*http 웹서버 구축하기*/
var http = require("http"); //필요한 모듈 가져오기
var fs = require("fs");//파일을 읽거나, 쓸수 있는 모듈
var url = require("url");
var mysql = require("mysql");
var con;
let conStr = {
    url : "locahost",
    user:"root",
    password:"1234",
    database:"node"
};


//서버객체 생성 
//request, response는 이미 nodejs자체적으로 존재하는 객체
var server = http.createServer(function(request, response){
    //클라이언트의 요청에 대한 응답 처리...(html문서를 주고받음)

        // console.log("클라이언트의 요청 url",request.url);

        var result = url.parse(request.url).pathname;
        var dataquery = url.parse(request.url,true);
        if(result === "/login"){

            // console.log("mysql 연동");
            
            var sql = "select * from hclass where id='" + dataquery.query.m_name  + "' and password = '"+ dataquery.query.m_pass + "'" ; 
            
            con.query(sql,function(error,record,field){
                if(error){
                    console.log("에러발생..",error);
                }else {
                    response.writeHead(200, {"Content-Type" : "text/html;charset=utf-8"});
                    if(record.length > 0){
                        response.end("<script>alert('인증성공');</script>");
                    }else{
                        response.end("<script>alert('인증실패'); history.back();</script>");
                    }
                }
            });

        }else if(result === "/apple"){
            console.log("사과를 드릴꼐요");
            response.end("가져가세용");
        }else if(result === "/loginForm"){
                //우리가 제작한 loginForm.html은 로컬 파일로 열면 안되고, 
                //모든 클라이언트가 인터넷 상의 주소로 접근하게 하기 위해서 
                //서버가  html내용을 읽고, 그 내용을 클라이언트에게 응답정보로 보내야 한다!!
                fs.readFile("./loginForm.html", "utf-8", function(error, data){
                    if(error){
                        console.log("읽기 실패입니다 ㅜㅜ", error);
                    }else{
                        //읽기 성공이므로, 클라이언트의 응답정보로 보내자!!
                        //HTTP 프로토콜로 데이터를 주고 받을때는, 이미 정해진 규약이 있으므로 눈에 보이지않는
                        //수많은 설정 정보값들을 서버와 클라이언트간 교환한다..
                        response.writeHead(200, {"Content-Type" : "text/html;charset=utf-8"});
                        response.end(data);
                    }
                });
        }

});
//mysql 접속

function connectDB(){
   con = mysql.createConnection({
        url:"localhost",
        user:"root",
        password:"1234",
        database:"node"
    });
}

//서버가동
server.listen(8888, function(){
    console.log("Server is running at 8888 port...");
    connectDB(); //웹서버 가동시 mysql 접속
});