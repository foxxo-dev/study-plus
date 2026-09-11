export async function getAverageBgColor() {
  const clr = localStorage.getItem('avgBgClr');

  if (!clr) {
    return '#3f1487';
  }

  return clr;
}

async function getAverageBgColorFromImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (data.length / 4));
      g = Math.floor(g / (data.length / 4));
      b = Math.floor(b / (data.length / 4));

      resolve(`rgb(${r},${g},${b})`);
    };

    img.onerror = (error) => reject(error);
  });
}

export async function setNewAverageBgColor(uri) {
  console.log('Called');
  const color = await getAverageBgColorFromImage(uri);
  console.log('New Average BG Color:', color);
  localStorage.setItem('avgBgClr', color);
  console.log('Updated Localstorage');
  return color;
}
