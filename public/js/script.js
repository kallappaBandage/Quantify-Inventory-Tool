function editStock(id, name, date, qty) {
    document.getElementById("stockForm").action = `/update-stock/${id}?_method=PUT`;
    document.getElementById("_method").value = "PUT";
    document.getElementById("stockId").value = id;
    document.getElementById("productName").value = name;
    document.getElementById("stockAddedDate").value = date;
    document.getElementById("stockQty").value = qty;
    document.getElementById("submitButton").innerText = "Update Stock";
}

document.addEventListener("DOMContentLoaded", () => {
    const stockForm = document.querySelector("#stockForm");
    const submitBtn = document.querySelector("#submitBtn");
    const updateBtn = document.querySelector("#updateBtn");


    stockForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const formData = new FormData(stockForm);
        const stockData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/addStock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(stockData),
            });

            if (response.ok) {
                alert("Stock added successfully!");
                window.location.reload(); 
            } else {
                alert("Failed to add stock.");
            }
        } catch (error) {
            console.error("Error adding stock:", error);
        }
    });

 
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const row = this.closest("tr");
            const stockId = row.getAttribute("data-id");

          
            const response = await fetch(`/edit-stock/${stockId}`);
            const stock = await response.json();

        
            document.querySelector("[name='stockId']").value = stock._id;
            document.querySelector("[name='productName']").value = stock.productName;
            document.querySelector("[name='stockAddedDate']").value = stock.stockAddedDate;
            document.querySelector("[name='stockQty']").value = stock.stockQty;
            document.querySelector("[name='stockPerQtyPrice']").value = stock.stockPerQtyPrice;
            document.querySelector("[name='stockSellPerQtyPrice']").value = stock.stockSellPerQtyPrice;
            document.querySelector("[name='stockCategory']").value = stock.stockCategory;
            document.querySelector("[name='stockSupplierName']").value = stock.stockSupplierName;
            document.querySelector("[name='stockDescription']").value = stock.stockDescription;

         
            submitBtn.style.display = "none";
            updateBtn.style.display = "inline-block";
        });
    });

   
    updateBtn.addEventListener("click", async function () {
        const stockId = document.querySelector("[name='stockId']").value;

        const formData = new FormData(stockForm);
        const stockData = Object.fromEntries(formData.entries());

        const response = await fetch(`/update-stock/${stockId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(stockData),
        });

        if (response.ok) {
            alert("Stock updated successfully! ");
            window.location.reload();
        } else {
            alert(" Error updating stock.");
        }
    });

   
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async function () {
            if (!confirm("Are you sure you want to delete this stock?")) return;

            const row = this.closest("tr");
            const stockId = row.getAttribute("data-id");

            const response = await fetch(`/delete-stock/${stockId}`, { method: "DELETE" });

            if (response.ok) {
                alert("Stock deleted successfully! ");
                row.remove();
            } else {
                alert(" Error deleting stock.");
            }
        });
    });
});
