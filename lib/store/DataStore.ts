import create from 'zustand/vanilla'
import supabase from '../supabase'

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
	getUserById: async (id: string, select?: string) => {
		const { data, error } = await supabase
			.from('profiles')
			.select(select ? select : '*')
			.match({ id })
			.single()
		if (error) throw error
		return data
	},
	getUserByUsername: async (username: string, select?: string) => {
		const { data, error } = await supabase
			.from('profiles')
			.select(select ? select : '*')
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
	getAllWorks: async () => {
		const { data, error } = await supabase
			.from('works')
			.select('*')
			.order('created_at', { ascending: false })
		if (error) throw error
		return data
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
			.select('*')
			.match({ username })
			.order('created_at', { ascending: false })
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
	getPublicUrl: async (id: string, from: string) => {
		const { data, error } = await supabase.storage.from(from).getPublicUrl(id)
		if (error) throw error
		return data
	},
	followUser: async (
		follower: string,
		following: string,
		isFollow: boolean
	) => {
		if (follower === following) throw new Error('You cannot follow yourself')
		if (isFollow) {
			const { data, error } = await supabase
				.from('follows')
				.insert([{ follower, following }])
				.single()
			if (error) throw error
			return data
		} else {
			const { data, error } = await supabase
				.from('follows')
				.delete()
				.match({ follower, following })
				.single()
			if (error) throw error
			return data
		}
	},
	getFollowers: async (id: string) => {
		const { data, error } = await supabase
			.from('follows')
			.select('follower')
			.match({ following: id })
		if (error) throw error
		return data
	},
	getForked: async (username: string) => {
		const { data, error } = await supabase
			.from('works')
			.select('count(forked)')
			.match({ username })
		if (error) throw error
		return data
	},
}))

export default useDataStore
