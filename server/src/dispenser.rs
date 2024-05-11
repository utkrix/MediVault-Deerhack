use actix_web::{get, post, web, HttpResponse};
use mongodb::{bson::{doc, Uuid}, Client, Collection};
use crate::model::{DispenserSchema, Info, MedicineDispensed};
use crate::smtp::EmailSender;

const DB_NAME: &str = "MedicineDispenser";
const COLL_NAME: &str = "DispenserData";

#[post("/dispenser")]
pub async fn dispenser_storage(client: web::Data<Client>, req: web::Json<Vec<DispenserSchema>>, info: web::Query<Info>) -> HttpResponse {
    println!("rw {:?}", &req);
    let collections: Collection<DispenserSchema> = client.database(DB_NAME).collection(COLL_NAME);
    let id = Uuid::parse_str(&info.id[..]).unwrap();
    println!("id: {}", id);
    
    for mut data in req.into_inner().into_iter() {
        data.id = id;
        let result = collections.insert_one(data, None).await;

        match  result {
            Ok(_) => return HttpResponse::Ok().body("successful insertion"),
            Err(err) => return HttpResponse::InternalServerError().body(err.to_string())
        }
    } 

    HttpResponse::InternalServerError().body("No data processed")
}

#[get("/dispenser_data")]
pub async fn dispenser_data(client: web::Data<Client>, info: web::Query<Info>) -> HttpResponse {
    let collecions: Collection<DispenserSchema> = client.database(DB_NAME).collection(COLL_NAME);
    let id = Uuid::parse_str(&info.id[..]).unwrap();
    println!("infoid {:?}", info.id);
    println!("id {:?}", id);


    match collecions.find_one(doc! {"id" : id}, None).await {
        Ok(Some(user)) => {
            println!("user {:?}", user);
            HttpResponse::Ok().json(user)
        },
        Ok(None) => HttpResponse::NotFound().body("No user found with the designated id"),
        Err(err) => HttpResponse::InternalServerError().json(err.to_string()),
    }
}

#[get("/namaste")]
pub async fn namaste() -> HttpResponse {
    HttpResponse::Ok().body("Namaste")
}

#[post("/dispensed")]
pub async fn dispensed(client: web::Data<Client>, req: web::Json<MedicineDispensed>) -> HttpResponse {
    println!("req {:?}", &req);
    let collection: Collection<DispenserSchema> = client.database(DB_NAME).collection(COLL_NAME);

    println!("{:?}", collection.find_one(doc! {"medicine_name": &req.medicine_name, "id": &req.id}, None).await);

    let mut user = match collection.find_one(doc! {"medicine_name": &req.medicine_name, "id": &req.id}, None).await {
        Ok(Some(user)) => user,
        Ok(None) => return HttpResponse::NotFound().json(format!("User with id {} not found", &req.id)),
        Err(err) => return HttpResponse::Ok().json(err.to_string())
    };

    println!("{:?}", &user);

    medicine_dispense(&req, &mut user).await;

    if user.quantity <= 10 {
        let subject = "Emergency refill of the vault required";
        let body = "Dear Valued Customer,

Emergency! Immediate medicine refill needed. Please act swiftly to restore the necessary medication.

Thank you.

Best regards,
Medicine Vault";

        let email_sender = EmailSender::new();
        email_sender.send_email(subject, body).await;
    } 
    HttpResponse::Ok().json("Utx")
}

pub async fn medicine_dispense(req: &web::Json<MedicineDispensed>, user: &mut DispenserSchema) {
    if req.dispensed {
        user.quantity -= 1;
        let subject = "Medicine Taken";
        let body = "Dear Valued Customer,

The subject has taken the medicine. Now, you can get back to your work without any friction.

Thank you.

Best regards,
Medicine Vault";

        let email_sender = EmailSender::new();
        email_sender.send_email(subject, body).await;                
    } else {
        if req.time_elapsed {
            let subject = "Emergency Medicine Shot Required";
            let body = "Dear Valued Customer,

Emergency! Immediate medicine shot needed. Please act swiftly to administer the necessary medication.

Thank you.

Best regards,
Medicine Vault";

            let email_sender = EmailSender::new();
            email_sender.send_email(subject, body).await;     
        }
    }
}


#[actix_web::test]
async fn send_mail_for_low_quantity() {
    use actix_web::{App, test};
    use dotenv::dotenv;
    dotenv().ok();
    let uri = std::env::var("MONGODB_URI").unwrap();
    let client = Client::with_uri_str(uri).await.expect("Failed to connect");

    let mut app = test::init_service(
        App::new()
            .app_data(web::Data::new(client.clone()))
            .service(medicine_dispense) 
    ).await;

    let payload = json!({
        "id": "94506190-01cd-4bdb-b696-101f630bca73",
        "sensitive": true,
        "medicine_name": "Metro",
        "dispensed": true,
        "time_elapsed": true
    });

    let request = test::TestRequest::post()
        .uri("/medicine_dispense")
        .set_json(&payload)
        .to_request(); 

    let response = test::call_service(&mut app, request).await;

    assert!(response.status().is_success());
    let response_body = test::read_body(response).await;
    let response_body_str = std::str::from_utf8(&response_body).unwrap();
    assert_eq!(response_body_str, "Mail Sent");
}

