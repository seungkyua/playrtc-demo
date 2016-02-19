var conn = null;

function createPlayRTC(){
    /*
	* PlayRTC 객체 생성 및 초기화
	* @Param
	* localVideoTarget : 내 영상이 표시될 <video> 태그의 id
	* remoteVideoTarget : 상대방의 영상이 표시될 <video> 태그의 id
	* */
	conn = new PlayRTC({
          projectKey: "90eb222b-5744-4b6a-a59d-389ee406c80f",
          localMediaTarget: "callerLocalVideo",
          remoteMediaTarget: "callerRemoteVideo"
	});

    conn.on('createChannel', function(channelId) {
        $( "#main" ).show();
        $( "#first" ).hide();
    });
    conn.on('connectChannel', function(channelId) {
        $( "#main" ).show();
        $( "#first" ).hide();        
    });
    conn.on('disconnectChannel', function(channelId) {
        $( "#first" ).show();
        $( "#main" ).hide();
    });    
    

};

$(function(){
	createPlayRTC(); //PlayRTC 객체 생생 후 conn 변수에 할당
	
	/*
	 * 채널 리스트 조회 후 화면에 표시
	 * */
	conn.getChannelList(function(data){
		var channels = data.channels,
			channel = null,
			html = ""
		
		for(var i=0; i<channels.length; i++){
			channel = channels[i];
			html = html + '<li>' + (channel.channelName || channel.channelId) 
			+ '<button data-channelId="' + channel.channelId +'" >입장</button></li>';
		}
		
		$("#channelList").html(html);
	}, function(xhr, res){
		alert("Code = " + xhr.status + ", " + res.message);
	});
	
	/*
	 * 채팅방 만들기 버튼을 클릭하여 채널 생성 및 입장
	 * */
	$("#enterchannel").click(function(){
		var channelName = $("#channelName").val();
		var userId = $("#userId").val();
		var userName = $("#userName").val();
		
		if(!channelName){
			return false;
		}

		conn.createChannel({
			channel: {
				channelName: channelName
			},
			peer: {
				uid: userId,
				userName: userName
			}
		});

		$("#channelName").val("");
		return false;
	});

	/*
	 * 입장 버튼을 클릭해서 채널 입장
	 * */
	$("#channelList").on("click", "button", function(){
		var $li = $(this);
		var channelId = $li.data("channelid");
		var userId = $("#userId").val();
		var userName = $("#userName").val();

		conn.connectChannel(channelId, {
			peer: {
				uid: userId,
				userName: userName
			}
		});
		return false;
	});
	
	/*
	 * 데이터 채널을 통해 텍스트를 전송할 경우
	 * */
	$("#sendTextForm").submit(function(){
		var text = $("#sendTextInput").val();
		if(text){
			createText('<b style="color:blue;">Me ' + text + '</b>'); 
			conn.dataSend(text);
		}

		$("#sendTextInput").val("");
		return false;
	});
	
	/*
	 * 데이터 채널을 통해 파일를 전송할 경우
	 * */
	$("#sendFileForm").submit(function(){
		if(!$("#sendFileInput").val()){
			return;
		};
		var input = $("#sendFileInput").get(0),
			files = input.files,
			file = files[0];

		conn.dataSend(file);
		return false;
	});
	
	/*
	 * 접속 끊기
	 * */
	$("#channelLeave").click(function(){
		conn.disconnectChannel();
		return false;
	});
	
	/*
	 * 목록새로고침 버튼 클릭할 경우 채널 목록 갱신
	 * */
	$("#channels").click(function(){
		conn.getChannelList(function(data, status){
			var channels = data.channels,
				channel = null,
				html = ""
			
			for(var i=0; i<channels.length; i++){
				channel = channels[i];
			html = html + '<li>' + (channel.channelName || channel.channelId) 
			+ '<button data-channelId="' + channel.channelId +'" >입장</button></li>';
			}
			
			$("#channelList").html(html);
		});
		return false;
	});
});

function createText(text){
	$(".messageList > div").append("<p>" + text + "</p>");
}

