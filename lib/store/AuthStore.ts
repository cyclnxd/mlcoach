import { Session, User } from '@supabase/supabase-js'
import create from 'zustand/vanilla'
import supabase from '../supabase'

type authState = {
	user: User | null
	currentUserData: any
	session: Session | null
	authStateChange: any
	setSession: any
	setUserSession: any
	login: any
	register: any
	logout: any
}

const useAuthStore = create<authState>((set, get) => ({
	user: null,
	session: null,
	currentUserData: null,
	setSession: async () => {
		try {
			const session = await supabase.auth.session()
			set({ session })
			try {
				const user = await supabase.auth.user()
				set({ user })
				if (user?.id !== undefined) {
					try {
						const userData = await supabase
							.from('profiles')
							.select('*')
							.eq('id', get().user?.id)
							.single()
						set({
							currentUserData: userData?.data,
						})
					} catch (error) {
						throw error
					}
				}
			} catch (error) {
				throw error
			}
		} catch (error) {
			throw error
		}
	},
	setUserSession: (user: User, session: Session) => {
		set({ user, session })
	},
	authStateChange: callback => {
		return supabase.auth.onAuthStateChange(callback)
	},
	login: async (email: string, password: string) => {
		const { user, session, error } = await supabase.auth.signIn({
			email,
			password,
		})
		if (error) {
			throw error
		}
		if (user?.id !== undefined) {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user?.id)
				.single()
			if (error) {
				throw error
			}
			set({
				currentUserData: data,
			})
		}
		set({ user, session })
	},
	register: async (email: string, password: string, username: string) => {
		const {
			user,
			session,
			error: signUpError,
		} = await supabase.auth.signUp({ email, password }, { data: { username } })
		if (signUpError) {
			throw signUpError
		}
		const { error } = await supabase.from('profiles').insert({
			id: user?.id,
			username,
			avatar_url: null,
			is_active: true,
		})
		if (error) {
			throw error
		}
		if (user?.id !== undefined) {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user?.id)
				.single()
			if (error) {
				throw error
			}
			set({
				currentUserData: data,
			})
		}

		set({
			user,
			session,
		})
	},
	logout: async () => {
		try {
			await supabase.auth.signOut()
		} catch (error) {
			throw error
		}
		set({ user: null, session: null, currentUserData: null })
	},
}))

export default useAuthStore
