import { create } from "zustand"

interface UserState {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  token: localStorage.getItem("adminToken"),
  setToken: (token: string) => {
    localStorage.setItem("adminToken", token)
    set({ token })
  },
  logout: () => {
    localStorage.removeItem("adminToken")
    set({ token: null })
    window.location.href = "/login"
  },
}))
