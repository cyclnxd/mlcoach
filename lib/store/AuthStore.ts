import { Session } from '@supabase/supabase-js'
import create from 'zustand'
import supabase from '../supabase'

type authState = {
	user: any
	session: Session | null
	setSession: any
	login: any
	register: any
	logout: any
}

const useAuthStore = create<authState>((set, get) => ({
	user: null,
	session: null,
	setSession: async () => {
		try {
			const { data } = await supabase.auth.getSession()
			if (get()?.session !== data.session) {
				const { data: user } = await supabase
					.from('profiles')
					.select('*')
					.match({ id: data.session?.user?.id })
					.single()
				set({ session: data.session, user: user || data.session.user })
			}
		} catch (error) {
			throw error
		}
	},

	login: async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		if (error) {
			throw error
		}
		get().setSession()
	},
	register: async (email: string, password: string, username: string) => {
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					username,
				},
			},
		})
		if (signUpError) {
			throw signUpError
		}
		const { error } = await supabase.from('profiles').insert({
			id: data.user?.id,
			username,
			avatar_url: null,
			is_active: true,
		})
		if (error) {
			throw error
		}

		get().setSession()
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
