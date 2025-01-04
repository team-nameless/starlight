use crate::context::Ctx;
use crate::api::guard::auth_player::AuthenticatedPlayer;
use crate::api::response::player_response::PlayerResponse;
use crate::prisma::player;
use crate::utils::exp::*;
use rocket::http::{CookieJar, Status};
use rocket::serde::json::Json;

#[get("/api/user")]
pub async fn get_user(player: AuthenticatedPlayer) -> Json<PlayerResponse> {
    let data = player.player;

    Json(PlayerResponse {
        id: data.numeric_id,
        email: data.email,
        name: data.handle,
        level: data.level,
        exp: data.exp_of_level,
        exp_needed_for_next_level: get_exp_for_level(data.level),
    })
}

#[delete("/api/user")]
pub async fn delete_user(
    cookies: &CookieJar<'_>,
    ctx: &Ctx,
    player: AuthenticatedPlayer,
) -> Status {
    let data = player.player;

    cookies.remove_private("user");

    ctx.prisma
        .player()
        .delete_many(vec![player::id::equals(data.id)])
        .exec()
        .await
        .unwrap();

    Status::NoContent
}
