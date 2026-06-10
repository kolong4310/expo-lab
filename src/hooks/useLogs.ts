import { useCallback, useState } from "react";
import { getLogsByDate, WorkLog } from "../database/db";

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
