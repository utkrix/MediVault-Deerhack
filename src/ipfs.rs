pub async fn retrive_image(cid: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let client = ipfsapi::IpfsApi::new("127.0.0.1", 5001);
    let block = client.block_get(cid)?;
    let bytes: Vec<u8> = block.collect();
    Ok(bytes)
}

pub async fn store_image(data: Vec<u8>) -> Result<String, Box<dyn std::error::Error>> {
    let client = ipfsapi::IpfsApi::new("127.0.0.1", 5001);
    let value = client.block_put(&data)?;
    Ok(value)
}
