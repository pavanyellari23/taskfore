import { buildData, buildGridColumns, buildLabelsData, gridData } from '../../../common/grid-common-helper';

export const gridColumns = (noOfCols) => buildGridColumns( [{ columnId: 'labelId', width: '22rem'}], noOfCols);

export const summaryGridData = (forecastingData) => {
  const totalRevenueLabelData = buildLabelsData({
    title: 'Total revenue',
    otherFields: []
  });
  const revenue = buildData({
    labelData: totalRevenueLabelData,
    field: 'totalRevenue',
    periodSummary: forecastingData?.periodSummary,
    totalSummary: forecastingData?.periodSummary?.totalRevenue,
    isReadOnly: true,
    formatOptions: {isFormat: true}
  });

  const totalResourceCost = buildLabelsData({
    title: 'Resource cost',
    otherFields: []
  });
  const resourceCost = buildData({
    labelData: totalResourceCost,
    field: 'finalResourceCostOtherCostSum',
    periodSummary: forecastingData?.periodSummary,
    totalSummary: forecastingData?.periodSummary?.totalCost,
    isReadOnly: true,
    formatOptions: {isFormat: true}
  });

  const totalDirectExpenses = buildLabelsData({
    title: 'Direct expenses $',
    otherFields: []
  });
  const directExpenses = buildData({
    labelData: totalDirectExpenses,
    field: 'directExpense',
    periodSummary: forecastingData?.periodSummary,
    totalSummary: forecastingData?.periodSummary?.directExpense,
    isReadOnly: true,
    formatOptions: {isFormat: true}
  });

  const totalDirectExpensePercentage = buildLabelsData({
    title: 'Direct expenses %',
    otherFields: []
  });
  const directExpensePercentage = buildData({
    labelData: totalDirectExpensePercentage,
    field: 'directExpensePercentage',
    periodSummary: forecastingData?.periodSummary,
    totalSummary: forecastingData?.periodSummary?.directExpensePercentage,
    isReadOnly: true,
    formatOptions: {isFormat: true, isPercentage: true}
  });

  const totalGrossMargin = buildLabelsData({
    title: 'Gross margin $',
    otherFields: []
  });
  const grossMargin = buildData({
    labelData: totalGrossMargin,
    field: 'grossMargin',
    periodSummary: forecastingData?.periodSummary,
    totalSummary: forecastingData?.periodSummary?.grossMargin,
    isReadOnly: true,
    formatOptions: {isFormat: true}
  });

  const totalGrossMarginPercentage = buildLabelsData({
    title: 'Gross margin %',
    otherFields: []
  });
  const grossMarginPercentage = buildData({
    labelData: totalGrossMarginPercentage,
    field: 'grossMarginPercentage',
    periodSummary: forecastingData?.periodSummary,
    totalSummary: forecastingData?.periodSummary?.grossMarginPercentage,
    isReadOnly: true,
    formatOptions: {isFormat: true, isPercentage: true}
  });
  
  const rowData = [
    revenue,
    resourceCost,
    directExpenses,
    directExpensePercentage,
    grossMargin,
    grossMarginPercentage
  ];

  return gridData(rowData);
};
