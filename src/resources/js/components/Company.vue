<template>
    <div class="company">
        <div class="col-12">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-building"></i> All Company List
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
                    <loading
                        :active.sync="isLoading"
                        :can-cancel="true"
                        :is-full-page="fullPage"
                    ></loading>
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
                            <tr
                                v-for="(company, index) in companies.data"
                                :key="company.index"
                            >
                                <td>{{ index + 1 }}</td>
                                <td>{{ company.name }}</td>
                                <td>{{ company.created_at | myDate }}</td>
                                <td>
                                    <a
                                        class="btn btn-primary btn-sm"
                                        title="Edit"
                                        href="#"
                                        @click="editCompany(company)"
                                    >
                                        <i class="fa fa-edit"></i>
                                    </a>
                                    <a
                                        class="btn btn-danger btn-sm"
                                        title="Delete"
                                        href="#"
                                        @click="deleteCompany(company.id)"
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
                    <pagination
                        :data="companies"
                        align="right"
                        @pagination-change-page="getResults"
                    ></pagination>
                </div>
            </div>
            <!-- /.card -->
        </div>
        <!-- Add new form modal -->
        <div
            class="modal fade"
            id="CompanyModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5
                            v-show="!editmode"
                            class="modal-title"
                            id="exampleModalLabel"
                        >
                            <i class="fas fa-building"></i> Add New Company
                        </h5>
                        <h5
                            v-show="editmode"
                            class="modal-title"
                            id="exampleModalLabel"
                        >
                            <i class="fas fa-building"></i> Update User Company
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form
                        @submit.prevent="
                            editmode ? updateCompany() : createCompany()
                        "
                    >
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Company Name(ආයතනය)</label>
                                <input
                                    v-model="form.name"
                                    type="text"
                                    name="name"
                                    class="form-control"
                                    placeholder="Enter your company name..."
                                    :class="{
                                        'is-invalid': form.errors.has('name')
                                    }"
                                />
                                <has-error
                                    :form="form"
                                    field="name"
                                ></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-danger"
                                data-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                v-show="editmode"
                                :disabled="form.busy"
                                type="submit"
                                class="btn btn-warning"
                            >
                                {{ loading ? "Updating..." : "Update Details" }}
                            </button>
                            <button
                                v-show="!editmode"
                                :disabled="form.busy"
                                type="submit"
                                class="btn btn-primary"
                            >
                                {{ loading ? "Saving..." : "Save Details" }}
                            </button>
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
import axios from "axios";
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
            isLoading: false,
            fullPage: false,
            companies: {},
            editmode: false,
            loading: false,
            form: new Form({
                id: "",
                name: "",
                busy: false
            })
        };
    },
    created() {
        this.getCompanies();
        Fire.$on("AfterCreate", () => {
            this.getCompanies();
        });
        Fire.$on("searching", () => {
            let query = this.$parent.search;
            this.isLoading = true;
            axios
                .get("api/findcompany?q=" + query)
                .then(data => {
                    this.companies = data.data;
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
        getResults(page = 1) {
            this.isLoading = true;
            axios
                .get("api/companies?page=" + page)
                .then(res => {
                    this.companies = res.data;
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.isLoading = false;
                });
        },
        newModal() {
            this.editmode = false;
            this.form.reset();
            this.form.clear();
            $("#CompanyModal").modal("show");
        },
        getCompanies() {
            this.isLoading = true;
            axios
                .get("api/companies")
                .then(({ data }) => {
                    this.companies = data;
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.isLoading = false;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        createCompany() {
            this.$Progress.start();
            this.loading = true;
            this.form
                .post("api/companies")
                .then(res => {
                    $("#CompanyModal").modal("hide");
                    Fire.$emit("AfterCreate");
                    Toast.fire({
                        type: "success",
                        title: "Company Added successfully",
                        timer: 3000
                    });
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
        updateCompany() {
            this.$Progress.start();
            this.loading = true;
            this.form
                .put("api/companies/" + this.form.id)
                .then(() => {
                    $("#CompanyModal").modal("hide");
                    Toast.fire({
                        type: "success",
                        title: "Updated!",
                        text: "Your file has been updated!",
                        timer: 3000
                    });
                    this.$Progress.finish();
                    Fire.$emit("AfterCreate");
                    this.loading = false;
                })
                .catch(() => {
                    this.$Progress.fail();
                    this.loading = false;
                })
                .finally(() => {
                    this.$Progress.fail();
                    this.loading = false;
                });
        },
        editCompany(company) {
            this.form.clear();
            this.editmode = true;
            this.form.reset();
            $("#CompanyModal").modal("show");
            this.form.fill(company);
        },
        deleteCompany(id) {
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
                        .delete("api/companies/" + id)
                        .then(() => {
                            Swal.fire(
                                "Deleted!",
                                "Your file has been deleted.",
                                "success"
                            );
                            Fire.$emit("AfterCreate");
                        })
                        .catch(() => {
                            Swal.fire(
                                "Failed!",
                                "There was something wrong.",
                                "warning"
                            );
                        });
                }
            });
        }
    }
};
</script>
