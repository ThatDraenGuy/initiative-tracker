DROP TABLE IF EXISTS ability CASCADE;

DROP TABLE IF EXISTS ability_scores CASCADE;

DROP TABLE IF EXISTS battle CASCADE;

DROP TABLE IF EXISTS player CASCADE;

DROP TABLE IF EXISTS "character" CASCADE;

DROP TABLE IF EXISTS "condition" CASCADE;

DROP TABLE IF EXISTS creature_type CASCADE;

DROP TABLE IF EXISTS current_conditions CASCADE;

DROP TABLE IF EXISTS current_stats CASCADE;

DROP TABLE IF EXISTS damage_type CASCADE;

DROP TABLE IF EXISTS damage_type_modifiers CASCADE;

DROP TABLE IF EXISTS dice_type CASCADE;

DROP TABLE IF EXISTS initiative_entry CASCADE;

DROP TABLE IF EXISTS proficient_skills CASCADE;

DROP TABLE IF EXISTS skill CASCADE;

DROP TABLE IF EXISTS stat_block CASCADE;


DROP FUNCTION trigger_delete_stats();

DROP FUNCTION trigger_check_character_index();

DROP FUNCTION trigger_check_current_stats_hp();

DROP FUNCTION trigger_check_ability_scores();

DROP FUNCTION trigger_check_player_in_battle();

DROP FUNCTION trigger_check_current_stats_hit_dice();


DROP FUNCTION start_battle(int8[]);

DROP FUNCTION damage(int4, int8);

DROP FUNCTION damage_with_type(int4, int8, int8);

DROP FUNCTION heal(int4, int8);

DROP FUNCTION roll_dice(int4);

DROP FUNCTION get_proficiency_bonus(int8);

DROP FUNCTION roll_ability_check(int8, int8);

DROP FUNCTION roll_skill_check(int8, int8);