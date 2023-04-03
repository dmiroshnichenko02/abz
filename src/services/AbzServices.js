import { useHttp } from '../hooks/useHttp';
// Helper function for working with queries
const useAbzService = () => {
    const { loading, request, error, clearError} = useHttp();
    // Basic variables with page and url
    const _apiBase = 'https://frontend-test-assignment-api.abz.agency/api/v1/';
    const _basePage = 1

    // Getting 6 Users
    const getServerUsers = async (page = _basePage, count = 6) => {
        const res = await request(`${_apiBase}users?page=${page}&count=${count}`);
        return res.users.map(_transformUser)
    }

    // Getting a list of positions
    const getPositions = async () => {
        const res = await request(`${_apiBase}positions`);
        return res.positions.map(_transformPosition)
    }

    // Getting a token for submitting a form
    const getFormToken = async () => {
        const res = await request(`${_apiBase}token`)
        return res.token
    }

    // Submitting a form
    const postUser = async (body, token) => {
        const res = await request(`${_apiBase}users`, "POST", body, { 'Token': token})
        return _transfromPostResponse(res)
    }

    // Function to get user by id if needed
    const getUserById = async (id) => {
        const res = await request(`${_apiBase}users/${id}`)
        return _transformUser(res.user)
    }

    // Server response enumeration function
    const _transfromPostResponse = (response) => {
        return {
            status: response.success,
            newUserId: response.user_id,
            message: response.message
        }
    }

    // Server response enumeration function
    const _transformUser = (user) => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            position: user.position,
            photo: user.photo,
        }
    }

    // Server response enumeration function
    const _transformPosition = (pos) => {
        return {
            id: pos.id,
            position: pos.name
        }
    }

    return {
        getServerUsers,
        getPositions,
        getFormToken,
        postUser,
        getUserById,
        loading,
        error,
        clearError
    }
}

export default useAbzService;