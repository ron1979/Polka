const DBService = require('./DBService.js');
const mongo = require('mongodb');
const ProductService = require('./ProductService.js');
const UserService = require('./UserService.js');

function query(loggedInUserId) {
  return new Promise((resolve, reject) => {
    loggedInUserId = new mongo.ObjectID(loggedInUserId);

    _getUserNotifications(loggedInUserId).then(notifications => {
      if (notifications.length === 0) return resolve();
      _replaceBidIdsWithBids(notifications).then(notifications => {
        _replaceBidsInnerPointersWithData(notifications).then(notifications => {
          resolve(notifications);
        });
      });
    });
  });
}

function _getUserNotifications(userId) {
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      db
        .collection(DBService.COLLECTIONS.USER)
        .findOne(
          { _id: userId },
          { notifications: 1 },
          (err, { notifications }) => {
            if (err) reject(err);
            resolve(notifications);
          }
        );
    });
  });
}

function _replaceBidIdsWithBids(notifications) {
  return new Promise((resolve, reject) => {
    DBService.dbConnect().then(db => {
      const mongoQuery = { $or: [] };

      mongoQuery.$or = notifications.map(notification => {
        notification.bidId = new mongo.ObjectID(notification.bidId);
        return { _id: notification.bidId };
      });

      db
        .collection(DBService.COLLECTIONS.BID)
        .find(mongoQuery)
        .toArray((err, bids) => {
          if (err) reject(err);
          else {
            notifications = notifications.map(notification => {
              const bid = bids.find(bid => {
                return notification.bidId.toString() === bid._id.toString();
              });
              delete notification.bidId;
              notification.bid = bid;
              return notification;
            });
            resolve(notifications);
          }
        });
    });
  });
}

function _replaceBidsInnerPointersWithData(notifications) {
  return new Promise((resolve, reject) => {
    notifications.forEach(notification => {
      const prms = [];
      const owner = notification.bid.owner;
      const bidder = notification.bid.bidder;

      prms.push(_productIdToData(notification, owner));
      prms.push(_productIdToData(notification, bidder));

      Promise.all(prms).then(notifications => {
        resolve(notifications);
      });
    });
  });

  function _productIdToData(notification, ownerOrBidder) {
    return new Promise((resolve, reject) => {
      const productColsToGet = { _id: 1, imgs: 1, ownerId: 1, title: 1 };
      ProductService.getById(ownerOrBidder.productId, productColsToGet).then(
        product => {
          delete ownerOrBidder.productId;
          ownerOrBidder.product = product;

          const userColsToGet = { _id: 1, nickName: 1 };
          UserService.getById(
            ownerOrBidder.product.ownerId,
            userColsToGet
          ).then(user => {
            ownerOrBidder._id = user._id;
            ownerOrBidder.nickName = user.nickName;

            resolve(notification);
          });
        }
      );
    });
  }
}

module.exports = {
  query
};