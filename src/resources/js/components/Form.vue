<template>
  <div>
    <!-- Add new form modal -->
    <div
      class="modal fade"
      id="DetailsModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editmode" class="modal-title" id="exampleModalLabel">
              <i class="fas fa-building"></i> Add New Detail
            </h5>
            <h5 v-show="editmode" class="modal-title" id="exampleModalLabel">
              <i class="fas fa-building"></i> Update Detail
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form
            @submit.prevent="
                            editmode ? updateDetails() : createDetails()
                        "
          >
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Company Name (ආයතනය)
                      <span class="required">*</span>
                    </label>
                    <autocomplete
                      v-if="editmode == false"
                      ref="autocomplete"
                      placeholder="Search company name"
                      :source="companies"
                      input-class="form-control"
                      v-model="form.company"
                      resultsValue="id"
                      name="company"
                      @selected="setSelectedValue"
                    ></autocomplete>
                    <select
                      v-else
                      name="company"
                      v-model="form.company"
                      id="company"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.has('company') }"
                    >
                      <option
                        v-for="company in companies"
                        :key="company.id"
                        :value="company.id"
                      >{{ company.name }}</option>
                    </select>
                    <has-error :form="form" field="company"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Hospital Name (රෝහලේ නම)
                      <span class="required">*</span>
                    </label>
                    <autocomplete
                      v-if="editmode == false"
                      ref="autocomplete"
                      placeholder="Search hospital name"
                      :source="hospitals"
                      input-class="form-control"
                      v-model="form.hospital"
                      resultsValue="id"
                      name="hospital"
                      @selected="setHospitalValue"
                    ></autocomplete>
                    <select
                      v-else
                      name="hospital"
                      v-model="form.hospital"
                      id="hospital"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.has('hospital') }"
                    >
                      <option
                        v-for="hospital in hospitals"
                        :key="hospital.id"
                        :value="hospital.id"
                      >{{ hospital.name }}</option>
                    </select>
                    <has-error :form="form" field="hospital"></has-error>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Expenditure Year (වැය වර්ෂය)</label>
                    <input
                      v-model="form.year"
                      type="text"
                      name="year"
                      class="form-control"
                      placeholder="Enter your expenditure year..."
                      :class="{
                                                'is-invalid': form.errors.has(
                                                    'year'
                                                )
                                            }"
                    />
                    <has-error :form="form" field="year"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Book No (මුදල් පොතේ අංක)</label>
                    <input
                      v-model="form.book_no"
                      type="text"
                      name="book_no"
                      class="form-control"
                      placeholder="Enter Book No..."
                      :class="{
                                                'is-invalid': form.errors.has(
                                                    'book_no'
                                                )
                                            }"
                    />
                    <has-error :form="form" field="book_no"></has-error>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Subject Clerk Name (විෂය ලිපිකරුගේ නම)</label>
                    <input
                      v-model="form.piyan_name"
                      type="text"
                      name="piyan_name"
                      class="form-control"
                      placeholder="Enter subject clerk name..."
                      :class="{
                                                'is-invalid': form.errors.has(
                                                    'piyan_name'
                                                )
                                            }"
                    />
                    <has-error :form="form" field="piyan_name"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Project Name (ව්‍යාපෘතිය)</label>
                    <input
                      v-model="form.project_name"
                      type="text"
                      name="project_name"
                      class="form-control"
                      placeholder="Enter project name..."
                      :class="{
                                                'is-invalid': form.errors.has(
                                                    'project_name'
                                                )
                                            }"
                    />
                    <has-error :form="form" field="project_name"></has-error>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Voucher No (වවුචර් අංකය)
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="form.voucher_no"
                      type="text"
                      name="voucher_no"
                      class="form-control"
                      placeholder="Enter voucher no..."
                      :class="{
                                                'is-invalid': form.errors.has(
                                                    'voucher_no'
                                                )
                                            }"
                    />
                    <has-error :form="form" field="voucher_no"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Payee (ගෙවීම් ලබන්නා)
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="form.payee"
                      type="text"
                      name="payee"
                      class="form-control"
                      placeholder="Enter payee name..."
                      :class="{
                                                'is-invalid': form.errors.has(
                                                    'payee'
                                                )
                                            }"
                    />
                    <has-error :form="form" field="payee"></has-error>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Date (දිනය)
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="form.date"
                      type="date"
                      name="date"
                      class="form-control"
                      placeholder="Enter date name..."
                      :class="{'is-invalid': form.errors.has('date')}"
                    />
                    <has-error :form="form" field="date"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Payment Month (මාසය)
                      <span class="required">*</span>
                    </label>
                    <autocomplete
                      v-if="editmode == false"
                      ref="autocomplete"
                      placeholder="Search payment month"
                      :source="month"
                      input-class="form-control"
                      v-model="form.month"
                      resultsValue="name"
                      name="month"
                      @select="setMonthValue"
                    ></autocomplete>
                    <select
                      v-else
                      name="month"
                      v-model="form.month"
                      id="month"
                      class="form-control"
                      :class="{ 'is-invalid': form.errors.has('month') }"
                    >
                      <option
                        v-for="value in month"
                        :key="value.id"
                        :value="value.name"
                      >{{ value.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>
                      Gross Sum (දල එකතුව) Rs.0.00
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="form.sub_total"
                      type="text"
                      name="sub_total"
                      class="form-control"
                      placeholder="Enter gross sum (Rs.0.00)..."
                      :class="{'is-invalid': form.errors.has('sub_total')}"
                    />
                    <has-error :form="form" field="sub_total"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Cross Note (හරස් සටහන්) Rs.0.00</label>
                    <input
                      v-model="form.cross_note"
                      type="text"
                      name="cross_note"
                      class="form-control"
                      placeholder="Enter cross note (Rs.0.00)..."
                      :class="{'is-invalid': form.errors.has('cross_note')}"
                    />
                    <has-error :form="form" field="cross_note"></has-error>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Balance (ඉතිරි මුදල) Rs.0.00</label>
                    <input
                      v-model="form.balance"
                      type="text"
                      name="balance"
                      class="form-control"
                      placeholder="Enter balance (Rs.0.00)..."
                      :class="{'is-invalid': form.errors.has('balance')}"
                    />
                    <has-error :form="form" field="balance"></has-error>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Company Total (ආයතන එකතුව) Rs.0.00</label>
                    <input
                      v-model="form.company_total"
                      type="text"
                      name="company_total"
                      class="form-control"
                      placeholder="Enter company_total (Rs.0.00)..."
                      :class="{'is-invalid': form.errors.has('company_total')}"
                    />
                    <has-error :form="form" field="company_total"></has-error>
                  </div>
                </div>
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
  </div>
</template>

<script>
import detailsMixins from "../mixins/detailsMixin.js";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

Vue.component("date-picker", DatePicker);

export default {
  mixins: [detailsMixins],
  components: {
    DatePicker
  },
  data() {
    return {
      mode: "single"
    };
  },
  methods: {
    setSelectedValue(event) {
      this.form.company = event.value;
    },
    setHospitalValue(event) {
      this.form.hospital = event.value;
    },
    setMonthValue(event) {
      this.form.month = event.display;
    }
  }
};
</script>

<style scoped>
.required {
  color: red;
}
</style>
