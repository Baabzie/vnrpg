import styles from "./Journal.module.scss";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Journal = ({ setActiveJournal }) => {
  const journalRef = useRef();
  const questsDataFromRedux = useSelector((state) => state.quests);
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const fetchQuestData = async () => {
      try {
        const fetchPromises = Object.values(questsDataFromRedux).map(
          async (quest) => {
            const response = await fetch(`/quests/${quest.id}.json`);
            const jsonData = await response.json();
            const questForJournal = {
              name: jsonData.name,
              stage: quest.stage,
              objective: jsonData.stages[quest.stage],
            };
            return questForJournal;
          }
        );
        const questDataArray = await Promise.all(fetchPromises);
        setQuests([...questDataArray]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchQuestData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (journalRef.current && !journalRef.current.contains(event.target)) {
        setActiveJournal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setActiveJournal(false);
  };

  return (
    <div className={styles["journal-container"]}>
      <div className={styles["journal"]} ref={journalRef}>
        <h3>Journal</h3>
        <ul>
          {quests.map((quest, i) => {
            return quest.stage !== 100 && quest.stage !== 0o0 ? (
              <li key={i}>
                <h4>{quest.name}</h4>
                <p>{quest.objective}</p>
              </li>
            ) : null;
          })}
        </ul>
        <button onClick={() => handleClick()}>
          <p>Close Journal</p>
        </button>
      </div>
    </div>
  );
};

export default Journal;
