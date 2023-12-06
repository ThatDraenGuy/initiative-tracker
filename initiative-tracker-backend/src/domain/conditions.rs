pub trait Condition {
    fn apply(&self, stmt: &str) -> String;
}

pub fn add_condition(stmt: &str, condition: &impl Condition) -> String {
    let stmt = condition.apply(stmt);
    stmt.replace("$condition", EMPTY_CONDITION)
}

pub static EMPTY_CONDITION: &str = "TRUE";
