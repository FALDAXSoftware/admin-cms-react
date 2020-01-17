const actions={
    USER_MENU_HEADER_DATA:"USER_MENU_HEADER_DATA",
    USER_MENU_REMOVE_DATA:"USER_MENU_REMOVE_DATA",
    showUserDetails:(data)=>({
        type:actions.USER_MENU_HEADER_DATA,
        payload:data
    }),
    removeUserDetails:()=>({
        type:actions.USER_MENU_REMOVE_DATA,
    })
}
export default actions;