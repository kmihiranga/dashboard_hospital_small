<template>
  <div class="hospital">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            <i class="fas fa-building"></i> All Hospital List
          </h3>

          <div class="card-tools">
            <button class="btn btn-success" @click="newModal">
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
                <th>Name</th>
                <th>Created at</th>
                <th>Modify</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(hospital, index) in hospitals.data" :key="hospital.index">
                <td>{{ index + 1 }}</td>
                <td>{{ hospital.name }}</td>
                <td>{{ hospital.created_at | myDate }}</td>
                <td>
                  <a
                    class="btn btn-primary btn-sm"
                    title="Edit"
                    href="#"
                    @click="editHospital(hospital)"
                  >
                    <i class="fa fa-edit"></i>
                  </a>
                  <a
                    class="btn btn-danger btn-sm"
                    title="Delete"
                    href="#"
                    @click="deleteHospital(hospital.id)"
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
          <pagination :data="hospitals" align="right" @pagination-change-page="getResults"></pagination>
        </div>
      </div>
      <!-- /.card -->
    </div>
    <!-- Add new form modal -->
    <div
      class="modal fade"
      id="HospitalModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editmode" class="modal-title" id="exampleModalLabel">
              <i class="fas fa-building"></i> Add New Hospital
            </h5>
            <h5 v-show="editmode" class="modal-title" id="exampleModalLabel">
              <i class="fas fa-building"></i> Update Hospital
              Details
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form
            @submit.prevent="
                            editmode ? updateHospital() : createHospital()
                        "
          >
            <div class="modal-body">
              <div class="form-group">
                <label>Hospital Name(රෝහලේ නම)</label>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                  placeholder="Enter your hospital name..."
                  :class="{
                                        'is-invalid': form.errors.has('name')
                                    }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button
                v-show="editmode"
                :disabled="form.busy"
                type="submit"
                class="btn btn-warning"
              >{{ loading ? "Updating..." : "Update Details" }}</button>
              <button
                v-show="!editmode"
                :disabled="form.busy"
                type="submit"
                class="btn btn-primary"
              >{{ loading ? "Saving..." : "Save Details" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- end add new form modal -->

    <div v-if="!$gate.isAdminOrDeveloper()">
      <not-found></not-found>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
// Import component
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  components: {
    Loading
  },
  data() {
    return {
      editmode: false,
      isLoading: false,
      fullPage: false,
      loading: false,
      form: new Form({
        id: "",
        name: "",
        busy: false
      }),
      hospitals: {}
    };
  },
  created() {
    this.getHospitals();
    Fire.$on("AfterCreate", () => {
      this.getHospitals();
    });
    Fire.$on("searching", () => {
      let query = this.$parent.search;
      this.isLoading = true;
      axios
        .get("api/findhospital?q=" + query)
        .then(data => {
          this.hospitals = data.data;
          this.isLoading = false;
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    });
  },
  methods: {
    newModal() {
      this.editmode = false;
      this.form.reset();
      this.form.clear();
      $("#HospitalModal").modal("show");
    },
    async getHospitals() {
      this.$Progress.start();
      this.isLoading = true;
      let hospital = await Axios.get("api/hospitals")
        .then(({ data }) => {
          this.hospitals = data;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.$Progress.fail();
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
          this.$Progress.finish();
        });
    },
    createHospital() {
      this.$Progress.start();
      this.loading = true;
      this.form
        .post("api/hospitals")
        .then(res => {
          $("#HospitalModal").modal("show");
          Fire.$emit("AfterCreate");
          Toast.fire({
            type: "success",
            title: "Hospital Added successfully",
            timer: 3000
          });
          this.loading = false;
          this.$Progress.finish();
          $("#HospitalModal").modal("hide");
        })
        .catch(err => {
          console.log(err);
          this.$Progress.fail();
          this.loading = false;
        })
        .finally(() => {
          this.$Progress.finish();
        });
    },
    editHospital(hospital) {
      this.form.clear();
      this.editmode = true;
      this.form.reset();
      $("#HospitalModal").modal("show");
      this.form.fill(hospital);
    },
    deleteHospital(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        // send request to server
        if (result.value) {
          this.form
            .delete("api/hospitals/" + id)
            .then(() => {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              Fire.$emit("AfterCreate");
            })
            .catch(() => {
              Swal.fire("Failed!", "There was something wrong.", "warning");
            });
        }
      });
    },
    updateHospital() {
      this.$Progress.start();
      this.loading = true;
      this.form
        .put("api/hospitals/" + this.form.id)
        .then(() => {
          $("#HospitalModal").modal("hide");
          Fire.$emit("AfterCreate");
          Toast.fire({
            type: "success",
            title: "Updated!",
            text: "Your file has been updated!",
            timer: 3000
          });
          this.$Progress.finish();
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.$Progress.fail();
          this.loading = false;
        })
        .finally(() => {
          this.$Progress.finish();
          this.loading = false;
        });
    },
    getResults(page = 1) {
      this.isLoading = true;
      axios
        .get("api/hospitals?page=" + page)
        .then(res => {
          this.hospitals = res.data;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
        });
    }
  }
};
</script>
