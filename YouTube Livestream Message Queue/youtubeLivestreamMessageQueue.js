// This code is just intended as a proof of concept

var DEBUGG=true;

function Node(content, prevNode){
	this.content=content; //a reference to the content of the node
	this.next=prevNode; // a reference to the next node
}

//Queue (implementation of a FIFO data structure)
function Queue(){
	this.length=0; //the length of the queue
	this.head=null; //a reference to the first node in the queue
	this.tail=null; //a reference to the last node in the queue
	
	/*
	add(nodeContent):
	- inserts a new node at the tail of the queue with the provided content
	- params:
		- nodeContent: a reference to the content, which should be added to the queue 
	*/
	this.add=function(nodeContent){
		var node=new Node(nodeContent,this.head);
		node.next=null;
		if(this.length==0){
			this.head=node;
		}
		else{
			this.tail.next=node;
		}
		this.tail=node;
		this.length++;
	}

	this.peek=function(){ //returns the content of the head element
		if(this.length>0)
			return this.head.content;
		else
			return null;
	}
	
	this.poll=function(){ //returns the content of the head element and removes the head-node
		if(this.length>0){
			var message=this.head.content;
			this.head=this.head.next;				
			this.length--;
			return message;
		}
		return null;
	}
}


function MessageItem(timestamp,author,message){
	this.timestamp=timestamp;
	this.author=author;
	this.message=message;
}

var messageQueue=new Queue(); //stores the selected messages
var queueMessageCounter=createMessageCounter(); // displays the number of messages, which are in the queue
var queueLayout=new QueueLayout(); // displays the fist message of the queue


// updateMessageItems is used to attach a click event handler to yt-live-chat-text-message-renderer items
setInterval(updateMessageItems, 1000/2);
function updateMessageItems(){
	var elem=document.getElementsByTagName("yt-live-chat-text-message-renderer");
	var newElementCounter=0;
	for (var i=0; i<elem.length;i++){
		if(!elem[i].classList.contains("modded")){
			elem[i].style.cursor="pointer";
			elem[i].addEventListener("click",function(){
				var content=this.querySelector("#content");
				var timestamp=content.querySelector("#timestamp").textContent;
				var author=content.querySelector("#author-name").textContent;
				var message=content.querySelector("#message").innerHTML;
				
				var messageItem=new MessageItem(timestamp,author,message);
				messageQueue.add(messageItem);
				queueMessageCounter.textContent=messageQueue.length;
				queueLayout.update();
			});
			elem[i].classList.add("modded");
			newElementCounter++;
		}
	}
	if(DEBUGG)
		console.log("Modded "+newElementCounter+" new Elements.");
}

// adds a counter to the chat-header
function createMessageCounter(){
	var messageCounter=document.getElementById("queueIndicator");
	if(messageCounter==null){	
		messageCounter=document.createElement("div");
		messageCounter.id="queueIndicator";
		
		// styling 
		messageCounter.style.height="24px";
		messageCounter.style.width="24px";
		messageCounter.style.padding="8px";
		messageCounter.style.marginRight="8px";
		messageCounter.style.backgroundColor="black";
		messageCounter.style.backgroundClip="content-box";
		messageCounter.style.color="white";
		messageCounter.style.borderRadius="50%";
		messageCounter.style.textAlign="center";
		messageCounter.style.fontSize="14px";
		messageCounter.style.lineHeight="26px";
		messageCounter.style.cursor="pointer";
			
		
		messageCounter.addEventListener("click",function(){
			if(!queueLayout.visible){
				queueLayout.show();
			}
			else{
				queueLayout.hide();
			}
		});
		
		
		// add messageCounter node to chat-header
		var text=document.createTextNode(messageQueue.length);
		messageCounter.appendChild(text);
		var layoutFrame=document.getElementsByTagName("yt-live-chat-header-renderer")[0];
		var menuIcon=document.getElementById("overflow");
		layoutFrame.insertBefore(messageCounter, menuIcon);
	}
	return messageCounter;
}



