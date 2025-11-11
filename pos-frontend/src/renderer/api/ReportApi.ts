export const fetchTotalSales = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/reports/total-sales");

    if (!response.ok) {
      throw new Error(`Failed to fetch total sales: ${response.statusText}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error fetching total sales:", error);
    throw error;
  }
};

export const fetchTopProducts = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/reports/top-products");

    if (!response.ok) {
      throw new Error(`Failed to fetch top products: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error("Error fetching top products:", error);
    throw error;
  }
};


export const fetchLowStock = async () => {
  const response = await fetch("http://localhost:5000/api/reports/low-stock");
  if (!response.ok) throw new Error("Failed to fetch low stock products");
  const data = await response.json();
  return data.data; 
};
