
const isAllowed = (permission) => {
    let roles = getRolesFromLocalStorage()
    for (let index = 0; index < roles.length; index++) {
        const r = roles[index];
        if (r.module_name == permission) {
            return true
        }
    }
    return false

}
const getRolesFromLocalStorage = () => {
    let roles = []
    let state = JSON.parse(localStorage.getItem("state"));
    if (state.Auth && state.Auth.user && state.Auth.user.roleAllowedData) {
        roles = state.Auth.user.roleAllowedData
    }
    return roles


}
export {
    isAllowed
}