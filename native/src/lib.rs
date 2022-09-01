use neon::prelude::*;

mod party1;
mod party2;

fn hello(mut cx: FunctionContext) -> JsResult<JsString> {
    Ok(cx.string("hello node"))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("hello", hello)?;
    cx.export_function("p1_launch_server", party1::launch_server)?;
    cx.export_function("p1_launch_server_regular", party1::launch_server_regular)?;

    cx.export_function("p1_ecdsa_get_child_share", party1::ecdsa::get_child_share)?;

    cx.export_function("p2_ecdsa_generate_master_key", party2::ecdsa::generate_master_key)?;
    cx.export_function("p2_ecdsa_get_child_share", party2::ecdsa::get_child_share)?;
    cx.export_function("p2_ecdsa_sign", party2::ecdsa::sign)?;

    Ok(())
}
