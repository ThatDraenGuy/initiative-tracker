use crate::schema::ability;
use diesel::prelude::*;

pub mod actions;
pub mod handler;

#[derive(Queryable, Selectable)]
#[diesel(table_name = ability)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Ability {
    pub ability_id: i64,
    pub ability_name: String,
}

#[derive(Insertable)]
#[diesel(table_name = ability)]
pub struct NewAbilty {
    pub ability_name: String,
}
