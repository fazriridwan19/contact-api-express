// import { logger } from "./app/logging";
import { web } from "./app/web.js";

web.listen(8899, () => {
  //   logger.info("App start");
  console.log("App start");
});
