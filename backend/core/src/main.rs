#[macro_use] extern crate rocket;

use std::sync::Arc;
use rocket_okapi::openapi_get_routes;
use rocket_okapi::swagger_ui::{make_swagger_ui, SwaggerUIConfig};
use crate::middlewares::cors;
use prisma;

mod controllers;
mod tests;
mod context;
mod utils;
mod middlewares;

#[launch]
async fn rocket() -> _ {
    let db = Arc::new(
        prisma::new_client()
            .await
            .expect("Failed to create Prisma client"),
    );

    rocket::build()
        .attach(cors::Cors)
        .manage(context::Context { prisma: db })
        .mount("/",
               openapi_get_routes![
                   controllers::index::hello_world,
                   controllers::auth::register,
                   controllers::auth::login,
                   controllers::auth::logout
               ]
        )
        .mount("/swagger", make_swagger_ui(&SwaggerUIConfig {
                url: "../openapi.json".to_owned(),
                ..Default::default()
            }),
        )
}