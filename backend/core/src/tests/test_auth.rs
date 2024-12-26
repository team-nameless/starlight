use crate::api::request::auth_request::*;
use crate::prisma::PrismaClient;
use crate::rocket;
use prisma_client_rust;
use prisma_client_rust::raw;
use rocket::http::Status;
use rocket::local::asynchronous::Client;

#[rocket::async_test]
async fn test_auth_flow() {
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

    let response = client.get("/api/logout").dispatch().await;
    assert_eq!(response.status(), Status::Ok);
}
