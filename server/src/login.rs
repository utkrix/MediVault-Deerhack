use mongodb::bson::doc;
use mongodb::{Client, Collection};
use actix_web::{post, web, HttpResponse};
use bcrypt::verify;
use crate::model::{LoginSchema, LoginResponse, RegisterSchema};

const DB_NAME: &str = "MedicineDispenser";
const COLL_NAME: &str = "Users";

#[post("/login")]
pub async fn login(client: web::Data<Client>, req: web::Json<LoginSchema>) -> HttpResponse {
   let collection: Collection<RegisterSchema> = client.database(DB_NAME).collection(COLL_NAME);
    println!("email {}", &req.email);
    println!("{:?}", &collection.find_one(doc! {"email" : &req.email}, None).await);
    //println!("{:?}", collection);
    println!("login");
    let user = match collection.find_one(doc! {"email" : &req.email}, None).await {
        Ok(Some(user)) => user,
        _ => return HttpResponse::Ok().body("Couldn't recognize the user")
    };

    let hash = user.password;
   
    if verify(&req.password, &hash[..]).unwrap() {
        HttpResponse::Ok().json(LoginResponse { id: (&user.id.unwrap().to_owned()).to_string(), message: "User recognized".to_string()})
    } else {
        HttpResponse::Ok().body("Invalid Password")
    }
}



