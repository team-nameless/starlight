#[macro_use]
extern crate rocket;

use crate::middlewares::cors;
use figment::providers::Serialized;
use figment::Figment;
use rocket_okapi::openapi_get_routes;
use rocket_okapi::swagger_ui::{make_swagger_ui, SwaggerUIConfig};
use std::sync::Arc;
use dotenvy::dotenv;

mod config;
mod context;
mod api;
mod middlewares;
mod prisma;
mod tests;
mod utils;

#[launch]
async fn rocket() -> _ {
    dotenv().ok();

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
                api::index::hello_world,
                api::auth::register,
                api::auth::login,
                api::auth::logout,
                api::user::get_user,
                api::user::delete_user
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
