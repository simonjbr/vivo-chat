import { create } from 'zustand';

const useChatStore = create((set) => ({
	selectedChat: null,
	setSelectedChat: (selectedChat) => set({ selectedChat }),
	messages: [],
	setMessages: (messages) => set({ messages }),
}));

export default useChatStore;
