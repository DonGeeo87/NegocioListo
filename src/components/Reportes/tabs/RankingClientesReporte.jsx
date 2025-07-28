import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { SalesService } from '../../../services/SalesService';
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

const RankingClientesReporte = forwardRef((props, ref) => {
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
      return data.labels.map((nombre, i) => [nombre, data.datasets[0]?.data[i] ?? 0]);
    },
    getTableHeaders: () => ['Cliente', 'Monto Total Comprado ($)'],
  }));

  useEffect(() => {
    const ventas = SalesService.getAllSales();
    // Sumar monto total por cliente
    const clientes = {};
    ventas.forEach(v => {
      const nombre = v.cliente || 'Sin nombre';
      if (!clientes[nombre]) clientes[nombre] = 0;
      clientes[nombre] += v.total || 0;
    });
    // Top N clientes
    const topN = 10;
    const clientesOrdenados = Object.entries(clientes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
    const labels = clientesOrdenados.map(([nombre]) => nombre);
    const montos = clientesOrdenados.map(([, monto]) => monto);
    setData({
      labels,
      datasets: [
        {
          label: "Monto Total Comprado ($)",
          data: montos,
          backgroundColor: "#8E24AA",
        },
      ],
    });
  }, []);

  return (
    <div className="ranking-clientes-reporte">
      <h2>Ranking de Clientes</h2>
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
            No hay ventas registradas para mostrar ranking.
          </div>
        )}
      </div>
    </div>
  );
});

export default RankingClientesReporte; 