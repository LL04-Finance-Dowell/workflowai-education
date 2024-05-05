const createResizableColumn = (col, resizer) => {
  // Track the current position of mouse
  let x = 0;
  let w = 0;

  const mouseDownHandler = function (e) {
    const holderDiv =
      col.parentElement.parentElement.parentElement.parentElement;
    holderDiv.removeAttribute('draggable');
    // Get the current mouse position
    x = e.clientX;

    // Calculate the current width of column
    const styles = window.getComputedStyle(col);
    w = parseInt(styles.width, 10);

    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // Determine how far the mouse has been moved
    const dx = e.clientX - x;

    // Update the width of column
    col.style.width = `${w + dx}px`;
  };

  // When user releases the mouse, remove the existing event listeners
  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  resizer.addEventListener('mousedown', mouseDownHandler);
};

const setColRowSize = (table, width = null, height = null) => {
  const col_resizers = table.querySelectorAll('.td-resizer');
  const row_resizers = table.querySelectorAll('.row-resizer');
  for (const resizer of col_resizers) {
    if (height) {
      resizer.style.height = `${height}px`;
      // console.log("set height: ",height);
    } else {
      resizer.style.height = `${table.offsetHeight}px`;
    }
  }
  for (const resizer of row_resizers) {
    if (width) {
      resizer.style.width = `${width}px`;
      // console.log("set witdh: ",width);
    } else {
      resizer.style.width = `${table.offsetWidth}px`;
    }
  }
};

const createResizableRow = (row, resizer) => {
  // Track the current position of the mouse
  let y = 0;
  let h = 0;

  const mouseDownHandler = function (e) {
    const holderDiv =
      row.parentElement.parentElement.parentElement.parentElement;
    holderDiv.removeAttribute('draggable');
    // Get the current mouse position
    y = e.clientY;

    // Calculate the current height of the row
    h = row.clientHeight;

    // Attach listeners for document's events
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // Determine how far the mouse has been moved
    const dy = e.clientY - y;

    // Update the height of the row
    row.style.height = `${h + dy}px`;
  };

  // When the user releases the mouse, remove the existing event listeners
  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  resizer.addEventListener('mousedown', mouseDownHandler);
};

