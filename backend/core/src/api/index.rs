/// Index page. Mostly for health checks.
#[get("/")]
pub fn hello_world() -> &'static str {
    "Hello, world!"
}
