import React from 'react';
import {useRouter} from 'next/router';
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
      text: 'Doanh thu hàng tháng',
      font: {
        size: 24,
      },
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
  dataPayment: any;
};

const BarPayment: React.FC<Props> = ({dataPayment}) => {
  const router = useRouter();
  const {id} = router.query;

  return (
    <div className="block h-[300px] lg:h-[400px]">
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              label: id ? 'Số tiền đã thu' : 'Số điện',
              data: id ? dataPayment.fullPayment : dataPayment.allPayment,
              backgroundColor: 'rgb(153, 255, 153)',
              borderWidth: 1,
            },
            {
              label: id ? 'Tổng số tiền' : 'Số nước',
              data: id ? dataPayment.allPayment : dataPayment.fullPayment,
              backgroundColor: 'rgb(255, 153, 153)',
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};
export default BarPayment;
