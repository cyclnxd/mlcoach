import { Session, User } from '@supabase/supabase-js'
import create from 'zustand'
import supabase from '../supabase'

type authState = {
	user: any
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
	setSession: async () => {
		try {
			if (get()?.session !== supabase.auth.session()) {
				const session = supabase.auth.session()
				const { data: user } = await supabase
					.from('profiles')
					.select('*')
					.match({ id: session?.user?.id })
					.single()

				set({ session, user: user || session.user })
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
		set({ user: null, session: null })
	},
}))

export default useAuthStore
