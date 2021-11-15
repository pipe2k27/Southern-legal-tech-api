import Router from 'express-promise-router';

// import fetch from 'node-fetch';

import Document from '../../models/document.js';
import { User } from '../../models/user.js';
import { userExists } from './userMethods.js';

const router = Router();

router.post('/create-document', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.findOne({ sub: req.user.sub });
      if (findThisUser) {
        const newDocumentForList = {
          name: req.body.name,
          date: req.body.date,
          id: req.body.id,
          month: req.body.month,
        };
        const newDocumentBase64 = new Document({
          sub: req.user.sub,
          identifier: req.body.identifier || 'unknown',
          id: req.body.id,
          document: req.body.document,
        });

        const savedBase64 = await newDocumentBase64.save();

        let addDocToList;

        if (findThisUser.documents) {
          addDocToList = await User.updateOne({ sub: req.user.sub }, {
            documents: [...findThisUser.documents, newDocumentForList],
          });
        } else {
          addDocToList = await User.updateOne({ sub: req.user.sub }, {
            documents: [newDocumentForList],
          });
        }
        if (savedBase64 && addDocToList) {
          res.status(200).send({ status: 'ok' });
        }
      }
    }
  } catch (error) {
    res.status(400).send({ error: 'error' });
  }
});

router.post('/get-document', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const getDocumentBase64 = await Document.findOne({
        id: req.body.id,
      });
      res.status(200).send({ document: getDocumentBase64.document });
    }
  } catch (error) {
    res.status(400).send({ error: 'error' });
  }
});

router.post('/delete-document', async (req, res) => {
  try {
    const isExistingUser = await userExists(req.user.sub);
    if (isExistingUser) {
      const findThisUser = await User.findOne({ sub: req.user.sub });
      if (findThisUser) {
        const deleteDocument = await Document.deleteOne({ id: req.body.id });

        const oldList = findThisUser.documents;
        const removerIndex = oldList.findIndex((e) => e.id === req.body.id);
        oldList.splice(removerIndex, 1);

        const deleteFromDocToList = await User.updateOne({ sub: req.user.sub }, {
          documents: [...oldList],
        });
        if (deleteDocument && deleteFromDocToList) {
          res.status(200).send({ status: 'ok' });
        }
      }
    }
  } catch (error) {
    res.status(400).send({ error: 'error' });
  }
});

router.post('/set-document-name', async (req, res) => {
  try {
    const findThisUser = await User.findOne({ sub: req.user.sub });
    if (findThisUser) {
      const newList = findThisUser.documents;
      const updateIndex = newList.findIndex((e) => e.id === req.body.id);
      newList[updateIndex].name = req.body.name;
      const updateDocList = await User.updateOne({ sub: req.user.sub }, {
        documents: [...newList],
      });
      if (updateDocList) {
        res.status(200).send({ status: 'ok' });
      }
    }
  } catch (error) {
    res.status(400).send({ error: 'error' });
  }
});

export default router;
