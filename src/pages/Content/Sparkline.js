import { createChart } from 'lightweight-charts';
import { ModalHeader } from './TradeModal';

const chartOptions = {
  width: 600,
  height: 300,
  rightPriceScale: {
    borderVisible: false,
  },
  timeScale: {
    borderVisible: false,
  },
};

const areaSeriesSetting = {
  topColor: 'rgba(33, 150, 243, 0.56)',
  bottomColor: 'rgba(33, 150, 243, 0.04)',
  lineColor: 'rgba(33, 150, 243, 1)',
  lineWidth: 2,
};

const lightTheme = {
  chart: {
    layout: {
      background: {
        type: 'solid',
        color: '#FFFFFF',
      },
      lineColor: '#2B2B43',
      textColor: '#191919',
    },
    watermark: {
      color: 'rgba(0, 0, 0, 0)',
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: '#f0f3fa',
      },
    },
  },
  series: {
    topColor: 'rgba(33, 150, 243, 0.56)',
    bottomColor: 'rgba(33, 150, 243, 0.04)',
    lineColor: 'rgba(33, 150, 243, 1)',
  },
};

function createSeriesNode(sparklines) {
  const chartElement = document.createElement('div');

  const chart = createChart(chartElement, chartOptions);
  const areaSeries = chart.addAreaSeries(areaSeriesSetting);
  chart.applyOptions(lightTheme.chart);
  areaSeries.applyOptions(lightTheme.series);

  areaSeries.setData(sparklines);

  chartElement.classList.add('chartModal');

  return chartElement;
}

export function SparklinesModal(chartData, tokenName) {
  const modalWrapper = document.createElement('div');
  modalWrapper.classList.add('modalWrapper');
  modalWrapper.innerHTML = '';
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.style.fontFamily = 'TwitterChirp';

  const chartNode = createSeriesNode(chartData);

  modal.appendChild(ModalHeader('💲' + tokenName + ' Chart'));
  modal.appendChild(chartNode);
  modalWrapper.appendChild(modal);

  return modalWrapper;
}

// Sparklines will be able to query the data from the API
