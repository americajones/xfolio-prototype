import axios from 'axios';

export default {
    getUsers: function () {
        return axios.get('/api/user');
    },
    getUser: function (id) {
        return axios.get(`/api/user/${id}`)
    },
    registerUser: function (newUser) {
        return axios.post('/api/user', {
            username: newUser.username,
            nickname: newUser.nickname,
            email: newUser.email,
            password: newUser.password
        })
    },
    login: function (login) {
        return axios.post('/api/user/login', {
            username: login.username,
            password: login.password
        })
    },
    logout: function () {
        return axios.post("/api/user/logout");
    }
}