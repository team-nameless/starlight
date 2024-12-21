use rocket_okapi::openapi;

/// Index page. Mostly for health checks.
#[openapi(tag = "Index")]
#[get("/")]
pub fn hello_world() -> &'static str {
    "Hello, world!"
}
