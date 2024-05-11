use actix_cors::Cors;
use actix_web::web::service;
use actix_web::{http::header, web, App, HttpServer};
use blockchain::Blockchain;
use std::sync::Arc;
use std::sync::Mutex;
#[macro_use]
extern crate log;
pub mod block;
pub mod blockchain;
pub mod ipfs;
pub mod router;
pub struct AppState {
    blockchain: Arc<Mutex<Blockchain>>,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    pretty_env_logger::init();
    let mut blockchain = blockchain::Blockchain::new();
    blockchain.import_transactions("sannux.json")?;
    blockchain.miner()?;
    // ipfs::store_data("uploads/gell.jpeg").await?;
    info!("Server running at port : 1984");
    // ipfs::store_image("random_image_location").await?;
    // ipfs::retrive_image("retrive_image_from_CID").await?;

    let shared_block_chain = Arc::new(Mutex::new(blockchain));
    let block_chain_state = web::Data::new(AppState {
        blockchain: shared_block_chain.clone(),
    });

    // http server
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
            .allowed_header(header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .app_data(block_chain_state.clone())
            .service(
                web::scope("/api")
                    .service(router::greeting)
                    .service(router::get_chain)
                    .service(router::get_patient_chain)
                    .service(router::upload_transaction_data)
                    .service(router::get_image_data),
            )
            .wrap(cors)
    })
    .bind(("0.0.0.0", 1582))?
    .run()
    .await?;
    Ok(())
}
