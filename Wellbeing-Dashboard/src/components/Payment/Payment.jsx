import React from "react";
import Card from "../UI/card.jsx";
import Button from "../Advertising/button.jsx";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import { Weight } from "lucide-react";
import { color } from "framer-motion";

// Register necessary elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Plugin to display percentage labels
const pieChartPercentagePlugin = {
  id: 'pieChartPercentage',
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const width = chart.width;
    const height = chart.height;
    ctx.restore();

    const fontSize = (height / 114).toFixed(2);
    ctx.font = `${fontSize}em sans-serif`;
    ctx.textBaseline = "middle";

    const text = chart.data.datasets[0].data.reduce((a, b) => a + b, 0) + '%';
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillText(text, textX, textY);
    ctx.save();
  }
};

const Payment = () => {
  const navigate = useNavigate();
  const handleInvoiceClick = () => navigate("/invoice");

  const data = {
    labels: ['مدفوعة', 'مجانية'],
    datasets: [{ data: [70, 30], backgroundColor: ['#1F77BC', '#B2CEF2'] }],
  };
  const data2 = {
    labels: ['اخرى', 'فيزا'],
    datasets: [{ data: [60, 40], backgroundColor: ['#1F77BC', '#B2CEF2'] }],
  };

    const options = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 13,
                        Weight: 'bold'
                    }
                }
            }
        }
    };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3">
      <Card className="p-4 bg-white shadow-md rounded-2xl">
          <div className="bg-white p-4 rounded-[20px] shadow-md">
                    <h2 className="text-[#1F77BC] text-md font-semibold">اجمالي الربح</h2>
                    <div className="flex flex-col items-center justify-center">
                      <GaugeChart
                        id="gauge-chart"
                        nrOfLevels={20}
                        percent={0.75} // Example percentage (75%)
                        colors={["#1F77BC", "#B2CEF2"]} // Gradient colors
                        arcWidth={0.3}
                        textColor="#1F77BC"
                      />
                      <div className="mt-2 text-center">
                        <p className="text-sm text-gray-700">القيمة الحالية: $7,500</p>
                        <p className="text-sm text-gray-700">القيمة المتوقعة: $10,000</p>
                      </div>
                    </div>
            </div>
        </Card>
        <Card className="p-4 bg-white shadow-md rounded-2xl">
          <h3 className="text-lg text-[#1F77BC] font-semibold mb-2">الجلسات</h3>
          <div style={{ width: '150px', height: '150px', margin: 'auto' }}>
            <Pie data={data} options={options} plugins={[pieChartPercentagePlugin]} />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-md rounded-2xl">
          <h3 className="text-lg text-[#1F77BC] font-semibold mb-2">الأكثر استخداماً</h3>
          <div style={{ width: '160px', height: '160px', margin: 'auto' }}>
            <Pie data={data2} options={options} plugins={[pieChartPercentagePlugin]} />
          </div>
        </Card>
       
      </div>
      {/* Table Section */}
      <div className="col-span-3 bg-white p-4 rounded-2xl shadow-md">
        <h3 className="text-lg text-[#1F77BC] font-semibold mb-4">المعاملات المالية</h3>
        <table className="w-full min-w-[600px] overflow-x-auto">
          <thead>
                <tr className="bg-gray-100">
                <th className="p-3 text-right">المريض</th>
                <th className="p-3 text-right">الطبيب</th>
                <th className="p-3 text-right">رقم المعاملة</th>
                <th className="p-3 text-right">المبلغ</th>
                <th className="p-3 text-right">الوسيلة</th>
                <th className="p-3 text-right">التاريخ</th>

                <th className="p-3 text-right">الفاتورة</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              
              <td className="p-3 text-right">عمر عبد الله</td>
              <td className="p-3 text-right">أسامة فهمي</td>
              <td className="p-3 text-right">207</td>
              <td className="p-3 text-right">200$</td>
              <td className="p-3 text-right"><img src="https://via.placeholder.com/50" alt="Visa Payment Method" className="mx-auto" /></td>
              <td className="p-3 text-right">20/2/2025</td>
              <td className="p-3 text-right">
                <Button className="bg-[#1F77BC] text-white px-4 py-2 rounded-md hover:bg-[#19649E]" onClick={handleInvoiceClick}>
                  عرض الفاتورة
                </Button>
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;