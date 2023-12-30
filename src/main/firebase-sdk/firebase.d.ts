// firebase-admin.d.ts
declare module 'firebase-admin' {
    namespace admin {
        interface ServiceAccount {
            type: string;
            project_id: string;
            private_key_id: string;
            private_key: string;
            client_email: string;
            client_id: string;
            auth_uri: string;
            token_uri: string;
            auth_provider_x509_cert_url: string;
            client_x509_cert_url: string;
            universe_domain: string;
        }

        // interface AppOptions {
        //   credential: admin.credential.Credential;
        // }

        // function initializeApp(options?: AppOptions, name?: string): admin.app.App;
    }

    const admin: admin.app.App;
    export = admin;
}