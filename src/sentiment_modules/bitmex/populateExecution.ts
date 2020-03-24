import { BitmexAPI } from "bitmex-node";
import { User } from "../../entity/User";
import { Trade } from "../../entity/Trade";
import { createOrderObj, genDatesList, makeid } from "./bitmexHelpers";
import { createConn } from "../../modules/utils/connectionOptions";

export async function fetchHistory(
  userNum,
  conn,
  symbol,
  history,
  fullExecHistory,
  bitmex
) {
  return new Promise(async (resolve: any) => {
    // console.log("fetching history");
    // console.log(typeof history);
    try {
      // const executionHistory = await bitmex.Execution.get({
      //   symbol: symbol,
      //   startTime: history
      // });
      const executionHistory = await bitmex.User.getExecutionHistory({
        symbol: symbol,
        timestamp: history
      });

      // console.log(history);
      // console.log(executionHistory);

      // let conn = await createConn(userNum.toString() + "sldfjk");
      // console.log(executionHistory.length, userNum);
      // console.log("length" + executionHistory.length);
      const userRepo = conn.getRepository(User);
      const tradeRepo = conn.getRepository(Trade);
      const thisUser = await userRepo.find({
        where: { userId: parseInt(userNum), select: "id" }
      });
      // console.log(thisUser[0]);
      let j = 0;
      // if (fullExecHistory[0] && executionHistory[0]) {
      for (let i = 0; i < executionHistory.length; i++) {
        createOrderObj(userNum, executionHistory[i]).then(async orderObject => {
          // console.log(orderObject);

          let newTrade = new Trade();
          newTrade.tradeNum = i;
          newTrade.searchTimestamp = history;

          //get execution history records
          newTrade.price = orderObject.price;
          // console.log(fullExecHistory.length);
          for (let k = 0; k < fullExecHistory.length; k++) {
            if (
              fullExecHistory[k].execID == orderObject.execID &&
              fullExecHistory[k].stopPx != null
            ) {
              console.log("equals");
              newTrade.price = fullExecHistory[k].stopPx.toString();
              console.log(fullExecHistory[k].stopPx);
            }
            if (k == fullExecHistory.length - 1) {
              newTrade.user = thisUser[0]!;
              newTrade.execID = orderObject.execID;
              newTrade.timestamp = orderObject.timestamp;
              newTrade.side = orderObject.side;
              newTrade.orderQty = orderObject.orderQty;
              newTrade.leavesQty = orderObject.leavesQty;
              newTrade.currentQty = orderObject.currentQty;
              newTrade.avgEntryPrice = orderObject.avgEntryPrice;
              newTrade.execType = orderObject.execType;
              newTrade.orderType = orderObject.orderType;
              newTrade.trdStart = orderObject.trdStart;
              newTrade.trdEnd = orderObject.trdEnd;
              newTrade.realizedPnl = orderObject.realizedPnl;
              newTrade.execGrossPnl = orderObject.execGrossPnl;
              newTrade.commission = orderObject.commission;
              newTrade.notes = "undefined";
              newTrade.hashtags = "undefined";

              tradeRepo
                .save(newTrade)
                .then(async r => {
                  j++;
                  // console.log(j);
                  // console.log("successfully saved trade " + i.toString());
                  if (j == executionHistory.length - 1) {
                    console.log(executionHistory.length);
                    let findings = await tradeRepo.find({
                      select: ["id", "trdEnd", "trdStart"],
                      where: { userId: parseInt(userNum) },
                      order: {
                        timestamp: "ASC",
                        searchTimestamp: "ASC",
                        tradeNum: "DESC"
                      }
                    });
                    if (findings[0]) {
                      console.log(findings.length);
                      let torf = false;
                      for (let i = 0; i < findings.length; i++) {
                        if (torf == true) {
                          findings[i].trdStart = true;
                          await tradeRepo.save(findings[i]);
                          torf = false;
                        }
                        if (
                          findings[i].trdEnd == true &&
                          findings[i].trdStart !== true
                        ) {
                          torf = true;
                        }
                        if (i == findings.length - 1) {
                          await resolve(r);
                        }
                      }
                    }
                    // resolve(r);

                    // let torf: boolean | null = null;
                    // if (!findings[0]) {
                    //   torf = false;
                    // } else {
                    //   torf = findings[0].trdEnd;
                    // }
                  }
                  // console.log(r);
                })
                .catch(err => console.log(err));
            }
          }
        });
      }
      // }
    } catch (err) {
      resolve(err);
    }
  });
}

export async function populate(userId) {
  return new Promise(async resolve => {
    let randId = makeid(10);
    let newconn = await createConn(randId);
    let userRepo = newconn.getRepository(User);
    let userNums = await userRepo.find({
      where: { id: userId },
      select: ["id", "apiKeyID", "apiKeySecret"]
    });
    try {
      const bitmex = new BitmexAPI({
        apiKeyID: userNums[0].apiKeyID,
        apiKeySecret: userNums[0].apiKeySecret
      });
      let symbol = "XBTUSD";
      const fullExecHistory = await bitmex.Execution.getTradeHistory({
        symbol: symbol,
        count: 500,
        reverse: true
      });

      // console.log(userNums);
      // let oneHrBack: any = newDate(1);
      let datesList = await genDatesList();
      console.log(datesList);
      var theEye = 1; //  set your counter to 1
      myLoop(
        datesList,
        userNums,
        newconn,
        theEye,
        fullExecHistory,
        bitmex,
        symbol
      )
        .then(() => {
          resolve(true);
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  });
}

async function myLoop(
  datesList,
  userNums,
  newconn,
  i,
  fullExecHistory,
  bitmex,
  symbol
): Promise<boolean> {
  return new Promise(async resolve => {
    setTimeout(async function() {
      i++;
      // console.log(i);
      let rand = makeid(10);
      let newconnect = await createConn(rand);
      fetchHistory(
        userNums[0].id,
        newconnect,
        symbol,
        datesList[i],
        fullExecHistory,
        bitmex
      )
        .then(async res => {
          await newconnect.close();
          // console.log("closed connection and added trade");
          // console.log(datesList.length);
          // console.log("datelist len");
          // console.log(res);
          return res;
        })
        .catch(err => console.log(err));

      if (i < datesList.length) {
        myLoop(
          datesList,
          userNums,
          newconn,
          i,
          fullExecHistory,
          bitmex,
          symbol
        );
      } else {
        await newconn.close();
        resolve(true);
      }
    }, 2000);
  });
}
