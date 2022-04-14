class Me3temed {
    #token;

    constructor(options = {}) {
        this.api = 'https://me3temed.samuraisoftware.house'
        this.user = options.user;
    }

    OTP(user = {}) {
        this.user = user;
        fetch(`${this.api}/otp`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }, 
            mode: 'cors',
            body: JSON.stringify(this.user),
        }).then((data) => {
            this.#token = data.token;
        }).catch((err) => {
            console.error(err);
        })
    }

    e3temed(creds = {}) {
        const res = fetch(`${this.api}/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': this.#token,
            }, 
            mode: 'cors',
            body: JSON.stringify({
                otp: creds.otp
            }),
        });
        return res;
    }
} 

export default new Me3temed()