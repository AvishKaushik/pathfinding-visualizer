import React,{Component} from 'react';
import Node from './Node/Node.jsx';
import {dijkstra, getNodesInShortestPathOrderD} from '../algorithms/dijkstra';
import {asearch} from '../algorithms/asearch';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 9;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 9;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      grid: [],
      mouseIsPressed: false,
    };
    this.state = this.initialState;
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-visited';
      }, 10 * i);
    }
  }


  animateShortestPath(nodesInShortestPathOrder) {
    document.getElementById(`node-${START_NODE_ROW}-${START_NODE_COL}`).className =
    'node node-initial-mark';
    for (let i = 1; i < (nodesInShortestPathOrder.length-1); i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-shortest-path';
      }, 50 * i);
    }
    setTimeout(() => {
      document.getElementById(`node-${FINISH_NODE_ROW}-${FINISH_NODE_COL}`).className =
      'node node-final-mark';
    }, 50 * (nodesInShortestPathOrder.length - 1));
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderD(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }


  visualizeASearch() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = asearch(grid, startNode, finishNode);
    console.log(visitedNodesInOrder);
  }
  resetMaze() {
    this.componentDidMount();
    const {grid, mouseIsPressed} = this.state;
    return(
      <>
      <div className="grid">
      {grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx}>
          {row.map((node, nodeIdx) => {
            const {row, col, isFinish, isStart, isWall} = node;
            if(!((row==9 && col==15) || (row==9 && col==35)))
            {
              const newGrid = getNewGridWithWallToggledOff(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
              this.setState(this.state);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(row==9 && col==15)
            {
              const newGrid = getNewGridWithStart(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-start';
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={true}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(row==9 && col==35)
            {
              const newGrid = getNewGridWithEnd(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-finish';
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={true}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
          })}
          </div>
        );
      })}
      </div>
      </>
    )
  }


  createRandomMaze() {
    this.rM();
    let count=300;
    let i=0;
    const {grid, mouseIsPressed} = this.state;
    return(
      <>
      <div className="grid">
      {grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx}>
          {row.map((node, nodeIdx) => {
            i+=1;
            const {row, col, isFinish, isStart, isWall} = node;
            if(row===0 || row==20 || col==0 || col==48)
            {
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-mazecr';
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(!((row==9 && col==15) || (row==9 && col==35)) && count>0)
            {
              let ch=randomIntFromInterval(0,2);
              console.log(ch);
              if(ch===1)
              {
                const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-mazecr';
                this.setState({grid: newGrid});
                count-=1;
                return (
                  <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={true}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                  onMouseEnter={(row, col) =>
                    this.handleMouseEnter(row, col)
                  }
                  onMouseUp={() => this.handleMouseUp()}
                  row={row}></Node>
                );
              }
              else {
                const newGrid = getNewGridWithWallToggledOff(this.state.grid, row, col);
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node';
                this.setState({grid: newGrid});
                return (
                  <Node
                  key={nodeIdx}
                  col={col}
                  isFinish={isFinish}
                  isStart={isStart}
                  isWall={false}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                  onMouseEnter={(row, col) =>
                    this.handleMouseEnter(row, col)
                  }
                  onMouseUp={() => this.handleMouseUp()}
                  row={row}></Node>
                );
              }
            }
            else if (!((row == 9 && col == 15) || (row == 9 && col == 35)) && count <= 0){
              const newGrid = getNewGridWithWallToggledOff(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node';
              this.setState({ grid: newGrid });
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if (row == 9 && col == 15) {
              const newGrid = getNewGridWithStart(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-start';
              this.setState({ grid: newGrid });
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if (row == 9 && col == 35) {
              const newGrid = getNewGridWithEnd(this.state.grid, row, col);
              document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-finish';
              this.setState({ grid: newGrid });
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
          })}
          </div>
        );
      })}
      </div>
      </>
    )
  }

  rM() {
    this.setState(this.state);
    this.resetMaze();
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  createVerticalMaze() {
    const grid1 = getInitialGrid();
    this.setState({ grid1 });
    const {grid, mouseIsPressed} = this.state;
    return(
      <>
      <div className="grid">
      {grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx}>
          {row.map((node, nodeIdx) => {
            const {row, col, isFinish, isStart, isWall} = node;
            if(row===0 || row==20 || col==0 || col==48)
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(col%4==0 && row!=19)
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(col%2==0 && col%4!=0 && row!=1)
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOff(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
          })}
          </div>
        );
      })}
      </div>
      </>
    )
  }

  createHorizontalMaze() {
    const grid1 = getInitialGrid();
    this.setState({ grid1 });
    const {grid, mouseIsPressed} = this.state;
    let i=1;
    return(
      <>
      <div className="grid">
      {grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx}>
          {row.map((node, nodeIdx) => {
            const {row, col, isFinish, isStart, isWall} = node;
            if(row===0 || row==20 || col==0 || col==48)
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(row%4==0 && col!=47)
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else if(row%2==0 && row%4!=0 && col!=1)
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOn(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={true}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
            else
            {
              console.log(col);
              const newGrid = getNewGridWithWallToggledOff(this.state.grid, row, col);
              this.setState({grid: newGrid});
              return (
                <Node
                key={nodeIdx}
                col={col}
                isFinish={isFinish}
                isStart={isStart}
                isWall={false}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                onMouseEnter={(row, col) =>
                  this.handleMouseEnter(row, col)
                }
                onMouseUp={() => this.handleMouseUp()}
                row={row}></Node>
              );
            }
          })}
          </div>
        );
      })}
      </div>
      </>
    )
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
      <button onClick={() => this.visualizeDijkstra()}>
      Visualize Dijkstra's Algorithm
      </button>
      <button onClick={() => this.visualizeASearch()}>
      Visualize ASearch Algorithm
      </button>
      <button onClick={() => this.rM()}>
      Reset Board
      </button>
      <button onClick={() => this.createVerticalMaze()}>
      Create Vertical Maze
      </button>
      <button onClick={() => this.createHorizontalMaze()}>
      Create Horizontal Maze
      </button>
      <button onClick={() => this.createRandomMaze()}>
      Create Random Maze
      </button>
      <div className="grid" id="m">
      {grid.map((row, rowIdx) => {
        return (
          <div key={rowIdx} id="n">
          {row.map((node, nodeIdx) => {
            const {row, col, isFinish, isStart, isWall} = node;
            return (
              <Node
              key={nodeIdx}
              col={col}
              isFinish={isFinish}
              isStart={isStart}
              isWall={isWall}
              mouseIsPressed={mouseIsPressed}
              color='white'
              onMouseDown={(row, col) => this.handleMouseDown(row, col)}
              onMouseEnter={(row, col) =>
                this.handleMouseEnter(row, col)
              }
              onMouseUp={() => this.handleMouseUp()}
              row={row}></Node>
            );
          })}
          </div>
        );
      })}
      </div>
      </>
    );
  }
}
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 21; row++) {
    const currentRow = [];
    for (let col = 0; col < 49; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  if (row == 9 && (col == 15 || col == 35)) {
    return newGrid;
  }
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWallToggledOn = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
const getNewGridWithWallToggledOff = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
const getNewGridWithEnd = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max-min+1) + min);
}
