import DialogueTree from "@/components/commons/DialogueTree";
import { useState, useEffect } from "react";
import styles from "./NpcButton.module.scss";

const NpcButton = ({
  npc,
  activeDialoge,
  setActiveDialoge,
  setDialogueData,
}) => {
  const [npcDialogueData, setNpcDialogueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/npcs/${npc}.json`);
        const jsonData = await response.json();
        setNpcDialogueData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const npcName = npc.charAt(0).toUpperCase() + npc.slice(1);
  return (
    <>
      {activeDialoge
        ? null
        : npcDialogueData.length > 0 && (
            <button
              className={styles["npc-button"]}
              onClick={() => {
                setDialogueData(npcDialogueData);
                // setActiveDialoge(true);
              }}
            >
              <img
                className={styles["portrait"]}
                src={`/images/npcs/${npcName}.png`}
              />
              <p>{`Talk to ${npcName}`}</p>
            </button>
          )}
    </>
  );
};

export default NpcButton;