export const CreateTableComponent = (
  holderDIV,
  id,
  element,
  handleDropp,
  p,
  table_dropdown_focuseddClassMaintain,
  focuseddClassMaintain,
  handleClicked,
  setSidebar,
  setStartDate,
  setMethod,
  setRightSideDateMenu,
  copy_data = false
) => {
  let isAnyRequiredElementEdited = false;
  let tableField = document.createElement('div');
  tableField.className = 'tableInput';
  tableField.style.width = '100%';
  tableField.style.height = '100%';
  tableField.style.backgroundColor = '#0000';
  tableField.style.borderRadius = '0px';
  tableField.style.outline = '0px';
  tableField.style.overflow = 'overlay';
  // tableField.innerHTML = 'table';
  tableField.style.position = 'absolute';
  tableField.id = id.includes('tab') ? id : `tab${id.slice(1)}`;

  const placeholder = document.createElement('p');
  placeholder.className = 'placeholder';
  placeholder.textContent = 'Insert Table';
  placeholder.style.zIndex = '-1';
  tableField.append(placeholder);
  // tableField.textContent = 'Table'

  tableField.oninput = (e) => {
    //setIsFinializeDisabled(false);
  };
  tableField.onclick = (e) => {
    // focuseddClassMaintain(e);

    table_dropdown_focuseddClassMaintain(e);
    // table_focuseddClassMaintain(e);
    if (e.ctrlKey) {
      copyInput('table2');
    }
    handleClicked('table2');
    setSidebar(true);
  };

  const tabb = document.createElement('table');
  tabb.id = !id.includes('tab') ? id : '';

  // tabb.innerHTML = element.data;
  let tableData = element?.data;
  if (copy_data) {
    tableData = copy_data;
  } else {
    tableData = element?.data;
  }
  // console.log("tableData", tableData);
  for (let i = 0; i < tableData.length; i++) {
    const tabbTR = document.createElement('tr');
    const tableTRData = tableData[i]['tr'];
    for (let j = 0; j < tableTRData.length; j++) {
      const tableTDData = tableTRData[j]['td'];
      // console.log("tableTD", tableTRData[j]["td"]);
      var cells = document.createElement('td');
      cells.contentEditable = true;
      cells.className = 'dropp';
      if (i === 0) {
        const resizer = document.createElement('div');
        resizer.contentEditable = false;
        resizer.classList.add('td-resizer');
        resizer.addEventListener('mousedown', (e) => {
          let x = 0;
          let w = 0;
        });
        createResizableColumn(cells, resizer);
        cells.appendChild(resizer);
      }

      cells.ondragover = function (e) {
        e.preventDefault();
        e.target.classList.add('table_drag');

        if (e.target.tagName.toLowerCase() == 'td') {
          e.target.style.border = '3px solid blue';
        }

        if (e.target.classList.contains('imageInput')) {
          e.target.style.border = 'none';
        }
      };
      cells.ondragleave = (e) => {
        e.preventDefault();
        if (!e.target.classList.contains('imageInput')) {
          if (e.target.tagName.toLowerCase() == 'td') {
            e.target.style.border = '1px solid black';
          }
        }
        if (e.target.classList.contains('imageInput')) {
          e.target.style.border = 'none';
        }
      };

      //  tableTDData.
      const cellsDiv = document.createElement('div');
      cellsDiv.id = tableTDData.id;
      const dataType = tableTDData.type;
      cellsDiv.className =
        (dataType == 'DATE_INPUT' && 'dateInput') ||
        (dataType == 'TEXT_INPUT' && 'textInput') ||
        (dataType == 'IMAGE_INPUT' && 'imageInput') ||
        (dataType == 'SIGN_INPUT' && 'signInput') || 
        (dataType == 'text_td'  && 'text_td')  ;
      if (dataType == 'DATE_INPUT') {
        setStartDate(new Date());
        setMethod('select');

        function dateClick() {
          document.getElementById('date_picker').click();
          setRightSideDateMenu(false);
        }
        cellsDiv.onclick = (e) => {
          focuseddClassMaintain(e);
          handleClicked('calendar2');
          setRightSideDateMenu(false);
          if (e.target.innerText != 'mm/dd/yyyy') {
            if (e.target.innerText.includes('/')) {
              const setDate = new Date(parseInt(e.target.innerText));
              setMethod('first');
              setStartDate(setDate);
            } else {
              if (e.target.innerText.includes('-')) {
                setMethod('fourth');
              } else {
                setMethod('second');
              }
              const setDate = new Date(e.target.innerText);
              setStartDate(setDate);
            }
          }
          setSidebar(true);
          setTimeout(dateClick, 0);
          e.stopPropagation();
        };
      }
      if (dataType == 'TEXT_INPUT') {
        cellsDiv.onclick = (e) => {
          focuseddClassMaintain(e);
          // handleClicked("align2");
          // setSidebar(true);
          handleClicked('align2', 'table2');
          setSidebar(true);
          e.stopPropagation();
        };
      }
      if (dataType == 'IMAGE_INPUT') {
        cellsDiv.onclick = (e) => {
          focuseddClassMaintain(e);
          // handleClicked("image2");
          // setSidebar(true);
          handleClicked('image2', 'table2');
          setSidebar(true);
          // console.log("imageclick test", e.target);
          e.stopPropagation();
        };
      }
      if (dataType == 'SIGN_INPUT') {
        cellsDiv.onclick = (e) => {
          focuseddClassMaintain(e);
          handleClicked('signs2', 'table2');
          setSidebar(true);
          e.stopPropagation();
        };
      }
      cellsDiv.setAttribute('contenteditable', true);
      cellsDiv.style.width = '100%';
      cellsDiv.style.height = '100%';
      cellsDiv.style.backgroundColor = '#0000';
      cellsDiv.style.borderRadius = '0px';
      cellsDiv.style.outline = '0px';
      cellsDiv.style.overflow = 'overlay';

      if (dataType == 'IMAGE_INPUT') {
        const imageButton = document.createElement('div');
        imageButton.className = 'addImageButton';
        imageButton.innerText = 'Choose File';
        imageButton.style.display = 'none';

        const imgBtn = document.createElement('input');
        imgBtn.className = 'addImageButtonInput';
        imgBtn.type = 'file';
        imgBtn.style.objectFit = 'cover';
        var uploadedImage = '';
        imgBtn.addEventListener('input', () => {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            uploadedImage = reader.result;
            document.querySelector(
              '.focussed'
            ).style.backgroundImage = `url(${uploadedImage})`;
          });
          reader.readAsDataURL(imgBtn.files[0]);
        });
        cellsDiv.style.backgroundImage = `${tableTDData.data}`;
        imageButton.append(imgBtn);
        if (dataType) {
          cells.appendChild(cellsDiv);
          cells.appendChild(imgBtn);
        }
      } else {
        if (dataType) {
          cellsDiv.innerHTML = tableTDData.data.toString();
          cells.appendChild(cellsDiv);
        }
      }
      cells.ondrop = handleDropp;
      tabbTR.appendChild(cells);
    }
    const rowResizeCell = tabbTR.firstElementChild;
    const resizer = document.createElement('div');
    resizer.contentEditable = false;
    resizer.classList.add('row-resizer');
    resizer.addEventListener('mousedown', (e) => {
      let x = 0;
      let w = 0;
    });
    rowResizeCell.appendChild(resizer);
    createResizableRow(rowResizeCell, resizer);
    tabb.appendChild(tabbTR);
  }
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      // console.log("Observing: ",entry.target);
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      const table = entry.target;
      const tableHolderDIV = table.parentElement?.parentElement;
      setColRowSize(table, width, height, tableHolderDIV);
    });
  });
  resizeObserver.observe(tabb);
  tableField.append(tabb);
  holderDIV.append(tableField);
  if (copy_data) {
    return holderDIV;
  } else {
    document
      .getElementsByClassName('midSection_container')
      [p - 1] // ?.item(0)
      ?.append(holderDIV);
  }
};
