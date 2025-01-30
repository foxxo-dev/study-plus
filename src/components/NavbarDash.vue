<template>
  <nav>
    <h3>Study+</h3>
    <div>
      <button>Join Premium</button>
      <img src="https://randomuser.me/api/portraits/men/89.jpg" alt="profile" />
    </div>
  </nav>
  <div id="spacer___"></div>
</template>

<style scoped>
h3 {
  font-family: 'League Spartan', serif;
  font-size: 1.3rem;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-image: linear-gradient(to bottom, #00000081, #0000);
  color: white;
  width: 100%;
  position: fixed;
  height: 6rem;
}
nav div {
  display: flex;
  gap: 2rem;
}

img {
  height: 3rem;
  border-radius: 50%;
  aspect-ratio: 1;
  cursor: pointer;
}

button {
  all: unset;
  background: #e2af08;
  padding-inline: 2rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  border-radius: 10vw;
  font-size: 1.3rem;
  cursor: pointer;
}

#spacer___ {
  height: 6rem;
  width: 100%;
}
</style>
