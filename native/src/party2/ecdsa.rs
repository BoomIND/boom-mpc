extern crate client_lib;
extern crate serde;
extern crate serde_json;

use self::client_lib::ecdsa::*;
use self::client_lib::{BigInt, ClientShim};
use neon::prelude::*;
use once_cell::sync::OnceCell;
use tokio::runtime::Runtime;

// Return a global tokio runtime or create one if it doesn't exist.
// Throws a JavaScript exception if the `Runtime` fails to create.
fn runtime<'a, C: Context<'a>>(cx: &mut C) -> NeonResult<&'static Runtime> {
    static RUNTIME: OnceCell<Runtime> = OnceCell::new();

    RUNTIME.get_or_try_init(|| Runtime::new().or_else(|err| cx.throw_error(err.to_string())))
}

pub fn generate_master_key(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let rt = runtime(&mut cx)?;
    let channel = cx.channel();
    let expected_args = 1;
    if cx.len() != expected_args {
        return cx.throw_error("Invalid number of arguments");
    }

    let (deferred, promise) = cx.promise();
    let p1_endpoint: String = cx.argument::<JsString>(0)?.value(&mut cx);
    rt.spawn(async move {
        println!("p1 {0}", p1_endpoint);

        let client_shim = ClientShim::new(p1_endpoint.to_string(), None);
        let master_key_share = get_master_key(&client_shim);

        deferred.settle_with(&channel, move |mut cx| {
            let val = cx.string(serde_json::to_string(&master_key_share).unwrap());
            Ok(val)
        });
    });
    Ok(promise)
}

pub fn get_child_share(mut cx: FunctionContext) -> JsResult<JsString> {
    let expected_args = 3;
    if cx.len() != expected_args {
        return cx.throw_error("Invalid number of arguments");
    }

    let party2_master_key_share: PrivateShare =
        serde_json::from_str(&cx.argument::<JsString>(0)?.value(&mut cx)).unwrap();
    let x: BigInt = serde_json::from_str(&cx.argument::<JsString>(1)?.value(&mut cx)).unwrap();
    let y: BigInt = serde_json::from_str(&cx.argument::<JsString>(2)?.value(&mut cx)).unwrap();

    let party2_child_share = party2_master_key_share.get_child(vec![x, y]);

    Ok(cx.string(serde_json::to_string(&party2_child_share).unwrap()))
}

pub fn sign(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let expected_args = 5;
    if cx.len() != expected_args {
        return cx.throw_error("Invalid number of arguments");
    }
    let (deferred, promise) = cx.promise();

    let p1_endpoint: String = cx.argument::<JsString>(0)?.value(&mut cx);

    let msg_hash: BigInt =
        serde_json::from_str(&cx.argument::<JsString>(1)?.value(&mut cx)).unwrap();

    let share: PrivateShare =
        serde_json::from_str(&cx.argument::<JsString>(2)?.value(&mut cx)).unwrap();

    let x: BigInt = serde_json::from_str(&cx.argument::<JsString>(3)?.value(&mut cx)).unwrap();
    let y: BigInt = serde_json::from_str(&cx.argument::<JsString>(4)?.value(&mut cx)).unwrap();

    let client_shim = ClientShim::new(p1_endpoint.to_string(), None);
    let signature = client_lib::ecdsa::sign(
        &client_shim,
        msg_hash.clone(),
        &share.master_key,
        x.clone(),
        y.clone(),
        &share.id,
    )
    .expect("ECDSA signature failed");

    let val = cx.string(serde_json::to_string(&signature).unwrap());
    deferred.resolve(&mut cx, val);

    Ok(promise)
}
