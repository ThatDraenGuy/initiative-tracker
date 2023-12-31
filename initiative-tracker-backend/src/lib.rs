extern crate proc_macro;
extern crate proc_macro2;
#[macro_use]
extern crate quote;
extern crate syn;

use proc_macro2::TokenStream;

#[proc_macro_attribute]
pub fn derive_request(
    _metadata: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let input: TokenStream = input.into();
    let output = quote! {
        #[derive(serde::Deserialize, validator::Validate)]
        #[serde(rename_all = "camelCase")]
        #input
    };
    output.into()
}

#[proc_macro_attribute]
pub fn derive_response(
    _metadata: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let input: TokenStream = input.into();
    let output = quote! {
        #[derive(serde::Serialize)]
        #[serde(rename_all = "camelCase")]
        #input
    };
    output.into()
}

#[proc_macro_attribute]
pub fn derive_entity(
    _metadata: proc_macro::TokenStream,
    input: proc_macro::TokenStream,
) -> proc_macro::TokenStream {
    let input: TokenStream = input.into();
    let output = quote! {
        #[derive(serde::Serialize, serde::Deserialize, sqlx::FromRow)]
        #input
    };
    output.into()
}
