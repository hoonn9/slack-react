import { IDM, IChat } from '@typings/api.d';
import dayjs from 'dayjs';

/**
 * key is date
 */
type Section = {
  [key: string]: (IDM | IChat)[];
};

const makeSection = (chatList: (IDM | IChat)[]) => {
  const sections: Section = {};
  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  return sections;
};

export default makeSection;
