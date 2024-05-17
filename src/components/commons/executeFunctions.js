//Execute functions. Different functions that changes states.

//Makes player known to NPC
export const makePlayerKnown = (characterData) => {
  return { ...characterData, knowsPlayer: true };
};

//Adds disposition to NPC, max 100 (how much NPC likes the player)
export const addDisposition = (characterData, argument) => {
  const number = parseInt(argument, 10);
  let newDisposition;
  if (characterData?.disposition) {
    newDisposition = characterData.disposition;
  } else {
    newDisposition = 50;
  }
  newDisposition += number;
  if (newDisposition >= 100) {
    return { ...characterData, disposition: 100 };
  } else {
    return { ...characterData, disposition: newDisposition };
  }
};

//Removes disposition from NPC, min 0 (how much NPC likes the player)
export const removeDisposition = (characterData, argument) => {
  const number = parseInt(argument, 10);
  let newDisposition;
  if (characterData?.disposition) {
    newDisposition = characterData.disposition;
  } else {
    newDisposition = 50;
  }
  newDisposition -= number;
  if (newDisposition <= 0) {
    return { ...characterData, disposition: 0 };
  } else {
    return { ...characterData, disposition: newDisposition };
  }
};

export const makeOldLocation = (location) => {
  return { ...location, isOldLocation: true };
};

export const changeQuestStage = (quest, questId, stageString) => {
  // console.log(stageString);
  // console.log(questId);
  const stageNumber = parseInt(stageString, 10);
  return { ...quest, stage: stageNumber, id: questId };
};
