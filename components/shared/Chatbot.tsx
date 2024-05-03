"use client";

import React from 'react';
import useChatbot from './useChatbot';

interface ChatbotProps {
    chatbotId: string;
    domain: string;
}

const ChatBot: React.FC<ChatbotProps> = ({ chatbotId, domain }) => {
    // Use the custom hook with provided chatbotId and domain
    useChatbot(chatbotId, domain);

    return null; // The component returns null, as it's only injecting scripts
};

export default ChatBot;
