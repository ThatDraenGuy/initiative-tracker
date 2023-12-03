// @generated automatically by Diesel CLI.

diesel::table! {
    ability (ability_id) {
        ability_id -> Int8,
        #[max_length = 20]
        ability_name -> Varchar,
    }
}

diesel::table! {
    ability_scores (stat_block_id, ability_id) {
        stat_block_id -> Int8,
        ability_id -> Int8,
        score -> Int4,
    }
}

diesel::table! {
    battle (battle_id) {
        battle_id -> Int8,
        round_number -> Int4,
        current_character_index -> Int4,
    }
}

diesel::table! {
    character (character_id) {
        character_id -> Int8,
        player_id -> Nullable<Int8>,
        stat_block_id -> Nullable<Int8>,
    }
}

diesel::table! {
    condition (condition_id) {
        condition_id -> Int8,
        #[max_length = 20]
        condition_name -> Varchar,
    }
}

diesel::table! {
    creature_type (creature_type_id) {
        creature_type_id -> Int8,
        #[max_length = 100]
        creature_type_name -> Varchar,
    }
}

diesel::table! {
    current_conditions (current_stats_id, condition_id) {
        current_stats_id -> Int8,
        condition_id -> Int8,
    }
}

diesel::table! {
    current_stats (current_stats_id) {
        current_stats_id -> Int8,
        character_id -> Int8,
        current_hit_points -> Nullable<Int4>,
        temporary_hit_points -> Int4,
        current_hit_dice_count -> Nullable<Int4>,
        current_armor_class -> Nullable<Int4>,
        current_speed -> Nullable<Int4>,
    }
}

diesel::table! {
    damage_type (damage_type_id) {
        damage_type_id -> Int8,
        #[max_length = 100]
        damage_type_name -> Varchar,
    }
}

diesel::table! {
    damage_type_modifiers (stat_block_id, damage_type_id) {
        stat_block_id -> Int8,
        damage_type_id -> Int8,
        modifier -> Float4,
    }
}

diesel::table! {
    dice_type (side_count) {
        side_count -> Int4,
    }
}

diesel::table! {
    initiative_entry (battle_id, character_id) {
        battle_id -> Int8,
        character_id -> Int8,
        initiative_roll -> Nullable<Int4>,
    }
}

diesel::table! {
    player (player_id) {
        player_id -> Int8,
        #[max_length = 20]
        player_name -> Nullable<Varchar>,
    }
}

diesel::table! {
    proficient_skills (stat_block_id, skill_id) {
        stat_block_id -> Int8,
        skill_id -> Int8,
    }
}

diesel::table! {
    skill (skill_id) {
        skill_id -> Int8,
        #[max_length = 100]
        skill_name -> Varchar,
        ability_id -> Int8,
    }
}

diesel::table! {
    stat_block (stat_block_id) {
        stat_block_id -> Int8,
        #[max_length = 20]
        entity_name -> Varchar,
        hit_points -> Int4,
        hit_dice_type -> Nullable<Int4>,
        hit_dice_count -> Nullable<Int4>,
        armor_class -> Int4,
        speed -> Int4,
        level -> Nullable<Int4>,
        creature_type_id -> Int8,
    }
}

diesel::joinable!(ability_scores -> ability (ability_id));
diesel::joinable!(ability_scores -> stat_block (stat_block_id));
diesel::joinable!(character -> player (player_id));
diesel::joinable!(character -> stat_block (stat_block_id));
diesel::joinable!(current_conditions -> condition (condition_id));
diesel::joinable!(current_conditions -> current_stats (current_stats_id));
diesel::joinable!(current_stats -> character (character_id));
diesel::joinable!(damage_type_modifiers -> damage_type (damage_type_id));
diesel::joinable!(damage_type_modifiers -> stat_block (stat_block_id));
diesel::joinable!(initiative_entry -> battle (battle_id));
diesel::joinable!(initiative_entry -> character (character_id));
diesel::joinable!(proficient_skills -> skill (skill_id));
diesel::joinable!(proficient_skills -> stat_block (stat_block_id));
diesel::joinable!(skill -> ability (ability_id));
diesel::joinable!(stat_block -> creature_type (creature_type_id));
diesel::joinable!(stat_block -> dice_type (hit_dice_type));

diesel::allow_tables_to_appear_in_same_query!(
    ability,
    ability_scores,
    battle,
    character,
    condition,
    creature_type,
    current_conditions,
    current_stats,
    damage_type,
    damage_type_modifiers,
    dice_type,
    initiative_entry,
    player,
    proficient_skills,
    skill,
    stat_block,
);
