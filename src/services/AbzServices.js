import { useHttp } from '../hooks/useHttp';

const useAbzService = () => {
    const { loading, request, error, clearError} = useHttp();

    const _apiBase = 'https://frontend-test-assignment-api.abz.agency/api/v1/';
    const _basePage = 1

    const getServerUsers = async (page = _basePage, count = 6) => {
        const res = await request(`${_apiBase}users?page=${page}&count=${count}`);
        return res.users.map(_transformUser)
    }

    const getPositions = async () => {
        const res = await request(`${_apiBase}positions`);
        return res.positions.map(_transformPosition)
    }

    const getFormToken = async () => {
        const res = await request(`${_apiBase}token`)
        return res.token
    }

    const postUser = async (body, token) => {
        const res = await request(`${_apiBase}users`, "POST", body, { 'Token': token})
        return _transfromPostResponse(res)
    }

    const getUserById = async (id) => {
        const res = await request(`${_apiBase}users/${id}`)
        return _transformUser(res.user)
    }

    const _transfromPostResponse = (response) => {
        return {
            status: response.success,
            newUserId: response.user_id,
            message: response.message
        }
    }

    const _transformUser = (user) => {
        const name = user.name.length > 40 ? `${user.name.slice(0, 40)}...` : user.name
        const email = user.email.length > 40 ? `${user.email.slice(0, 40)}...` : user.email
        return {
            id: user.id,
            name: name,
            email: email,
            phone: user.phone,
            position: user.position,
            photo: user.photo,
        }
    }

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