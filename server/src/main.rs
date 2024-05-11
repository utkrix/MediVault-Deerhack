use dispenser::{dispensed, dispenser_data, dispenser_storage, namaste};
use mongodb::Client;
use actix_web::{web, App, HttpServer};
use actix_web::http::header;
use actix_cors::Cors;
use dotenv::dotenv;

mod dispenser;
mod login;
mod model;
mod register;
mod smtp;
//mod module;

use login::login as login_handler;
use register::register as register_handler;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let uri = std::env::var("MONGODB_URI").unwrap();

    let client = Client::with_uri_str(uri).await.expect("Failed to connect");

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                header::AUTHORIZATION,
                header::ACCEPT,
                header::CONTENT_TYPE,
            ]);

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(client.clone()))
            .service(register_handler)
            .service(login_handler)
            .service(dispenser_storage)
            .service(dispensed)
            .service(dispenser_data)
            .service(namaste)
    })
    .bind(("0.0.0.0", 6175))?
    .run()
    .await
}
