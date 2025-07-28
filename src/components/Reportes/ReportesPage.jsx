import React, { useState } from "react";
import VentasMensualesReporte from "./tabs/VentasMensualesReporte";
import GastosPorCategoriaReporte from './tabs/GastosPorCategoriaReporte';
import VentasVsGastosReporte from './tabs/VentasVsGastosReporte';
import RankingProductosReporte from './tabs/RankingProductosReporte';
import RankingClientesReporte from './tabs/RankingClientesReporte';
import './ReportesPage.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const TABS = [
  { key: 'ventas', label: 'Ventas Mensuales', component: <VentasMensualesReporte /> },
  { key: 'gastos', label: 'Gastos por Categoría', component: <GastosPorCategoriaReporte /> },
  { key: 'vs', label: 'Ventas vs Gastos', component: <VentasVsGastosReporte /> },
  { key: 'productos', label: 'Ranking de Productos', component: <RankingProductosReporte /> },
  { key: 'clientes', label: 'Ranking de Clientes', component: <RankingClientesReporte /> },
];

const EXPORT_OPTIONS = [
  { key: 'ventas', label: 'Ventas Mensuales' },
  { key: 'gastos', label: 'Gastos por Categoría' },
  { key: 'vs', label: 'Ventas vs Gastos' },
  { key: 'productos', label: 'Ranking de Productos' },
  { key: 'clientes', label: 'Ranking de Clientes' },
  { key: 'facturas', label: 'Histórico de Facturas' },
];

const REPORT_COMPONENTS = {
  ventas: VentasMensualesReporte,
  gastos: GastosPorCategoriaReporte,
  vs: VentasVsGastosReporte,
  productos: RankingProductosReporte,
  clientes: RankingClientesReporte,
};

