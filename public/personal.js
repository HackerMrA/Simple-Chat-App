var socket=io.connect('https://aniruddhaghsoh.run.goorm.io/');
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      feedback=document.getElementById('feedback'),
      onl=document.getElementById('online'),
	handle1=document.getElementById('handle1');
var target=document.getElementsByClassName('on');
console.log(handle.getAttribute('value'));
window.setInterval(function() {
  var elem = document.getElementById('chat-window');
  elem.scrollTop = elem.scrollHeight;
}, 3000);
socket.on('connect',()=>{
	socket.emit('userid',handle1.getAttribute('value'));
});
btn.addEventListener('click',function(){
	console.log(handle.getAttribute('value'));
	socket.emit('personal',{
		message:message.value,
		handle:handle.getAttribute('value'),
		to:handle2.getAttribute('value')
});
	message.value="";
});
message.addEventListener('keyup',()=>{
	socket.emit('typing',handle.getAttribute('value'));
});
socket.on('personal',function(data){
	feedback.innerHTML="";
	output.innerHTML+='<p><strong>'+data.handle+':</strong>'+data.message+'</p>';
	
});
socket.on('typing',(data)=>{
	feedback.innerHTML='<bold>'+data+'</bold> is typing...';
});



