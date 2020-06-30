import axios from "axios";
import Autocomplete from "vuejs-auto-complete";
export default {
    components: {
        Autocomplete
    },
    data() {
        return {
            loading: false,
            editmode: false,
            isLoading: false,
            fullPage: false,
            searchcompany: "",
            searchhospital: "",
            form: new Form({
                id: "",
                hospital: "",
                company: "",
                date: "",
                book_no: "",
                year: "",
                piyan_name: "",
                project_name: "",
                voucher_no: "",
                payee: "",
                month: "",
                sub_total: "",
                cross_note: "",
                balance: "",
                company_total: ""
            }),
            companies: [],
            hospitals: [],
            details: {},
            month: [
                {
                    id: 1,
                    name: "January"
                },
                {
                    id: 2,
                    name: "February"
                },
                {
                    id: 3,
                    name: "March"
                },
                {
                    id: 4,
                    name: "April"
                },
                {
                    id: 5,
                    name: "May"
                },
                {
                    id: 6,
                    name: "June"
                },
                {
                    id: 7,
                    name: "July"
                },
                {
                    id: 8,
                    name: "August"
                },
                {
                    id: 9,
                    name: "September"
                },
                {
                    id: 10,
                    name: "October"
                },
                {
                    id: 11,
                    name: "November"
                },
                {
                    id: 12,
                    name: "December"
                }
            ]
        };
    },
    created() {
        this.getCompanies();
        this.getHospitals();
        this.getDetails();
        Fire.$on("AfterCreate", () => {
            this.getDetails();
        });
        Fire.$on("editDetails", value => {
            this.form.clear();
            this.editmode = true;
            this.form.reset();
            $("#DetailsModal").modal("show");
            this.form.fill(value);
        });
        Fire.$on("changeEditMode", () => {
            this.editmode = false;
            this.form.reset();
            this.form.clear();
        });
        Fire.$on("searching", () => {
            let query = this.$parent.search;
            this.isLoading = true;
            axios
                .get("api/finddetails?q=" + query)
                .then(data => {
                    this.details = data.data;
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
    computed: {
        totalGross() {
            if (this.details.hasOwnProperty("data")) {
                return this.details.data.reduce(
                    (acc, cur) => acc + Number(cur.sub_total),
                    0
                );
            }
        }
    },
    filters: {
        total(value) {
            return "Rs." + parseFloat(value).toFixed(2);
        }
    },
    methods: {
        getCompanies() {
            axios
                .get("api/companies")
                .then(res => {
                    this.companies = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getHospitals() {
            axios
                .get("api/hospitals")
                .then(res => {
                    this.hospitals = res.data.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getDetails() {
            this.$Progress.start();
            this.isLoading = true;
            axios
                .get("api/details")
                .then(({ data }) => {
                    this.details = data;
                    this.$Progress.finish();
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.$Progress.fail();
                    this.isLoading = false;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        newModal() {
            this.editmode = false;
            this.form.reset();
            this.form.clear();
            Fire.$emit("changeEditMode");
            $("#DetailsModal").modal("show");
        },
        updateDetails() {
            this.$Progress.start();
            this.loading = true;
            this.form
                .put("api/details/" + this.form.id)
                .then(() => {
                    $("#DetailsModal").modal("hide");
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
        createDetails() {
            this.$Progress.start();
            this.loading = true;
            this.form
                .post("api/details")
                .then(res => {
                    $("#DetailsModal").modal("hide");
                    Fire.$emit("AfterCreate");
                    Toast.fire({
                        type: "success",
                        title: "Details Added successfully",
                        timer: 3000
                    });
                    this.loading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.loading = false;
                    this.$Progress.fail();
                })
                .finally(() => {
                    this.$Progress.finish();
                    this.loading = false;
                });
        },
        editDetails(detail) {
            this.form.clear();
            this.form.reset();
            Fire.$emit("editDetails", detail);
        },
        deleteDetails(id) {
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
                        .delete("api/details/" + id)
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
        },
        async searchByCompany(event) {
            this.isLoading = true;
            this.searchcompany = event.value;
            let query = this.searchcompany;
            let res = await axios.get("api/sortcompany/" + query);
            this.details = res;
            this.isLoading = false;
        },
        async searchByHospital(event) {
            this.isLoading = true;
            this.searchhospital = event.value;
            let query = this.searchhospital;
            let res = await axios.get("api/sorthospital/" + query);
            this.details = res;
            this.isLoading = false;
        },
        getResults(page = 1) {
            this.isLoading = true;
            axios
                .get("api/details?page=" + page)
                .then(res => {
                    this.details = res.data;
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.isLoading = false;
                });
        }
    }
};
