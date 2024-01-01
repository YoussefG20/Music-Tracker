let currentUser = null;

function login(user) {
    currentUser = {
        user: user,
    }
}

function getCurrentUser(){
    return currentUser.user;
}

function isAdmin() {
    return user && user.isAdmin;
}

module.exports = {
    login,getCurrentUser,isAdmin,
};