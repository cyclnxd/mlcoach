// import { PostgrestError, SupabaseClient } from '@supabase/supabase-js'

// interface UserState {
// 	getUserDataById: (
// 		id: string
// 	) => Promise<{ data: object | null; error: PostgrestError | null }>
// 	updateUserDataById: (
// 		id: string,
// 		data: object
// 	) => Promise<{ error: PostgrestError | null }>
// 	getAllUserData: () => Promise<{
// 		data: object | null
// 		error: PostgrestError | null
// 	}>
// }

// class UserService implements UserState {
// 	_supaBaseClient: SupabaseClient

// 	constructor(supabase) {
// 		this._supaBaseClient = supabase
// 	}
// 	async getAllUserData() {
// 		const { data, error } = await this._supaBaseClient
// 			.from('profiles')
// 			.select('*')
// 			.order('id', { ascending: true })

// 		return { data, error }
// 	}
// 	async getUserDataById(id: string) {
// 		const { data, error } = await this._supaBaseClient
// 			.from('profiles')
// 			.select('*')
// 			.eq('id', id)
// 		return { data, error }
// 	}
// 	async updateUserDataById(id: string, data: object) {
// 		const { error } = await this._supaBaseClient
// 			.from('profiles')
// 			.update(data)
// 			.eq('id', id)
// 		return { error }
// 	}
// }

// export { UserService, UserState }
