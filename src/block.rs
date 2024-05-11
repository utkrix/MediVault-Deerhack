use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::time::{Duration, SystemTime};
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PatientRecord {
    pub patient_id: String,
    pub doctor: String,
    pub diagnosis: String,
    pub treatment: String,
    pub timestamp: u128,
    pub nmc_number: u128,
    pub image_cid: String,
}
impl Default for PatientRecord {
    fn default() -> Self {
        PatientRecord {
            patient_id: String::from("Genisis"),
            doctor: String::from("Genisis"),
            diagnosis: String::from("Genisis"),
            treatment: String::from("Genisis"),
            image_cid: String::from("Genisis"),
            nmc_number: 101010,
            timestamp: SystemTime::now()
                .duration_since(SystemTime::UNIX_EPOCH)
                .unwrap_or(Duration::from_secs(69))
                .as_millis(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Block {
    index: u64,
    timestamp: u128,
    data: PatientRecord,
    prev_block_hash: String,
    hash: String,
    nonce: i32,
}
impl Block {
    pub fn new(
        index: u64,
        data: PatientRecord,
        prev_block_hash: String,
        nonce: i32,
    ) -> Result<Block, Box<dyn std::error::Error>> {
        let timestamp = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)?
            .as_millis();
        let block = Block {
            index,
            timestamp,
            data,
            prev_block_hash,
            hash: String::new(),
            nonce,
        };
        Ok(block)
    }
    pub fn get_transaction_data(&self) -> PatientRecord {
        self.data.clone()
    }
    pub fn compute_hash(&self) -> Result<String, Box<dyn std::error::Error>> {
        let block_string = serde_json::to_string(self)?;
        let mut hasher = Sha256::new();
        hasher.update(block_string);
        let result = hasher.finalize();
        Ok(hex::encode(result))
    }
    pub fn set_hash_value(&mut self, hash: String) {
        self.hash = hash;
    }
    pub fn get_hash_value(&self) -> &str {
        &self.hash
    }
    pub fn get_pre_hash_value(&self) -> &str {
        &self.prev_block_hash
    }
    pub fn increase_nonce(&mut self) {
        self.nonce = self.nonce + 1;
    }
    pub fn get_index_value(&self) -> u64 {
        self.index
    }
}
