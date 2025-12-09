const form = document.getElementById("form");
const sectionOutputs = document.querySelectorAll(".section-output");

function validInput(value) {
  if (value === null || value === undefined) {
    return "Поле не должно быть пустым";
  }

  if (isNaN(value)) {
    return "Значение должно быть числом";
  }

  if (!Number.isInteger(value)) {
    return "Значение должно быть целочисленным";
  }

  if (value <= 0) {
    return "Значение должно быть положительным числом";
  }

  return "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.classList.remove("error");
  });

  const pValue = form.querySelector('[name="pValue"]').value.trim();
  const gValue = form.querySelector('[name="gValue"]').value.trim();
  const aValue = form.querySelector('[name="aValue"]').value.trim();

  let hasError = false;

  if (!pValue) {
    showError(
      form.querySelector('[name="pValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (!gValue) {
    showError(
      form.querySelector('[name="gValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (!aValue) {
    showError(
      form.querySelector('[name="aValue"]'),
      "Поле не должно быть пустым"
    );
    hasError = true;
  }

  if (hasError) return;

  const p = parseInt(pValue);
  const g = parseInt(gValue);
  const a = parseInt(aValue);

  const pError = validInput(p);
  const gError = validInput(g);
  const aError = validInput(a);

  if (pError) {
    showError(form.querySelector('[name="pValue"]'), pError);
    hasError = true;
  }

  if (gError) {
    showError(form.querySelector('[name="gValue"]'), gError);
    hasError = true;
  }

  if (aError) {
    showError(form.querySelector('[name="aValue"]'), aError);
    hasError = true;
  }

  if (hasError) return;

  if (a >= p) {
    showError(form.querySelector('[name="aValue"]'), "a должно быть меньше p");
    return;
  }

  if (g >= p) {
    showError(form.querySelector('[name="gValue"]'), "g должно быть меньше p");
    return;
  }

  const nValueDiv = form.querySelector('[name="nValue"]');
  const n = p - 1;

  nValueDiv.innerHTML = `n = ${n}`;

  clearErrors();
  init(p, g, a, n);
});
function showError(input, message) {
  input.classList.add("error");

  let errorElement = input.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }

  errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  input.parentNode.appendChild(errorElement);
}

function clearErrors() {
  const inputs = form.querySelectorAll('input[type="text"]');
  inputs.forEach((input) => {
    input.classList.remove("error");
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  });
}

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

  return { m: m, sqrt: Math.sqrt(p), round: Math.round(Math.sqrt(p)) };
}

function step2(m, g, p) {
  const b = sumMod(g, m, p);

  return b;
}

function step3(b, a, g, p, m) {
  const dict = { u: [], v: [] };
  for (let i = 1; i <= m; i++) {
    dict.u.push(sumMod(b, i, p));
    dict.v.push(sumMod(a * sumMod(g, i, p), 1, p));
  }

  return dict;
}

function step4(m, dict, n) {
  let iIndex = null;
  let jIndex = null;
  let findNumber = null;

  const uArray = dict.u;
  const vArray = dict.v;

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < m; j++) {
      if (uArray[i] === vArray[j]) {
        findNumber = uArray[i];
        iIndex = i + 1;
        jIndex = j + 1;
        break;
      }
    }
  }

  return {
    resultStep4: sumMod(m * iIndex - jIndex, 1, n),
    iIndex: iIndex,
    jIndex: jIndex,
    findNumber: findNumber,
  };
}

function createTable(dict, section) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");

  const th1 = document.createElement("th");
  th1.innerHTML = `i/j`;
  headerRow.appendChild(th1);

  const th2 = document.createElement("th");
  th2.innerHTML = `u<sub>i</sub>`;
  headerRow.appendChild(th2);

  const th3 = document.createElement("th");
  th3.innerHTML = `v<sub>j</sub>`;
  headerRow.appendChild(th3);

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const uArray = dict.u;
  const vArray = dict.v;

  for (let i = 0; i < uArray.length; i++) {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = `${i + 1}`;
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.innerHTML = `${uArray[i]}`;
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerHTML = `${vArray[i]}`;
    tr.appendChild(td3);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);

  section.innerHTML = "";
  section.appendChild(table);
}

function init(p, g, a, n) {
  const { m, sqrt, round } = step1(p);
  sectionOutputs[0].innerHTML = `m = [
          <math>
            <msqrt>
              <mi>${p}</mi>
            </msqrt>
          </math>
          ] + 1 = [${sqrt.toFixed(4)}] + 1 = ${round} + 1 = ${m}`;

  const b = step2(m, g, p);
  sectionOutputs[1].innerHTML = `b = ${b}`;

  const dict = step3(b, a, g, p, m);
  createTable(dict, sectionOutputs[2]);

  const { resultStep4, iIndex, jIndex, findNumber } = step4(m, dict, n);
  sectionOutputs[3].innerHTML = `u<sub>${iIndex}</sub> = v<sub>${jIndex}</sub> = ${findNumber} => x = (${m} * ${iIndex} - ${jIndex}) mod ${n} = ${resultStep4}`;

  sectionOutputs[4].innerHTML = `g<sup>x</sup> = ${g}<sup>${resultStep4}</sup> = ${sumMod(
    g,
    resultStep4,
    p
  )} = a`;
}
