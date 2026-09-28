export const fft = (samples: number[]) => {
  const N = samples.length;
  const real = new Array<number>(N).fill(0);
  const imag = new Array<number>(N).fill(0);

  for (let i = 0; i < N; i++) {
    real[i] = samples[i];
  }

  let j = 0;

  for (let i = 1; i < N; i++) {
    let bit = N >> 1;

    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }

    j ^= bit;

    if (i < j) {
      const temp = real[i];
      real[i] = real[j];
      real[j] = temp;
    }
  }

  for (let length = 2; length <= N; length <<= 1) {
    const angle = (-2 * Math.PI) / length;
    const wReal = Math.cos(angle);
    const wImag = Math.sin(angle);

    for (let start = 0; start < N; start += length) {
      let currentReal = 1;
      let currentImag = 0;

      for (let k = 0; k < length / 2; k++) {
        const evenIndex = start + k;
        const oddIndex = start + k + length / 2;

        const oddReal =
          real[oddIndex] * currentReal - imag[oddIndex] * currentImag;
        const oddImag =
          real[oddIndex] * currentImag + imag[oddIndex] * currentReal;

        const evenReal = real[evenIndex];
        const evenImag = imag[evenIndex];

        real[evenIndex] = evenReal + oddReal;
        imag[evenIndex] = evenImag + oddImag;
        real[oddIndex] = evenReal - oddReal;
        imag[oddIndex] = evenImag - oddImag;

        const nextReal = currentReal * wReal - currentImag * wImag;
        const nextImag = currentReal * wImag + currentImag * wReal;

        currentReal = nextReal;
        currentImag = nextImag;
      }
    }
  }

  return { real, imag };
};
