use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct AppConfig<'a> {
    pub host: &'a str,
    pub port: i32,
}

impl Default for AppConfig<'_> {
    fn default() -> Self {
        Self {
            host: "127.0.0.1",
            port: 5000,
        }
    }
}
