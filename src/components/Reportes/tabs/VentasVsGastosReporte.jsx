import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { SalesService } from '../../../services/SalesService';
import { ExpensesService } from '../../../services/ExpensesService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const VentasVsGastosReporte = forwardRef((props, ref) => {
  const [data, setData] = useState({ labels: meses, datasets: [] });
  const chartRef = useRef();

  useImperativeHandle(ref, () => ({
    getChartImage: () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        return chartRef.current.chartInstance.toBase64Image();
      }
      return null;
    },
    getTableData: () => {
      // Devuelve una fila por mes: [mes, ventas, gastos]
      return data.labels.map((mes, i) => [
        mes,
        data.datasets[0]?.data[i] ?? 0,
        data.datasets[1]?.data[i] ?? 0
      ]);
    },
    getTableHeaders: () => ['Mes', 'Ventas ($)', 'Gastos ($)'],
  }));

  useEffect(() => {
    const ventas = SalesService.getAllSales();
    const gastos = ExpensesService.getAllExpenses();
    // Agrupar ventas y gastos por mes
    const ventasPorMes = Array(12).fill(0);
    const gastosPorMes = Array(12).fill(0);
    ventas.forEach(v => {
      const fecha = new Date(v.fecha);
      const mes = fecha.getMonth();
      ventasPorMes[mes] += v.total || 0;
    });
    gastos.forEach(g => {
      const fecha = new Date(g.fecha);
      const mes = fecha.getMonth();
      gastosPorMes[mes] += g.monto || 0;
    });
    setData({
      labels: meses,
      datasets: [
        {
          label: "Ventas ($)",
          data: ventasPorMes,
          backgroundColor: "#2E7D32",
        },
        {
          label: "Gastos ($)",
          data: gastosPorMes,
          backgroundColor: "#FF9800",
        },
      ],
    });
  }, []);

  return (
    <div className="ventas-vs-gastos-reporte">
      <h2>Ventas vs Gastos</h2>
      <div style={{ height: 350, background: '#fff', borderRadius: 8, marginBottom: 24, padding: 16 }}>
        <Bar ref={chartRef}
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
              title: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
});

export default VentasVsGastosReporte; 