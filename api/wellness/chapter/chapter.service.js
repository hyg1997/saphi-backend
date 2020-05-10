/* eslint-disable no-param-reassign */
const { Chapter } = require('./chapter.model');
const { setResponse } = require('../../utils');

const getChapter = async reqParams => {
  const chapter = await Chapter.findById(reqParams.id);
  if (!chapter) return setResponse(404, 'Chapter not found');
  return setResponse(200, 'Chapter Found', chapter);
};

const getChapterActivity = async reqParams => {
  const chapter = await Chapter.findById(reqParams.id);
  if (!chapter) return setResponse(404, 'Chapter not found');
  const activity = chapter.activities.find(obj =>
    obj._id.equals(reqParams.subId),
  );
  if (!chapter) return setResponse(404, 'Activity not found');
  return setResponse(200, 'Activity Found', activity);
};

const listChapterByModule = async reqQuery => {
  const chapters = await Chapter.find(reqQuery);

  chapters.sort((a, b) =>
    a.module.displayOrder !== b.module.displayOrder
      ? a.module.displayOrder - b.module.displayOrder
      : a.displayOrder - b.displayOrder,
  );
  const sortedChapters = chapters.reduce((acc, val) => {
    if (
      acc.length === 0 ||
      acc[acc.length - 1][0].module.name !== val.module.name
    )
      acc.push([]);
    acc[acc.length - 1].push(val);
    return acc;
  }, []);

  return setResponse(200, 'Chapters Found', sortedChapters);
};

const getInitModules = async reqUser => {
  // Se puede filtrar los modulos segun se requiera
  const { data: modules } = await listChapterByModule();
  const initModules = modules.map(mod => ({
    name: mod[0].module.name,
    chapters: mod.map(cha => ({
      chapter: cha.id,
      name: cha.name,
      activities: cha.activities.map(act => ({
        activity: act.id,
        name: act.name,
        state: act.initialState,
      })),
    })),
  }));
  return setResponse(200, 'Modules initialized', initModules);
};

module.exports = {
  getChapter,
  listChapterByModule,
  getChapterActivity,
  getInitModules,
};
