// import { useState } from 'react'
// import './App.css'
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
// import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

// const API_KEY = "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";
// // "Explain things like you would to a 10 year old learning how to code."
// const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
//   "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
// }

// function App() {
//   const [messages, setMessages] = useState([
//     {
//       message: "Hello, I'm ChatGPT! Ask me anything!",
//       sentTime: "just now",
//       sender: "ChatGPT"
//     }
//   ]);
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSend = async (message) => {
//     const newMessage = {
//       message,
//       direction: 'outgoing',
//       sender: "user"
//     };

//     const newMessages = [...messages, newMessage];
    
//     setMessages(newMessages);

//     // Initial system message to determine ChatGPT functionality
//     // How it responds, how it talks, etc.
//     setIsTyping(true);
//     await processMessageToChatGPT(newMessages);
//   };

//   async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
//     // Format messages for chatGPT API
//     // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
//     // So we need to reformat

//     let apiMessages = chatMessages.map((messageObject) => {
//       let role = "";
//       if (messageObject.sender === "ChatGPT") {
//         role = "assistant";
//       } else {
//         role = "user";
//       }
//       return { role: role, content: messageObject.message}
//     });


//     // Get the request body set up with the model we plan to use
//     // and the messages which we formatted above. We add a system message in the front to'
//     // determine how we want chatGPT to act. 
//     const apiRequestBody = {
//       "model": "gpt-3.5-turbo",
//       "messages": [
//         systemMessage,  // The system message DEFINES the logic of our chatGPT
//         ...apiMessages // The messages from our chat with ChatGPT
//       ]
//     }

//     await fetch("https://api.openai.com/v1/chat/completions", 
//     {
//       method: "POST",
//       headers: {
//         "Authorization": "Bearer " + API_KEY,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(apiRequestBody)
//     }).then((data) => {
//       return data.json();
//     }).then((data) => {
//       console.log(data);
//       setMessages([...chatMessages, {
//         message: data.choices[0].message.content,
//         sender: "ChatGPT"
//       }]);
//       setIsTyping(false);
//     });
//   }

//   return (
//     <div className="App">
//       <div style={{ position:"relative", height: "800px", width: "700px"  }}>
//         <MainContainer>
//           <ChatContainer>       
//             <MessageList 
//               scrollBehavior="smooth" 
//               typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
//             >
//               {messages.map((message, i) => {
//                 console.log(message)
//                 return <Message key={i} model={message} />
//               })}
//             </MessageList>
//             <MessageInput placeholder="Type message here" onSend={handleSend} />        
//           </ChatContainer>
//         </MainContainer>
//       </div>
//     </div>
//   )
// }

// export default App


import { useState } from "react";
import "./App.css";
import ChatWindow from "./components/ChatWindow";

const API_KEY = "AIzaSyDVkl2WbAjL1KoMHBGkm5xy3ubVq_iuJp0"; // Replace this with your actual API key

function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I assist you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: message }] }],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

      let cleanedText = "";
    
      //----------
      for (let i = 0; i < botResponse.length; i++) {
        if (botResponse[i] !== "*") {
          cleanedText += botResponse[i]; // Append only if it's not an asterisk
        }
      }

      // cleanedText += "give answer in very short according to your understanding...";
      //----------
      setMessages([...newMessages, { role: "assistant", content: cleanedText }]);

    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { role: "assistant", content: `Error: ${error.message}` }]);
    }

    setIsTyping(false);
  };

  return <ChatWindow messages={messages} isTyping={isTyping} onSend={handleSend} />;
}

export default App;
