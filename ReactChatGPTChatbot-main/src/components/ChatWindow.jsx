import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

function ChatWindow({ messages, isTyping, onSend }) {
  return (
    <MainContainer>
      <ChatContainer>
        <MessageList>
          {messages.map((msg, i) => (
            <Message key={i} model={{ message: msg.content, sentTime: "just now", sender: msg.role }} />
          ))}
        </MessageList>
        {isTyping && <TypingIndicator content="Assistant is typing..." />}
        <MessageInput placeholder="Type a message..." onSend={onSend} />
      </ChatContainer>
    </MainContainer>
  );
}

export default ChatWindow;
