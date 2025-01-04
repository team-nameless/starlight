use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Serialize, Deserialize, Validate)]
pub struct PlayerResponse {
    pub id: i64,
    pub name: String,
    #[validate(email)]
    pub email: String,
    pub level: i64,
    pub exp: i64,
    pub exp_needed_for_next_level: i64,
}
