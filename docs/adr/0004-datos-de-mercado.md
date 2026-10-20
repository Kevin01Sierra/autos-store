# ADR 0004: Datos reales de mercado desde datos.gov.co

- Estado: aceptado (2026-10-20). Conjunto verificado el mismo día.

## Contexto
Las recomendaciones deben parecerse a la realidad, y el mejor indicador público de lo que
la gente compra es el parque automotor registrado. Se revisó el catálogo de datos.gov.co:

| Conjunto | Columnas útiles | Por qué sí o no |
|---|---|---|
| [Parque automotor de Risaralda](https://www.datos.gov.co/d/x9pp-pcn5) (`x9pp-pcn5`) | clase, marca, línea, modelo (año) | **Elegido**: 453.925 vehículos con marca y línea en texto |
| [Matriculados 2020–2022](https://www.datos.gov.co/d/bj7e-xc9g) (`bj7e-xc9g`) | clase, marca, modelo, fecha | Sin línea; 16.943 filas, muchas del año 2000 |
| [Parque de Barbosa 2021](https://www.datos.gov.co/d/wvky-zsdn) (`wvky-zsdn`) | id_marca, id_linea, id_color | Códigos numéricos sin tabla de equivalencias publicada |
| [Crecimiento del parque RUNT 2.0](https://www.datos.gov.co/d/u3vn-bdcy) (`u3vn-bdcy`) | clase, servicio, municipio | Nacional, pero sin marca ni línea |

Ningún conjunto abierto nacional publica marca, línea y color juntos.

## Decisión
Un adaptador Socrata agrega por marca, línea, color (si existe) y periodo. Todo se configura
por entorno porque cada conjunto usa nombres distintos:

| Variable | Valor para Risaralda |
|---|---|
| `MARKET_DATASET_URL` | `https://www.datos.gov.co/resource/x9pp-pcn5.json` |
| `MARKET_FIELD_BRAND` / `MARKET_FIELD_MODEL` | `marca` / `linea` (por defecto) |
| `MARKET_FIELD_COLOR` | sin definir: el conjunto no trae color |
| `MARKET_FIELD_PERIOD` / `MARKET_PERIOD_TYPE` | `modelo` / `year` (por defecto) |
| `MARKET_WHERE` | `clase in('AUTOMOVIL','CAMIONETA','CAMPERO') AND modelo >= 2018` |

El filtro deja fuera motos y vehículos antiguos, para que el ranking refleje compras recientes.
Como la línea incluye la versión ("Picanto Ekotaxi"), la estrategia de mercado suma las
versiones de cada modelo del catálogo.

## Consecuencias
- El color sale de las ventas de la tienda y de las preferencias del usuario, no del mercado.
- Es un departamento, no el país: sirve como muestra real del mercado colombiano.
- La primera sincronización real borra los datos de demostración (`source = 'demo'`).
