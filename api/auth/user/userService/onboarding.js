/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const _ = require('lodash');

const { User } = require('../userModel');
const { setResponse } = require('../../../utils');
const { listAliment } = require('../../../nutrition/aliment/alimentService');
const {
  listPathology,
} = require('../../../nutrition/pathology/pathologyService');

const { ALIMENT_TYPE, OTHER_PATHOLOGY } = require('../../../utils/constants');

const validateOnboarding = async (reqBody, reqUser) => {
  const updateUser = { ...reqBody };
  updateUser.onboardingFinished = true;
  if (!updateUser.otherPathology) updateUser.activeDiet = true;

  // *Aliments Check
  const alimentEntries = Object.entries(ALIMENT_TYPE);
  for (const [type, name] of alimentEntries) {
    let refAliments = await listAliment({ type: name });
    refAliments = refAliments.data;
    for (const id of updateUser.avoidedAliments[type]) {
      const found = refAliments.find(a => a.id === id);
      if (!found) return setResponse(400, 'Incorrect Avoided Aliments', {});
    }
  }

  // *Pathologies Check
  let refPathologies = await listPathology({});
  refPathologies = refPathologies.data;
  for (const id of updateUser.pathologies) {
    const found = refPathologies.find(p => p.id === id);
    if (!found) return setResponse(400, 'Incorrect Pathologies', {});
    if (found.name === OTHER_PATHOLOGY && !updateUser.otherPathology)
      return setResponse(400, 'Other Pathology empty', {});
  }

  return setResponse(200, '', updateUser);
};

const onboarding = async (reqBody, reqUser) => {
  const updateUser = await validateOnboarding(reqBody, reqUser);
  if (updateUser.status !== 200) return updateUser;
  await User.findByIdAndUpdate(reqUser.id, updateUser.data);
  return setResponse(200, 'Finished Onboarding', {});
};

module.exports = {
  onboarding,
};
