import create from 'zustand/vanilla'
//@ts-ignore
import { UserService, UserState } from '../services/UserService'
import supabase from '../supabase'

type userState = {
	updateUserDataById: any
	getUserDataById: any
	getAllUserData: any
}

const userService: UserState = new UserService(supabase)
const useUserStore = create<userState>(() => ({
	updateUserDataById: async (id: string, data: object) => {
		const { error } = await userService.updateUserDataById(id, data)
		if (error) throw error
	},
	getUserDataById: async (id: string) => {
		const { data, error } = await userService.getUserDataById(id)
		if (error) throw error
		return data
	},
	getAllUserData: async () => {
		const { data, error } = await userService.getAllUserData()
		if (error) throw error
		return data
	},
}))

export default useUserStore
