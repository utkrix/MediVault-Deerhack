use mongodb::bson::Uuid;
use mongodb::{bson::doc, Collection};
use mongodb::Client;
use actix_web::{post, web, HttpResponse};
use bcrypt::{hash, DEFAULT_COST};
use crate::model::RegisterSchema;

const DB_NAME: &str = "MedicineDispenser";
const COLL_NAME: &str = "Users";

async fn existing_user(collection: &Collection<RegisterSchema>, req: &web::Json<RegisterSchema>) -> Result<bool, HttpResponse> {
   match collection.find_one(doc! {"username": &req.username, "email": &req.email}, None).await {
        Ok(Some(_)) => Ok(true),
        Ok(None) => Ok(false),
        Err(err) => Err(HttpResponse::InternalServerError().body(err.to_string()))
    } 
}

#[post("/register")]
pub async fn register(client: web::Data<Client>, mut req: web::Json<RegisterSchema>) -> HttpResponse {
    println!("req {:?}", &req);
    let password = hash(&req.password, DEFAULT_COST).unwrap();
    let id = Uuid::new();
    req.id = Some(id);
    println!("result {:?}", &req);
    req.password = password;
    let collection: Collection<RegisterSchema> = client.database(DB_NAME).collection(COLL_NAME);
    let existing_user = existing_user(&collection, &req).await.unwrap();

    if !existing_user {
        let result = collection.insert_one(req.into_inner(), None).await;
        

        match result {
            Ok(_) => return HttpResponse::Ok().body("user added"),
            Err(err) => return HttpResponse::InternalServerError().body(err.to_string())
        }   
    } else {
        HttpResponse::BadRequest().body("user already exists")
    }
}
    
    

