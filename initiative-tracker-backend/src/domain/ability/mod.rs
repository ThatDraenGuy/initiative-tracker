use serde::{Deserialize, Serialize};
use tokio_pg_mapper_derive::PostgresMapper;
use tokio_postgres::types::ToSql;

pub mod actions;
pub mod handler;

#[derive(Deserialize, PostgresMapper, Serialize)]
#[pg_mapper(table = "ability")]
pub struct Ability {
    pub ability_id: i64,
    pub ability_name: String,
}

#[derive(Deserialize, PostgresMapper, Serialize)]
#[pg_mapper(table = "ability")]
pub struct NewAbilty {
    pub ability_name: String,
}
impl NewAbilty {
    pub fn as_sql_values(&self) -> [&(dyn ToSql + Sync); 1] {
        [&self.ability_name]
    }
}
