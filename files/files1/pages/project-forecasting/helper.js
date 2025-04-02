export const initilizeAdjustmentRow = (forecastingPeriodSummary) => {
  forecastingPeriodSummary.map(item => {
    delete item.resourceRevenueAdjustments;
    delete item.resourceCostAdjustments;
  });
  return forecastingPeriodSummary;
};