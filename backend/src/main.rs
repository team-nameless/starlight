#[macro_use] extern crate rocket;

use rocket_okapi::openapi_get_routes;
use rocket_okapi::swagger_ui::{make_swagger_ui, SwaggerUIConfig};

mod controllers;
mod tests;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/",
               openapi_get_routes![
                   controllers::hello_world
               ]
        )
        .mount("/swagger", make_swagger_ui(&SwaggerUIConfig {
                url: "../openapi.json".to_owned(),
                ..Default::default()
            }),
        )
}