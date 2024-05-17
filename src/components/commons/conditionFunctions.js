//Conditions functions. Different functions for checking conditions.

export const isPlayerKnown = (characterData) => {
  if (characterData?.knowsPlayer) {
    return characterData.knowsPlayer;
  } else {
    return false;
  }
};

export const isDispositionAbove = (characterData, argument) => {
  const number = parseInt(argument, 10);
  if (characterData?.disposition) {
    return characterData.disposition >= number;
  } else {
    return 50 >= number;
  }
};

export const isDispositionBelow = (characterData, argument) => {
  const number = parseInt(argument, 10);
  if (characterData?.disposition) {
    return characterData.disposition < number;
  } else {
    return 50 < number;
  }
};

export const isOldLocation = (location) => {
  if (location?.isOldLocation) {
    return location.isOldLocation;
  } else {
    return false;
  }
};

export const isQuestStarted = (quest) => {
  if (quest && quest.stage !== 0o0) {
    return true;
  } else {
    return false;
  }
};

export const isQuestStage = (quest, stageString) => {
  const stageNumber = parseInt(stageString, 10);
  if (quest && quest.stage === stageNumber) {
    return true;
  } else {
    return false;
  }
};
