/// Calculate exp for a specific level.
pub fn get_exp_for_level(level: i64) -> i64 {
    const C: u64 = 53;
    let z = level as f64;
    let t = ((z + C as f64 - 92.0) * 0.02).max(0.0);

    ((t + 0.1) * (z + C as f64).powi(2)).round() as i64 + 1
}
