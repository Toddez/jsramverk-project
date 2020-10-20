class authStorage {
    static jwt = null;
    static email = null;

    static getToken = () => this.jwt;
    static setToken = (value) => {
        this.jwt = value;
    };

    static getEmail = () => this.email;
    static setEmail = (value) => {
        this.email = value;
    };

    static authorized = () => {
        if (!this.jwt)
            return false;

        if (!this.email)
            return false;

        return true;
    };
}

export default authStorage;
