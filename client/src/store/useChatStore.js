import { create } from 'zustand';

const useChatStore = create((set) => ({
	selectedChat: null,
	setSelectedChat: (selectedChat) => set({ selectedChat }),
	// probably don't need messages here
	messages: [],
	setMessages: (messages) => set({ messages }),
}));

export default useChatStore;
