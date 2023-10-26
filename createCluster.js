import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

// export interface ClusterConfig {
//   autoRestart?: boolean;
//   instanceMultiplier?: number;
//   logger: LoggerInstance;
//   useCluster: boolean;
// }

export const createCluster = (
  { autoRestart = false, instanceMultiplier = 1, logger = console },
  callback
) => {
  if (!cluster.isPrimary) {
    return callback();
  }

  const workersCount = numCPUs * (instanceMultiplier || 1);
  const maxRestartTimeout = 5000 * workersCount;
  const cleanExit = () => {
    process.exit();
  };

  for (let count = 0; count < workersCount; count++) {
    cluster.fork();
  }

  cluster.on("fork", (worker) => {
    logger.info("Cluster: worker started", { pid: worker.process.pid });
  });

  cluster.on("error", (error) => {
    logger.error("Cluster thread error", error);
  });

  cluster.on("exit", (worker, code, signal) => {
    logger.error("Cluster: worker died", {
      code,
      pid: worker.process.pid,
      signal,
    });

    if (autoRestart) {
      setTimeout(() => {
        cluster.fork();
      }, Math.round(Math.random() * maxRestartTimeout));
    }
  });

  // App is closing
  process.on("exit", cleanExit);

  // Catch ctrl+c event
  process.on("SIGINT", cleanExit);

  // Catch "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", cleanExit);
  process.on("SIGUSR2", cleanExit);

  // Catch kill
  process.on("SIGTERM", cleanExit);

  // Catch uncaught exceptions
  process.on("uncaughtException", cleanExit);

  // Catch unhandled promise rejections
  process.on("unhandledRejection", cleanExit);
};
