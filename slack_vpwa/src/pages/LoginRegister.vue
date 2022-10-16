<template>
  <!-- <div class="centerContent"> -->
  <q-page class="row items-center justify-evenly">
    <h2>Slack v2</h2>
    <div class="q-md">
      <div class="q-gutter-y-md" style="max-width: 10000px">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="justify"
            narrow-indicator
          >
            <q-tab name="login" label="LOGIN" />
            <q-tab name="register" label="REGISTER" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="login">
              <div class="text-h6">LOGIN</div>
              <q-form
                @reset="onReset"
                @submit="$emit('login')"
                class="q-gutter-md"
              >
                <q-input
                  filled
                  v-model="lemail"
                  label="Email"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />

                <q-input
                  v-model="lpassword"
                  filled
                  label="Password"
                  :type="lisPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="lisPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="lisPwd = !lisPwd"
                    />
                  </template>
                </q-input>

                <div>
                  <q-btn label="Login" type="submit" color="primary" />
                  <q-btn
                    label="Reset"
                    type="reset"
                    color="primary"
                    flat
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-tab-panel>

            <q-tab-panel name="register">
              <div class="text-h6">REGISTER</div>
              <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <q-input
                  filled
                  v-model="rname"
                  label="Nickname"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />

                <q-input
                  filled
                  v-model="remail"
                  label="Email"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                />

                <q-input
                  v-model="rpassword"
                  filled
                  label="Password"
                  :type="risPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="risPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="risPwd = !risPwd"
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="rrpassword"
                  filled
                  label="Repeat Password"
                  :type="rrisPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="[
                    (val) => (val && val.length > 0) || 'Please type something',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="rrisPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="rrisPwd = !rrisPwd"
                    />
                  </template>
                </q-input>

                <q-toggle
                  v-model="accept"
                  label="I accept the license and terms"
                />

                <div>
                  <q-btn label="Register" type="submit" color="primary" />
                  <q-btn
                    label="Reset"
                    type="reset"
                    color="primary"
                    flat
                    class="q-ml-sm"
                  />
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
  <!-- </div> -->
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';

export default {
  setup() {
    const $q = useQuasar();

    const accept = ref(false);

    const lpassword = ref('');
    const rpassword = ref('');
    const rrpassword = ref('');
    const lisPwd = ref(true);
    const risPwd = ref(true);
    const rrisPwd = ref(true);
    const lemail = ref('');
    const remail = ref('');
    const rname = ref('');
    return {
      tab: ref('login'),
      lpassword,
      rpassword,
      rrpassword,
      lemail,
      remail,
      rname,
      accept,
      lisPwd,
      risPwd,
      rrisPwd,

      onSubmit() {
        if (accept.value !== true) {
          console.log('4nnjinijnijwnhivhnvnhavnani');
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first',
          });
        } else {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted',
          });
        }
      },

      onReset() {
        rname.value = '';
        lpassword.value = '';
        rpassword.value = '';
        rrpassword.value = '';
        lemail.value = '';
        remail.value = '';
        rname.value = '';
        accept.value = false;
      },
    };
  },
};
</script>

<style>
.q-tabs {
  width: 40rem;
  /* width: auto; */
}
</style>
