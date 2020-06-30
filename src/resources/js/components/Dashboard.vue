<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-info">
          <div class="inner">
            <h3>{{companies}}</h3>

            <p>Total Companies</p>
          </div>
          <div class="icon">
            <i class="ion ion-bag"></i>
          </div>
        </div>
      </div>
      <!-- ./col -->
      <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-success">
          <div class="inner">
            <h3>{{hospitals}}</h3>

            <p>Total Hospitals</p>
          </div>
          <div class="icon">
            <i class="ion ion-stats-bars"></i>
          </div>
        </div>
      </div>
      <!-- ./col -->
      <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-warning">
          <div class="inner">
            <h3>{{total}}</h3>

            <p>Total Entries</p>
          </div>
          <div class="icon">
            <i class="ion ion-person-add"></i>
          </div>
        </div>
      </div>
      <!-- ./col -->
      <div class="col-lg-3 col-6">
        <!-- small box -->
        <div class="small-box bg-danger">
          <div class="inner">
            <h3>{{today}}</h3>

            <p>Today Entries</p>
          </div>
          <div class="icon">
            <i class="ion ion-pie-graph"></i>
          </div>
        </div>
      </div>
      <!-- ./col -->
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      companies: "",
      hospitals: "",
      total: "",
      today: ""
    };
  },
  created() {
    this.getDetails();
  },
  methods: {
    async getDetails() {
      let values = await Axios.get("api/dashboard")
        .then(res => {
          this.companies = res.data.company;
          this.hospitals = res.data.hospital;
          this.total = res.data.details;
          this.today = res.data.today;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
