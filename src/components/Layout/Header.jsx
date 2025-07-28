import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Group,
  UnstyledButton,
  Text,
  rem,
  ActionIcon,
  NavLink,
  Image,
  Drawer,
  ScrollArea,
  Burger,
} from '@mantine/core';
import {
  IconHome,
  IconBox,
  IconShoppingCart,
  IconReceipt,
  IconReport,
  IconSettings,
  IconTrendingDown,
} from '@tabler/icons-react';

const navLinks = [
  { label: 'Dashboard', path: '/', icon: IconHome },
  { label: 'Inventario', path: '/inventario', icon: IconBox },
  { label: 'Ventas', path: '/ventas', icon: IconShoppingCart },
  { label: 'Gastos', path: '/gastos', icon: IconTrendingDown },
  { label: 'Facturas', path: '/facturas', icon: IconReceipt },
  { label: 'Reportes', path: '/reportes', icon: IconReport },
];

const SidebarMenu = ({ active, onSectionChange }) => (
  <Box
    component="nav"
    style={{
      width: 220,
      minHeight: '100vh',
      background: '#f8fafc',
      boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1200,
    }}
    px="md"
    py="md"
  >
    <Group mb="xl">
      <Image src="/icon-192.png" alt="Logo NegocioListo" width={36} height={36} radius="md" />
      <Text weight={700} size="lg" color="blue">
        NegocioListo
      </Text>
    </Group>
    <Stack gap="xs" style={{ flex: 1 }}>
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <UnstyledButton
            key={link.path}
            component={Link}
            to={link.path}
            onClick={() => onSectionChange && onSectionChange(link.path)}
            style={{
              background: active === link.path ? '#e7f5ff' : 'transparent',
              borderRadius: 8,
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              color: active === link.path ? '#1c7ed6' : '#222',
              fontSize: rem(16),
              gap: 12,
              transition: 'background 0.18s, color 0.18s',
            }}
          >
            <Icon size={20} />
            <Text>{link.label}</Text>
          </UnstyledButton>
        );
      })}
    </Stack>
    <Box mt="auto" pt="lg">
      <UnstyledButton
        onClick={() => onSectionChange && onSectionChange('/configuracion')}
        component={Link}
        to="/configuracion"
        style={{
          borderRadius: 8,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          color: active === '/configuracion' ? '#1c7ed6' : '#222',
          fontSize: rem(16),
          gap: 12,
          transition: 'background 0.18s, color 0.18s',
        }}
      >
        <IconSettings size={20} />
        <Text>Configuración</Text>
      </UnstyledButton>
    </Box>
  </Box>
);

const Header = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  // Para mobile: Drawer con el mismo menú
  return (
    <>
      {/* Sidebar para desktop */}
      <Box visibleFrom="md">
        <SidebarMenu
          active={location.pathname}
          onSectionChange={(path) => navigate(path)}
        />
      </Box>
      {/* Burger y Drawer para mobile */}
      <Box hiddenFrom="md" style={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
        <Burger
          opened={drawerOpened}
          onClick={() => setDrawerOpened((o) => !o)}
          size="md"
          aria-label={drawerOpened ? 'Cerrar menú' : 'Abrir menú'}
        />
      </Box>
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        size="80%"
        padding="md"
        title={<Text fw={700} size="lg">Menú</Text>}
        hiddenFrom="md"
        zIndex={3000}
        overlayProps={{ opacity: 0.5, blur: 2 }}
      >
        <ScrollArea h="calc(100vh - 80px)" type="auto">
          <SidebarMenu
            active={location.pathname}
            onSectionChange={(path) => {
              setDrawerOpened(false);
              navigate(path);
            }}
          />
        </ScrollArea>
      </Drawer>
      {/* Espaciador para que el contenido principal no quede debajo del sidebar */}
      <Box visibleFrom="md" style={{ width: 220, minHeight: '100vh', float: 'left' }} />
    </>
  );
};

export default Header; 