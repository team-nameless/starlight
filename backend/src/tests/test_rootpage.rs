use rocket::local::blocking::Client;
use rocket::http::Status;
use crate::rocket;

#[test]
fn test_rootpage() {
    let client = Client::untracked(rocket()).unwrap();
    
    let response = client.get("/").dispatch();
    assert_eq!(response.status(), Status::Ok);
    assert_eq!(response.into_string().unwrap(), "Hello, world!");
}

#[test]
fn test_swagger() {
    let client = Client::untracked(rocket()).unwrap();
    
    let response = client.get("/swagger").dispatch();
    assert_eq!(response.status(), Status::SeeOther);

    let response = client.get("/swagger/index.html").dispatch();
    assert_eq!(response.status(), Status::Ok);
}