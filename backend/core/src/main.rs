#[macro_use] extern crate rocket;

use crate::middlewares::cors;
use figment::providers::Serialized;
use figment::Figment;
use std::sync::Arc;
use dotenvy::dotenv;

mod config;
mod context;
mod api;
mod middlewares;
#[allow(dead_code, clippy::all)] mod prisma;
#[cfg(test)] mod tests;
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
            routes![
                api::index::hello_world,
                api::auth::register,
                api::auth::login,
                api::auth::logout,
                api::user::get_user,
                api::user::delete_user
            ],
        )
}