function QueueLayout(){
	this.visible=false;
	this.container=document.createElement("div");
	this.container.id="queueLayout";
	this.container.style.position="fixed";
	this.container.style.top="48px";
	this.container.style.right="0px";
	this.container.style.bottom="0px";
	this.container.style.width="500px";
	this.container.style.zIndex="5";
	this.container.style.backgroundColor="rgb(248,248,248)";
	this.container.style.padding="16px";
	this.container.style.display="none";
	
	
	this.timeViewWrapper=document.createElement("div");
	this.timeViewWrapper.style.width="20%";
	this.timeViewWrapper.style.float="left";
	
	this.timeView=document.createElement("p");
	this.timeView.textContent="";
	this.timeView.style.height="34px";
	this.timeView.style.lineHeight="34px";
	this.timeView.style.fontSize="14px";
	this.timeView.style.textAlign="right";
	this.timeView.style.paddingRight="20px";
	this.timeViewWrapper.appendChild(this.timeView);
	this.container.appendChild(this.timeViewWrapper);
	
	
	this.nameAndMessageWrapper=document.createElement("div");
	this.nameAndMessageWrapper.style.width="80%";
	this.nameAndMessageWrapper.style.float="left";

	this.nameView=document.createElement("p");
	this.nameView.textContent="";
	this.nameView.style.fontSize="24px";
	this.nameView.style.fontWeight="bold";
	this.nameAndMessageWrapper.appendChild(this.nameView);
	
	this.messageView=document.createElement("p");
	this.messageView.textContent="";
	this.messageView.style.fontSize="16px";
	this.nameAndMessageWrapper.appendChild(this.messageView);
	this.container.appendChild(this.nameAndMessageWrapper);
	
	
	this.nextElementButtonWrapper=document.createElement("div");
	this.nextElementButtonWrapper.style.textAlign="center";
	this.nextElementButtonWrapper.style.clear="left";
	
	this.nextElementButton=document.createElement("button");
	this.nextElementButton.textContent="Next message";
	this.nextElementButton.style.margin="20px 0";
	this.nextElement=function(){
		messageQueue.poll();
		this.update();
	}
	this.nextElementButton.addEventListener("click",this.nextElement.bind(this));
	this.nextElementButtonWrapper.appendChild(this.nextElementButton);
	this.container.appendChild(this.nextElementButtonWrapper);

	document.getElementsByTagName("body")[0].appendChild(this.container);
	
	this.update=function(){
		queueMessageCounter.textContent=messageQueue.length;
		var message=messageQueue.peek();
		if(message!=null){
			this.messageView.style.textAlign="left";
			this.nameAndMessageWrapper.style.width="80%";
			
			this.timeView.textContent=message.timestamp;
			this.nameView.textContent=message.author;
			this.messageView.innerHTML=message.message;
			
			
			var emoij=this.messageView.querySelectorAll("img.style-scope.yt-live-chat-text-message-renderer");
			for(var i=0; i<emoij.length;i++){
				emoij[i].style.width="20px";
				emoij[i].style.height="20px";
				emoij[i].style.verticalAlign="middle";
			}
			
			if(DEBUGG)
				console.log(message.timestamp+"  "+message.author+"  "+message.message);
		}
		else{
			this.timeView.textContent="";
			this.nameView.textContent="";
			this.messageView.textContent="No more messages left!";
			this.messageView.style.textAlign="center";
			this.nameAndMessageWrapper.style.width="100%";
		}
	}
	
	this.show=function(){
		this.container.style.display="block";
		document.querySelector("#contents.hide-on-collapse.style-scope.yt-live-chat-renderer").style.marginRight="530px";
		this.update();
		this.visible=true;
	}
	this.hide=function(){
		this.container.style.display="none";
		document.querySelector("#contents.hide-on-collapse.style-scope.yt-live-chat-renderer").style.marginRight="0";
		this.visible=false;
	}
	
}
