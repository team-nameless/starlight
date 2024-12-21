use prisma_client_rust::{and, or, not};
use rocket::http::{Cookie, CookieJar};
use rocket::http::Status;
use rocket::serde::json::Json;
use crate::context::Ctx;
use crate::prisma::player;

use rocket_okapi::openapi;
use crate::controllers::request::auth_request::*;
use crate::utils::hash_password;

#[openapi(tag = "Authentication")]
#[post("/api/register", data = "<register_request>")]
pub async fn register(ctx: &Ctx, register_request: Json<RegisterRequest<'_>>) -> Status {
    let found_player = ctx.prisma.player()
        .find_first(
            vec![player::email::equals(register_request.email.to_string())]
        )
        .exec()
        .await
        .unwrap();
    
    if found_player.is_some() {
        return Status::BadRequest;
    }

    ctx.prisma.player()
        .create(
            chrono::offset::Utc::now().timestamp(),
            register_request.handle.to_string(),
            register_request.email.to_string(),
            hash_password(register_request.password),
            hash_password(register_request.password),
            0,
            1,
            0,
            vec![]
        )
        .exec()
        .await
        .expect("Unable to register user!");

    Status::Ok
}

#[openapi(tag = "Authentication")]
#[post("/api/login", data = "<login_request>")]
pub async fn login(cookies: &CookieJar<'_>, ctx: &Ctx, login_request: Json<LoginRequest<'_>>) -> Status {
    let mut found_player = ctx.prisma.player()
        .find_first(vec![
            player::email::equals(login_request.email.to_string()),
            or![
                player::hashed_password::equals(hash_password(login_request.password)),
                player::hashed_temporary_password::equals(hash_password(login_request.password))
            ]
        ])
        .exec()
        .await
        .unwrap();

    if found_player.is_none() {
        return Status::BadRequest;
    }

    let found_player = found_player.expect("How did we get here?");
    cookies.add_private(Cookie::new("user", found_player.id));

    Status::Ok
}

#[openapi(tag = "Authentication")]
#[get("/api/logout")]
pub async fn logout(cookies: &CookieJar<'_>) -> Status {
    cookies.remove_private("user");

    Status::Ok
}