use rocket::log::private::Level;
use rocket_okapi::okapi::schemars;
use rocket_okapi::okapi::schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct PlayerResponse {
    pub id: i64,
    pub name: String,
    #[validate(email)]
    pub email: String,
    pub level: i64,
    pub exp: i64,
    pub exp_needed_for_next_level: i64,
}
