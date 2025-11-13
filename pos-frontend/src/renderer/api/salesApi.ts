export const fetchSale = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/sales");
    if (!response.ok) throw new Error(`Failed to fetch sales: ${response.statusText}`);
    const data = await response.json();
    return data.sales;
  } catch (error) {
    console.error("Error fetching sales:", error);
    throw error;
  }
};

export const addSale = async (saleData: { product_id: number; quantity: number }) => {
  try {
    const response = await fetch("http://localhost:5000/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData),
    });
    if (!response.ok) throw new Error(`Failed to add sale: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error adding sale:", error);
    throw error;
  }
};

// Helper: Fetch last 5 recent sales for Dashboard
export const fetchRecentSales = async (): Promise<
  { id: string; customer_name: string; total_price: number; sale_date: string }[]
> => {
  try {
    const sales = await fetchSale();
    const sorted = sales.sort(
      (a:any, b:any) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
    );
    return sorted.slice(0, 5);
  } catch (error) {
    throw error;
  }
};

