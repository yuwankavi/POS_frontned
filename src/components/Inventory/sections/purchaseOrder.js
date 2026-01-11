// inventoryProject.js
import PurchaseOrderTable from "../common/purchaseOrderTable.js";

export default function PurchaseOrder() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>
      <PurchaseOrderTable />
    </section>
  );
}