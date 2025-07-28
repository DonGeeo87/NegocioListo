import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { SalesService } from "../../../services/SalesService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const VentasMensualesReporte = forwardRef((props, ref) => {
  const [data, setData] = useState({ labels: meses, datasets: [] });
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const chartRef = useRef();

  useImperativeHandle(ref, () => ({
    getChartImage: () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        return chartRef.current.chartInstance.toBase64Image();
      }
      return null;
    },
    getTableData: () => {
      return meses.map((mes, i) => [mes, ventasPorMes[i]?.toFixed(2) ?? '0']);
    },
    getTableHeaders: () => ['Mes', 'Total Ventas'],
  }));

  useEffect(() => {
    const ventas = SalesService.getAllSales();
    // Agrupar ventas por mes
    const ventasPorMesArr = Array(12).fill(0);
    ventas.forEach(v => {
      const fecha = new Date(v.fecha);
      const mes = fecha.getMonth();
      ventasPorMesArr[mes] += v.total || 0;
    });
    setVentasPorMes(ventasPorMesArr);
    setData({
      labels: meses,
      datasets: [
        {
          label: "Ventas ($)",
          data: ventasPorMesArr,
          backgroundColor: "#2E7D32",
        },
      ],
    });
  }, []);

  const exportarExcel = () => {
    let csv = 'Mes,Total Ventas\n';
    meses.forEach((mes, i) => {
      csv += `${mes},${ventasPorMes[i].toFixed(2)}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventas_mensuales.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Ventas Mensuales', 14, 16);
    const tableColumn = ['Mes', 'Total Ventas'];
    const tableRows = meses.map((mes, i) => [mes, ventasPorMes[i].toFixed(2)]);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 22 });
    doc.save('ventas_mensuales.pdf');
  };

  return (
    <div className="ventas-mensuales-reporte">
      <h2>Ventas Mensuales</h2>
      <div style={{ height: 350, background: '#fff', borderRadius: 8, marginBottom: 24, padding: 16 }}>
        <Bar ref={chartRef} data={data} options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }} />
      </div>
    </div>
  );
});

export default VentasMensualesReporte; 