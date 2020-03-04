import axios from 'axios'
// 
export default {
    login(params){
        return axios({
            method: "get",
            url: "/login",
            params: params
        })
    },
    getMenuList(){
        return axios({
            method: "get",
            url: "/menus"
        })
    },
    getUserList(params){
        return axios({
            method: "get",
            url: "/users",
            params: params
        })
    },
    updateUserState(params){
        return axios({
            method: "put",
            url: "/users/" + params.id + "/state/" + params.mg_state
        })
    },
    addUser(params){
        return axios({
            method: "post",
            url: "/users",
            data: params
        })
    },
    editUser(params){
        return axios({
            method: "put",
            url: "/users/" + params.id,
            data: params
        })
    },
    getUserInfoById(id){
        return axios({
            method: "get",
            url: "/users/" + id 
        })
    },
    deleteUserById(id){
        return axios({
            method: "delete",
            url: "/users/" + id 
        })
    },
}