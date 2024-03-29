import React from 'react';
import {Bar} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Doanh thu hàng tháng của nhà',
    },
  },
};

const labels = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

type Props = {
  data: any;
};

const BarChart: React.FC<Props> = ({data}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Tổng số tiền',
        data: data,
        backgroundColor: 'springgreen',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="block h-[300px] lg:h-[400px]">
      <Bar options={options} data={chartData} />
    </div>
  );
};
export default BarChart;
