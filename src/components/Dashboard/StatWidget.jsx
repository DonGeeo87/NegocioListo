import React from 'react';
import { Card, Text } from '@mantine/core';

const StatWidget = ({ widget, onClick }) => (
  <Card
    shadow="lg"
    radius="xl"
    p="xl"
    style={{
      background: widget.bg,
      border: widget.border,
      minHeight: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform 0.18s',
      boxSizing: 'border-box',
      width: '100%',
      maxWidth: 340,
      minWidth: 260,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    }}
    withBorder
    onClick={onClick}
    onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-6px) scale(1.04)')}
    onMouseOut={e => (e.currentTarget.style.transform = 'none')}
    title={`Ver detalle de ${widget.label}`}
  >
    <div style={{ marginBottom: 18, fontSize: 48 }}>{widget.icon}</div>
    <Text size="lg" weight={900} style={{ color: '#222', marginBottom: 10, fontSize: 26, letterSpacing: 0.5 }}>{widget.label}</Text>
    <Text size="xl" weight={900} style={{ color: '#222', fontSize: 40, marginBottom: 4 }}>{widget.value}</Text>
  </Card>
);

export default StatWidget;
