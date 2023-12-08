use serde::Serialize;

use super::Player;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerResponse {
    pub id: i64,
    pub name: String,
}
impl From<Player> for PlayerResponse {
    fn from(value: Player) -> Self {
        Self {
            id: value.player_id,
            name: value.player_name,
        }
    }
}
