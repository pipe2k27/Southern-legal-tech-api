import { User } from '../../models/user.js';

export default null;

export const userExists = async (requestSub) => {
  const findThisUser = await User.exists({ sub: requestSub });
  if (findThisUser) {
    return true;
  }
  return false;
};
