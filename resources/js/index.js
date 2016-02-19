$(function(){
	$(".loginForm").submit(function(){
		var userName = $("#userName").val(),
			userPwd = $("#userPwd").val();
		
		if(!userName || !userPwd){
			alert("사용자 정보를 입력하세요..");
			return false;
		}
		
		return true;
	});
});