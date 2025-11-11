export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

// Fetch all customers
export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch("http://localhost:5000/api/customers");
    if (!response.ok) throw new Error(`Failed to fetch customers: ${response.statusText}`);
    const data = await response.json();
    return data.customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Add a new customer
export const addCustomer = async (customerData: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const response = await fetch("http://localhost:5000/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error(`Failed to add customer: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (id: number, customerData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
    if (!response.ok) throw new Error(`Failed to update customer: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Failed to delete customer: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};
