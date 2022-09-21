import { Session, UserCredentials } from '@supabase/supabase-js'
import create from 'zustand/vanilla'
//@ts-ignore
import { AuthService, AuthState } from '../services/AuthService.ts'
import supabase from '../supabase'
//@ts-ignore
import { UserService, UserState } from '../services/UserService.ts'

type authState = {
	user: UserCredentials | null
	currentUserData: any
	session: Session | null
	authStateChange: any
	setSession: any
	setUserSession: any
	login: any
	register: any
	logout: any
}

const authService: AuthState = new AuthService(supabase)
const userService: UserState = new UserService(supabase)
const useAuthStore = create<authState>((set, get) => ({
	user: null,
	session: null,
	currentUserData: null,
	setSession: async () => {
		const session = await authService.getCurrentSession()
		const userData = await userService.getUserDataById(session?.user.id)
		set({ user: session?.user, session, currentUserData: userData?.data[0] })
	},
	setUserSession: (user: UserCredentials, session: Session) => {
		set({ user, session })
	},
	authStateChange: callback => {
		return authService.onAuthStateChange(callback)
	},
	login: async (email: string, password: string) => {
		const { user, session, error } = await authService.login(email, password)
		const userData = await userService.getUserDataById(session?.user.id)
		if (error) throw error
		set({ user, session, currentUserData: userData?.data[0] })
	},
	register: async (email: string, password: string, username: string) => {
		const { user, session, error } = await authService.register(
			email,
			password,
			username
		)
		const userData = await userService.getUserDataById(session?.user.id)
		if (error) throw error
		set({ user, session, currentUserData: userData?.data[0] })
	},
	logout: async () => {
		const error = await authService.logout()
		if (error) throw error
		set({ user: null, session: null, currentUserData: null })
	},
}))

export default useAuthStore
