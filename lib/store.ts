import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  accountId: string
  username: string
  initials: string
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Session
  sessionId: string | null
  
  // Chat
  conversations: Conversation[]
  currentConversationId: string | null
  selectedModel: string
  region: string
  tokensUsed: number
  maxTokens: number
  
  // UI
  sidebarOpen: boolean
  
  // Actions
  login: (accountId: string, username: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setSessionId: (sessionId: string) => void
  
  createConversation: () => string
  deleteConversation: (id: string) => void
  setCurrentConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  updateConversationTitle: (id: string, title: string) => void
  
  setSelectedModel: (model: string) => void
  setRegion: (region: string) => void
  updateTokens: (used: number) => void
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const generateId = () => Math.random().toString(36).substring(2, 15)

const getInitials = (name: string) => {
  return name
    .split(/[\s._-]/)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      sessionId: null,
      conversations: [],
      currentConversationId: null,
      selectedModel: 'Claude Sonnet',
      region: 'us-east-1',
      tokensUsed: 0,
      maxTokens: 100000,
      sidebarOpen: true,
      
      // Auth actions
      login: (accountId, username) => {
        set({
          user: {
            accountId,
            username,
            initials: getInitials(username),
          },
          isAuthenticated: true,
          isLoading: false,
        })
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          conversations: [],
          currentConversationId: null,
          sessionId: null,
        })
      },

      setSessionId: (sessionId) => set({ sessionId }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Conversation actions
      createConversation: () => {
        const id = generateId()
        const newConversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        set(state => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }))
        
        return id
      },
      
      deleteConversation: (id) => {
        set(state => {
          const newConversations = state.conversations.filter(c => c.id !== id)
          return {
            conversations: newConversations,
            currentConversationId: state.currentConversationId === id 
              ? (newConversations[0]?.id ?? null)
              : state.currentConversationId,
          }
        })
      },
      
      setCurrentConversation: (id) => set({ currentConversationId: id }),
      
      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        }
        
        set(state => ({
          conversations: state.conversations.map(conv => {
            if (conv.id === conversationId) {
              const updatedMessages = [...conv.messages, newMessage]
              // Update title from first user message if it's still "New Chat"
              let title = conv.title
              if (title === 'New Chat' && message.role === 'user') {
                title = message.content.substring(0, 40) + (message.content.length > 40 ? '...' : '')
              }
              return {
                ...conv,
                title,
                messages: updatedMessages,
                updatedAt: new Date(),
              }
            }
            return conv
          }),
        }))
      },
      
      updateConversationTitle: (id, title) => {
        set(state => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, title } : conv
          ),
        }))
      },
      
      setSelectedModel: (model) => set({ selectedModel: model }),
      setRegion: (region) => set({ region }),
      updateTokens: (used) => set({ tokensUsed: used }),
      
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'cia-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionId: state.sessionId,
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        selectedModel: state.selectedModel,
        region: state.region,
      }),
    }
  )
)
