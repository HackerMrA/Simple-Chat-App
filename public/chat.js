var socket=io.connect('https://aniruddhaghsoh.run.goorm.io/');
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback=document.getElementById('feedback'),
      onl=document.getElementById('online');
var target=document.getElementsByClassName('on');
window.setInterval(function() {
  var elem = document.getElementById('chat-window');
  elem.scrollTop = elem.scrollHeight;
}, 3000);
socket.on('connect',()=>{
	socket.emit('userid',handle1.getAttribute('value'));
});
btn.addEventListener('click',function(){
	console.log(handle.getAttribute('value'));
	socket.emit('chat',{
		message:message.value,
		handle:handle.getAttribute('value')
});
	message.value="";
});
message.addEventListener('keyup',()=>{
	socket.emit('typing',handle.getAttribute('value'));
});
socket.on('chat',function(data){
	feedback.innerHTML="";
	output.innerHTML+='<p><strong>'+data.handle+':</strong>'+data.message+'</p>';
	
});
socket.on('typing',(data)=>{
	feedback.innerHTML='<bold>'+data+'</bold> is typing...';
});
socket.on('online',(data)=>{
	console.log(data);
	var s="";
	for(var i=0;i<data.length;i++){
		var name=Object.values(data[i])[0].username;
		var key=Object.keys(data[i]);
		var x=handle1.getAttribute('value');
		s+='<li>'+name+'</li>';
}
	
online.innerHTML=s;	
});
socket.on('private',(data)=>{
	output.innerHTML+='<p>'+data+'</p>';
});