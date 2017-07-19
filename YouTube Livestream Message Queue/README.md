# YouTube Livestream Message Queue
This JavaScript code adds a message queue layout to the comment section of a YouTube livestream and is just intended as a proof of concept.


## If you want to try it out, follow these steps:
(I am using Google Chrome, so the required steps may be different for your browser of choice)
1. Go to youtube.com and start watching a livestream.
2. Click on the three-dot icon at the top right of the "Live chat" container and select "Popout chat". This will open the Chat in a new browser window.
3. Right click on the title bar and select "Show as tab".
4. Open the Developer Tools (Ctrl+Shift+I).
5. Select the Console tab.
6. Paste the JavaScript code in the console and hit enter.
7. That's it, you can close the Developer tools now.


## How to use the Message Queue?
- The code adds a message counter to the right of the navbar which displays how many messages are in the queue.
- Click on a message in the chat to enqueue it.
- When you click on the counter, a container is added to the right of the screen, which displays the topmost message.
- By clicking on the "Next message" button, the current message is removed and the next one is displayed.
- When you click again on the counter the message queue layout will close.


## What does the code do?
- It adds a counter to the navbar which displays the number of messages inside the queue. On top of that a container is appended, which displays the topmost message.
- Two times a second a loop is executed which attaches a "click" event handler to the "yt-live-chat-text-message-renderer" tags. This handler enqueues a clicked message into the message queue.
- When clicked, the counter toggles the display state of the container.
