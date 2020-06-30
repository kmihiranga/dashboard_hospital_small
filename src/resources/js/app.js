/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("./bootstrap");

window.Vue = require("vue");
import moment from "moment";
import VueRouter from "vue-router";
import VueGoodTablePlugin from "vue-good-table";
// import the styles
import "vue-good-table/dist/vue-good-table.css";
import { Form, HasError, AlertError } from "vform";
import Gate from "./Gate";
Vue.prototype.$gate = new Gate(window.user);

import VueProgressBar from "vue-progressbar";
import Swal from "sweetalert2";
import ToggleButton from "vue-js-toggle-button";
import VueSkeletonLoading from "vue-skeleton-loading";
import VCalendar from "v-calendar";

window.Form = Form;
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000
});

window.Toast = Swal;

Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

Vue.component("pagination", require("laravel-vue-pagination"));

Vue.use(VueRouter);
Vue.use(VueGoodTablePlugin);
Vue.use(ToggleButton);
Vue.use(VueSkeletonLoading);

Vue.use(VueProgressBar, {
    color: "rgb(143, 255, 199)",
    failedColor: "red",
    height: "3px"
});

Vue.use(VCalendar, {
    componentPrefix: "vc" // Use <vc-calendar /> instead of <v-calendar />
});

const routes = [
    {
        path: "/dashboard",
        component: require("./components/Dashboard.vue").default,
        meta: {
            breadCrumbs: [
                {
                    to: "/", // hyperlink
                    text: "Dashboard" // crumb text
                }
            ]
        }
    },
    {
        path: "/developer",
        component: require("./components/Developer.vue").default
    },
    {
        path: "/user",
        component: require("./components/Users.vue").default
    },
    {
        path: "/profile",
        component: require("./components/Profile.vue").default
    },
    {
        path: "/company",
        component: require("./components/Company.vue").default
    },
    {
        path: "/hospitals",
        component: require("./components/Hospital.vue").default
    },
    {
        path: "/details",
        component: require("./components/Details.vue").default
    },
    {
        path: "*",
        component: require("./components/NotFound.vue").default
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

Vue.filter("upText", function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter("myDate", function(created) {
    return moment(created).format("MMMM Do YYYY");
});

// get every update in component
window.Fire = new Vue();

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

Vue.component(
    "passport-clients",
    require("./components/passport/Clients.vue").default
);

Vue.component(
    "passport-authorized-clients",
    require("./components/passport/AuthorizedClients.vue").default
);

Vue.component(
    "passport-personal-access-tokens",
    require("./components/passport/PersonalAccessTokens.vue").default
);

Vue.component("not-found", require("./components/NotFound.vue").default);

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

// Vue.component("dashboard-component", require("./components/Dashboard.vue"))

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */
const app = new Vue({
    el: "#app",
    router,
    data: {
        search: ""
    },
    methods: {
        searchit: _.debounce(() => {
            Fire.$emit("searching");
        }, 1000)
    }
});
