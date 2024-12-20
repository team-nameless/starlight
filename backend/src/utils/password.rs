use ring::digest::digest;
use ring::digest::SHA512;

/// Hash the password.
pub fn hash_password(password: &str) -> String {
    let digest = digest(&SHA512, password.as_bytes());
    hex::encode(digest.as_ref())
}

/// Compares if the password equals to the stored hash.
#[allow(dead_code)]
pub fn verify_password(password: &str, hash: &str) -> bool {
    let digest = digest(&SHA512, password.as_bytes());

    let hashed = hex::encode(digest.as_ref());
    let origin = hash.to_string();

    hashed == origin
}