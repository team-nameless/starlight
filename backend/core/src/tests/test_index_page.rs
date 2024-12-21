use crate::rocket;
use rocket::http::Status;
use rocket::local::asynchronous::Client;

#[rocket::async_test]
async fn test_rootpage() {
    let client = Client::untracked(rocket().await).await.unwrap();

    let response = client.get("/").dispatch().await;
    assert_eq!(response.status(), Status::Ok);
    assert_eq!(response.into_string().await.unwrap(), "Hello, world!");
}

#[rocket::async_test]
async fn test_swagger() {
    let client = Client::untracked(rocket().await).await.unwrap();

    let response = client.get("/swagger").dispatch().await;
    assert_eq!(response.status(), Status::SeeOther);

    let response = client.get("/swagger/index.html").dispatch().await;
    assert_eq!(response.status(), Status::Ok);
}
