import axios from "axios"

export const getRequest = async(type, endpoint) => {
    const res = await axios({
        method: type,
        url: `http://localhost:8800${endpoint}`
    })
    return res.data
}

const postRequest = async() => {
    await axios.post(`http://localhost:8800/logout`, currentUser.refreshToken , {
            headers: {authorization: "Bearer " + currentUser.accessToken},
        })
}