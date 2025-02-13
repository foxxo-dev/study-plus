<template>
  <div>
    <p>Redirecting...</p>
  </div>
</template>

<script>
export default {
  methods: {
    getParameterByName(name) {
      const url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      const results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
  },
  mounted() {
    const mode = this.getParameterByName('mode');

    const actionCode = this.getParameterByName('oobCode');

    const lang = this.getParameterByName('lang') || 'en';

    switch (mode) {
      case 'resetPassword':
        this.$router.push(
          `/auth/resetpassword?oobCode=${actionCode}&mode=${mode}&lang=${lang}`,
        );
        break;
      case 'verifyEmail':
        this.$router.push(
          `/auth/verifyingemail?oobCode=${actionCode}&mode=${mode}&lang=${lang}`,
        );
        break;
      default:
        this.$router.push('/auth/login');
    }
  },
};
</script>
