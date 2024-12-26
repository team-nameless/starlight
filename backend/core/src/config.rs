use std::env;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct AppConfig<'a> {
    pub host: &'a str,
    pub port: i32,
    pub secret_key: String,
}

impl Default for AppConfig<'_> {
    fn default() -> Self {
        // For future me: https://api.rocket.rs/v0.5/rocket/config/struct.SecretKey
        let secret_key = env::var("SECRETPASSWD")
            .expect("SECRETPASSWD environment variable must be set.");

        Self {
            host: "127.0.0.1",
            port: 5000,
            secret_key,
        }
    }
}
