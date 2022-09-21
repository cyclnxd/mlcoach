import {
	ApiError,
	SupabaseClient,
	User,
	Session,
	Subscription,
} from '@supabase/supabase-js'

interface AuthState {
	login: (email: string, password: string) => Promise<{}>
	register: (email: string, password: string, username: string) => Promise<{}>
	logout: () => Promise<ApiError | null>
	getCurrentUser: () => Promise<{
		token: string | null
		user: User | null
		data: User | null
		error: ApiError | null
	}>
	getCurrentSession: () => Promise<Session | null>
	onAuthStateChange: (
		callback: (event: string, session: Session | null) => void
	) => {
		data: Subscription | null
		error: ApiError | null
	}
}

class AuthService implements AuthState {
	_supaBaseClient: SupabaseClient

	constructor(supabase) {
		this._supaBaseClient = supabase
	}

	onAuthStateChange(callback) {
		const { data, error } =
			this._supaBaseClient.auth.onAuthStateChange(callback)

		return { data, error }
	}

	async login(email: string, password: string) {
		const { user, session, error } = await this._supaBaseClient.auth.signIn({
			email,
			password,
		})
		return { user, session, error }
	}

	async register(email: string, password: string, username: string) {
		const { user, session, error } = await this._supaBaseClient.auth.signUp({
			email,
			password,
		})
		if (!error && user) {
			const { data, error } = await this._supaBaseClient
				.from('profiles')
				.insert({ id: user.id, username, is_active: true })
			return { user, session, error }
		}

		return { user, session, error }
	}

	async logout() {
		const { error } = await this._supaBaseClient.auth.signOut()
		return error
	}

	async getCurrentUser() {
		const { token, user, data, error } =
			await this._supaBaseClient.auth.api.getUserByCookie((req, res) => {
				console.log(res)
				return res
			})
		return { token, user, data, error }
	}

	async getCurrentSession() {
		const session = await this._supaBaseClient.auth.session()
		return session
	}
}

export { AuthService, AuthState }
