#[macro_use]
extern crate rocket;

use crate::middlewares::cors;
use figment::providers::Serialized;
use figment::Figment;
use rocket_okapi::openapi_get_routes;
use rocket_okapi::swagger_ui::{make_swagger_ui, SwaggerUIConfig};
use std::sync::Arc;

mod config;
mod context;
mod controllers;
mod middlewares;
mod prisma;
mod tests;
mod utils;

#[launch]
async fn rocket() -> _ {
    let db = Arc::new(
        prisma::new_client()
            .await
            .expect("Failed to create Prisma client"),
    );

    let figment = Figment::from(rocket::Config::default())
        .merge(Serialized::defaults(config::AppConfig::default()));

    rocket::custom(figment)
        .attach(cors::Cors)
        .manage(context::Context { prisma: db })
        .mount(
            "/",
            openapi_get_routes![
                controllers::index::hello_world,
                controllers::auth::register,
                controllers::auth::login,
                controllers::auth::logout
            ],
        )
        .mount(
            "/swagger",
            make_swagger_ui(&SwaggerUIConfig {
                url: "../openapi.json".to_owned(),
                ..Default::default()
            }),
        )
}
