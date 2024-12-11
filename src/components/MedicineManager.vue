<template>
    <div class="container mt-5">
      <h1 class="text-primary text-center mb-4">Medicine Manager</h1>
      <div class="card p-4 mb-4">
        <form @submit.prevent="addMedicine">
          <div class="row g-3">
            <div class="col-md-6">
              <input
                type="text"
                v-model="name"
                class="form-control"
                placeholder="Medicine Name"
                required
              />
            </div>
            <div class="col-md-6">
              <select v-model="type" class="form-select" required>
                <option disabled value="">Select Type</option>
                <option>Tablet</option>
                <option>Syrup</option>
                <option>Injection</option>
              </select>
            </div>
            <div class="col-md-6">
              <input
                type="number"
                v-model="quantity"
                class="form-control"
                placeholder="Quantity"
                required
                min="1"
              />
            </div>
            <div class="col-md-6">
              <input
                type="date"
                v-model="expirationDate"
                class="form-control"
                :min="today"
                required
              />
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-4 w-100">Add Medicine</button>
        </form>
      </div>
  
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-primary">
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Expiration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medicine in medicines" :key="medicine._id">
              <td>{{ medicine.name }}</td>
              <td>{{ medicine.type }}</td>
              <td>
                <div class="d-flex align-items-center justify-content-center">
                  <button
                    class="btn btn-danger btn-sm rounded-circle me-2"
                    @click="decrementQuantity(medicine._id)"
                    title="Decrease Quantity"
                  >
                    -
                  </button>
                  <span>{{ medicine.quantity }}</span>
                  <button
                    class="btn btn-success btn-sm rounded-circle ms-2"
                    @click="incrementQuantity(medicine._id)"
                    title="Increase Quantity"
                  >
                    +
                  </button>
                </div>
              </td>
              <td>{{ formatDate(medicine.expirationDate) }}</td>
              <td>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteMedicine(medicine._id)"
                  title="Delete Medicine"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "MedicineManager",
    data() {
      return {
        name: "",
        type: "",
        quantity: "",
        expirationDate: "",
        medicines: [],
        today: "",
      };
    },
    methods: {
      async addMedicine() {
        if (this.quantity < 1) {
          alert("The quantity must be at least 1!");
          return;
        }
  
        await axios.post("http://localhost:3001/medicines", {
          name: this.name,
          type: this.type,
          quantity: this.quantity,
          expirationDate: this.expirationDate,
        });
        this.fetchMedicines();
        this.name = "";
        this.type = "";
        this.quantity = "";
        this.expirationDate = "";
      },
      async fetchMedicines() {
        const response = await axios.get("http://localhost:3001/medicines");
        this.medicines = response.data;
      },
      async incrementQuantity(id) {
        try {
          await axios.patch(`http://localhost:3001/medicines/${id}/increment`);
          this.fetchMedicines();
        } catch (error) {
          console.error("Error incrementing quantity:", error.message);
        }
      },
      async decrementQuantity(id) {
        try {
          const response = await axios.patch(
            `http://localhost:3001/medicines/${id}/decrement`
          );
          if (response.data === "Medicine deleted as quantity reached 0") {
            console.log("Medicine deleted as quantity reached 0");
          }
          this.fetchMedicines();
        } catch (error) {
          console.error("Error decrementing quantity:", error.message);
        }
      },
      async deleteMedicine(id) {
        try {
          await axios.delete(`http://localhost:3001/medicines/${id}`);
          this.fetchMedicines();
        } catch (error) {
          console.error("Error deleting medicine:", error.message);
        }
      },
      formatDate(dateString) {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      setTodayDate() {
        const today = new Date();
        this.today = today.toISOString().split("T")[0];
      },
    },
    mounted() {
      this.setTodayDate();
      this.fetchMedicines();
    },
  };
  </script>  