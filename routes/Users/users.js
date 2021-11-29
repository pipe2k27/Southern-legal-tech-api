import Router from 'express-promise-router';

// import fetch from 'node-fetch';

import { User } from '../../models/user.js';
import { userExists } from './userMethods.js';

const router = Router();

router.post('/find-user', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      res.status(200).send({ userExists: true });
    } else {
      const newUser = new User({
        sub: req.user.sub,
        identifier: req.body.identifier,
        email: req.body.email,
        documents: [],
      });
      const createdUser = await newUser.save();
      res.status(200).send({ userExists: true, newCreatedUser: createdUser });
    }
  } catch (error) {
    res.status(400).send({ userExists: 'error' });
  }
});

router.get('/get-user', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.findOne({ sub: req.user.sub });
      if (findThisUser) {
        res.status(200).send({ userExists: true, foundUser: findThisUser });
      } else {
        res.status(200).send({ userExists: false });
      }
    }
  } catch (error) {
    res.status(400).send({ userExists: 'error' });
  }
});

router.get('/get-user-documents', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.findOne({ sub: req.user.sub });
      if (findThisUser.documents) {
        res.status(200).send({ userExists: true, foundUser: findThisUser });
      } else if (findThisUser && !findThisUser.documents) {
        await User.updateOne({ sub: req.user.sub }, {
          documents: [],
        });
      } else {
        res.status(200).send({ userExists: false });
      }
    }
  } catch (error) {
    res.status(400).send({ userExists: 'error' });
  }
});

router.post('/subscribe-user', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.updateOne({ sub: req.user.sub }, {
        anyContracts: {
          startAmount: 20,
          currentAmount: 20,
        },
        plan: 'Premium',
      });
      if (findThisUser) {
        res.status(200).send({ userIsSuscribed: true });
      } else {
        res.status(200).send({ userIsSuscribed: false });
      }
    } else {
      res.status(200).send({ userIsSuscribed: 'user not found' });
    }
  } catch (error) {
    res.status(400).send({ userIsSuscribed: 'error' });
  }
});

router.post('/use-one-contract', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.findOne({ sub: req.user.sub });
      if (findThisUser.anyContracts.currentAmount > 0) {
        const updateThisUser = await User.updateOne({ sub: req.user.sub }, {
          anyContracts: {
            startAmount: findThisUser.anyContracts.startAmount,
            currentAmount: findThisUser.anyContracts.currentAmount - 1,
          },
        });
        if (updateThisUser) {
          res.status(200).send({ contractUsed: true });
        } else {
          res.status(200).send({ contractUsed: false });
        }
      }
    } else {
      res.status(200).send({ userExists: false });
    }
  } catch (error) {
    res.status(400).send({ contractUsed: 'error' });
  }
});

router.post('/save-progress', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.findOne({ sub: req.user.sub });
      let updateThisUser;
      if (findThisUser.saved && findThisUser.saved.length > 0 && findThisUser.saved.length < 4) {
        updateThisUser = await User.updateOne({ sub: req.user.sub }, {
          saved: [req.body.saved, ...findThisUser.saved],
        });
      } else if (findThisUser.saved && findThisUser.saved.length > 3) {
        const shortenedArray = findThisUser.saved;
        shortenedArray.pop();

        updateThisUser = await User.updateOne({ sub: req.user.sub }, {
          saved: [req.body.saved, ...shortenedArray],
        });
      } else {
        updateThisUser = await User.updateOne({ sub: req.user.sub }, {
          saved: [req.body.saved],
        });
      }
      if (updateThisUser) {
        res.status(200).send({ saved: true });
      }
    } else {
      res.status(200).send({ saved: false });
    }
  } catch (error) {
    res.status(400).send({ saved: 'error' });
  }
});

export default router;
