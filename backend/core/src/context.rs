#[allow(unused, warnings)]
use crate::prisma;
use std::sync::Arc;

#[allow(unused, warnings)]
use prisma::*;

#[derive(Clone)]
pub struct Context {
    pub prisma: Arc<PrismaClient>,
}

pub type Ctx = rocket::State<Context>;
