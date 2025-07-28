import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Bar } from "react-chartjs-2";
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

const GastosPorCategoriaReporte = forwardRef((props, ref) => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const chartRef = useRef();

  useImperativeHandle(ref, () => ({
    getChartImage: () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        return chartRef.current.chartInstance.toBase64Image();
      }
      return null;
    },
    getTableData: () => {
      return data.labels.map((cat, i) => [cat, data.datasets[0]?.data[i] ?? 0]);
    },
    getTableHeaders: () => ['Categoría', 'Gastos ($)'],
  }));

  useEffect(() => {
    const gastos = ExpensesService.getAllExpenses();
    // Agrupar y sumar por categoría
    const categorias = {};
    gastos.forEach(g => {
      if (!categorias[g.categoria]) categorias[g.categoria] = 0;
      categorias[g.categoria] += g.monto || 0;
    });
    const labels = Object.keys(categorias);
    const valores = labels.map(cat => categorias[cat]);
    setData({
      labels,
      datasets: [
        {
          label: "Gastos ($)",
          data: valores,
          backgroundColor: "#FF9800",
        },
      ],
    });
  }, []);

  return (
    <div className="gastos-por-categoria-reporte">
      <h2>Gastos por Categoría</h2>
      <div style={{ height: 350, background: '#fff', borderRadius: 8, marginBottom: 24, padding: 16 }}>
        {data.labels.length > 0 ? (
          <Bar ref={chartRef}
            data={data}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: { enabled: true },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#888', marginTop: 100 }}>
            No hay datos de gastos para mostrar.
          </div>
        )}
      </div>
    </div>
  );
});

export default GastosPorCategoriaReporte; 