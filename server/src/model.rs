use serde::Deserialize;
use mongodb::bson::{doc,  Uuid};
use serde::Serialize;

#[derive(Debug, Eq, PartialEq, Deserialize)]
pub struct RegisterUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Eq, PartialEq, Deserialize, Serialize, Clone)]
pub struct DispenserSchema {
    pub id: Uuid,
    pub sensitive: bool,
    pub medicine_name: String,
    pub days: Vec<String>,
    pub times: Vec<String>,
    pub quantity: usize, 
}

#[derive(Deserialize)]
pub struct Info {
    pub id: String,
}

#[derive(Serialize, Deserialize)]
struct DispenserResponse {
    id: Uuid,
    medicine_name: String,
    days: Vec<String>,
    times: Vec<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MedicineDispensed {
    pub id: Uuid,
    pub sensitive: bool,
    pub medicine_name: String,
    pub dispensed: bool,
    pub time_elapsed: bool,
}

#[derive(Deserialize)]
pub struct LoginSchema {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub id: String,
    pub message: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct RegisterSchema {
    pub id: Option<Uuid>,  
    pub email: String,
    pub password: String,
    pub phone_number: String,
    pub username: String,
    pub emergency_email: String,
}



