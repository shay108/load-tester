const fetch = require("node-fetch");
const fs = require("fs");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let globalCount = 0;
const randomFileName = `result${getRandomInt(100000000000000)}.csv`;

function infiniteSend(url, shouldWriteToFile) {
    setTimeout(() => {
        const localSentTime = Date.now();
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                info: {
                    traceId: {
                        Root: "1-5c17d4e3-de53ba825ddc706004853d8e",
                        Parent: "1c23c424056a3ec7",
                        Sampled: 0,
                        Version: "Root=1",
                        Time: "5c17d4e3",
                        TransactionId: "de53ba825ddc706004853d8e",
                        shortParentId: "d4e3",
                    },
                    logGroupName: "/aws/lambda/tracer-test-dev-main",
                    logStreamName: "2018/12/17/[$LATEST]3d987c650e0d4c1cacaa6c74128298ff",
                    tracer: {name: "@lumigo/tracer", from: "undefined", version: "1.0.22"},
                },
                children: {},
                vendor: "AWS",
                transactionId: "987654321",
                account: "291070810472",
                memoryAllocated: "256",
                version: "$LATEST",
                runtime: "AWS_Lambda_nodejs8.10",
                readyness: "warm",
                containerTimestamp: "1545065699907",
                invocationsSequence: "2",
                parentId: "7d576551-021c-11e9-b0eb-d774ea76243a",
                started: "1545065701269",
                type: "http",
                id: "12345678",
                shortId: "7588",
                service: "unmapped",
                region: "unmapped",
                name: "https://sts.amazonaws.com/",
                ended: "1545065701628"
            }),
            headers: {"Content-Type": "application/json"}
        })
            .then(() => {
                process.stdout.write(".");
                if (shouldWriteToFile) {
                    data = `${Date.now() - localSentTime}\n`;
                    fs.appendFileSync(randomFileName, data, "utf8");
                }
                globalCount++;
            })
            .catch(err => {
                console.error(err);
            });
        infiniteSend(url, shouldWriteToFile);
    }, 5);
}

if (process.argv.length < 3) {
    console.error("Missing url name");
    process.exit();
}
const startTime = Date.now();
process.on("SIGINT", function () {
    console.log("Caught interrupt signal");
    const timePassed = (Date.now() - startTime) / 1000;
    console.info(`On average ${globalCount / timePassed}`);
    process.exit();
});

infiniteSend(process.argv[2], process.argv[3] === "true");