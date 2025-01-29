<template>
  <nav>
    <h3>Study+</h3>
    <div>
      <router-link to="/login">Log Out</router-link>
    </div>
  </nav>
  <div id="spacer___"></div>
</template>

<style>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-image: linear-gradient(to bottom, #00000081, #0000);
  color: white;
  width: 100%;
  position: fixed;
}
#spacer___ {
  height: 6rem;
  width: 100%;
}
</style>
