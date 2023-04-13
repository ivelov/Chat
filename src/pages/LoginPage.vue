<template>
    <div>
        <!-- <HeaderComponent></HeaderComponent> -->
        <div class="mt-4"></div>
        <section class="container">
            <form action="">
                <b-field
                    label="Email"
                    :type="errors && errors.email ? 'is-danger' : ''"
                    :message="errors && errors.email ? errors.email[0] : ''"
                >
                    <b-input
                        required
                        type="email"
                        v-model="data.email"
                        @blur="errors.email = null"
                    >
                    </b-input>
                </b-field>
                <b-field
                    label="Password"
                    :type="errors && errors.password ? 'is-danger' : ''"
                    :message="
                        errors && errors.password ? errors.password[0] : ''
                    "
                >
                    <b-input
                        minlength="6"
                        required
                        type="password"
                        v-model="data.password"
                    >
                    </b-input>
                </b-field>
                <b-button
                    native-type="submit"
                    @click.prevent="submit"
                    class="is-primary"
                    outlined
                    :loading="loading"
                    :disabled="loading"
                    >Login</b-button
                >
            </form>
            <p class="mt-3">
                Don`t have an account?
                <router-link to="/register">Sign up</router-link>
            </p>
        </section>
    </div>
</template>

<script>
// import HeaderComponent from "../components/HeaderComponent.vue";
export default {
    data() {
        return {
            data: {
                email: "",
                password: "",
            },
            errors: {},
            loading: false,
        };
    },
    methods: {
        submit() {
            this.loading = true;
            this.$store
                .dispatch("login", this.data)
                .then(() => {
                    this.$router.push("/");
                })
                .catch((response) => {
                    if (response.data.errors) {
                        this.errors = response.data.errors;
                    }
                })
                .finally(() => {
                    this.loading = false;
                });
        },
    },
    // components: { HeaderComponent },
};
</script>

<style scoped>
.container {
    max-width: 300px;
}
</style>
