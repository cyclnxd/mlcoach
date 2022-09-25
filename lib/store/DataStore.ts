import create from 'zustand/vanilla'
import supabase from '../supabase'
import { decode, encode } from 'base64-arraybuffer'

type userState = {
	updateUserById: any
	getUserById: any
	getUserByUsername: any
	getAllUserData: any
}
const useDataStore = create<userState>(() => ({
	updateUserById: async (id: string, data: object) => {
		const { data: user, error } = await supabase
			.from('profiles')
			.update(data)
			.match({ id })
			.single()
		if (error) throw error
		return user
	},
	getUserById: async (id: string) => {
		const { data, error } = await supabase
			.from('profiles')
			.select()
			.match({ id })
			.single()
		if (error) throw error
		return data
	},
	getUserByUsername: async (username: string) => {
		const { data, error } = await supabase
			.from('profiles')
			.select()
			.match({ username })
			.single()
		if (error) throw error
		return data
	},
	getAllUserData: async () => {
		const { data, error } = await await supabase.from('profiles').select()
		if (error) throw error
		return data
	},
	uploadThumbnail: async (file, id: string) => {
		const { error } = await supabase.storage
			.from('thumbnails')
			.upload(id, file, {
				cacheControl: '3600',
				upsert: true,
				contentType: 'File',
			})
		if (error) throw error
	},
	updateWorkByUsername: async (data: object) => {
		const { data: work, error } = await supabase
			.from('works')
			.upsert(data, { onConflict: 'id' })
			.single()

		if (error) throw error
		return work
	},
	getWorkByUsernameAndName: async (username: string, name: string) => {
		const { data, error } = await supabase
			.from('works')
			.select()
			.match({ username, name })
			.single()
		if (error) throw error
		return data
	},
	getWorksByUsername: async (username: string) => {
		const { data, error } = await supabase
			.from('works')
			.select('id, name, username, thumbnail_url, updated_at')
			.match({ username })
			.order('updated_at', { ascending: false })
		if (error) throw error
		return data
	},
	deleteWorkByUsernameAndName: async (username: string, name: string) => {
		const { data, error } = await supabase
			.from('works')
			.delete()
			.match({ username, name })
			.single()
		if (error) throw error
		return data
	},
	getPublicUrl: async (id: string) => {
		const { data, error } = await supabase.storage
			.from('thumbnails')
			.getPublicUrl(id)
		if (error) throw error
		return data
	},
}))

export default useDataStore
