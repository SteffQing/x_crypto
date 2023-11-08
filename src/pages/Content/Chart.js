import { CrosshairMode, createChart } from 'lightweight-charts';

const chartOptions = {
  width: 600,
  height: 300,
  layout: {
    background: {
      type: 'solid',
      color: '#000000',
    },
    textColor: 'rgba(255, 255, 255, 0.9)',
  },
  grid: {
    vertLines: {
      color: 'rgba(197, 203, 206, 0.5)',
    },
    horzLines: {
      color: 'rgba(197, 203, 206, 0.5)',
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
  },
  rightPriceScale: {
    borderColor: 'rgba(197, 203, 206, 0.8)',
  },
  timeScale: {
    borderColor: 'rgba(197, 203, 206, 0.8)',
  },
};
const candleSeriesSettings = {
  upColor: 'rgba(0, 255, 0, 1)',
  downColor: 'rgba(255, 0, 0, 1)',
  borderDownColor: 'rgba(255, 0, 0, 1)',
  borderUpColor: 'rgba(0, 255, 0, 1)',
  wickDownColor: 'rgba(255, 0, 0, 1)',
  wickUpColor: 'rgba(0, 255, 0, 1)',
};

function createChartNode(chartData) {
  const chartElement = document.createElement('div');

  const chart = createChart(chartElement, chartOptions);
  const candleSeries = chart.addCandlestickSeries(candleSeriesSettings);
  candleSeries.setData(chartData);

  chartElement.style.position = 'absolute';
  chartElement.style.left = '0';
  chartElement.style.zIndex = '999';
  chartElement.style.display = 'none';
  chartElement.style.width = '400px';
  chartElement.style.top = '0px';

  return chartElement;
}
export { createChartNode };
