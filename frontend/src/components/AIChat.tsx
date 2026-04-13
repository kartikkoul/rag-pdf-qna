import React from 'react'

const AIChat = () => {
  return (
    <section className="chat">
        <div className="sectionTitle">
            <h2>AI Chat</h2>
            <p>Engage in a conversation with the AI</p>
        </div>
        
        <div className="chatArea">
            <div className="messages">
            <div className="message user">User: Hello, AI!</div>
            <div className="message ai">AI: Hello! How can I assist you today?</div>
            </div>
            <input type="text" placeholder="Type your message here..." />
        </div>
    </section>
  )
}

export default AIChat