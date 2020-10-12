// http 모듈로 웹서버 구축하기
var http = require('http');
var fs = require("fs"); //File system 모듈, 파일을 읽거나 쓸수있는 모듈






//서버는 클라이언트의 요청이들어오면, 반드시 응답을 해야한다..
//http 메카니즘이다.. 만약 응답을안할시 클라이언트는 무한정 서버의 응답을 기다리므로 
//무한대기 상태에 빠진다...
//서버 객체 생성시, 요청정보와 응답정를 구성할수있는 request,response 객체가 매개변수로 
//전달 될수있다..

//서버객체를 생성
var server = http.createServer(function(request,respone){
    //request 객체로는 클라이언트 요청 정보를 처리할수있고,
    //response 객체는 클라이언트에게 전송할 응답 정보를 구성할수 있다..
    console.log("클라이언트의 요청을 받았습니다");
    //컨텐츠 전송(클라이언트의 브라우저가 받게될 내용)
    // http 소통 - 편지지를 이용하여 의사소통
    // HTTP 상태코드중 200은 정상처리를 의미..(즉 서버에서 클라이언트의 요청을 정상적으로
    //처리했다는 상태 코드) 누가 정한건가? W3C 표준에 의해 정해진 것임..
    //etc..) 500 심각한 서버 에러 , 404 요청한 자원을 찾을 수 없을떄..
    // respone.writeHead(200,{"Content-Type" : "text/html;charset=utf-8"}); //편지 봉투 구성하기!!
    // var tag = "<input type=\"text\"/>";
    // tag = tag+"<button>가입</button>";

    //서버에있는 파일을 읽어들여, 클라이언트에게 전송한다!!
    // fs.readFile("./회원폼유효성체크.html","utf-8",function(error,data){
    //     respone.end(data);//클라이언트에게 응답정보 전송
    // });
    // respone.writeHead(200,{"Content-Type" : "image/jpg"}); //이미지 전송시
    // fs.readFile("../../image/7.jpg",function(error,data){
    //     respone.end(data);
    // });


    respone.writeHead(200,{"Content-Type" : "text/html,charset=utf-8"});  
    fs.readFile("./회원폼유효성체크.html","utf-8",function(error,data){
        respone.end(data);
    });


});




//접속자를 감지
/*
server.on("connection",function(){
    console.log("접속자 감지!");
});

*/



//서버 가동
/*
모든 네트워크 프로그램은 포트번호가 있어야 한다
왜? 하나의 os 내에서 수많은 네트워크 프로그램들간 엉키지 않기 위해 
ex)  오라클 1521 포트 , mysql 3306 포트...
그래서 서로 구분이 되야한다.
*/
server.listen(7777,function(){
    console.log("Server is running at 7777 port...");
});
