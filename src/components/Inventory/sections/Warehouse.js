// inventoryProject.js
import WarehouseTable from "../common/warehouseTable.js";   

export default function Warehouse() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Warehouse Management</h1>
      <WarehouseTable />
    </section>
  );
}
