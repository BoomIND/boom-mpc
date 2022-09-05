import app from "./party2-express";

app.listen(process.env.PORT ?? 3005, () => {
  console.log(`Party2 server started at ${process.env.PORT ?? 3005}`);
});
