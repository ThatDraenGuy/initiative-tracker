use serde::{Deserialize, Serialize};
pub mod actions;
pub mod handler;

#[derive(Deserialize, Serialize)]
pub struct Ability {
    pub ability_id: i64,
    pub ability_name: String,
}

// #[derive(Deserialize, Serialize)]
// pub struct NewAbilty {
//     pub ability_name: String,
// }
