use rocket_okapi::okapi::schemars;
use rocket_okapi::okapi::schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Serialize, Deserialize, JsonSchema, Validate)]
pub struct RegisterRequest<'a> {
    pub handle: &'a str,
    #[validate(email)]
    pub email: &'a str,
    pub password: &'a str,
}

#[derive(Serialize, Deserialize, JsonSchema, Validate)]
pub struct LoginRequest<'a> {
    #[validate(email)]
    pub email: &'a str,
    pub password: &'a str,
}
