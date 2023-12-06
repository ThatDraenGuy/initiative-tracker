use tokio_pg_mapper::FromTokioPostgresRow;

static INSERT_STMT: &str = include_str!("../sql/insert.sql");
pub fn prepare_insert<T: FromTokioPostgresRow, I: FromTokioPostgresRow>() -> String {
    INSERT_STMT
        .replace("$table_name", &T::sql_table())
        .replace("$fields", &I::sql_fields())
        .replace("$return_fields", &T::sql_table_fields())
        .replace("$values", {
            I::sql_fields()
                .split(',')
                .enumerate()
                .map(|val| format!("${}", val.0 + 1))
                .reduce(|acc, val| acc + ", " + &val)
                .as_deref()
                .unwrap_or("")
        })
}

static SELECT_STMT: &str = include_str!("../sql/select.sql");
pub fn prepare_select<T: FromTokioPostgresRow>() -> String {
    SELECT_STMT
        .replace("$table_name", &T::sql_table())
        .replace("$select_values", &T::sql_table_fields())
}

static COUNT_STMT: &str = include_str!("../sql/count.sql");
pub fn prepare_count<T: FromTokioPostgresRow>() -> String {
    COUNT_STMT.replace("$table_name", &T::sql_table())
}
