export default class Gate {
    constructor(user) {
        this.user = user
    }

    isAdmin() {
        return this.user.type === "admin"
    }

    isUser() {
        return this.user.type === "user"
    }

    isDeveloper() {
        return this.user.type === "developer"
    }

    isAdminOrDeveloper() {
        if (this.user.type === "admin" || this.user.type === "developer") {
            return true
        }
    }
}
