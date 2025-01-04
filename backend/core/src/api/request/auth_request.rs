use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Serialize, Deserialize, Validate)]
pub struct RegisterRequest<'a> {
    pub handle: &'a str,
    #[validate(email)]
    pub email: &'a str,
    pub password: &'a str,
}

#[derive(Serialize, Deserialize, Validate)]
pub struct LoginRequest<'a> {
    #[validate(email)]
    pub email: &'a str,
    pub password: &'a str,
}
