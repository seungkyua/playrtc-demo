$(function(){
	$(".joinForm").submit(function(){
		var userName = $("#userName").val(),
			userNickname = $("#userNickName").val(),
			userPwd = $("#userPwd").val();
		
		if(!userName || !userNickname || !userPwd){
			alert("사용자 정보를 입력하세요..");
			return false;
		}
		
		return true;
	});
});