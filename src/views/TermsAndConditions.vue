<template>
  <div id="bg"></div>
  <main>
    <ol>
      <p>Terms & Conditions</p>
      <li>
        You understand that AI may generate incorrect or false information.
      </li>
      <li>
        You understand that this is a free service and may not be available at
        all times.
      </li>
      <li>
        You understand that this service is not responsible for any data loss or
        corruption.
      </li>
      <li>
        You understand that you are submitting your Email, Password, User ID and
        other information to a secure database. The managers of the database,
        including 3rd party software does not have access to your full
        credentials.
      </li>
      <li>
        For testing and development purposes, you understand that each login
        will be announced. This information will not include any secure info,
        and will only include the date of login and method.
      </li>
      <li>
        You agree to 3rd parties terms and conditions. All of them you can find
        in the following list:
        <ul>
          <li>
            <a
              href="https://www.netlify.com/legal/terms-of-use/"
              target="_blank"
              >Netlify</a
            >
          </li>
          <li>
            <a href="https://cloud.google.com/terms" target="_blank"
              >Google Cloud Services</a
            >
          </li>
          <li>
            <a
              href="https://openai.com/policies/row-terms-of-use/"
              target="_blank"
              >OpenAI</a
            >
          </li>
          <li>
            <a href="https://discord.com/terms" target="_blank"
              >Discord - <i>for development purposes</i></a
            >
          </li>
        </ul>
      </li>
    </ol>
    <img src="@/assets/img/mac-os.png" alt="profile" />
  </main>
</template>

<style>
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
img {
  width: 40vw;
  height: 90vh;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 1rem;
  object-fit: cover;
  object-position: 0% center;
  border-radius: 1rem;
}
#bg {
  position: fixed;
  inset: 0;
  background: black;
  opacity: 0.8;
  z-index: -1;
}
p {
  font-size: 2rem;
}
main {
  padding-left: 2rem;
}
ol {
  font-size: 1.25rem;
  line-height: 2;
  max-width: 50pc;
}
</style>
