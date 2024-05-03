"use client"

import { useEffect } from 'react';

function useChatbot(chatbotId: string, domain: string) {
    useEffect(() => {
        // Inject chatbot configuration script
        const chatbotConfigScript = document.createElement('script');
        chatbotConfigScript.innerHTML = `
            window.embeddedChatbotConfig = {
                chatbotId: "${chatbotId}",
                domain: "${domain}"
            };
        `;
        document.body.appendChild(chatbotConfigScript);

        // Inject chatbot script
        const chatbotScript = document.createElement('script');
        chatbotScript.src = 'https://www.chatbase.co/embed.min.js';
        chatbotScript.setAttribute('defer', 'true');
        document.body.appendChild(chatbotScript);

        // Cleanup function to remove scripts when the component unmounts
        return () => {
            document.body.removeChild(chatbotConfigScript);
            document.body.removeChild(chatbotScript);
        };
    }, [chatbotId, domain]);
}

export default useChatbot;
