use crate::ipfs;
use crate::{block::PatientRecord, AppState};
use actix_multipart::Multipart;
use actix_web::{get, post, web, HttpResponse, Responder};
use futures::{StreamExt, TryStreamExt};

// accepting json and saving in the get_transaction_data - done
// mining api - done
// retriving the image from ipfs - done
// storing the image in ipfs - done

#[get("/greet")]
pub async fn greeting() -> impl Responder {
    HttpResponse::Ok().json("namaste")
}

#[get("/allchain")]
pub async fn get_chain(data: web::Data<AppState>) -> impl Responder {
    let chain = data.blockchain.lock().unwrap().get_all_chain();
    HttpResponse::Ok().json(chain)
}

#[get("/chain/{patient_id}")]
pub async fn get_patient_chain(
    data: web::Data<AppState>,
    opts: web::Path<String>,
) -> impl Responder {
    let patient_id = opts.into_inner();
    let mut patient_data = Vec::new();
    for item in data.blockchain.lock().unwrap().get_all_chain() {
        if item.get_transaction_data().patient_id == patient_id {
            patient_data.push(item);
        }
    }
    HttpResponse::Ok().json(patient_data)
}
#[get("/image/{cid}")]
pub async fn get_image_data(opts: web::Path<String>) -> impl Responder {
    let cid = opts.into_inner();
    let bytes = ipfs::retrive_image(&cid).await.unwrap();
    HttpResponse::Ok().body(bytes)
}

#[get("/mine")]
pub async fn mine(data: web::Data<AppState>) -> impl Responder {
    let mut blockchain = data.blockchain.lock().unwrap();
    if let Ok(status) = blockchain.miner() {
        if status {
            return HttpResponse::Ok().json("Successfully Mined!");
        } else {
            return HttpResponse::Ok().json("Failed to validate and mine");
        }
    } else {
        HttpResponse::BadRequest().json("Failed to mine the data")
    }
}

#[post("/upload")]
pub async fn upload_transaction_data(
    mut payload: Multipart,
    data: web::Data<AppState>,
) -> impl Responder {
    let mut json_data: Option<PatientRecord> = None;
    let mut image_data: Option<Vec<u8>> = None;
    // Iterate over multipart items
    while let Ok(Some(mut field)) = payload.try_next().await {
        let content_disposition = field.content_disposition();
        let field_name = content_disposition.get_name().unwrap();
        match field_name {
            "jsonData" => {
                let mut data = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.unwrap();
                    data.extend_from_slice(&chunk);
                }
                let json_str = String::from_utf8(data).unwrap();
                json_data = Some(serde_json::from_str(&json_str).unwrap());
                println!("{:?}", json_data);
            }
            "imageFile" => {
                let mut data = Vec::new();
                while let Some(chunk) = field.next().await {
                    let chunk = chunk.unwrap();
                    data.extend_from_slice(&chunk);
                }
                image_data = Some(data);
                println!("{:?}", image_data);
            }
            _ => {}
        }
    }
    if let Some(mut json) = json_data {
        if let Some(image) = image_data {
            let cid = ipfs::store_image(image).await.unwrap();
            let new_transaction = PatientRecord {
                patient_id: json.patient_id.clone(),
                doctor: json.doctor.clone(),
                image_cid: cid.clone(),
                diagnosis: json.diagnosis.clone(),
                treatment: json.treatment.clone(),
                timestamp: json.timestamp,
                nmc_number: json.nmc_number,
            };
            json = new_transaction.clone();
            let mut blockchain = data.blockchain.lock().unwrap();
            blockchain.add_new_transaction(new_transaction);
            blockchain.miner().unwrap();
        }
        HttpResponse::Ok().json(json)
    } else {
        HttpResponse::BadRequest().body("JSON data not provided")
    }
}
// fn save_image(file_path: &str, image_data: &[u8]) -> std::io::Result<()> {
//     let mut file = File::create(file_path)?;
//     file.write_all(image_data)?;
//     Ok(())
// }
