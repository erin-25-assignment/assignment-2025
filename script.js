const container = document.getElementById('spreadsheet-container');
const statusDisplay = document.getElementById('cell-status');
const ROWS = 10;
const COLS = 10;

let selectedCell = null;

function createSpreadsheet() {
  // 첫 행: 빈칸 + A~J
  container.appendChild(createHeaderCell(''));
  for (let j = 0; j < COLS; j++) {
    const header = createHeaderCell(String.fromCharCode(65 + j)); // A~J
    container.appendChild(header);
  }

  for (let i = 0; i < ROWS; i++) {
    // 왼쪽 열: 1~10
    container.appendChild(createHeaderCell(i + 1));

    for (let j = 0; j < COLS; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.contentEditable = true;
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', () => selectCell(cell));
      container.appendChild(cell);
    }
  }
}

function createHeaderCell(content) {
  const header = document.createElement('div');
  header.classList.add('header-cell');
  header.textContent = content;
  return header;
}

function selectCell(cell) {
  if (selectedCell) {
    selectedCell.classList.remove('active');
  }

  clearHeaderHighlights();

  selectedCell = cell;
  cell.classList.add('active');

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  // 표시 텍스트
  const colLetter = String.fromCharCode(65 + col);
  statusDisplay.textContent = `${colLetter}${row + 1}`;

  // 헤더 하이라이트
  const headerRow = container.children[1 + col]; // top header (0+1~10)
  const headerCol = container.children[(row + 1) * (COLS + 1)]; // left header
  headerRow.classList.add('highlight-header');
  headerCol.classList.add('highlight-header');
}

function clearHeaderHighlights() {
  const highlights = container.querySelectorAll('.highlight-header');
  highlights.forEach(el => el.classList.remove('highlight-header'));
}

document.getElementById('export-btn').addEventListener('click', () => {
  const data = [];

  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) {
      const index = (i + 1) * (COLS + 1) + (j + 1); // offset due to headers
      const cell = container.children[index];
      row.push(cell.innerText.trim());
    }
    data.push(row);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "spreadsheet.xlsx");
});

createSpreadsheet();