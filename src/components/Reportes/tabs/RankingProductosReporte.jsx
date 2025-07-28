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

const RankingProductosReporte = forwardRef((props, ref) => {
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
    getTableHeaders: () => ['Producto', 'Cantidad Vendida'],
  }));

  useEffect(() => {
    const ventas = SalesService.getAllSales();
    // Contar cantidad vendida por producto
    const productosVendidos = {};
    ventas.forEach(v => {
      (v.productos || []).forEach(p => {
        if (!productosVendidos[p.nombre]) productosVendidos[p.nombre] = 0;
        productosVendidos[p.nombre] += p.cantidad || 0;
      });
    });
    // Top N productos
    const topN = 10;
    const productosOrdenados = Object.entries(productosVendidos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);
    const labels = productosOrdenados.map(([nombre]) => nombre);
    const cantidades = productosOrdenados.map(([, cantidad]) => cantidad);
    setData({
      labels,
      datasets: [
        {
          label: "Cantidad Vendida",
          data: cantidades,
          backgroundColor: "#1976D2",
        },
      ],
    });
  }, []);

  return (
    <div className="ranking-productos-reporte">
      <h2>Ranking de Productos</h2>
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

export default RankingProductosReporte; 