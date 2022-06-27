class Me3temed {
  #token;

  constructor(options = {}) {
    this.API_URL = "https://me3temed.samuraisoftware.house/";
    this.user = options.user;
  }

  /**
   * @description Send a post request to me3temed's server
   * @param route: /path/to/endpoint
   * @param data: request body
   * @callback cb: executes after response success. Receives response data as a parameter
   */
  async post(route, data = {}, cb) {
    const response = await fetch(`${this.API_URL + route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.#token,
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      let data = await response.json();
      cb(data);
    } else console.error(response.status, response.message);
  }

  /**
   * @description Generate a one-time password for a user and email it to them
   * @param email: user's email
   * @returns Data object with temporary token & sets token
   */
  async getOTP(email) {
    await this.post("otp", email, (data) => {
      this.#token = data.token;
      return data;
    });
  }

  /**
   * @description Login a user
   * @param strategy: Specify the login method used. Leave it blank to login using the token (if it exists)
   * @oneOf ["", "otp", "password", or "link"]
   * @param creds: The user's sign in credentials
   * @creds { email, password, otp }
   * @returns Data object with "user" property
   */
  async login(strategy = "", creds = {}) {
    await this.post(
      `login/${strategy}`,
      { token: this.#token, ...creds },
      (data) => {
        this.user = data.user;
        this.#token = data.token;
        return data;
      }
    );
  }

  /**
   * @description register a user
   * @param strategy: Leave it blank for default email and password sign up.
   * @oneOf ["", "passwordless", "social"]
   * @param userData: The user data used to create the account.
   * @userData { email, password, name, img, meta, origin, isEmailVerified }
   * @returns Data object with "user" property
   */
  async register(strategy = "", userData = {}) {
    await this.post(
      `register/${strategy}`,
      { token: this.#token, ...userData },
      (data) => {
        this.user = data.user;
        this.#token = data.token;
        return data;
      }
    );
  }
}

export default new Me3temed();
