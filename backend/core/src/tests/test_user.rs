use crate::controllers::request::auth_request::*;
use crate::prisma::PrismaClient;
use crate::rocket;
use prisma_client_rust;
use prisma_client_rust::raw;
use rocket::http::Status;
use rocket::local::asynchronous::Client;
use crate::controllers::response::player_response::PlayerResponse;
use crate::utils::exp::get_exp_for_level;

#[rocket::async_test]
async fn test_user_profile() {
    let prisma_client: PrismaClient = PrismaClient::_builder().build().await.expect("We fucked.");
    prisma_client
        ._execute_raw(raw!("TRUNCATE TABLE \"Player\" CASCADE"))
        .exec()
        .await
        .unwrap();

    let client = Client::tracked(rocket().await).await.unwrap();

    let register_body = RegisterRequest {
        handle: "KURWA",
        email: "user@example.com",
        password: "password123",
    };

    let response = client
        .post("/api/register")
        .json(&register_body)
        .dispatch()
        .await;

    assert_eq!(response.status(), Status::Created);

    let body = LoginRequest {
        email: "user@example.com",
        password: "password123",
    };

    let response = client.post("/api/login").json(&body).dispatch().await;
    assert_eq!(response.status(), Status::Ok);

    let response = client.get("/api/user").dispatch().await;
    assert_eq!(response.status(), Status::Ok);

    let body = response.into_json::<PlayerResponse>().await.expect("No parsable response.");
    assert_eq!(body.name, "KURWA");
    assert_eq!(body.email, "user@example.com");
    assert_eq!(body.level, 1);
    assert_eq!(body.exp, 0);
    assert_eq!(body.exp_needed_for_next_level, get_exp_for_level(body.level));
}

#[rocket::async_test]
async fn test_user_delete() {
    let prisma_client: PrismaClient = PrismaClient::_builder().build().await.expect("We fucked.");
    prisma_client
        ._execute_raw(raw!("TRUNCATE TABLE \"Player\" CASCADE"))
        .exec()
        .await
        .unwrap();

    let client = Client::tracked(rocket().await).await.unwrap();

    let register_body = RegisterRequest {
        handle: "KURWA",
        email: "user@example.com",
        password: "password123",
    };

    let response = client
        .post("/api/register")
        .json(&register_body)
        .dispatch()
        .await;

    assert_eq!(response.status(), Status::Created);

    let body = LoginRequest {
        email: "user@example.com",
        password: "password123",
    };

    let response = client.post("/api/login").json(&body).dispatch().await;
    assert_eq!(response.status(), Status::Ok);

    let response = client.delete("/api/user").dispatch().await;
    assert_eq!(response.status(), Status::NoContent);

    let response = client.post("/api/login").json(&body).dispatch().await;
    assert_eq!(response.status(), Status::BadRequest);
}
