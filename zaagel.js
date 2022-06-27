import fetch from 'node-fetch';

class Zaagel {
    constructor(apiURL, site = {}, configuration = {}) {
        this.config = configuration
        this.siteData = site
        this.api = apiURL
    }

    configure(site = {}, configuration = {}) {
        this.siteData = site
        this.config = configuration
    }
    
    mail(options = {}) {
        const { to, subject, template, body, replyTo } = options
        fetch(`${this.api}/mail`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            mode: 'cors',
            body: JSON.stringify({
                subject,
                to,
                template,
                data: {
                    ...body,
                    ...this.siteData,
                },
                config: this.config,
                replyTo: replyTo || this.siteData.siteEmail,
            }),
        }).then(res => {
            return res
        });
    }
}

const zaagel = new Zaagel('https://zaagel.samuraisoftware.house')
export default zaagel
