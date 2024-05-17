import styles from "./DialogueTree.module.scss";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  makePlayerKnown,
  addDisposition,
  removeDisposition,
  makeOldLocation,
  changeQuestStage,
} from "./executeFunctions";
import {
  isPlayerKnown,
  isDispositionAbove,
  isDispositionBelow,
  isOldLocation,
  isQuestStarted,
  isQuestStage,
} from "./conditionFunctions";

import { updateNPC } from "@/redux/npcsSlice";
import { updateCell } from "@/redux/cellsSlice";
import { updateQuest } from "@/redux/questSlice";

const DialogueTree = ({
  dialogue,
  currentCellData,
  setActiveDialoge,
  setDialogueData,
}) => {
  const [currentNode, setCurrentNode] = useState("");
  const [loaded, setloaded] = useState(false);
  const [npcKeys, setNpcKeys] = useState([]);
  const [localNpcData, setLocalNpcData] = useState({});
  const [questData, setQuestData] = useState({});
  const [cellData, setCellData] = useState({});

  const dispatch = useDispatch();

  const npcDataFromRedux = useSelector((state) => state.npcs);
  const questsDataFromRedux = useSelector((state) => state.quests);

  useEffect(() => {
    let npcs = [];
    dialogue[0].nodes.forEach((node) => {
      if (node.character) {
        let character = node.character[0].toLowerCase();
        npcs.push(character);
      }
    });
    // remove duplicate
    let uniqNpcs = [...new Set(npcs)];
    setNpcKeys(uniqNpcs);
    setCellData(currentCellData);
  }, []);

  useEffect(() => {
    const existingNpcs = {};
    npcKeys.forEach((key) => {
      if (npcDataFromRedux[key]) {
        existingNpcs[key] = npcDataFromRedux[key];
      }
    });

    const mergedNpcData = { ...existingNpcs };
    npcKeys.forEach((key) => {
      if (!mergedNpcData[key]) {
        mergedNpcData[key] = { name: key };
      }
    });

    setQuestData(questsDataFromRedux);
    setLocalNpcData(mergedNpcData);
    setloaded(true);
    setCurrentNode("START");
  }, [npcKeys]);

  useEffect(() => {
    // console.log(localNpcData);
    return () => {
      if (loaded) {
        Object.values(localNpcData).forEach((npc) => {
          if (Object.keys(npc).length > 1) {
            // console.log(npc);
            dispatch(updateNPC(npc));
          }
        });
      }
    };
  }, [localNpcData]);

  useEffect(() => {
    return () => {
      if (loaded) {
        dispatch(updateCell(cellData));
      }
    };
  }, [cellData]);

  useEffect(() => {
    // console.log(questData);
    return () => {
      if (loaded) {
        Object.values(questData).forEach((quest) => {
          // console.log(quest);
          if (Object.keys(quest).length > 1) {
            dispatch(updateQuest(quest));
          }
        });
      }
    };
  }, [questData]);

  //Check-Condition-function. Will check what condition-function (functions above) should be runned.

  const checkCondition = (inputString) => {
    const parts = inputString.split("(");
    const functionName = parts[0];
    const argumentsPart = parts[1].slice(0, -1);
    const argumentsArray = argumentsPart.split(",").map((arg) => arg.trim());
    const argument = argumentsArray[0];
    const argument2 = argumentsArray[1] || "";

    // console.log(argument);
    // console.log(localNpcData[argument.toLowerCase()]);

    if (functionName === "isPlayerKnown") {
      return isPlayerKnown(localNpcData[argument.toLowerCase()]);
    }
    if (functionName === "isDispositionAbove") {
      return isDispositionAbove(
        localNpcData[argument.toLowerCase()],
        argument2
      );
    }
    if (functionName === "isDispositionBelow") {
      return isDispositionBelow(
        localNpcData[argument.toLowerCase()],
        argument2
      );
    }
    if (functionName === "isOldLocation") {
      return isOldLocation(cellData);
    }
    if (functionName === "isQuestStarted") {
      console.log(questData[argument]);
      if (questData[argument]) {
        return isQuestStarted(questData[argument]);
      }
    }
    if (functionName === "isQuestStage") {
      if (questData[argument]) {
        return isQuestStage(questData[argument], argument2);
      }
    }
  };
  //-----------------------------------------------

  //Check-Execute-function. Will check what execute-function (functions above) should be runned.

  const checkExecute = (inputString) => {
    let edit;
    const parts = inputString.split("(");
    const functionName = parts[0];
    const argumentsPart = parts[1].slice(0, -1);
    const argumentsArray = argumentsPart.split(",").map((arg) => arg.trim());
    const argument = argumentsArray[0];
    const argument2 = argumentsArray[1] || "";

    if (functionName === "makePlayerKnown") {
      edit = makePlayerKnown(localNpcData[argument.toLowerCase()]);
      setLocalNpcData({ ...localNpcData, [argument.toLowerCase()]: edit });
    }
    if (functionName === "addDisposition") {
      edit = addDisposition(localNpcData[argument.toLowerCase()], argument2);
      setLocalNpcData({ ...localNpcData, [argument.toLowerCase()]: edit });
    }
    if (functionName === "removeDisposition") {
      edit = removeDisposition(localNpcData[argument.toLowerCase()], argument2);
      setLocalNpcData({ ...localNpcData, [argument.toLowerCase()]: edit });
    }
    if (functionName === "makeOldLocation") {
      setCellData(makeOldLocation(cellData));
    }
    if (functionName === "changeQuestStage") {
      edit = changeQuestStage(questData[argument], argument, argument2);
      setQuestData({ ...questData, [argument]: edit });
    }
  };
  //-----------------------------------------------

  const handleContinueClick = (nextNode) => {
    if (nextNode === null) {
      setDialogueData([]);
      setActiveDialoge(false);
      return;
    }
    setCurrentNode(nextNode);
  };

  const handleChoiceClick = (nextNode) => {
    if (nextNode === null) {
      setDialogueData([]);
      setActiveDialoge(false);
      return;
    }
    setCurrentNode(nextNode || getNextNodeWithoutChoice(currentNode));
  };

  const getNextNodeWithoutChoice = (currentNode) => {
    const nextNode = dialogue[0].nodes.find(
      (node) => node.node_name === currentNode
    )?.next;
    return nextNode || currentNode;
  };

  const renderChoices = (choices) => {
    return (
      <div className={styles["dialogue-choices-div"]}>
        {choices.map((choice, index) =>
          !choice.is_condition || checkCondition(choice.condition) ? (
            <button
              className={styles["choice-btn"]}
              key={index}
              onClick={() => handleChoiceClick(choice.next)}
            >
              <p>{choice.text.ENG}</p>
            </button>
          ) : null
        )}
      </div>
    );
  };

  const renderNode = () => {
    const currentNodeData = dialogue[0].nodes.find(
      (node) => node.node_name === currentNode
    );

    // Look this over
    const handeBranch = (boolean) => {
      if (boolean) {
        if (currentNodeData.branches.True === null) {
          setDialogueData([]);
          setActiveDialoge(false);
          return;
        }
        setCurrentNode(currentNodeData.branches.True);
      } else {
        if (currentNodeData.branches.False === null) {
          setDialogueData([]);
          setActiveDialoge(false);
          return;
        }
        setCurrentNode(currentNodeData.branches.False);
      }
    };

    return (
      <>
        {loaded && (
          <>
            <div className={styles["portrait-div"]}>
              {currentNodeData?.character &&
              currentNodeData?.character[0].toLowerCase() !== "narrator" ? (
                <img
                  className={styles["portrait"]}
                  src={`/images/npcs/${currentNodeData.character[0]}.png`}
                />
              ) : null}
            </div>
            <div className={styles["dialogue-overlay"]}>
              {currentNodeData?.character ? (
                <h1>{currentNodeData.character[0]}</h1>
              ) : null}
              <p>{currentNodeData?.text?.ENG}</p>
              {currentNodeData?.node_type === "condition_branch" ? (
                checkCondition(currentNodeData.text) ? (
                  handeBranch(true)
                ) : (
                  handeBranch(false)
                )
              ) : currentNodeData?.node_type === "execute" ? (
                (() => {
                  checkExecute(currentNodeData.text);
                  setCurrentNode(currentNodeData.next);
                })()
              ) : currentNodeData?.choices ? (
                renderChoices(currentNodeData.choices)
              ) : currentNode === "START" ? (
                (setCurrentNode(currentNodeData.next), null) // Don't return anything from this condition
              ) : (
                <div className={styles["dialogue-choices-div"]}>
                  <button
                    className={styles["choice-btn"]}
                    onClick={() => {
                      handleContinueClick(currentNodeData.next);
                    }}
                  >
                    <p>Continue..</p>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </>
    );
  };

  return <>{renderNode()}</>;
};

export default DialogueTree;
