extern crate server_lib;

use std::collections::HashMap;

use self::server_lib::server::*;
use neon::prelude::*;
use once_cell::sync::OnceCell;
use tokio::runtime::Runtime;

// Return a global tokio runtime or create one if it doesn't exist.
// Throws a JavaScript exception if the `Runtime` fails to create.
fn runtime<'a, C: Context<'a>>(cx: &mut C) -> NeonResult<&'static Runtime> {
    static RUNTIME: OnceCell<Runtime> = OnceCell::new();

    RUNTIME.get_or_try_init(|| Runtime::new().or_else(|err| cx.throw_error(err.to_string())))
}

pub fn launch_server(mut cx: FunctionContext) -> JsResult<JsPromise> {
    let rt = runtime(&mut cx)?;
    let channel = cx.channel();
    let (deferred, promise) = cx.promise();
    rt.spawn(async move {
        let mut settings = HashMap::new();
        settings.insert("db".to_string(), "aws".to_string());
        settings.insert("aws_region".to_string(), "ap-south-1".to_string());

        let rsp = get_server(settings).launch().await;
        deferred.settle_with(&channel, move |mut cx| {
            let _r = rsp.or_else(|err| cx.throw_error(err.to_string()));
            Ok(cx.string("success"))
        });
    });
    Ok(promise)
}

pub mod ecdsa;
