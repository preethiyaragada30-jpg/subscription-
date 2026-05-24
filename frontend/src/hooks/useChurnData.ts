import {
  kpiData,
  riskAccounts,
  trendData,
  churnReasons,
} from "../data/mockData";

const useChurnData = () => {
  return {
    kpiData,
    riskAccounts,
    trendData,
    churnReasons,
  };
};

export default useChurnData;