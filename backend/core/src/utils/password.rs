use ring::constant_time::verify_slices_are_equal;
use ring::digest::digest;
use ring::digest::SHA512;

/// Hash the password.
pub fn hash_password(password: &str) -> String {
    let digest = digest(&SHA512, password.as_bytes());
    hex::encode(digest.as_ref())
}

/// Compares if the password equals to the stored hash.
pub fn verify_password(password: &str, hash: &str) -> bool {
    let digest = digest(&SHA512, password.as_bytes());

    let hashed = hex::encode(digest.as_ref());
    let origin = hash.to_string();

    match verify_slices_are_equal(hashed.as_bytes(), origin.as_bytes()) {
        Ok(()) => true,
        Err(_) => false,
    }
}
