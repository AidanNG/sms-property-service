import { app } from "./app.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
