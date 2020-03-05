import axios from 'axios'
// 
export default {
    getRightsList() {
        return axios({
            method: "get",
            url: "/rights/list",
        })
    },
    getRightsTree() {
        return axios({
            method: "get",
            url: "/rights/tree",
        })
    },
    getRolesList() {
        return axios({
            method: "get",
            url: "/roles",
        })
    },
    removeRightById(roleId, rightId) {
        return axios({
            method: "delete",
            url: `roles/${roleId}/rights/${rightId}`,
        })
    },
    allotRights(roleId, rids) {
        return axios({
            method: "post",
            url: `roles/${roleId}/rights`,
            data: rids
        })
    },

}