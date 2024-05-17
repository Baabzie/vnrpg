import styles from "./index.module.scss";
import { useState, useEffect } from "react";
// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });
import { useSelector, useDispatch } from "react-redux";
import ChangeCellButton from "@/components/commons/ChangeCellButton";
import NpcButton from "@/components/commons/NpcButton";
import JournalButton from "@/components/commons/JournalButton";
import Journal from "@/components/commons/Journal";
import DialogueTree from "@/components/commons/DialogueTree";

// import { updateCell } from "@/redux/cellsSlice";

export default function GamePage() {
  const [currentCell, setCurrentCell] = useState("town");
  const [activeDialoge, setActiveDialoge] = useState(false);
  const [activeJournal, setActiveJournal] = useState(false);
  const [currentCellData, setCurrentCellData] = useState(
    useSelector((state) => state.cells[currentCell]) || {}
  );
  const [dialogueData, setDialogueData] = useState([]);
  const cellsDataFromRedux = useSelector((state) => state.cells);
  // console.log(cellsDataFromRedux);

  useEffect(() => {
    // console.log(currentCellData);
    const fetchData = async () => {
      if (cellsDataFromRedux[currentCell]) {
        console.log("old data");
        setCurrentCellData(cellsDataFromRedux[currentCell]);
      } else {
        try {
          console.log("new data");
          const response = await fetch(`/cells/${currentCell}.json`);
          const jsonData = await response.json();
          setCurrentCellData(jsonData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      try {
        const response = await fetch(`/cellsText/${currentCell}.json`);
        const jsonData = await response.json();
        setDialogueData(jsonData);
      } catch (error) {
        // console.error("Error cellsText:", error);
        console.log("No text for cell");
      }
    };
    fetchData();
  }, [currentCell]);

  useEffect(() => {
    console.log(currentCellData);
  }, [currentCellData]);

  useEffect(() => {
    if (dialogueData.length > 0) {
      setActiveDialoge(true);
    }
  }, [dialogueData]);

  return (
    <main>
      <div className={styles["game-screen"]}>
        <div className={styles["background-img-div"]}>
          <img
            className={styles["background-img"]}
            src={`./images/cells/${currentCell}.png`}
          />
        </div>
        <div className={styles["locations-buttons-div"]}>
          {!activeDialoge && !activeJournal
            ? Object.keys(currentCellData).length !== 0 &&
              currentCellData.connections.map((connection, index) => {
                return (
                  <ChangeCellButton
                    currentCell={currentCell}
                    currentCellData={currentCellData}
                    connection={connection}
                    setCurrentCell={setCurrentCell}
                    key={currentCell + index}
                  />
                );
              })
            : null}
        </div>
        <div className={styles["journal-button-div"]}>
          {!activeDialoge && !activeJournal ? (
            <JournalButton setActiveJournal={setActiveJournal} />
          ) : null}
        </div>
        {activeJournal ? <Journal setActiveJournal={setActiveJournal} /> : null}
        {!activeJournal ? (
          <div className={styles["npcs-buttons-div"]}>
            {activeDialoge && (
              <DialogueTree
                dialogue={dialogueData}
                currentCellData={currentCellData}
                setActiveDialoge={setActiveDialoge}
                setDialogueData={setDialogueData}
              />
            )}
            {Object.keys(currentCellData).length !== 0 &&
              currentCellData.npcs.map((npc, index) => {
                return (
                  <NpcButton
                    npc={npc}
                    activeDialoge={activeDialoge}
                    setActiveDialoge={setActiveDialoge}
                    setDialogueData={setDialogueData}
                    key={npc + index}
                  />
                );
              })}
          </div>
        ) : null}
      </div>
    </main>
  );
}
