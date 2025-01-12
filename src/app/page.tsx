
import { fetchTipoCambio } from "@/app/lib/data";
export default async function Home() {
  const tipoCambio = await fetchTipoCambio();
  return (
    <>
      {tipoCambio.compra !== undefined && tipoCambio.venta !== undefined && (
        <div>
          <h1>Compra: {tipoCambio.compra} colones</h1>
          <h1>Venta: {tipoCambio.venta} colones</h1>
        </div>
      )}
    </>
  );
}
