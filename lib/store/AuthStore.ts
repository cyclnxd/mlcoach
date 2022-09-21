import { Session, User } from '@supabase/supabase-js'
import create from 'zustand/vanilla'
//@ts-ignore
// import { AuthService, AuthState } from '../services/AuthService.ts'
// import supabase from '../supabase'
// //@ts-ignore
// import { UserService, UserState } from '../services/UserService.ts'

import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { userAgent } from 'next/server'

type authState = {
	user: User | null
	currentUserData: any
	session: Session | null
	authStateChange: any
	setSession: any
	setUserSession: any
	login: any
	register: any
}

// const authService: AuthState = new AuthService(supabase)
// const userService: UserState = new UserService(supabase)
const useAuthStore = create<authState>((set, get) => ({
	user: null,
	session: null,
	currentUserData: null,
	setSession: async () => {
		try {
			const session = await supabaseClient.auth.session()
			set({ session })
		} catch (error) {
			throw error
		}
		if (get().session) {
			try {
				const user = await supabaseClient.auth.user()
				set({ user })
			} catch (error) {
				throw error
			}
		}

		try {
			const userData = await supabaseClient
				.from('users')
				.select('*')
				.eq('id', get().user?.id)
				.single()
			set({
				currentUserData: userData?.data,
			})
		} catch (error) {
			throw error
		}
	},
	setUserSession: (user: User, session: Session) => {
		set({ user, session })
	},
	authStateChange: callback => {
		return supabaseClient.auth.onAuthStateChange(callback)
	},
	login: async (email: string, password: string) => {
		try {
			const { user, session } = await supabaseClient.auth.signIn({
				email,
				password,
			})
			set({ user, session })
		} catch (error) {
			throw error
		}

		try {
			const userData = await supabaseClient
				.from('users')
				.select('*')
				.eq('id', get().user?.id)
				.single()
			set({
				currentUserData: userData?.data,
			})
		} catch (error) {
			throw error
		}
	},
	register: async (email: string, password: string, username: string) => {
		try {
			const { user, session } = await supabaseClient.auth.signUp(
				{ email, password },
				{ data: { username } }
			)
			set({
				user,
				session,
			})
		} catch (error) {
			throw error
		}
		try {
			await supabaseClient.from('users').insert({
				id: get().user?.id,
				username,
				avatar_url: null,
				is_active: true,
			})
		} catch (error) {
			throw error
		}
		try {
			const userData = await supabaseClient
				.from('users')
				.select('*')
				.eq('id', get().user?.id)
				.single()
			set({
				currentUserData: userData?.data,
			})
		} catch (error) {
			throw error
		}
	},
}))

export default useAuthStore
