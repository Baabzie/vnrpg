import { useState, useEffect } from "react";

const ChangeCellButton = ({
  currentCell,
  currentCellData,
  connection,
  setCurrentCell,
}) => {
  const changeCell = (connection) => {
    setCurrentCell(connection);
  };

  const currentCellName =
    currentCell.charAt(0).toUpperCase() + currentCell.slice(1);
  const nextCellName = connection.charAt(0).toUpperCase() + connection.slice(1);
  return (
    <button onClick={() => changeCell(connection)} key={connection}>
      {currentCellData.inside
        ? `Exit ${currentCellName}`
        : `Enter ${nextCellName}`}
    </button>
  );
};

export default ChangeCellButton;