const ReportesPage = () => {
  const [tab, setTab] = useState('ventas');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(EXPORT_OPTIONS.map(opt => opt.key));
  const [exporting, setExporting] = useState(false);

  // Crear refs para cada sección
  const sectionRefs = React.useRef({});
  Object.keys(REPORT_COMPONENTS).forEach(key => {
    if (!sectionRefs.current[key]) {
      sectionRefs.current[key] = React.createRef();
    }
  });

  const handleOptionChange = (key) => {
    setSelectedOptions(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const handleExportPDF = async () => {
    setExporting(true);
    // Obtener datos de empresa
    const config = JSON.parse(localStorage.getItem('configuracion_empresa') || '{}');
    const empresaNombre = config.nombre || 'NegocioListo';
    const logo = config.logo || (window.location.origin + '/public/icon-512.png');
    const fecha = new Date().toLocaleDateString('es-CL');
    // Crear PDF
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    // Logo
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);
    // Nombre empresa
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(empresaNombre, 50, 25);
    // Fecha
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${fecha}`, 50, 35);
    // Resumen de secciones
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Secciones incluidas:', 10, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    let y = 65;
    selectedOptions.forEach((key, idx) => {
      const label = EXPORT_OPTIONS.find(opt => opt.key === key)?.label || key;
      doc.text(`- ${label}`, 15, y + idx * 8);
    });
    // Salto de página para empezar las secciones
    doc.addPage();
    // Capturar cada sección desde refs ya montados
    for (let i = 0; i < selectedOptions.length; i++) {
      const key = selectedOptions[i];
      const label = EXPORT_OPTIONS.find(opt => opt.key === key)?.label || key;
      const ref = sectionRefs.current[key];
      if (!ref || !ref.current) continue;
      // Esperar a que el gráfico esté listo (pequeño delay por seguridad)
      await new Promise(res => setTimeout(res, 200));
      // Capturar imagen y datos
      const chartImage = ref.current?.getChartImage?.();
      const tableHeaders = ref.current?.getTableHeaders?.() || [];
      const tableData = ref.current?.getTableData?.() || [];
      // Insertar título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(label, 10, 20);
      // Insertar imagen del gráfico
      if (chartImage) {
        doc.addImage(chartImage, 'PNG', 10, 25, 180, 60);
      }
      // Insertar tabla
      if (tableHeaders.length && tableData.length) {
        autoTable(doc, {
          head: [tableHeaders],
          body: tableData,
          startY: chartImage ? 90 : 30,
          margin: { left: 10, right: 10 },
          styles: { fontSize: 10 },
        });
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text('No hay datos para mostrar.', 10, chartImage ? 90 : 30);
      }
      // Salto de página si no es la última sección
      if (i < selectedOptions.length - 1) {
        doc.addPage();
      }
    }
    // Guardar PDF
    doc.save(`Reporte_NegocioListo_${fecha.replace(/\//g, '-')}.pdf`);
    setExporting(false);
    setShowExportModal(false);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    const config = JSON.parse(localStorage.getItem('configuracion_empresa') || '{}');
    const fecha = new Date().toLocaleDateString('es-CL');
    const wb = XLSX.utils.book_new();
    for (let i = 0; i < selectedOptions.length; i++) {
      const key = selectedOptions[i];
      const label = EXPORT_OPTIONS.find(opt => opt.key === key)?.label || key;
      const ref = sectionRefs.current[key];
      if (!ref || !ref.current) continue;
      await new Promise(res => setTimeout(res, 100));
      const headers = ref.current?.getTableHeaders?.() || [];
      const data = ref.current?.getTableData?.() || [];
      // Si no hay datos, poner una fila vacía
      const rows = data.length ? data : [['No hay datos']];
      const wsData = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, label.substring(0, 31));
    }
    const nombreArchivo = `Reporte_NegocioListo_${fecha.replace(/\//g, '-')}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
    setExporting(false);
    setShowExportModal(false);
  };

  return (
    <div className="reportes-page-container">
      <div className="reportes-container">
        <div className="reportes-header">
          <h1>Reportes</h1>
          <p>Analiza el rendimiento de tu negocio</p>
        </div>
        
        <div className="calendario-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--color-title)', margin: 0 }}>Análisis de Datos</h2>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowExportModal(true)}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition-normal)'
              }}
            >
              Exportar Reporte Personalizado
            </button>
          </div>
      {showExportModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginBottom: 16 }}>Exportar Reporte Personalizado</h2>
            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              {EXPORT_OPTIONS.map(opt => (
                <div key={opt.key} style={{ marginBottom: 8 }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(opt.key)}
                      onChange={() => handleOptionChange(opt.key)}
                      style={{ marginRight: 8 }}
                      disabled={exporting}
                    />
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button className="btn btn-primary" onClick={handleExportPDF} disabled={exporting}>
                {exporting ? 'Generando PDF...' : 'Exportar a PDF'}
              </button>
              <button className="btn btn-secondary" onClick={handleExportExcel} disabled={exporting}>
                {exporting ? 'Generando Excel...' : 'Exportar a Excel'}
              </button>
            </div>
            <button className="btn btn-error" onClick={() => setShowExportModal(false)} disabled={exporting}>
              Cancelar
            </button>
            {exporting && <div style={{marginTop:16, color:'#888'}}>Generando reporte, por favor espera...</div>}
          </div>
        </div>
      )}
          <div className="reportes-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`tab-btn${tab === t.key ? ' active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="reportes-tab-content">
            {TABS.find(t => t.key === tab)?.component}
          </div>
        </div>
        
        {/* Renderizar todos los reportes ocultos para exportación */}
        <div style={{display:'none'}}>
          <VentasMensualesReporte ref={sectionRefs.current['ventas']} />
          <GastosPorCategoriaReporte ref={sectionRefs.current['gastos']} />
          <VentasVsGastosReporte ref={sectionRefs.current['vs']} />
          <RankingProductosReporte ref={sectionRefs.current['productos']} />
          <RankingClientesReporte ref={sectionRefs.current['clientes']} />
        </div>
      </div>
    </div>
  );
};

export default ReportesPage; 