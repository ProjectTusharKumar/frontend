import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import api from '../api';


function Chat() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);
  const messagesEndRef = useRef(null);

  const sendQuery = async () => {
    if (!query.trim()) return;

    // Add the user's query to the conversation
    setResponses(prev => [...prev, { type: 'user', text: query }]);

    // Insert a temporary "Bot is thinking..." message
    setResponses(prev => [...prev, { type: 'bot', isThinking: true }]);

    try {
      const response = await api.post('/api/chat', { queries: [query] });
      const newResponse = response.data;

      // Convert the backend response into an array of bot messages.
      // Each response is expected to include context, schema_name, and employee_data.data.
      const formattedBotMessages = Object.keys(newResponse).map(key => ({
        type: 'bot',
        context: newResponse[key].context,
        schema_name: newResponse[key].schema_name,
        data: newResponse[key].employee_data.data
      }));

      // Remove the temporary "Bot is thinking..." message and add the actual responses.
      setResponses(prev => {
        let newMessages = [...prev];
        if (newMessages.length && newMessages[newMessages.length - 1].isThinking) {
          newMessages.pop();
        }
        return [...newMessages, ...formattedBotMessages];
      });

      setQuery('');
    } catch (error) {
      console.error('Error sending query:', error);
      // Replace the temporary message with an error message.
      setResponses(prev => {
        let newMessages = [...prev];
        if (newMessages.length && newMessages[newMessages.length - 1].isThinking) {
          newMessages.pop();
        }
        newMessages.push({ type: 'bot', context: 'Error fetching response.', schema_name: '', data: '' });
        return newMessages;
      });
    }
  };

  // Auto-scroll to the bottom when new messages arrive.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [responses]);

  return (
    <div className="d-flex">
      <div className="container my-auto">
        <h2 className="text-center mb-4">Multi-Query Chat App</h2>
        <div className="card mx-auto" style={{ maxWidth: '600px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          {/* Chat History */}
          <div className="card-body flex-grow-1 overflow-auto">
            {responses.length > 0 ? (
              responses.map((msg, index) => (
                <div key={index} className="d-flex mb-3 align-items-center">
                  {msg.type === 'bot' ? (
                    <>
                      <i className="bi bi-chat-dots-fill fs-3 me-2"></i>
                      <div className="bg-light p-2 rounded" style={{ maxWidth: '70%' }}>
                        {msg.isThinking ? (
                          <div>Bot is thinking...</div>
                        ) : (
                          <div>
                            {(() => {
                              // Get context and keyword as strings.
                              const context = Array.isArray(msg.context) ? msg.context.join(', ') : msg.context;
                              const keyword = Array.isArray(msg.schema_name) ? msg.schema_name.join(', ') : msg.schema_name;
                              if (msg.data && typeof msg.data === 'object' && Object.keys(msg.data).length > 0) {
                                const keys = Object.keys(msg.data);
                                // If there's one key, display a simple sentence.
                                if (keys.length === 1) {
                                  return `For ${context}, the ${keyword} is ${msg.data[keys[0]]}.`;
                                } else {
                                  // For multiple keys, list out the details.
                                  const details = keys.map(key => `${key}: ${msg.data[key]}`).join(', ');
                                  return `For ${context}, the details are: ${details}.`;
                                }
                              }
                              return '';
                            })()}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-primary text-white p-2 rounded ms-auto" style={{ maxWidth: '70%' }}>
                        {msg.text}
                      </div>
                      <i className="bi bi-person-fill fs-3 ms-2"></i>
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-muted">No messages yet.</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input and Send Button */}
          <div className="card-footer">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={query}
                placeholder="Type your query..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendQuery(); }}
              />
              <button className="btn btn-primary" onClick={sendQuery}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
