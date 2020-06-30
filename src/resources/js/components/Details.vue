<template>
  <div class="details">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-file"></i> All Details
          </h3>

          <div class="card-tools">
            <div class="row mb-2">
              <div class="col-md-4">
                <autocomplete
                  ref="autocomplete"
                  placeholder="Filter by companies"
                  :source="companies"
                  input-class="form-control"
                  v-model="searchcompany"
                  resultsValue="id"
                  name="searchcompany"
                  @selected="searchByCompany"
                ></autocomplete>
              </div>
              <div class="col-md-4">
                <autocomplete
                  ref="autocomplete"
                  placeholder="Filter by hospitals"
                  :source="hospitals"
                  input-class="form-control"
                  v-model="searchhospital"
                  resultsValue="id"
                  name="searchhospital"
                  @selected="searchByHospital"
                ></autocomplete>
              </div>
              <div class="col-md-4">
                <input
                  v-model="searchdate"
                  type="date"
                  name="searchdate"
                  class="form-control"
                  placeholder="Filter by date..."
                  @change="searchByDate"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <span class="font-weight-bold">Total Gross Sum (දල එකතුව): {{totalGross | total}}</span>
              </div>
            </div>
            <button class="btn btn-info float-right ml-2" @click="getDetails()">
              View All
              <i class="fas fa-search fa-fw"></i>
            </button>
            <button class="btn btn-success float-right" @click="newModal">
              Add New
              <i class="fas fa-plus-circle fa-fw"></i>
            </button>
          </div>
        </div>
        <!-- /.card-header -->
        <div class="card-body table-responsive p-0">
          <loading :active.sync="isLoading" :can-cancel="true" :is-full-page="fullPage"></loading>
          <table class="table table-hover table-bordered">
            <thead class="thead-dark">
              <tr>
                <th>ID</th>
                <th>Voucher No</th>
                <th>Company</th>
                <th>Hospital</th>
                <th>Payee</th>
                <th>Payment Month</th>
                <th>Gross Sum</th>
                <th>Created at</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, index) in details.data" :key="detail.index">
                <td>{{ index + 1 }}</td>
                <td>{{ detail.voucher_no }}</td>
                <td>{{detail.companies.name}}</td>
                <td>{{detail.hospitals.name}}</td>
                <td>{{detail.payee}}</td>
                <td>{{detail.month}}</td>
                <td>{{detail.sub_total | total}}</td>
                <td>{{ detail.created_at | myDate }}</td>
                <td>
                  <a
                    class="btn btn-primary btn-sm"
                    title="Edit"
                    href="#"
                    @click="editDetails(detail)"
                  >
                    <i class="fa fa-edit"></i>
                  </a>
                  <a
                    class="btn btn-danger btn-sm"
                    title="Delete"
                    href="#"
                    @click="deleteDetails(detail.id)"
                  >
                    <i class="fa fa-trash"></i>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
          <pagination :data="details" align="right" @pagination-change-page="getResults"></pagination>
        </div>
      </div>
      <!-- /.card -->
    </div>
    <Dialog />
    <div v-if="!$gate.isAdminOrDeveloper()">
      <not-found></not-found>
    </div>
  </div>
</template>

<script>
import detailsMixins from "../mixins/detailsMixin.js";
import Dialog from "./Form.vue";
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Dialog,
    Loading
  },
  mixins: [detailsMixins],
  data() {
    return {};
  }
};
</script>
