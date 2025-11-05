function visualizeMaze(mazeArray, startPoint, finalPoint) {
  const container = document.getElementById("maze-container");

  // Clear the previous visualization
  container.innerHTML = "";

  // Set the grid size based on maze dimensions
  container.style.gridTemplateColumns = `repeat(${mazeArray[0].length}, 20px)`;

  // Loop through the maze array and create divs
  mazeArray.forEach((row, y) => {
    row.forEach((cell, x) => {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";

      // Set class based on cell value
      switch (cell) {
        case 0:
          cellDiv.classList.add("path"); // Open path
          break;
        case 1:
          cellDiv.classList.add("wall"); // Wall
          break;
        case 2:
          cellDiv.classList.add("visited"); // Visited
          break;
        case 3:
          cellDiv.classList.add("path-found"); // Path found
          break;
        default:
          break;
      }

      // Set starting point
      if (x === startPoint[0] && y === startPoint[1]) {
        cellDiv.classList.add("start"); // Start point
      }
      // Set final point
      if (x === finalPoint[0] && y === finalPoint[1]) {
        cellDiv.classList.add("end"); //Final point
      }

      container.appendChild(cellDiv);
    });
  });
}


// Алгоритм A* с анимацией
function aStarWithAnimation(maze, start, end, updateVisualization) {
  const [startX, startY] = start;
  const [endX, endY] = end;

  const rows = maze.length;
  const cols = maze[0].length;

  // Возможные направления движения (вправо, вниз, влево, вверх)
  const directions = [
    [0, 1], 
    [1, 0], 
    [0, -1], 
    [-1, 0], 
  ];

   // Эвристическая функция: оценивает расстояние до цели (Манхэттенское расстояние)
  function heuristic(x, y) {
    return Math.abs(x - endX) + Math.abs(y - endY); 
  }

  const openSet = [{ x: startX, y: startY, g: 0, h: heuristic(startX, startY), f: 0 }];
  const cameFrom = new Map(); // Сохранение пути

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false)); // Сохранение посещённых клеток
  const stepDelay = 100; // Задержка между шагами анимации (в миллисекундах)

  const path = [];
  
  function animateStep() {
    if (openSet.length > 0) {
      // Сортировка открытого набора по значению f (оценочная стоимость пути)
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift();

      // Проверка, достигли ли мы конечной точки
      if (current.x === endX && current.y === endY) {
        let temp = `${current.x},${current.y}`;
        while (cameFrom.has(temp)) {
          const [px, py] = temp.split(",").map(Number);
          path.push([px, py]);
          temp = cameFrom.get(temp);
        }
        path.reverse(); // Путь должен быть от начальной точки к конечной
        updateVisualization(path, maze); // Визуализировать найденный путь
        return;
      }

      visited[current.y][current.x] = true;

      // Обход соседних клеток
      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;


        // Проверяем, находится ли клетка в пределах лабиринта и проходима ли она
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && maze[ny][nx] === 0 && !visited[ny][nx]) {
          const g = current.g + 1;
          const h = heuristic(nx, ny);
          const f = g + h;

          // Добавляем клетку в открытый набор, если она ранее не была посещена
          if (!openSet.some(node => node.x === nx && node.y === ny && node.g <= g)) {
            openSet.push({ x: nx, y: ny, g, h, f });
            cameFrom.set(`${nx},${ny}`, `${current.x},${current.y}`);
          }
        }
      }

      maze[current.y][current.x] = 2; // Отметить как посещенную
      updateVisualization(null, maze); // Обновить визуализацию
      setTimeout(animateStep, stepDelay); // Пауза перед следующим шагом
    }
  }

  animateStep();
}

// Функция для обновления визуализации
function updateVisualization(path, maze) {
  visualizeMaze(maze, start, end);
  if (path) {
    path.forEach(([x, y]) => {
      maze[y][x] = 3; // Отметить найденный путь
    });
  }
}

const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
 
]

const start = [1, 1];
const end = [16, 13];

visualizeMaze(maze, start, end);

document.getElementById("find-path-btn").addEventListener("click", () => {
  aStarWithAnimation(maze, start, end, updateVisualization);
});




