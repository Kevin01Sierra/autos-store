import { createBrowserRouter } from 'react-router';
import { AppLayout } from './layout/app-layout';
import { RequireAuth } from './layout/require-auth';
import { RouteError } from './layout/route-error';

/** Carga diferida por página: cada ruta descarga solo su propio código. */
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: page(() => import('@/features/home/home-page')) },
      { path: 'autos', lazy: page(() => import('@/features/catalog/catalog-page')) },
      { path: 'autos/:id', lazy: page(() => import('@/features/vehicle-detail/vehicle-detail-page')) },
      { path: 'descubre', lazy: page(() => import('@/features/discover/discover-page')) },
      { path: 'comparar', lazy: page(() => import('@/features/compare/compare-page')) },
      { path: 'mercado', lazy: page(() => import('@/features/market/market-page')) },
      { path: 'ingresar', lazy: page(() => import('@/features/auth/login-page')) },
      {
        element: <RequireAuth />,
        children: [
          { path: 'vender', lazy: page(() => import('@/features/sell/sell-page')) },
          { path: 'mis-pedidos', lazy: page(() => import('@/features/orders/orders-page')) },
        ],
      },
      {
        path: 'admin',
        element: <RequireAuth role="admin" />,
        children: [
          { index: true, lazy: page(() => import('@/features/admin/dashboard/dashboard-page')) },
          { path: 'vehiculos', lazy: page(() => import('@/features/admin/vehicles/admin-vehicles-page')) },
          { path: 'catalogo', lazy: page(() => import('@/features/admin/catalog/admin-catalog-page')) },
          { path: 'pedidos', lazy: page(() => import('@/features/admin/orders/admin-orders-page')) },
        ],
      },
      { path: '*', lazy: page(() => import('./layout/not-found-page')) },
    ],
  },
]);
