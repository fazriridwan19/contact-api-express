import { logger } from "./app/logging.js";
import { web } from "./app/web.js";

web.listen(8899, () => {
  logger.info("App start");
});
