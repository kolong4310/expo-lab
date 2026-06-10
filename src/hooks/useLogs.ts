import { useCallback, useState } from "react";
import { getLogsByDate } from "../database/repositories/logsRepository";
import { WorkLog } from "../database/types";

export const useLogs = (date: string) => {
  const [logs, setLogs] = useState<WorkLog[]>([]);

  const refreshLogs = useCallback(() => {
    setLogs(getLogsByDate(date));
  }, [date]);

  return {
    logs,
    todayLog: logs[0] ?? null,
    refreshLogs,
  };
};
