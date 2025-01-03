import { createCluster } from "./createCluster.js";
import { start } from "./start.js";

const clusterConfig = {
  autoRestart: true,
  instanceMultiplier: 1,
  logger: console,
  useCluster: true,
};

createCluster(clusterConfig, start);
