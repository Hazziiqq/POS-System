export const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/products");

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const updateProduct = async (id: number, updatedProduct: any) => {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    if (!response.ok) throw new Error("Failed to update product");
    return await response.json();
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
    return await response.json();
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

export const addProduct = async (newProduct: {
  name: string;
  price: number;
  stock: number;
  category: string;
}) => {
  try {
    const response = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    if (!response.ok) throw new Error("Failed to add product");
    return await response.json(); 
  } catch (error) {
    console.error("Add product error:", error);
    throw error;
  }
};