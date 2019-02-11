import twit from "scrape-twitter";
// import { Tweet } from "../entity/Tweet";
// import { SearchTerm } from "../entity/SearchTerm";
// import { createConnections } from "typeorm";
// import { checkTweet, format, getSentiment } from "./tweetFunctions";
// const dateFormat = require("dateformat");
// const chalk = require("chalk");
require("dotenv").config();

const getTweets = () => {
  return new Promise(async resolve => {
    // let arr: any[] = [];

    console.log("at beginning");
    // create stream
    const stream = new twit.TimelineStream("mjackson", {
      retweets: true,
      replies: true,
      count: 10
    });
    // let entLo1 = __dirname + "/../entity/*.*";
    // let entLo2 = __dirname + "/../entity/instagram/*.*";
    // const conns = await createConnections([
    //   {
    //     name: word,
    //     type: "postgres",
    //     host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
    //     port: 5432,
    //     username: "manx",
    //     password: "jakeadelman",
    //     database: "instagauge",
    //     logging: false,
    //     entities: [entLo1, entLo2]
    //   }
    // ]);
    // const tweetRepository = conns[0].getRepository(Tweet);

    stream.on("error", (r: any) => {
      console.log(`got err ${r}`);
      return `here is err: ${r}`;
    });

    // test return
    stream.on("data", async (data: any) => {
      console.log(data);
      //   let daty = JSON.stringify(data);
      //   let dat = JSON.parse(daty);
      //   // format
      //   let userMentions = format(dat.userMentions);
      //   let hashtags = format(dat.hashtags);
      //   let images = format(dat.images);
      //   let urls = format(dat.urls);
      //   //get current time and format to hour
      //   let now = new Date();
      //   let currHour = dateFormat(now, "yymmddHH");
      //   // format hour
      //   let concatHour = dat.time;
      //   let str1 = concatHour.substring(2, 4);
      //   let str2 = concatHour.substring(5, 7);
      //   let str3 = concatHour.substring(8, 10);
      //   let str4 = concatHour.substring(11, 13);
      //   concatHour = str1 + str2 + str3 + str4;
      //   const variables = {
      //     tweetId: dat.id,
      //     query: word,
      //     timestamp: dat.time,
      //     currHour: currHour,
      //     hour: concatHour,
      //     screenName: dat.screenName,
      //     isRetweet: dat.isRetweet,
      //     isPinned: dat.isPinned,
      //     isReplyTo: dat.isReplyTo,
      //     text: dat.text,
      //     userMentions: userMentions,
      //     hashtags: hashtags,
      //     images: images,
      //     urls: urls,
      //     replyCount: parseInt(dat.replyCount),
      //     retweetCount: parseInt(dat.retweetCount),
      //     favoriteCount: parseInt(dat.favoriteCount)
      //   };
      //   arr.push(variables);
    });

    stream.on("end", async () => {
      resolve(true);
      //   console.log(`found ${arr.length} tweets for ${word}`);
      //   if (arr.length == 0) {
      //     conns[0].close();
      //     reject("no new tweets");
      //   } else {
      //     checkTweet(arr, tweetRepository)
      //       .then((r: any) => {
      //         return r;
      //       })
      //       .then((r: any[]) => {
      //         getSentiment(r)
      //           .then(r => {
      //             conns[0].close();
      //             resolve(r);
      //           })
      //           .catch(err => {
      //             conns[0].close();
      //             reject(new Error(err));
      //           });
      //       })
      //       .catch((r: any) => {
      //         conns[0].close();
      //         reject(chalk.red(`>> ${r}`));
      //       });
      //   }
    });
  });
};

getTweets();
// setInterval(async function() {
//   let entLo1 = __dirname + "/../entity/*.*";
//   let entLo2 = __dirname + "/../entity/instagram/*.*";
//   const connections = await createConnections([
//     {
//       name: "default2",
//       type: "postgres",
//       host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
//       port: 5432,
//       username: "manx",
//       password: "jakeadelman",
//       database: "instagauge",
//       logging: false,
//       entities: [entLo1, entLo2]
//     },
//     {
//       name: "test2",
//       type: "postgres",
//       host: "instagauge.cmxxymh53lj2.us-east-1.rds.amazonaws.com",
//       port: 5432,
//       username: "manx",
//       password: "jakeadelman",
//       database: "instagauge",
//       logging: false,
//       entities: [entLo1, entLo2]
//     }
//   ]);
//   console.log(
//     `[` + chalk.blue(`PG`) + `]:` + chalk.green(` opened connections`)
//   );
//   let searchTermRepository = connections[0].getRepository(SearchTerm);
//   let terms: any[] = await searchTermRepository.find({ select: ["term"] });
//   let count = 0;

//   terms.map(term => {
//     console.log(
//       `[` +
//         chalk.green(`FETCH`) +
//         `]` +
//         `: fetching tweets for term ` +
//         chalk.underline.bold.green(`${term.term}`)
//     );
//     getTweets(term.term, "top")
//       .then((r: any) => {
//         console.log(r);
//         count += 1;
//         if (count == terms.length) {
//           connections[1].close();
//           connections[0].close();
//           console.log(
//             `[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`)
//           );
//         } else {
//           return;
//         }
//       })
//       .catch((r: any) => {
//         count += 1;
//         console.log(`${r}`);
//         if (count == terms.length) {
//           connections[1].close();
//           connections[0].close();
//           console.log(
//             `[` + chalk.blue(`PG`) + `]:` + chalk.red(` closed connections`)
//           );
//         } else {
//           return;
//         }
//       });
//   });
// }, 20000);