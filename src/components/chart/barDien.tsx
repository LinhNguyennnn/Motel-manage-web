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
      text: 'Số lượng điện tiêu thụ hàng tháng',
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
  data: any;
};

const BarDien: React.FC<Props> = ({data}) => {
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
              label: 'Số điện',
              data: id ? data : data.result,
              backgroundColor: 'rgb(255, 152, 152)',
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};
export default BarDien;
