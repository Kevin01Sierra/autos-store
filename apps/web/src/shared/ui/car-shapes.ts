/** Siluetas laterales por tipo de carrocería (viewBox 0 0 400 150). */
export interface CarShape {
  body: string;
  windows: string;
  wheels: [number, number];
}

const sedan: CarShape = {
  body: 'M18 112V98q2-13 22-17l70-9 40-28q10-6 25-6h80q15 0 27 10l36 24 52 8q14 4 14 20v12z',
  windows: 'M118 72l36-25q7-4 17-4h34v29zm95 0V43h40q11 0 19 7l26 22z',
  wheels: [96, 306],
};

const hatchback: CarShape = {
  body: 'M22 112V92q2-14 22-18l62-7 38-26q10-6 25-6h128q18 0 26 16l16 30q6 10 6 24v7z',
  windows: 'M116 68l33-23q7-4 16-4h32v27zm89 0V41h56q12 0 17 10l9 17z',
  wheels: [94, 286],
};

const suv: CarShape = {
  body: 'M18 112V84q2-14 22-18l60-6 32-30q8-6 20-6h168q18 0 26 16l16 24q18 4 20 20v28z',
  windows: 'M112 62l27-26q6-5 15-5h42v31zm92 0V31h60v31zm68 0V31h22q10 0 15 9l13 22z',
  wheels: [98, 312],
};

const pickup: CarShape = {
  body: 'M18 112V88q2-14 22-18l60-6 30-30q8-6 20-6h80q10 0 14 10l6 26h134v48z',
  windows: 'M110 64l25-25q6-5 14-5h32v30zm79 0V34h28q7 0 9 6l6 24z',
  wheels: [94, 318],
};

export const CAR_SHAPES: Record<string, CarShape> = {
  sedan, coupe: sedan, hatchback, suv, van: suv, pickup,
};
