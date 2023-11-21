import { CrosshairMode, createChart } from 'lightweight-charts';
import { ModalHeader } from './TradeModal';

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

  chartElement.classList.add('chartModal');

  return chartElement;
}
export function ChartModal(chartData, tokenName) {
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modalWrapper');
  modalWrapper.innerHTML = '';
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.fontFamily = 'TwitterChirp';

  const chartNode = createChartNode(chartData);

  modal.appendChild(ModalHeader('💲' + tokenName + ' Chart'));
  modal.appendChild(chartNode);
  modalWrapper.appendChild(modal);

  return modalWrapper;
}

// Chart will be able to query the data from the API
