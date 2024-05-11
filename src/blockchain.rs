use crate::block::{Block, PatientRecord};
use std::collections::{hash_map::Entry, HashMap};
use std::fs::{File, OpenOptions};
use std::io::BufReader;
use std::io::BufWriter;
use std::time::SystemTime;

pub struct Blockchain {
    unconfirmed_transactions: HashMap<String, PatientRecord>,
    pub chain: Vec<Block>,
    nodes: Vec<String>,
    difficulty: usize,
}

impl Blockchain {
    pub fn new() -> Self {
        let mut blockchain = Blockchain {
            unconfirmed_transactions: HashMap::new(),
            chain: Vec::new(),
            nodes: Vec::new(),
            difficulty: 4,
        };
        //maybe fix this
        blockchain.create_genesis_block().unwrap();
        blockchain
    }
    pub fn create_genesis_block(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let mut genesis_block = Block::new(0, PatientRecord::default(), String::from("hashed"), 0)?;
        let hash = genesis_block.compute_hash()?;
        genesis_block.set_hash_value(hash);
        self.chain.push(genesis_block);
        Ok(())
    }
    fn last_block(&mut self) -> Result<Block, Box<dyn std::error::Error>> {
        if let Some(last_block) = self.chain.last() {
            Ok(last_block.clone())
        } else {
            self.create_genesis_block()?;
            Ok(self.last_block()?)
        }
    }

    pub fn get_transaction_pool(&self) -> HashMap<String, PatientRecord> {
        return self.unconfirmed_transactions.clone();
    }

    fn register_node(&mut self, address: String) {
        self.nodes.push(address)
    }
    // fn resolve_conflicts(&mut self) -> bool {
    //     let mut max_length = self.chain.len();
    //     let mut new_chain = None;
    // }

    /*
     * add block function checks if newly added block's previous value is
     * equal or not to last block of the chains also checks if hashed value
     * is according to the design
     *
     *
     */

    pub fn add_block(
        &mut self,
        mut block: Block,
        proof: String,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        //proof is baically the computed hasehed value
        if let Ok(last_block) = self.last_block() {
            let previous_hash = last_block.get_hash_value().to_string();
            let block_previous_hash = block.get_pre_hash_value().to_string();
            if previous_hash != block_previous_hash {
                return Ok(false);
            }
            if !self.is_valid_proof(block.clone(), &proof)? {
                return Ok(false);
            }
            block.set_hash_value(proof);
            self.chain.push(block);
        }
        Ok(false)
    }

    pub fn add_new_transaction(&mut self, transaction: PatientRecord) {
        let patient_id = transaction.patient_id.clone();
        match self.unconfirmed_transactions.entry(patient_id) {
            Entry::Occupied(_) => {
                println!("Previous unconfirmed transaction on the pool!");
            }
            Entry::Vacant(entry) => {
                entry.insert(transaction);
            }
        }
    }
    fn clear_transaction_pool(&mut self) {
        self.unconfirmed_transactions.clear();
    }

    fn write_json(&self, filename: &str) -> Result<(), Box<dyn std::error::Error>> {
        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(false)
            .open(filename)?;
        let writer = BufWriter::new(file);
        serde_json::to_writer_pretty(writer, &self.get_all_chain().clone())?;
        Ok(())
    }

    pub fn get_all_chain(&self) -> Vec<Block> {
        self.chain.clone()
    }

    pub fn miner(&mut self) -> Result<bool, Box<dyn std::error::Error>> {
        if self.unconfirmed_transactions.len() == 0 {
            //nothing to mine
            return Ok(false);
        }
        for (_, transaction) in &self.unconfirmed_transactions.clone() {
            let last_block = self.last_block()?;
            let index = last_block.get_index_value() + 1;
            let mut new_block = Block::new(
                index,
                transaction.clone(),
                last_block.get_hash_value().to_string(),
                0,
            )?;
            let proof = &self.proof_of_work(&mut new_block)?;
            self.add_block(new_block, proof.to_string())?;
        }

        self.clear_transaction_pool();
        self.write_json("sannux.json")?;
        return Ok(true);
    }
    //checks the validity of the block with difficulty and computeted hash
    fn is_valid_proof(
        &self,
        block: Block,
        block_hash: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        if block_hash.starts_with(&"0".repeat(self.difficulty))
            && block_hash == block.compute_hash()?
        {
            return Ok(true);
        }
        return Ok(false);
    }

    pub fn proof_of_work(&self, block: &mut Block) -> Result<String, Box<dyn std::error::Error>> {
        let mut computed_hash = block.compute_hash()?;
        while !computed_hash.starts_with(&"0".repeat(self.difficulty)) {
            block.increase_nonce();
            computed_hash = block.compute_hash()?;
        }
        Ok(computed_hash)
    }
    pub fn import_transactions(
        &mut self,
        file_name: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        // let transaction_1 = PatientRecord {
        //     patient_id: "patient1".to_string(),
        //     doctor: "Maithala".to_string(),
        //     diagnosis: "i dont care".to_string(),
        //     treatment: "who cares".to_string(),
        //     image_cid: "utx".to_string(),
        //     nmc_number: 123,
        //     timestamp: SystemTime::now()
        //         .duration_since(SystemTime::UNIX_EPOCH)
        //         .unwrap()
        //         .as_millis(),
        // };
        // let transaction_2 = PatientRecord {
        //     patient_id: "patient2".to_string(),
        //     doctor: "Maithala".to_string(),
        //     diagnosis: "i dont care".to_string(),
        //     treatment: "who cares".to_string(),
        //     image_cid: "utx".to_string(),
        //     nmc_number: 12345,
        //     timestamp: SystemTime::now()
        //         .duration_since(SystemTime::UNIX_EPOCH)
        //         .unwrap()
        //         .as_millis(),
        // };
        // let transaction_3 = PatientRecord {
        //     patient_id: "patient3".to_string(),
        //     doctor: "Maithala".to_string(),
        //     diagnosis: "i dont care".to_string(),
        //     treatment: "who cares".to_string(),
        //     image_cid: "utx".to_string(),
        //     nmc_number: 12345,
        //     timestamp: SystemTime::now()
        //         .duration_since(SystemTime::UNIX_EPOCH)
        //         .unwrap()
        //         .as_millis(),
        // };
        // let transaction_4 = PatientRecord {
        //     patient_id: "patient4".to_string(),
        //     doctor: "Maithala".to_string(),
        //     diagnosis: "i dont care".to_string(),
        //     treatment: "who cares".to_string(),
        //     image_cid: "utx".to_string(),
        //     nmc_number: 12345,
        //     timestamp: SystemTime::now()
        //         .duration_since(SystemTime::UNIX_EPOCH)
        //         .unwrap()
        //         .as_millis(),
        // };
        let file = File::open(file_name)?;
        let reader = BufReader::new(file);
        let transaction_data: Vec<Block> = serde_json::from_reader(reader)?;
        self.chain = transaction_data;
        Ok(())
    }
}
