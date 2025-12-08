const p = 229;
const g = 6;
const a = 12;
const n = p - 1;

function sumMod(a, x, n) {
  let p = 1;
  let i = x;

  while (i > 0) {
    const s = i % 2;

    if (s === 1) {
      p = (p * a) % n;
    }

    a = (a * a) % n;
    i = (i - s) / 2;
  }

  return p < 0 ? p + n : p;
}

function step1(p) {
  const m = Math.round(Math.sqrt(p)) + 1;
  const k = m;

  return { m, k };
}

console.log("Шаг 1:");
const { m, k } = step1(p);
console.log("m:", m, " k:", k);

function step2(m, g, p) {
  const b = sumMod(g, m, p);

  return b;
}

console.log("Шаг 2:");
const b = step2(m, g, p);
console.log("b:", b);

function step3(b, a, g, p, m) {
  const dict = { u: [], v: [] };
  for (let i = 1; i <= m; i++) {
    dict.u.push(sumMod(b, i, p));
    dict.v.push(sumMod(a * sumMod(g, i, p), 1, p));
  }

  return dict;
}

console.log("Шаг 3:");
const dict = step3(b, a, g, p, m);
console.log(dict);

function step4(m, dict, n) {
  let iIndex = null;
  let jIndex = null;
  let x = null;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      if (dict.u[i] === dict.v[j]) {
        iIndex = i + 1;
        jIndex = j + 1;
        break;
      }
    }
  }

  return sumMod(m * iIndex - jIndex, 1, n);
}

console.log("Шаг 4:");
const result = step4(m, dict, n);
console.log(result);

console.log("Проверка:");
console.log(`${g}^${result} = ${sumMod(g, result, p)}`);
