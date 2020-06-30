<template>
  <div class="container">
    <div class="row" v-if="$gate.isAdminOrDeveloper()">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <i class="fas fa-users"></i> All users list
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
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Created at</th>
                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users.data" :key="user.index">
                  <td>{{user.id}}</td>
                  <td>{{user.name}}</td>
                  <td>{{user.email}}</td>
                  <td>{{user.type | upText}}</td>
                  <td>{{user.created_at | myDate}}</td>
                  <td>
                    <a
                      class="btn btn-primary btn-sm"
                      title="Edit"
                      href="#"
                      @click="editModal(user)"
                    >
                      <i class="fa fa-edit"></i>
                    </a>
                    <a
                      class="btn btn-danger btn-sm"
                      title="Delete"
                      href="#"
                      @click="deleteUser(user.id)"
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
            <pagination :data="users" align="right" @pagination-change-page="getResults"></pagination>
          </div>
        </div>
        <!-- /.card -->
      </div>
    </div>
    <!-- Add new form modal -->
    <div
      class="modal fade"
      id="UserModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editmode" class="modal-title" id="exampleModalLabel">
              <i class="fas fa-users"></i> Add New Profile
            </h5>
            <h5 v-show="editmode" class="modal-title" id="exampleModalLabel">
              <i class="fas fa-users"></i> Update User Profile
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form @submit.prevent="editmode ? updateUser() : createUser()">
            <div class="modal-body">
              <div class="form-group">
                <label>Full Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                  placeholder="Enter your full name..."
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="name"></has-error>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  class="form-control"
                  placeholder="Enter your email address..."
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>
              <div class="form-group">
                <label for="inputExperience">Experience</label>
                <textarea
                  v-model="form.bio"
                  class="form-control"
                  id="inputExperience"
                  placeholder="Enter your experience..."
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                ></textarea>
                <has-error :form="form" field="bio"></has-error>
              </div>
              <div class="form-group">
                <label for="type">User Type</label>
                <select
                  name="type"
                  v-model="form.type"
                  id="type"
                  class="form-control"
                  :class="{'is-invalid': form.errors.has('type')}"
                >
                  <option disabled selected>Select a user role</option>
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                  <option value="user">Standard User</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>
              <div class="form-group">
                <label>Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  class="form-control"
                  placeholder="Enter your password..."
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
              <button
                v-show="editmode"
                :disabled="form.busy"
                type="submit"
                class="btn btn-warning"
              >Update Data</button>
              <button
                v-show="!editmode"
                :disabled="form.busy"
                type="submit"
                class="btn btn-primary"
              >Save Data</button>
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
export default {
  data() {
    return {
      editmode: false,
      users: {},
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        bio: "",
        type: "",
        photo: ""
      })
    };
  },
  methods: {
    getResults(page = 1) {
      axios.get("api/user?page=" + page).then(response => {
        this.users = response.data;
      });
    },
    editModal(user) {
      this.form.clear();
      this.editmode = true;
      this.form.reset();
      $("#UserModal").modal("show");
      this.form.fill(user);
    },
    newModal() {
      this.editmode = false;
      this.form.reset();
      this.form.clear();
      $("#UserModal").modal("show");
    },
    loadUsers() {
      if (this.$gate.isAdminOrDeveloper()) {
        axios
          .get("api/user")
          .then(({ data }) => (this.users = data))
          .catch(error => {
            console.log(error);
          });
      }
    },
    createUser() {
      this.$Progress.start();
      //this.form.post("api/user");
      this.form
        .post("api/user")
        .then(response => {
          $("#UserModal").modal("hide");
          Fire.$emit("AfterCreate");
          Toast.fire({
            type: "success",
            title: "Signed in successfully",
            timer: 3000
          });
        })
        .catch(error => {
          console.log(error);
        });
      this.$Progress.finish();
    },
    deleteUser(id) {
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
            .delete("api/user/" + id)
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
    updateUser() {
      this.$Progress.start();
      this.form
        .put("api/user/" + this.form.id)
        .then(() => {
          // success
          $("#UserModal").modal("hide");
          Toast.fire({
            type: "success",
            title: "Updated!",
            text: "Your file has been updated!",
            timer: 3000
          });
          this.$Progress.finish();
          Fire.$emit("AfterCreate");
        })
        .catch(() => {
          this.$Progress.fail();
        });
    }
  },
  created() {
    Fire.$on("searching", () => {
      let query = this.$parent.search;
      axios
        .get("api/finduser?q=" + query)
        .then(data => {
          this.users = data.data;
        })
        .catch(error => {
          console.log(error);
        });
    });
    this.loadUsers();
    Fire.$on("AfterCreate", () => {
      this.loadUsers();
    });
  },
  mounted() {
    console.log("Component mounted.");
  }
};
</script>

<style scoped>
[v-cloak] .v-cloak--hidden {
  display: none;
}
[v-cloak]::before {
  content: "loading.....";
}
</style>