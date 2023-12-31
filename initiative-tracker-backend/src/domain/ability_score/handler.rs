use initiative_tracker_backend::derive_response;

use crate::domain::ability::handler::AbililtyResponse;

use super::AbilityScore;

#[derive_response]
pub struct AbilityScoreResponse {
    pub stat_block_id: i64,
    pub score: i32,
    pub ability: AbililtyResponse,
}
impl From<AbilityScore> for AbilityScoreResponse {
    fn from(value: AbilityScore) -> Self {
        Self {
            stat_block_id: value.stat_block_id,
            score: value.score,
            ability: value.ability.into(),
        }
    }
}
