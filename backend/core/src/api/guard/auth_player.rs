use crate::context::Ctx;
use crate::prisma::*;
use rocket::http::Status;
use rocket::outcome::try_outcome;
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use rocket_okapi::OpenApiFromRequest;

#[derive(OpenApiFromRequest)]
pub struct AuthenticatedPlayer {
    #[allow(unused)]
    pub player: player::Data,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthenticatedPlayer {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let db = try_outcome!(request.guard::<&Ctx>().await);

        let user_id: Option<String> = request
            .cookies()
            .get_private("user")
            .and_then(|cookie| cookie.value().parse().ok());

        let read_user_id = match user_id {
            Some(crunch) => crunch,
            None => return Outcome::Error((Status::Unauthorized, ())),
        };

        let user = db
            .prisma
            .player()
            .find_first(vec![player::id::equals(read_user_id)])
            .exec()
            .await
            .unwrap();

        match user {
            Some(user) => Outcome::Success(AuthenticatedPlayer { player: user }),
            None => Outcome::Error((Status::Unauthorized, ())),
        }
    }
}
